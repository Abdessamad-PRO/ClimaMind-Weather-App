import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { WeatherData, WeatherCondition, ForecastDay, AirQuality, HourlyPoint } from '../models/weather.model';
import { SearchResult } from '../models/location.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly API_KEY = environment.openWeatherApiKey;
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';
  private readonly GEO_URL  = 'https://api.openweathermap.org/geo/1.0';
  private readonly UNITS    = 'metric';

  constructor(private http: HttpClient) {}

  // Helper pour créer les HttpParams proprement
  private createParams(extraParams: Record<string, string | number>): HttpParams {
    let params = new HttpParams()
      .set('appid', this.API_KEY)
      .set('units', this.UNITS);
    
    Object.keys(extraParams).forEach(key => {
      params = params.set(key, extraParams[key].toString());
    });
    return params;
  }

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    const params = this.createParams({ lat, lon });

    const current$    = this.http.get<any>(`${this.BASE_URL}/weather`, { params });
    const forecast$   = this.http.get<any>(`${this.BASE_URL}/forecast`, { params });
    const airQuality$ = this.http.get<any>(`${this.BASE_URL}/air_pollution`, { params });

    return forkJoin([current$, forecast$, airQuality$]).pipe(
      map(([cur, fc, aq]) => this.mapToWeatherData(cur, fc, aq))
    );
  }

  getWeatherByCity(city: string): Observable<WeatherData> {
    const params = this.createParams({ q: city });
    return this.http.get<any>(`${this.BASE_URL}/weather`, { params }).pipe(
      switchMap(d => this.getWeatherByCoords(d.coord.lat, d.coord.lon))
    );
  }

  searchCities(query: string): Observable<SearchResult[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', 5)
      .set('appid', this.API_KEY);

    return this.http.get<any[]>(`${this.GEO_URL}/direct`, { params }).pipe(
      map(rs => rs.map(r => ({
        name: r.name,
        country: r.country,
        countryCode: r.country,
        state: r.state,
        lat: r.lat,
        lon: r.lon
      })))
    );
  }

  // ── MAPPING D'ENTRÉE DES DONNÉES ──────────────────────────────
  private mapToWeatherData(current: any, forecast: any, aq: any): WeatherData {
    const condition  = this.mapCondition(current.weather[0].id);
    const todayItems = this.getTodayItems(forecast.list);
    const sunrise    = current.sys.sunrise as number;
    const sunset     = current.sys.sunset  as number;
    const now        = current.dt          as number;
    
    // Détection si c'est le jour ou la nuit
    const isDay = now >= sunrise && now <= sunset;

    const tempMin = todayItems.length 
      ? Math.round(Math.min(...todayItems.map((i: any) => i.main.temp_min)))
      : Math.round(current.main.temp_min);
      
    const tempMax = todayItems.length 
      ? Math.round(Math.max(...todayItems.map((i: any) => i.main.temp_max)))
      : Math.round(current.main.temp_max);

    return {
      city:          current.name,
      country:       current.sys.country,
      timezone:      current.timezone,
      lat:           current.coord.lat,
      lon:           current.coord.lon,
      temperature:   Math.round(current.main.temp),
      feelsLike:     Math.round(current.main.feels_like),
      tempMin,
      tempMax,
      humidity:      current.main.humidity,
      windSpeed:     Math.round(current.wind.speed * 3.6), // Convertit m/s en km/h
      windDeg:       current.wind.deg,
      windDirection: this.degToDirection(current.wind.deg),
      visibility:    Math.round(current.visibility / 1000), // Convertit m en km
      pressure:      current.main.pressure,
      uvIndex:       0,
      condition,
      description:   current.weather[0].description,
      icon:          current.weather[0].icon,
      sunrise,
      sunset,
      timestamp:     now,
      isDay,         // 👈 Indispensable pour votre UI dynamique !
      forecast:      this.aggregateDailyForecast(forecast.list),
      hourly:        this.extractHourly(forecast.list, sunrise, sunset),
      airQuality:    this.mapAirQuality(aq)
    };
  }

  private extractHourly(list: any[], sunrise: number, sunset: number): HourlyPoint[] {
    return list.slice(0, 8).map(item => {
      const date = new Date(item.dt * 1000);
      const isDaySlot = (item.dt as number) >= sunrise && (item.dt as number) <= sunset;
      return {
        time:      item.dt,
        hour:      date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        temp:      Math.round(item.main.temp),
        condition: this.mapCondition(item.weather[0].id),
        icon:      item.weather[0].icon,
        isDay:     isDaySlot // 👈 Indique si le créneau horaire est de jour/nuit
      };
    });
  }

  private getTodayItems(list: any[]): any[] {
    const todayStr = new Date().toDateString();
    const today = list.filter((i: any) => new Date(i.dt * 1000).toDateString() === todayStr);
    return today.length ? today : list.slice(0, 8);
  }

  private aggregateDailyForecast(list: any[]): ForecastDay[] {
    const dayMap = new Map<string, any[]>();
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const key = date.toDateString();
      if (!dayMap.has(key)) dayMap.set(key, []);
      dayMap.get(key)!.push(item);
    });

    return Array.from(dayMap.entries()).slice(0, 7).map(([dateStr, items]) => {
      const date   = new Date(dateStr);
      const temps  = items.map(i => i.main.temp);
      const midday = items[Math.floor(items.length / 2)];

      return {
        date:          date.getTime() / 1000,
        dayName:       days[date.getDay()],
        tempMin:       Math.round(Math.min(...temps)),
        tempMax:       Math.round(Math.max(...temps)),
        condition:     this.mapCondition(midday.weather[0].id),
        icon:          midday.weather[0].icon,
        description:   midday.weather[0].description,
        precipitation: Math.round((midday.pop || 0) * 100)
      };
    });
  }

  private mapCondition(id: number): WeatherCondition {
    if (id >= 200 && id < 300) return 'thunderstorm';
    if (id >= 300 && id < 400) return 'drizzle';
    if (id >= 500 && id < 600) return id >= 511 ? 'stormy' : 'rain';
    if (id >= 600 && id < 700) return 'snow';
    if (id >= 700 && id < 800) return 'mist';
    if (id === 800) return 'clear';
    if (id === 801 || id === 802) return 'partly-cloudy';
    if (id === 803 || id === 804) return 'cloudy';
    return 'clear';
  }

  private degToDirection(deg: number): string {
    const dirs = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
    return dirs[Math.round(deg / 45) % 8];
  }

  private mapAirQuality(aq: any): AirQuality {
    if (!aq?.list?.[0]) return { aqi: 1, label: 'Bon', pm25: 0, pm10: 0, o3: 0, no2: 0 };
    const comp = aq.list[0].components;
    const aqi = aq.list[0].main.aqi;
    const labels = ['', 'Bon', 'Moyen', 'Modéré', 'Mauvais', 'Très Mauvais'];
    
    return {
      aqi,
      label: labels[aqi],
      pm25: comp.pm2_5,
      pm10: comp.pm10,
      o3: comp.o3,
      no2: comp.no2
    };
  }
}