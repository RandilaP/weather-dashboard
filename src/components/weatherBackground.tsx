import Image from 'next/image';
import { WeatherData } from '@/types/weatherData';

interface WeatherBackgroundProps {
  weather: WeatherData | null;
  children: React.ReactNode;
}

// Function to determine background based on weather conditions
export function getBackgroundImage(weather: WeatherData | null): string {
  if (!weather) return '/sunny.png';
  
  const conditionText = weather.current.condition.text.toLowerCase();
  const isDay = weather.current.is_day === 1;
  
  if (!isDay) {
    return '/night.png';
  } else if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
    return '/rainy.png';
  } else if (conditionText.includes('cloud') || conditionText.includes('overcast')) {
    return '/partly-cloudy.png';
  } else if (conditionText.includes('fog') || conditionText.includes('mist')) {
    return '/fog.png';
  } else if (conditionText.includes('snow')) {
    return '/snowy.png';
  } else if (conditionText.includes('thunder') || conditionText.includes('storm')) {
    return '/stormy.png';
  } else {
    return '/sunny.png';
  }
}

export default function WeatherBackground({ weather, children }: WeatherBackgroundProps) {
  const backgroundImage = getBackgroundImage(weather);
  
  return (
    <div className="min-h-screen relative flex justify-center items-center p-2 sm:p-4 md:p-6">
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
      <div className="relative z-10 bg-black/30 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-3xl mx-auto shadow-xl border border-white/20 text-white">
        {children}
      </div>
    </div>
  );
}