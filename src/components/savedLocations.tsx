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
    <div className="mb-6 flex flex-wrap gap-2">
      {locations.map((location) => (
        <button
          key={location}
          onClick={() => onLocationClick(location)}
          className="bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
        >
          {location}
          <X 
            className="h-3.5 w-3.5 text-white/70 hover:text-white" 
            onClick={(e) => onDeleteLocation(location, e)} 
          />
        </button>
      ))}
    </div>
  );
}