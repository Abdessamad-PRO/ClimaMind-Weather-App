import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData, WeatherCondition } from '../../core/models/weather.model';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss'
})
export class CurrentWeatherComponent {
  @Input() weather?: WeatherData;
  @Input() unit: 'C' | 'F' = 'C';

  /** Détermine si l'on est de jour ou de nuit */
  get isDay(): boolean {
    return this.weather?.isDay ?? true;
  }

  /** Libellé traduit dynamiquement selon la météo et le cycle jour/nuit */
  get conditionLabel(): string {
    const isDay = this.isDay;
    const map: Record<string, string> = {
      'clear':          isDay ? 'Ensoleillé'            : 'Ciel dégagé',
      'partly-cloudy':  isDay ? 'Partiellement nuageux' : 'Nuit partiellement nuageuse',
      'cloudy':         'Couvert',
      'rain':           isDay ? 'Pluvieux'               : 'Pluie nocturne',
      'drizzle':        'Bruine légère',
      'thunderstorm':   'Orage',
      'stormy':         'Tempête',
      'snow':           isDay ? 'Neige'                 : 'Neige nocturne',
      'mist':           'Brumeux'
    };
    return map[this.weather?.condition || ''] || '';
  }

  /** Emoji principal (Météo actuelle) */
  get conditionEmoji(): string {
    return this.getEmoji(this.weather?.condition || 'clear', this.isDay);
  }

  /** Retourne l'emoji adapté selon la condition et si c'est le jour ou la nuit */
  getEmoji(c: WeatherCondition | string, dayFlag?: boolean): string {
    const day = dayFlag ?? true;

    const dayMap: Record<string, string> = {
      'clear': '☀️', 'partly-cloudy': '⛅', 'cloudy': '☁️',
      'rain': '🌧️', 'drizzle': '🌦️', 'thunderstorm': '⛈️',
      'stormy': '🌩️', 'snow': '❄️', 'mist': '🌫️'
    };

    const nightMap: Record<string, string> = {
      'clear': '🌙', 'partly-cloudy': '🌙', 'cloudy': '☁️',
      'rain': '🌧️', 'drizzle': '🌦️', 'thunderstorm': '⛈️',
      'stormy': '🌩️', 'snow': '🌨️', 'mist': '🌫️'
    };

    return (day ? dayMap : nightMap)[c] || (day ? '🌤️' : '🌙');
  }

  /** Formate la température selon l'unité sélectionnée (°C ou °F) */
  getTemp(tempInCelsius: number | undefined): string {
    if (tempInCelsius === undefined) return '';

    if (this.unit === 'F') {
      const fahrenheit = Math.round((tempInCelsius * 9) / 5 + 32);
      return `${fahrenheit}°F`;
    }

    return `${Math.round(tempInCelsius)}°C`;
  }
}