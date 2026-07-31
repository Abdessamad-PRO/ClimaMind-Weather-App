import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../core/models/weather.model';
import { RecentSearch } from '../../core/models/location.model';

@Component({
  selector: 'app-indicator-cards',
  imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './indicator-cards.component.html',
  styleUrl: './indicator-cards.component.scss'
})
export class IndicatorCardsComponent {
  @Input() weather?: WeatherData;
  @Input() recentSearches: RecentSearch[] = [];
  @Output() onSelect = new EventEmitter<RecentSearch>();
  @Input() unit: 'C' | 'F' = 'C';
  @Input() isDay = true;

  Math = Math;

  // Emoji selon condition + isDay (pour recent searches)
  getConditionEmoji(condition: string | undefined): string {
    const c = condition || 'clear';
    const nightMap: Record<string, string> = {
      'clear': '🌙', 'partly-cloudy': '🌛', 'cloudy': '☁️',
      'rain': '🌧️', 'drizzle': '🌦️', 'thunderstorm': '⛈️',
      'stormy': '🌩️', 'snow': '🌨️', 'mist': '🌫️'
    };
    const dayMap: Record<string, string> = {
      'clear': '☀️', 'partly-cloudy': '⛅', 'cloudy': '☁️',
      'rain': '🌧️', 'drizzle': '🌦️', 'thunderstorm': '⛈️',
      'stormy': '🌩️', 'snow': '❄️', 'mist': '🌫️'
    };
    return (this.isDay ? dayMap : nightMap)[c] || '🌤️';
  }

  get aqClass(): string {
    const map: Record<string, string> = {
      'Good': 'good', 'Fair': 'fair', 'Moderate': 'moderate',
      'Poor': 'poor', 'Very Poor': 'very-poor'
    };
    return map[this.weather?.airQuality?.label || ''] || 'good';
  }

  formatTime(ts: number): string {
    return new Date(ts * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  // Durée du jour
  get daylightDuration(): string {
    if (!this.weather) return '—';
    const secs = this.weather.sunset - this.weather.sunrise;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m`;
  }

  // Progression de l'arc solaire (0–1)
  private get sunProgress(): number {
    if (!this.weather) return 0;
    const now  = Math.floor(Date.now() / 1000);
    const sr   = this.weather.sunrise;
    const ss   = this.weather.sunset;
    if (now < sr) return 0;
    if (now > ss) return 1;
    return (now - sr) / (ss - sr);
  }

  // Le demi-cercle SVG a une longueur d'arc ≈ 157 (π * 50)
  private readonly ARC_LEN = 157;

  get sunDashArray(): string  { return `${this.ARC_LEN}`; }
  get sunDashOffset(): string { return `${this.ARC_LEN * (1 - this.sunProgress)}`; }

  // Position du soleil sur le demi-cercle (cx = 10..110, cy sur l'arc)
  get sunDotX(): number {
    const angle = Math.PI * this.sunProgress; // 0 → π
    return 10 + 50 * (1 - Math.cos(angle));   // 10 → 110
  }
  get sunDotY(): number {
    const angle = Math.PI * this.sunProgress;
    return 60 - 50 * Math.sin(angle);         // 60 en haut de l'arc
  }

  get uvLabel(): string {
    const uv = this.weather?.uvIndex || 0;
    if (uv <= 2)  return 'Faible';
    if (uv <= 5)  return 'Modéré';
    if (uv <= 7)  return 'Élevé';
    if (uv <= 10) return 'Très élevé';
    return 'Extrême';
  }

  get uvColor(): string {
    const uv = this.weather?.uvIndex || 0;
    if (uv <= 2)  return '#34d399';
    if (uv <= 5)  return '#fbbf24';
    if (uv <= 7)  return '#fb923c';
    if (uv <= 10) return '#ef4444';
    return '#a855f7';
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