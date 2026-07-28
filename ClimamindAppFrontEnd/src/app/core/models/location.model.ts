export interface LocationData {
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  state?: string;
  timezone?: string;
}

export interface SearchResult {
  name: string;
  country: string;
  countryCode: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface RecentSearch {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature?: number;
  condition?: string;
  timestamp: number;
}

export interface MapPin {
  lat: number;
  lon: number;
  city: string;
  temperature?: number;
  condition?: string;
}
