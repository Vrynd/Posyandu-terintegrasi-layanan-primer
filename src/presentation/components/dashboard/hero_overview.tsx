import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { useDateTime } from '../../hooks/useDateTime';
import { useWeather } from '../../hooks/useWeather';
import { QuickSearch } from './quick_search';
import { Welcome } from './welcome';
import { WeatherClock } from './weather_clock';
import { Service } from './targeted_service';

export function HeroOverview() {
   // Mengambil seluruh data global yang dibutuhkan component hero
   const { user } = useAuth();
   const { stats, isLoading: isStatsLoading } = useDashboard();
   const { formatDate, formatTime } = useDateTime();
   const { weather, isLoading: isWeatherLoading } = useWeather();

   // State untuk mengontrol visibilitas pencarian cepat
   const [isSearchOpen, setIsSearchOpen] = useState(false);

   // Menentukan identitas pengguna
   const fullName = user?.name || '';
   const firstName = fullName.split(' ')[0] || user?.email?.split('@')[0] || 'Pengguna';
   const userRole = user?.role === 'admin' ? 'Admin' : 'Kader';

   // Menyiapkan tanggal dan waktu saat ini
   const currentDate = formatDate();
   const currentTime = formatTime();

   // Menangani shortcut keyboard global (Ctrl/Cmd + K)
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsSearchOpen(true);
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, []);

   // Merender tampilan antar muka utama Hero Overview
   return (
      <div className="space-y-5">
         <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
            <div className="absolute inset-0 overflow-hidden">
               <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
               <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
            <Welcome
               firstName={firstName}
               userRole={userRole}
               onSearchOpen={() => setIsSearchOpen(true)}
            />
            <WeatherClock
               date={currentDate}
               time={currentTime}
               weather={weather}
               weatherLoading={isWeatherLoading}
            />
         </div>
         <Service stats={stats?.kategori} isLoading={isStatsLoading} />
         <QuickSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
   );
}

