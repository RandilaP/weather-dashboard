'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

// Components
import WeatherCard from '@/components/weatherCard';
import SearchBar from '@/components/searchBar';
import SavedLocations from '@/components/savedLocations';
import LocationSwitcher from '@/components/locationSwitcher';
import WeatherBackground, { getBackgroundImage } from '@/components/weatherBackground';

// Types
import { WeatherData } from '@/types/weatherData';

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

  const handleSavedLocationClick = (locationName: string) => {
    fetchWeather(locationName);
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
    </WeatherBackground>
  );
}