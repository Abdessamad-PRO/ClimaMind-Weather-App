import {
  Component, Output, EventEmitter, Input, ViewChild,
  ElementRef, HostListener, OnChanges, OnDestroy,SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../core/services/weather.service';
import { SearchResult } from '../../core/models/location.model';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-header-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss']
})
export class HeaderActionsComponent implements OnChanges, OnDestroy {
  @Input() city = '';
  @Input() country = '';
  @Input() timezoneOffset: number = 0; // Décalage en secondes depuis l'API OpenWeather
  @Input() unit: 'C' | 'F' = 'C';

  @Output() onSearch  = new EventEmitter<{ lat: number; lon: number; name: string }>();
  @Output() onRefresh = new EventEmitter<void>();
  @Output() onUnitChange = new EventEmitter<'C' | 'F'>();

  query = '';
  searchOpen = false;
  results: SearchResult[] = [];
  currentTime = '';
  search$ = new Subject<string>();
  private timerId: any;

  constructor(private weatherService: WeatherService) {
    this.search$.pipe(
      debounceTime(300), distinctUntilChanged(),
      switchMap(q => q.length > 2
        ? this.weatherService.searchCities(q).pipe(catchError(() => of([])))
        : of([]))
    ).subscribe(r => this.results = r);

    // Mise à jour de l'horloge toutes les secondes
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timezoneOffset'] || changes['city']) {
      this.tick();
    }
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  // Calcul de l'heure exacte de la ville recherchée selon son Timezone Offset
  tick() {
    const now = new Date();
    // UTC actuel en millisecondes
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    // Temps réel de la ville distante en millisecondes
    const cityMs = utcMs + (this.timezoneOffset * 1000);
    const cityDate = new Date(cityMs);

    this.currentTime = cityDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  pick(r: SearchResult) {
    this.onSearch.emit({ lat: r.lat, lon: r.lon, name: r.name });
    this.close();
  }

  setUnit(u: 'C' | 'F') {
    this.unit = u;
    this.onUnitChange.emit(u);
  }

  close() { this.searchOpen = false; this.results = []; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    if (!(e.target as HTMLElement).closest('.search-wrap')) this.close();
  }
}