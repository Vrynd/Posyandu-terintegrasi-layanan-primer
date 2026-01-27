import { Moon, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Definisi properti komponen sambutan pengguna
interface WelcomeProps {
   firstName: string;
   userRole: string;
   onSearchOpen: () => void;
}

export function Welcome({ firstName, userRole, onSearchOpen }: WelcomeProps) {
   // Handler notifikasi untuk fitur yang belum tersedia
   const handleThemeToast = () => {
      toast('Fitur Mode Gelap akan segera hadir!', { icon: '✨' });
   };

   // Render komponen pesan selamat datang dan aksi cepat
   return (
      <div className="relative flex items-center justify-between">
         <div className="shrink-0 flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
               Selamat Datang, {firstName}!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
               {userRole} • Posyandu ILP Desa Tondomulyo
            </p>
         </div>
         <div className="flex items-center gap-2">
            <button
               onClick={handleThemeToast}
               className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all group"
               title="Mode Gelap (Segera Hadir)"
            >
               <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300 group-hover:-rotate-12 transition-transform" />
            </button>
            <button
               onClick={onSearchOpen}
               className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all group"
               title="Cari Peserta (Ctrl+K)"
            >
               <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
         </div>
      </div>
   );
}
