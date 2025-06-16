import { FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: FormEvent) => void;
  searching: boolean;
  error: string | null;
}

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  searching, 
  error 
}: SearchBarProps) {
  return (
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
  );
}