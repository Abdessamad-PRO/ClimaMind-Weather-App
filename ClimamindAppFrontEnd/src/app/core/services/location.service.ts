import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {
  getCurrentPosition(): Observable<GeolocationPosition> {
    if (!navigator.geolocation) {
      return throwError(() => new Error('Geolocation not supported'));
    }
    return from(
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      })
    );
  }

  // Fallback: default to Paris if geolocation fails
  getDefaultLocation(): { lat: number; lon: number } {
    return { lat: 48.8566, lon: 2.3522 };
  }
}
