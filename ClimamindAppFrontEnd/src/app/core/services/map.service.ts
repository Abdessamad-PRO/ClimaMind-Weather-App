import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapPin } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class MapService {
  private pins$ = new BehaviorSubject<MapPin[]>([]);
  private selectedPin$ = new BehaviorSubject<MapPin | null>(null);

  pins = this.pins$.asObservable();
  selectedPin = this.selectedPin$.asObservable();

  addPin(pin: MapPin) {
    const current = this.pins$.value;
    const exists = current.find(p => p.city === pin.city);
    if (!exists) {
      this.pins$.next([...current, pin]);
    }
  }

  selectPin(pin: MapPin) {
    this.selectedPin$.next(pin);
  }

  clearPins() {
    this.pins$.next([]);
    this.selectedPin$.next(null);
  }

  // Convert lat/lon to SVG coordinates for world map
  latLonToSvg(lat: number, lon: number, width: number, height: number): { x: number; y: number } {
    // Mercator-style projection
    const x = ((lon + 180) / 360) * width;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = (height / 2) - (width * mercN) / (2 * Math.PI);
    return { x, y };
  }
}
