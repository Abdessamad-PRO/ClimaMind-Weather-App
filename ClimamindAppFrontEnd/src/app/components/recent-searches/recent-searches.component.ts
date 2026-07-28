import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentSearch } from '../../core/models/location.model';

@Component({
  selector: 'app-recent-searches',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-searches.component.html',
  styleUrls: ['./recent-searches.component.scss']
})
export class RecentSearchesComponent {
  @Input() searches: RecentSearch[] = [];
  @Output() onSelect = new EventEmitter<RecentSearch>();
}