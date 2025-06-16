import { 
  Droplets, 
  Wind, 
  Sun, 
  MapPin,
  Plus
} from 'lucide-react';
import { WeatherData } from '@/types/weatherData';

interface WeatherCardProps {
  weather: WeatherData;
  isCurrentLocation: boolean;
  savedLocations: string[];
  onSaveLocation: () => void;
}

export default function WeatherCard({ 
  weather, 
  isCurrentLocation, 
  savedLocations,
  onSaveLocation
}: WeatherCardProps) {
  return (
    <>
      {/* Header with save button */}
      <div className="mb-6 md:mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2">
            {isCurrentLocation && <MapPin className="h-5 w-5 text-blue-300" />}
            {weather.location.name}, {weather.location.country}
          </h1>
          <p className="text-xs sm:text-sm opacity-80">
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
        <button 
          onClick={onSaveLocation}
          disabled={savedLocations.includes(weather.location.name)}
          className={`p-2 rounded-full ${
            savedLocations.includes(weather.location.name) 
              ? 'bg-white/10 cursor-not-allowed' 
              : 'bg-white/20 hover:bg-white/30 transition-colors'
          }`}
          title={savedLocations.includes(weather.location.name) ? 'Already saved' : 'Save location'}
        >
          <Plus className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Main information */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h2 className="text-4xl sm:text-5xl font-bold mb-1">{weather.current.temp_c}°C</h2>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/20">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 sm:h-6 w-5 sm:w-6 text-white/90" />
          <div>
            <p className="text-xs opacity-70">Humidity</p>
            <p className="font-semibold">{weather.current.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Wind className="h-5 sm:h-6 w-5 sm:w-6 text-white/90" />
          <div>
            <p className="text-xs opacity-70">Wind</p>
            <p className="font-semibold">{weather.current.wind_kph} km/h</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Sun className="h-5 sm:h-6 w-5 sm:w-6 text-white/90" />
          <div>
            <p className="text-xs opacity-70">UV Index</p>
            <p className="font-semibold">{weather.current.uv}</p>
          </div>
        </div>
      </div>
    </>
  );
}