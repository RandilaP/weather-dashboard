export interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
    uv: number;
    feelslike_c: number;
    is_day: number;
  };
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    maxwind_kph: number;
    totalprecip_mm: number;
    avghumidity: number;
    daily_chance_of_rain: number;
    uv: number;
  };
}

export interface ForecastData {
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface HistoryDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    maxwind_kph: number;
    totalprecip_mm: number;
    avghumidity: number;
    uv: number;
  };
}

export interface HistoryData {
  forecast: {
    forecastday: HistoryDay[];
  };
}