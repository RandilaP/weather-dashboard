import { ForecastDay } from '@/types/weatherData';

interface ForecastTableProps {
  forecastData: ForecastDay[];
}

export default function ForecastTable({ forecastData }: ForecastTableProps) {
  if (!forecastData || forecastData.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">3-Day Forecast</h2>
      
      {/* Desktop version (hidden on small screens) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full bg-white/10 backdrop-blur-md rounded-lg border-collapse">
          <thead>
            <tr className="border-b border-white/20">
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Condition</th>
              <th className="p-3 text-left">High/Low</th>
              <th className="p-3 text-left">Rain Chance</th>
              <th className="p-3 text-left">Humidity</th>
              <th className="p-3 text-left">UV Index</th>
            </tr>
          </thead>
          <tbody>
            {forecastData.map((day) => {
              const date = new Date(day.date);
              return (
                <tr key={day.date_epoch} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-3">
                    {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https:${day.day.condition.icon}`} 
                        alt={day.day.condition.text} 
                        width={30} 
                        height={30}
                      />
                      <span>{day.day.condition.text}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {Math.round(day.day.maxtemp_c)}°/{Math.round(day.day.mintemp_c)}°
                  </td>
                  <td className="p-3">{day.day.daily_chance_of_rain}%</td>
                  <td className="p-3">{day.day.avghumidity}%</td>
                  <td className="p-3">{day.day.uv}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile version (card-based layout) */}
      <div className="sm:hidden space-y-4">
        {forecastData.map((day) => {
          const date = new Date(day.date);
          return (
            <div key={day.date_epoch} className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-sm">
                  {Math.round(day.day.maxtemp_c)}°/{Math.round(day.day.mintemp_c)}°
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src={`https:${day.day.condition.icon}`} 
                  alt={day.day.condition.text} 
                  width={30} 
                  height={30}
                />
                <span className="text-sm">{day.day.condition.text}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-white/70">Rain</p>
                  <p>{day.day.daily_chance_of_rain}%</p>
                </div>
                <div>
                  <p className="text-white/70">Humidity</p>
                  <p>{day.day.avghumidity}%</p>
                </div>
                <div>
                  <p className="text-white/70">UV Index</p>
                  <p>{day.day.uv}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}