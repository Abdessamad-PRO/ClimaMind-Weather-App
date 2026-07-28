import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirQuality } from '../../core/models/weather.model';

@Component({
  selector: 'app-air-quality',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './air-quality.component.html',
  styleUrls: ['./air-quality.component.scss']
})
export class AirQualityComponent {
  @Input() aq?: AirQuality;

  getClass(): string {
    const map: Record<string, string> = {
      'Good': 'good', 'Fair': 'fair', 'Moderate': 'moderate',
      'Poor': 'poor', 'Very Poor': 'very-poor'
    };
    return map[this.aq?.label || ''] || 'good';
  }

  getPollutants() {
    if (!this.aq) return [];
    return [
      { name: 'PM2.5', value: this.aq.pm25 },
      { name: 'PM10', value: this.aq.pm10 },
      { name: 'O₃', value: this.aq.o3 },
      { name: 'NO₂', value: this.aq.no2 }
    ];
  }
}