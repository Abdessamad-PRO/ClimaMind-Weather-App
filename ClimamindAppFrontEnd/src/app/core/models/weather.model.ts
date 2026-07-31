export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  windDirection: string;
  visibility: number;
  pressure: number;
  uvIndex: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  timestamp: number;
  timezone: number;
  isDay: boolean;          
  forecast: ForecastDay[];
  hourly: HourlyPoint[];
  airQuality?: AirQuality;
}

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'stormy';

export interface ForecastDay {
  date: number;
  dayName: string;
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  icon: string;
  description: string;
  precipitation: number;
}

export interface HourlyPoint {
  time: number;
  hour: string;
  temp: number;
  condition: WeatherCondition;
  icon: string;
  isDay: boolean;          
}

export interface AirQuality {
  aqi: number;
  label: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
}