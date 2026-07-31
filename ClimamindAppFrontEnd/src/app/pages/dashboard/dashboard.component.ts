import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../core/models/weather.model';
import { RecentSearch, MapPin } from '../../core/models/location.model';
import { WeatherService } from '../../core/services/weather.service';
import { LocationService } from '../../core/services/location.service';
import { BackgroundAnimComponent } from '../../components/background-anim/background-anim.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderActionsComponent } from '../../components/header-actions/header-actions.component';
import { CurrentWeatherComponent } from '../../components/current-weather/current-weather.component';
import { ForecastWaveComponent } from '../../components/forecast-wave/forecast-wave.component';
import { IndicatorCardsComponent } from '../../components/indicator-cards/indicator-cards.component';
import { WorldMapComponent } from '../../components/world-map/world-map.component';
import { catchError, of } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
   CommonModule,
    BackgroundAnimComponent,
    HeaderActionsComponent,
    CurrentWeatherComponent,
    ForecastWaveComponent,
    IndicatorCardsComponent,
    WorldMapComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedUnit: 'C' | 'F' = 'C';
  weather?: WeatherData;
  loading = false;
  mapLoading = false;
  error = '';
  recentSearches: RecentSearch[] = [];
  mapPins: MapPin[] = [];

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.detectAndLoad();
    this.loadRecentSearches();
  }

  detectAndLoad() {
    this.loading = true;
    this.error = '';
    this.locationService.getCurrentPosition().pipe(
      catchError(() => {
        this.error = 'Accès à la géolocalisation refusé.';
        this.loading = false;
        this.cdr.detectChanges();
        return of(null);
      })
    ).subscribe(pos => {
      if (pos) {
        this.loadByCoords(pos.coords.latitude, pos.coords.longitude);
      } else {
        this.loadDefault();
      }
    });
  }

  onMapClick(coords: { lat: number; lon: number }): void {
    this.loadByCoords(coords.lat, coords.lon);
  }

  loadByCoords(lat: number, lon: number, addPin = true) {
    this.mapLoading = true;
    this.weatherService.getWeatherByCoords(lat, lon).pipe(
      catchError(() => {
        this.error = 'Impossible de charger les données météo.';
        this.mapLoading = false;
        this.loading = false;
        this.cdr.detectChanges();
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.weather = data;
        this.loading = false;
        this.mapLoading = false;
        this.error = '';

        if (addPin) {
          const pin: MapPin = {
            lat,
            lon,
            city: data.city,
            temperature: data.temperature,
            condition: data.condition
          };
          this.mapPins = [...this.mapPins.filter(p => p.city !== data.city), pin];
          this.addToRecent(data);
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadBySearch(evt: { lat: number; lon: number; name: string }) {
    this.loadByCoords(evt.lat, evt.lon);
  }

  loadByRecent(r: RecentSearch) {
    this.loadByCoords(r.lat, r.lon);
  }

  loadDefault() {
    const { lat, lon } = this.locationService.getDefaultLocation();
    this.loadByCoords(lat, lon);
    this.error = '';
  }

  refresh() {
    if (this.weather) {
      this.loadByCoords(this.weather.lat, this.weather.lon, false);
    } else {
      this.detectAndLoad();
    }
  }

  private addToRecent(data: WeatherData) {
    const entry: RecentSearch = {
      city: data.city,
      country: data.country,
      lat: data.lat,
      lon: data.lon,
      temperature: data.temperature,
      condition: data.condition,
      timestamp: Date.now()
    };
    const existing = this.recentSearches.filter(r => r.city !== data.city);
    this.recentSearches = [entry, ...existing].slice(0, 5);
    localStorage.setItem('recent-searches', JSON.stringify(this.recentSearches));
  }

  private loadRecentSearches() {
    try {
      const saved = localStorage.getItem('recent-searches');
      if (saved) this.recentSearches = JSON.parse(saved);
    } catch {}
  }

  changeUnit(unit: 'C' | 'F') {
    this.selectedUnit = unit;
}

}
