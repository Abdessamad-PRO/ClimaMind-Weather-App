import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../core/models/weather.model';
import { RecentSearch, MapPin } from '../../core/models/location.model';
import { AirQualityComponent } from '../air-quality/air-quality.component';
import { RecentSearchesComponent } from '../recent-searches/recent-searches.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AirQualityComponent, RecentSearchesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() weather?: WeatherData;
  @Input() recentSearches: RecentSearch[] = [];
  @Input() pins: MapPin[] = [];
  @Input() mapLoading = false;
  @Output() onMapClick = new EventEmitter<{ lat: number; lon: number }>();
  @Output() onRecentSelect = new EventEmitter<RecentSearch>();

  formatTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }
}