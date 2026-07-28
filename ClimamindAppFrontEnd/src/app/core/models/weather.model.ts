export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  timestamp: number;
  forecast: ForecastDay[];
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

export interface AirQuality {
  aqi: number;
  label: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
}

export interface HourlyForecast {
  time: number;
  temp: number;
  condition: WeatherCondition;
  icon: string;
}
