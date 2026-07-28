import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../core/models/weather.model';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss']
})
export class CurrentWeatherComponent {
  @Input() weather?: WeatherData;

  getConditionLabel(): string {
    const map: Record<string, string> = {
      'clear': 'Sunny & Clear',
      'partly-cloudy': 'Partly Cloudy',
      'cloudy': 'Overcast',
      'rain': 'Rainy',
      'drizzle': 'Light Drizzle',
      'thunderstorm': 'Thunderstorm',
      'stormy': 'Stormy',
      'snow': 'Snowfall',
      'mist': 'Misty'
    };
    return map[this.weather?.condition || ''] || this.weather?.condition || '';
  }
}