'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { 
  Droplets, 
  Wind, 
  Sun, 
  Search,
  Loader2,
  Plus,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight
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
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState('/sunny.png');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Colombo');
  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [view, setView] = useState<'default' | 'current'>('default');
  const [currentLocationWeather, setCurrentLocationWeather] = useState<WeatherData | null>(null);
  const [currentLocationError, setCurrentLocationError] = useState<string | null>(null);

  // Load saved locations from localStorage
  useEffect(() => {
    const storedLocations = localStorage.getItem('savedLocations');
    if (storedLocations) {
      setSavedLocations(JSON.parse(storedLocations));
    }
  }, []);

  // Update localStorage whenever savedLocations changes
  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const fetchWeather = async (query: string) => {
    try {
      setSearching(true);
      setError(null);
      
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${query}&aqi=no`
      );
      
      setWeather(response.data);
      setLocation(query);
      setSearchQuery('');
      
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
      setError('Location not found. Please try another search.');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const fetchCurrentLocationWeather = async () => {
    setGettingLocation(true);
    setCurrentLocationError(null);
    
    try {
      // Get user's current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      // Fetch weather for the current location
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${latitude},${longitude}&aqi=no`
      );
      
      setCurrentLocationWeather(response.data);
      setView('current');
    } catch (err: any) {
      if (err.code === 1) { // Permission denied
        setCurrentLocationError('Location access was denied. Please enable location access in your browser settings.');
      } else if (err.code === 2) { // Position unavailable
        setCurrentLocationError('Could not determine your location. Please try again later.');
      } else if (err.code === 3) { // Timeout
        setCurrentLocationError('Location request timed out. Please try again.');
      } else {
        setCurrentLocationError('Error getting your location. Please try again.');
      }
      console.error('Error getting current location:', err);
    } finally {
      setGettingLocation(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery);
      setView('default');
    }
  };

  const saveCurrentLocation = () => {
    const locationToSave = view === 'current' && currentLocationWeather 
      ? currentLocationWeather.location.name
      : weather?.location.name;
      
    if (locationToSave && !savedLocations.includes(locationToSave)) {
      setSavedLocations([...savedLocations, locationToSave]);
    }
  };

  const deleteLocation = (locationToDelete: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the button's onClick
    setSavedLocations(savedLocations.filter(loc => loc !== locationToDelete));
  };

  // Determine which weather data to display
  const displayWeather = view === 'current' && currentLocationWeather ? currentLocationWeather : weather;
  const displayLocationName = view === 'current' && currentLocationWeather ? 'My Location' : 'Default';

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
        {/* Location switcher */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs opacity-70">
            {view === 'default' ? 'Default Location' : 'Current Location'}
          </span>
          
          <div className="flex items-center gap-2">
            {view === 'current' && (
              <button 
                onClick={() => setView('default')}
                className="bg-white/10 hover:bg-white/20 transition-colors p-1.5 rounded-full flex items-center gap-1 text-xs"
              >
                <ChevronLeft className="h-3 w-3" />
                Default
              </button>
            )}
            
            {view === 'default' && (
              <button 
                onClick={fetchCurrentLocationWeather}
                disabled={gettingLocation}
                className="bg-white/10 hover:bg-white/20 transition-colors p-1.5 rounded-full flex items-center gap-1 text-xs"
              >
                {gettingLocation ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    My Location
                    <ChevronRight className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Current location error message */}
        {currentLocationError && view === 'default' && (
          <div className="mb-4 px-3 py-2 bg-red-500/20 rounded-lg text-sm">
            <p>{currentLocationError}</p>
          </div>
        )}

        {/* Saved locations */}
        {savedLocations.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {savedLocations.map((savedLocation) => (
              <button
                key={savedLocation}
                onClick={() => {
                  fetchWeather(savedLocation);
                  setView('default');
                }}
                className="bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
              >
                {savedLocation}
                <X 
                  className="h-3.5 w-3.5 text-white/70 hover:text-white" 
                  onClick={(e) => deleteLocation(savedLocation, e)} 
                />
              </button>
            ))}
          </div>
        )}

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md rounded-full py-3 pl-5 pr-12 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full"
              disabled={searching}
            >
              {searching ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <Search className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-300 text-sm mt-2">{error}</p>
          )}
        </form>
        
        {displayWeather && (
          <>
            {/* Header with save button */}
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  {view === 'current' && <MapPin className="h-5 w-5 text-blue-300" />}
                  {displayWeather.location.name}, {displayWeather.location.country}
                </h1>
                <p className="text-sm opacity-80">
                  {new Date(displayWeather.location.localtime).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button 
                onClick={saveCurrentLocation}
                disabled={savedLocations.includes(displayWeather.location.name)}
                className={`p-2 rounded-full ${
                  savedLocations.includes(displayWeather.location.name) 
                    ? 'bg-white/10 cursor-not-allowed' 
                    : 'bg-white/20 hover:bg-white/30 transition-colors'
                }`}
                title={savedLocations.includes(displayWeather.location.name) ? 'Already saved' : 'Save location'}
              >
                <Plus className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Main information */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-5xl font-bold mb-1">{displayWeather.current.temp_c}°C</h2>
                <p className="text-sm opacity-80">Feels like {displayWeather.current.feelslike_c}°C</p>
              </div>
              <div className="flex flex-col items-center">
                <img 
                  src={`https:${displayWeather.current.condition.icon}`} 
                  alt={displayWeather.current.condition.text}
                  width={80}
                  height={80}
                  className="mb-1"
                />
                <p className="text-center text-sm">{displayWeather.current.condition.text}</p>
              </div>
            </div>

            {/* Weather details */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Droplets className="h-6 w-6 text-white/90" />
                <div>
                  <p className="text-xs opacity-70">Humidity</p>
                  <p className="font-semibold">{displayWeather.current.humidity}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Wind className="h-6 w-6 text-white/90" />
                <div>
                  <p className="text-xs opacity-70">Wind</p>
                  <p className="font-semibold">{displayWeather.current.wind_kph} km/h</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Sun className="h-6 w-6 text-white/90" />
                <div>
                  <p className="text-xs opacity-70">UV Index</p>
                  <p className="font-semibold">{displayWeather.current.uv}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}