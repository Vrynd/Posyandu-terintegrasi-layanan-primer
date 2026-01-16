import { Heart, Baby, GraduationCap, Briefcase, PersonStanding, Calendar, CloudSun, Search, Clock, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { SearchModal } from './SearchModal';
import { toast } from 'react-hot-toast';

interface SasaranItem {
    id: string;
    label: string;
    value: number;
    icon: LucideIcon;
    gradient: string;
    iconBg: string;
    iconColor: string;
}

/**
 * HeroOverview - Command Center hero section with modern glassmorphism design
 * 5 Sasaran Layanan Posyandu - Realtime data from Supabase
 */
export function HeroOverview() {
    const { user } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { stats, isLoading: isStatsLoading } = useDashboard();

    // Get first name for greeting
    const fullName = user?.name || '';
    const firstName = fullName.split(' ')[0] || user?.email?.split('@')[0] || 'Pengguna';

    const userRole = user?.role === 'admin' ? 'Admin' : 'Kader';

    // Weather & Time state
    const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Format current date and time
    const formatDate = () => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${days[currentTime.getDay()]}, ${currentTime.getDate()} ${months[currentTime.getMonth()]} ${currentTime.getFullYear()}`;
    };

    const formatTime = () => {
        return currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    };

    // Fetch weather based on user's realtime location (with localStorage cache)
    useEffect(() => {
        const CACHE_KEY = 'posyandu_weather_cache';
        const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

        // Weather code descriptions
        const weatherCodes: Record<number, string> = {
            0: 'Cerah',
            1: 'Cerah Berawan',
            2: 'Berawan Sebagian',
            3: 'Berawan',
            45: 'Berkabut',
            48: 'Berkabut Tebal',
            51: 'Gerimis Ringan',
            53: 'Gerimis',
            55: 'Gerimis Lebat',
            61: 'Hujan Ringan',
            63: 'Hujan',
            65: 'Hujan Lebat',
            71: 'Hujan Salju Ringan',
            73: 'Hujan Salju',
            75: 'Hujan Salju Lebat',
            80: 'Hujan Lokal',
            81: 'Hujan Lokal Sedang',
            82: 'Hujan Lokal Lebat',
            95: 'Badai Petir',
            96: 'Badai Petir + Hujan Es',
            99: 'Badai Petir Hebat',
        };

        const fetchWeatherForLocation = async (latitude: number, longitude: number) => {
            // Create location-specific cache key
            const locationKey = `${CACHE_KEY}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;

            // Check cache first
            try {
                const cached = localStorage.getItem(locationKey);
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_DURATION_MS) {
                        setWeather(data);
                        setWeatherLoading(false);
                        console.log('[Weather] Using cached data for location');
                        return;
                    }
                }
            } catch {
                // Cache read failed, continue to fetch
            }

            try {
                // Using Open-Meteo API (free, no API key needed)
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=Asia/Jakarta`
                );
                const data = await res.json();

                const weatherData = {
                    temp: Math.round(data.current.temperature_2m),
                    desc: weatherCodes[data.current.weather_code] || 'Tidak Diketahui'
                };

                setWeather(weatherData);
                setWeatherLoading(false);

                // Save to cache with location key
                try {
                    localStorage.setItem(locationKey, JSON.stringify({
                        data: weatherData,
                        timestamp: Date.now()
                    }));
                    console.log('[Weather] Data cached for location:', latitude.toFixed(2), longitude.toFixed(2));
                } catch {
                    // Cache write failed, ignore
                }
            } catch (error) {
                console.warn('[Weather] Failed to fetch:', error);
                setWeatherLoading(false);
            }
        };

        // Try to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Success - use real location
                    const { latitude, longitude } = position.coords;
                    console.log('[Weather] Using realtime location:', latitude, longitude);
                    fetchWeatherForLocation(latitude, longitude);
                },
                (error) => {
                    // Geolocation failed - fallback to Yogyakarta (default)
                    console.log('[Weather] Geolocation denied, using default (Yogyakarta):', error.message);
                    // Yogyakarta coordinates: -7.7956, 110.3695
                    fetchWeatherForLocation(-7.7956, 110.3695);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 10 * 60 * 1000 // Cache position for 10 minutes
                }
            );
        } else {
            // Browser doesn't support geolocation - fallback to Yogyakarta
            console.log('[Weather] Geolocation not supported, using default (Yogyakarta)');
            fetchWeatherForLocation(-7.7956, 110.3695);
        }
    }, []);

    // Global Keyboard Shortcut (Cmd+K / Ctrl+K)
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

    const sasaran: SasaranItem[] = [
        {
            id: 'bumil',
            label: 'Ibu Hamil',
            value: stats?.kategori.bumil || 0,
            icon: Heart,
            gradient: 'from-pink-500 to-rose-500',
            iconBg: 'bg-white/20 backdrop-blur-sm',
            iconColor: 'text-white'
        },
        {
            id: 'balita',
            label: 'Bayi & Balita',
            value: stats?.kategori.balita || 0,
            icon: Baby,
            gradient: 'from-blue-500 to-cyan-500',
            iconBg: 'bg-white/20 backdrop-blur-sm',
            iconColor: 'text-white'
        },
        {
            id: 'remaja',
            label: 'Anak & Remaja',
            value: stats?.kategori.remaja || 0,
            icon: GraduationCap,
            gradient: 'from-amber-500 to-orange-500',
            iconBg: 'bg-white/20 backdrop-blur-sm',
            iconColor: 'text-white'
        },
        {
            id: 'produktif',
            label: 'Usia Produktif',
            value: stats?.kategori.produktif || 0,
            icon: Briefcase,
            gradient: 'from-emerald-500 to-teal-500',
            iconBg: 'bg-white/20 backdrop-blur-sm',
            iconColor: 'text-white'
        },
        {
            id: 'lansia',
            label: 'Lansia',
            value: stats?.kategori.lansia || 0,
            icon: PersonStanding,
            gradient: 'from-purple-500 to-violet-500',
            iconBg: 'bg-white/20 backdrop-blur-sm',
            iconColor: 'text-white'
        },
    ];

    return (
        <div className="space-y-5">
            {/* Header Card with Total & Real-time indicator */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
                </div>

                {/* Main Content - Welcome & Compact Search */}
                <div className="relative flex items-center justify-between">
                    {/* Welcome Message */}
                    <div className="shrink-0 flex flex-col">
                        <h1 className="text-xl sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                            Selamat Datang, {firstName}!
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm">
                            {userRole} • Posyandu ILP Desa Tondomulyo
                        </p>
                    </div>

                    {/* Actions: Theme Toggle & Search */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle - Placeholder behavior */}
                        <button 
                            onClick={() => toast('Fitur Mode Gelap akan segera hadir! 🌙', { icon: '✨' })}
                            className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all group"
                            title="Mode Gelap (Segera Hadir)"
                        >
                            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300 group-hover:-rotate-12 transition-transform" />
                        </button>

                        {/* Search Trigger Icon Button */}
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all group"
                            title="Cari Peserta (Ctrl+K)"
                        >
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Date, Time & Weather Info */}
                <div className="relative mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 text-slate-400">
                        {/* Date Container */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                            <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-400 shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                                {formatDate()}
                            </span>
                        </div>
                        
                        {/* Time Container */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                            <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-400 shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-slate-200">
                                {formatTime()}
                            </span>
                        </div>

                        {/* Weather Container - Always visible with loading state */}
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
            </div>

            {/* 5 Sasaran Cards - Colorful gradient cards */}
            {/* Mobile: 3 on first row, 2 centered on second row using grid-cols-6 */}
            <div className="grid grid-cols-6 lg:grid-cols-5 gap-3">
                {sasaran.map((item, index) => {
                    const IconComponent = item.icon;
                    // First 3 items: span 2 cols (3 per row on mobile)
                    // Last 2 items: span 3 cols (2 centered on second row)
                    const colSpanClass = index < 3 
                        ? 'col-span-2 lg:col-span-1' 
                        : 'col-span-3 lg:col-span-1';

                    return (
                        <div
                            key={item.id}
                            className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${item.gradient} p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer ${colSpanClass}`}
                        >
                            {/* Background glow */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

                            {/* Content */}
                            <div className="relative">
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-xl ${item.iconBg} border border-white/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <IconComponent className={`w-5 h-5 ${item.iconColor}`} strokeWidth={2.5} />
                                </div>

                                {/* Value */}
                                {isStatsLoading ? (
                                    <BeatLoader color="#ffffff" size={8} margin={2} />
                                ) : (
                                    <>
                                        <p className="text-3xl font-bold text-white mb-1">
                                            {item.value}
                                        </p>
                                        <p className="text-sm font-medium text-white/80">
                                            {item.label}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Decorative circle */}
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                        </div>
                    );
                })}
            </div>

            {/* Search Modal (Command Palette) */}
            <SearchModal 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
            />
        </div>
    );
}

