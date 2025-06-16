import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface LocationSwitcherProps {
  view: 'default' | 'current';
  setView: (view: 'default' | 'current') => void;
  fetchCurrentLocationWeather: () => Promise<void>;
  gettingLocation: boolean;
}

export default function LocationSwitcher({
  view,
  setView,
  fetchCurrentLocationWeather,
  gettingLocation
}: LocationSwitcherProps) {
  return (
    <div className="flex justify-between items-center mb-3 sm:mb-4">
      <span className="text-xs opacity-70">
        {view === 'default' ? 'Default Location' : 'Current Location'}
      </span>
      
      <div className="flex items-center gap-2">
        {view === 'current' && (
          <button 
            onClick={() => setView('default')}
            className="bg-white/10 hover:bg-white/20 transition-colors p-1 sm:p-1.5 rounded-full flex items-center gap-1 text-xs"
          >
            <ChevronLeft className="h-3 w-3" />
            <span className="hidden xs:inline">Default</span>
          </button>
        )}
        
        {view === 'default' && (
          <button 
            onClick={fetchCurrentLocationWeather}
            disabled={gettingLocation}
            className="bg-white/10 hover:bg-white/20 transition-colors p-1 sm:p-1.5 rounded-full flex items-center gap-1 text-xs"
          >
            {gettingLocation ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <span className="hidden xs:inline">My Location</span>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}