import { Calendar, Clock, CloudSun } from 'lucide-react';
import { BeatLoader } from 'react-spinners';

// Definisi properti untuk komponen informasi cuaca dan waktu
interface WeatherClockProps {
   date: string;
   time: string;
   weather: { temp: number; desc: string } | null;
   weatherLoading: boolean;
}

export function WeatherClock({ date, time, weather, weatherLoading }: WeatherClockProps) {
   // Render widget informasi cuaca dan jam digital
   return (
      <div className="relative mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
               <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-400 shrink-0" />
               <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                  {date}
               </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
               <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-400 shrink-0" />
               <span className="text-xs sm:text-sm font-medium text-slate-200">
                  {time}
               </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
               <CloudSun className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-400 shrink-0" />
               {weatherLoading ? (
                  <BeatLoader color="#e2e8f0" size={6} margin={2} />
               ) : weather ? (
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                     {weather.temp}°C <span className="hidden sm:inline text-slate-500">• {weather.desc}</span>
                  </span>
               ) : (
                  <span className="text-xs sm:text-sm font-medium text-slate-400">--°C</span>
               )}
            </div>
         </div>
      </div>
   );
}
