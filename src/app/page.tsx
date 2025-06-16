'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

// Components
import WeatherCard from '@/components/weatherCard';
import SearchBar from '@/components/searchBar';
import SavedLocations from '@/components/savedLocations';
import LocationSwitcher from '@/components/locationSwitcher';
import WeatherBackground, { getBackgroundImage } from '@/components/weatherBackground';
import WeatherTabs from '@/components/weatherDataTabs';

// Types
import { WeatherData, ForecastDay, HistoryDay } from '@/types/weatherData';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Colombo');
  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [view, setView] = useState<'default' | 'current'>('default');
  const [currentLocationWeather, setCurrentLocationWeather] = useState<WeatherData | null>(null);
  const [currentLocationError, setCurrentLocationError] = useState<string | null>(null);
  
  // New state for forecast and history data
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [historyData, setHistoryData] = useState<HistoryDay[]>([]);
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(false);

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

  const fetchWeatherData = async (query: string) => {
    try {
      setSearching(true);
      setError(null);
      setLoadingAdditionalData(true);
      
      // Fetch current weather
      const currentResponse = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${query}&aqi=no`
      );
      
      setWeather(currentResponse.data);
      setLocation(query);
      setSearchQuery('');
      
      // Fetch forecast data (3 days)
      const forecastResponse = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${query}&days=3&aqi=no`
      );
      setForecastData(forecastResponse.data.forecast.forecastday);
      
      // Fetch history data (last 7 days)
      const historyPromises = [];
      for (let i = 1; i <= 7; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        historyPromises.push(
          axios.get(`https://api.weatherapi.com/v1/history.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${query}&dt=${date}`)
        );
      }
      
      const historyResponses = await Promise.all(historyPromises);
      const historyResults = historyResponses.map(response => response.data.forecast.forecastday[0]);
      setHistoryData(historyResults);
      
    } catch (err) {
      setError('Location not found. Please try another search.');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
      setSearching(false);
      setLoadingAdditionalData(false);
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
      const query = `${latitude},${longitude}`;
      
      // Fetch current weather for the current location
      const currentResponse = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${query}&aqi=no`
      );
      
      setCurrentLocationWeather(currentResponse.data);
      
      // Fetch forecast data
      const forecastResponse = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${query}&days=3&aqi=no`
      );
      setForecastData(forecastResponse.data.forecast.forecastday);
      
      // Fetch history data
      const historyPromises = [];
      for (let i = 1; i <= 7; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        historyPromises.push(
          axios.get(`https://api.weatherapi.com/v1/history.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${query}&dt=${date}`)
        );
      }
      
      const historyResponses = await Promise.all(historyPromises);
      const historyResults = historyResponses.map(response => response.data.forecast.forecastday[0]);
      setHistoryData(historyResults);
      
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
    fetchWeatherData(location);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherData(searchQuery);
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

  const handleSavedLocationClick = (locationName: string) => {
    fetchWeatherData(locationName);
    setView('default');
  };

  const deleteLocation = (locationToDelete: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the button's onClick
    setSavedLocations(savedLocations.filter(loc => loc !== locationToDelete));
  };

  // Determine which weather data to display
  const displayWeather = view === 'current' && currentLocationWeather ? currentLocationWeather : weather;

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
    <WeatherBackground weather={displayWeather}>
      {/* Location switcher */}
      <LocationSwitcher 
        view={view}
        setView={setView}
        fetchCurrentLocationWeather={fetchCurrentLocationWeather}
        gettingLocation={gettingLocation}
      />
      
      {/* Current location error message */}
      {currentLocationError && view === 'default' && (
        <div className="mb-4 px-3 py-2 bg-red-500/20 rounded-lg text-sm">
          <p>{currentLocationError}</p>
        </div>
      )}

      {/* Saved locations */}
      <SavedLocations 
        locations={savedLocations}
        onLocationClick={handleSavedLocationClick}
        onDeleteLocation={deleteLocation}
      />

      {/* Search form */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        searching={searching}
        error={error}
      />
      
      {/* Weather card */}
      {displayWeather && (
        <WeatherCard
          weather={displayWeather}
          isCurrentLocation={view === 'current'}
          savedLocations={savedLocations}
          onSaveLocation={saveCurrentLocation}
        />
      )}
      
      {/* Loading indicator for additional data */}
      {loadingAdditionalData && (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      
      {/* Weather Tabs with Forecast and History */}
      {!loadingAdditionalData && forecastData.length > 0 && historyData.length > 0 && (
        <WeatherTabs 
          forecastData={forecastData}
          historyData={historyData}
        />
      )}
    </WeatherBackground>
  );
}