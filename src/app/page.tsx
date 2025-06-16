'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Droplets, 
  Wind, 
  Sun, 
  Thermometer,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

interface WeatherData {
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

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState('/sunny.png');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=Colombo&aqi=no`
        );
        setWeather(response.data);
        
        // Set background image based on weather condition
        const conditionText = response.data.current.condition.text.toLowerCase();
        const isDay = response.data.current.is_day === 1;
        
        if (!isDay) {
          setBackgroundImage('/night.png');
        } else if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
          setBackgroundImage('/rainy.png');
        } else if (conditionText.includes('cloud') || conditionText.includes('overcast')) {
          setBackgroundImage('/partly-cloudy.png');
        } else if (conditionText.includes('fog') || conditionText.includes('mist')) {
          setBackgroundImage('/fog.png');
        } else if (conditionText.includes('snow')) {
          setBackgroundImage('/snowy.png');
        } else if (conditionText.includes('thunder') || conditionText.includes('storm')) {
          setBackgroundImage('/stormy.png');
        } else {
          setBackgroundImage('/sunny.png');
        }
      } catch (err) {
        setError('Failed to fetch weather data. Please try again later.');
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-primary-light to-primary-dark text-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-primary-light to-primary-dark text-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="mb-4">{error || 'Something went wrong'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white/20 hover:bg-white/30 transition-colors px-6 py-3 rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex justify-center items-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Weather background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay with blur and darkening effect */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 bg-black/30 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-xl border border-white/20 text-white">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            {weather.location.name}, {weather.location.country}
          </h1>
          <p className="text-sm opacity-80">
            {new Date(weather.location.localtime).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Main information */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-5xl font-bold mb-1">{weather.current.temp_c}°C</h2>
            <p className="text-sm opacity-80">Feels like {weather.current.feelslike_c}°C</p>
          </div>
          <div className="flex flex-col items-center">
            <img 
              src={`https:${weather.current.condition.icon}`} 
              alt={weather.current.condition.text}
              width={80}
              height={80}
              className="mb-1"
            />
            <p className="text-center text-sm">{weather.current.condition.text}</p>
          </div>
        </div>

        {/* Weather details */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-white/90" />
            <div>
              <p className="text-xs opacity-70">Humidity</p>
              <p className="font-semibold">{weather.current.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-6 w-6 text-white/90" />
            <div>
              <p className="text-xs opacity-70">Wind</p>
              <p className="font-semibold">{weather.current.wind_kph} km/h</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sun className="h-6 w-6 text-white/90" />
            <div>
              <p className="text-xs opacity-70">UV Index</p>
              <p className="font-semibold">{weather.current.uv}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}