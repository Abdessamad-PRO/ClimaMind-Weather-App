import {
  Component, Output, EventEmitter, Input, ViewChild,
  ElementRef, HostListener
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
export class HeaderActionsComponent {
  @Input() city = '';
  @Input() country = '';
  @Output() onSearch = new EventEmitter<{ lat: number; lon: number; name: string }>();
  @Output() onRefresh = new EventEmitter<void>();

  query = '';
  searchOpen = false;
  results: SearchResult[] = [];
  currentDateTime = '';
  private search$ = new Subject<string>();

  constructor(private weatherService: WeatherService) {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);

    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => q.length > 2
        ? this.weatherService.searchCities(q).pipe(catchError(() => of([])))
        : of([]))
    ).subscribe(r => this.results = r);
  }

  updateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  }

  onQueryChange(q: string) { this.search$.next(q); }

  selectResult(r: SearchResult) {
    this.onSearch.emit({ lat: r.lat, lon: r.lon, name: r.name });
    this.closeSearch();
  }

  clearSearch() { this.query = ''; this.results = []; }

  closeSearch() {
    this.searchOpen = false;
    this.results = [];
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    if (!(e.target as HTMLElement).closest('.search-wrapper')) {
      this.closeSearch();
    }
  }
}