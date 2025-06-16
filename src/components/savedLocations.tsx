import { X } from 'lucide-react';

interface SavedLocationsProps {
  locations: string[];
  onLocationClick: (location: string) => void;
  onDeleteLocation: (location: string, event: React.MouseEvent) => void;
}

export default function SavedLocations({ 
  locations, 
  onLocationClick, 
  onDeleteLocation 
}: SavedLocationsProps) {
  if (locations.length === 0) return null;
  
  return (
    <div className="mb-4 sm:mb-6 overflow-x-auto pb-2">
      <div className="flex flex-nowrap gap-2 min-w-min">
        {locations.map((location) => (
          <button
            key={location}
            onClick={() => onLocationClick(location)}
            className="bg-white/10 hover:bg-white/20 transition-colors px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
          >
            {location}
            <X 
              className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/70 hover:text-white" 
              onClick={(e) => onDeleteLocation(location, e)} 
            />
          </button>
        ))}
      </div>
    </div>
  );
}