import { Heart, Baby, GraduationCap, Briefcase, PersonStanding, Zap, Users, Calendar, CloudSun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { SyncStatus } from '../common/SyncStatus';

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

    const { stats, isLoading: isStatsLoading } = useDashboard();

    // Get first name for greeting
    const fullName = user?.name || '';
    const firstName = fullName.split(' ')[0] || user?.email?.split('@')[0] || 'Pengguna';

    const userRole = user?.role === 'admin' ? 'Admin' : 'Kader';

    // Weather state
    const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null);

    // Format current date
    const formatDate = () => {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    };

    // Fetch weather for Pati, Jawa Tengah
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Using Open-Meteo API (free, no API key needed)
                // Pati coordinates: -6.75, 111.04
                const res = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=-6.75&longitude=111.04&current=temperature_2m,weather_code&timezone=Asia/Jakarta'
                );
                const data = await res.json();
                
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

                setWeather({
                    temp: Math.round(data.current.temperature_2m),
                    desc: weatherCodes[data.current.weather_code] || 'Tidak Diketahui'
                });
            } catch (error) {
                console.warn('[Weather] Failed to fetch:', error);
            }
        };

        fetchWeather();
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
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left - Welcome */}
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            Selamat Datang, {firstName}!
                        </h1>
                        <p className="text-slate-400 text-sm">
                            {userRole} • Posyandu ILP Desa Tondomulyo
                        </p>
                    </div>

                    {/* Right - Stats Summary + Sync */}
                    <div className="flex items-center gap-3">
                        {/* Total Peserta */}
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                {isStatsLoading ? (
                                    <BeatLoader color="#ffffff" size={6} margin={2} />
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold text-white">
                                            {stats?.total_peserta || 0}
                                        </p>
                                        <p className="text-xs text-slate-400">Total Peserta</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Kunjungan Bulan Ini */}
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                {isStatsLoading ? (
                                    <BeatLoader color="#ffffff" size={6} margin={2} />
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold text-white">
                                            {stats?.kunjungan_hari_ini || 0}
                                        </p>
                                        <p className="text-xs text-slate-400">Hari ini</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date & Weather Info + Sync Button */}
                <div className="relative mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Date */}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-400">
                                    {formatDate()}
                                </span>
                            </div>
                            
                            {/* Weather */}
                            {weather && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg">
                                    <CloudSun className="w-4 h-4 text-amber-400" />
                                    <span className="text-sm text-slate-300">
                                        {weather.temp}°C • {weather.desc}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Sync Button - Glass style */}
                        <SyncStatus variant="glass" />
                    </div>
                </div>
            </div>

            {/* 5 Sasaran Cards - Colorful gradient cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {sasaran.map((item) => {
                    const IconComponent = item.icon;

                    return (
                        <div
                            key={item.id}
                            className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${item.gradient} p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
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
        </div>
    );
}

