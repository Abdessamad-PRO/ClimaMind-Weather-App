import {
  Component, Input, OnChanges, ViewChild,
  ElementRef, AfterViewInit, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData, ForecastDay } from '../../core/models/weather.model';

@Component({
  selector: 'app-forecast-wave',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forecast-wave.component.html',
  styleUrls: ['./forecast-wave.component.scss']
})
export class ForecastWaveComponent implements OnChanges {
  @Input() weather?: WeatherData;
  @Input() unit: 'C' | 'F' = 'C'; 

  private globalMin = 0;
  private globalMax = 0;

  ngOnChanges() {
    if (!this.weather?.forecast?.length) return;
    const allTemps = this.weather.forecast.flatMap(d => [d.tempMin, d.tempMax]);
    this.globalMin = Math.min(...allTemps);
    this.globalMax = Math.max(...allTemps);
  }

  // Position gauche de la barre (relative à la plage globale)
  getBarLeft(day: ForecastDay): number {
    const range = this.globalMax - this.globalMin || 1;
    return ((day.tempMin - this.globalMin) / range) * 100;
  }

  // Largeur de la barre
  getBarWidth(day: ForecastDay): number {
    const range = this.globalMax - this.globalMin || 1;
    return ((day.tempMax - day.tempMin) / range) * 100;
  }

  // Position du dot = temp actuelle (jour 0) ou milieu pour les autres
  getCurrentDot(day: ForecastDay, index: number): number {
    const range = this.globalMax - this.globalMin || 1;
    if (index === 0 && this.weather?.temperature !== undefined) {
      const t = Math.min(Math.max(this.weather.temperature, day.tempMin), day.tempMax);
      return ((t - this.globalMin) / range) * 100;
    }
    const mid = (day.tempMin + day.tempMax) / 2;
    return ((mid - this.globalMin) / range) * 100;
  }

  // Dégradé bleu → jaune selon les températures
  getBarGradient(day: ForecastDay): string {
    const cold = day.tempMin <= 10;
    const hot  = day.tempMax >= 30;
    if (cold && !hot) return 'linear-gradient(90deg, #60a5fa, #93c5fd)';
    if (hot && !cold) return 'linear-gradient(90deg, #fbbf24, #f97316)';
    return 'linear-gradient(90deg, #60a5fa, #34d399, #fbbf24)';
  }

  getIcon(day: ForecastDay): string {
    const map: Record<string, string> = {
      'clear': '☀️', 'partly-cloudy': '⛅', 'cloudy': '☁️',
      'rain': '🌧️', 'drizzle': '🌦️', 'thunderstorm': '⛈️',
      'stormy': '🌩️', 'snow': '❄️', 'mist': '🌫️'
    };
    return map[day.condition] || '🌤️';
  }

  getTemp(tempInCelsius: number | undefined): string {
    if (tempInCelsius === undefined) return '';
    
    if (this.unit === 'F') {
      const fahrenheit = Math.round((tempInCelsius * 9) / 5 + 32);
      return `${fahrenheit}°F`;
    }
    
    return `${Math.round(tempInCelsius)}°C`;
  }
}