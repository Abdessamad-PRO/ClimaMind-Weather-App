import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, of } from 'rxjs';
import { WeatherData, WeatherCondition, ForecastDay, AirQuality } from '../models/weather.model';
import { SearchResult } from '../models/location.model';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly API_KEY = environment.openWeatherApiKey;
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';
  private readonly GEO_URL = 'https://api.openweathermap.org/geo/1.0';
  private readonly UNITS = 'metric';

  constructor(private http: HttpClient) {}

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    const current$ = this.http.get<any>(`${this.BASE_URL}/weather`, {
      params: new HttpParams()
        .set('lat', lat)
        .set('lon', lon)
        .set('appid', this.API_KEY)
        .set('units', this.UNITS)
    });

    const forecast$ = this.http.get<any>(`${this.BASE_URL}/forecast`, {
      params: new HttpParams()
        .set('lat', lat)
        .set('lon', lon)
        .set('appid', this.API_KEY)
        .set('units', this.UNITS)
    });

    const airQuality$ = this.http.get<any>(`${this.BASE_URL}/air_pollution`, {
      params: new HttpParams()
        .set('lat', lat)
        .set('lon', lon)
        .set('appid', this.API_KEY)
    });

    return forkJoin([current$, forecast$, airQuality$]).pipe(
      map(([current, forecast, aq]) => this.mapToWeatherData(current, forecast, aq))
    );
  }

  getWeatherByCity(city: string): Observable<WeatherData> {
    return this.http.get<any>(`${this.BASE_URL}/weather`, {
      params: new HttpParams()
        .set('q', city)
        .set('appid', this.API_KEY)
        .set('units', this.UNITS)
    }).pipe(
      switchMap(data => this.getWeatherByCoords(data.coord.lat, data.coord.lon))
    );
  }

  searchCities(query: string): Observable<SearchResult[]> {
    return this.http.get<any[]>(`${this.GEO_URL}/direct`, {
      params: new HttpParams()
        .set('q', query)
        .set('limit', 5)
        .set('appid', this.API_KEY)
    }).pipe(
      map(results => results.map(r => ({
        name: r.name,
        country: r.country,
        countryCode: r.country,
        state: r.state,
        lat: r.lat,
        lon: r.lon
      })))
    );
  }

  private mapToWeatherData(current: any, forecast: any, aq: any): WeatherData {
    const condition = this.mapCondition(current.weather[0].id);
    const dailyForecast = this.aggregateDailyForecast(forecast.list);

    return {
      city: current.name,
      country: current.sys.country,
      lat: current.coord.lat,
      lon: current.coord.lon,
      temperature: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6),
      windDeg: current.wind.deg,
      visibility: Math.round(current.visibility / 1000),
      pressure: current.main.pressure,
      uvIndex: 0,
      condition,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
      timestamp: current.dt,
      forecast: dailyForecast,
      airQuality: this.mapAirQuality(aq)
    };
  }

  private aggregateDailyForecast(list: any[]): ForecastDay[] {
    const dayMap = new Map<string, any[]>();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const key = date.toDateString();
      if (!dayMap.has(key)) dayMap.set(key, []);
      dayMap.get(key)!.push(item);
    });

    return Array.from(dayMap.entries()).slice(0, 6).map(([dateStr, items]) => {
      const date = new Date(dateStr);
      const temps = items.map(i => i.main.temp);
      const midday = items[Math.floor(items.length / 2)];
      return {
        date: date.getTime() / 1000,
        dayName: days[date.getDay()],
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        condition: this.mapCondition(midday.weather[0].id),
        icon: midday.weather[0].icon,
        description: midday.weather[0].description,
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

  private mapAirQuality(aq: any): AirQuality {
    if (!aq?.list?.[0]) return { aqi: 1, label: 'Good', pm25: 0, pm10: 0, o3: 0, no2: 0 };
    const comp = aq.list[0].components;
    const aqi = aq.list[0].main.aqi;
    const labels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
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
