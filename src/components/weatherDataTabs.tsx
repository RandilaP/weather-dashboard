import { useState } from 'react';
import ForecastTable from './forecastTable';
import HistoryTable from './historyTable';
import { ForecastDay, HistoryDay } from '@/types/weatherData';

interface WeatherTabsProps {
  forecastData: ForecastDay[];
  historyData: HistoryDay[];
}

export default function WeatherTabs({ forecastData, historyData }: WeatherTabsProps) {
  const [activeTab, setActiveTab] = useState<'forecast' | 'history'>('forecast');

  return (
    <div className="mt-6 sm:mt-8 border-t border-white/20 pt-4 sm:pt-6">
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
            activeTab === 'forecast' 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          3-Day Forecast
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
            activeTab === 'history' 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          7-Day History
        </button>
      </div>

      {activeTab === 'forecast' ? (
        <ForecastTable forecastData={forecastData} />
      ) : (
        <HistoryTable historyData={historyData} />
      )}
    </div>
  );
}