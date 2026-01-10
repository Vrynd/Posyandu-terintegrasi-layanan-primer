import { useMemo, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { BeatLoader } from 'react-spinners';

// Month names in Indonesian
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Category configuration with colors - matching HeroOverview stat cards
const CATEGORIES = [
    { key: 'bumil', label: 'Ibu Hamil', color: '#ec4899' },          // Pink (from-pink-500)
    { key: 'balita', label: 'Bayi & Balita', color: '#3b82f6' },     // Blue (from-blue-500)
    { key: 'remaja', label: 'Anak & Remaja', color: '#f97316' },     // Orange (from-amber-500)
    { key: 'produktif', label: 'Usia Produktif', color: '#10b981' }, // Emerald (from-emerald-500)
    { key: 'lansia', label: 'Lansia', color: '#8b5cf6' },            // Purple (from-purple-500)
] as const;

type CategoryKey = typeof CATEGORIES[number]['key'];

/**
 * VisitChart - Multi-line chart showing pemeriksaan per month for 2026
 * Displays each category with separate colored lines
 */
export function VisitChart() {
    const { chartData, isLoading } = useDashboard();
    const [activeCategories, setActiveCategories] = useState<Set<CategoryKey>>(
        new Set(CATEGORIES.map(c => c.key))
    );

    // Filter and format data for 2026 only
    const formattedChartData = useMemo(() => {
        // Create 12 months for 2026
        const months2026 = MONTH_NAMES.map((month, index) => ({
            label: month,
            month: index + 1,
            total: 0,
            bumil: 0,
            balita: 0,
            remaja: 0,
            produktif: 0,
            lansia: 0,
        }));

        // Fill in actual data from API
        chartData.forEach(item => {
            // Parse label to extract month (e.g., "Jan 2026" -> 1)
            const parts = item.label.split(' ');
            const monthStr = parts[0];
            const year = parts[1] ? parseInt(parts[1]) : new Date().getFullYear();
            
            // Only include 2026 data
            if (year === 2026) {
                const monthIndex = MONTH_NAMES.findIndex(m => m === monthStr || item.label.includes(m));
                if (monthIndex !== -1) {
                    months2026[monthIndex].total = item.total;
                    months2026[monthIndex].bumil = item.bumil ?? 0;
                    months2026[monthIndex].balita = item.balita ?? 0;
                    months2026[monthIndex].remaja = item.remaja ?? 0;
                    months2026[monthIndex].produktif = item.produktif ?? 0;
                    months2026[monthIndex].lansia = item.lansia ?? 0;
                }
            }
        });

        return months2026;
    }, [chartData]);

    const totalVisits = formattedChartData.reduce((sum, item) => sum + item.total, 0);
    
    // Calculate YTD growth (current month vs first month with data)
    const growth = useMemo(() => {
        const monthsWithData = formattedChartData.filter(m => m.total > 0);
        if (monthsWithData.length < 2) return { value: 0, hasData: monthsWithData.length > 0 };
        const first = monthsWithData[0].total;
        const last = monthsWithData[monthsWithData.length - 1].total;
        if (first === 0) return { value: 0, hasData: true };
        return { value: Math.round(((last - first) / first) * 100), hasData: true };
    }, [formattedChartData]);

    const hasData = totalVisits > 0;

    // Toggle category visibility
    const toggleCategory = (key: CategoryKey) => {
        setActiveCategories(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };


    return (
        <div className="bg-white rounded-2xl border border-gray-100 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Pemeriksaan Per Bulan</h3>
                </div>

                {/* Right side - Year indicator */}
                <div className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-full">
                    Tahun 2026
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                {/* Category Legend - Interactive toggles */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => toggleCategory(cat.key)}
                            className={`
                                flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium
                                transition-all duration-200 border
                                ${activeCategories.has(cat.key)
                                    ? 'bg-white shadow-sm'
                                    : 'bg-gray-50 opacity-50'
                                }
                            `}
                            style={{
                                borderColor: activeCategories.has(cat.key) ? cat.color : '#e2e8f0',
                            }}
                        >
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-gray-700">{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Chart Container */}
                <div className="flex-1 min-h-[180px] relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 transition-all">
                            <div className="text-center">
                                <BeatLoader color="#3B82F6" size={10} margin={3} />
                                <p className="text-xs text-gray-500 mt-2">Memuat data pemeriksaan...</p>
                            </div>
                        </div>
                    ) : !hasData && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-sm text-gray-400 font-medium whitespace-pre-wrap text-center px-6">
                                Belum ada data pemeriksaan di tahun 2026
                            </p>
                        </div>
                    )}

                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                {CATEGORIES.map(cat => (
                                    <linearGradient key={cat.key} id={`color-${cat.key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={cat.color} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={cat.color} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                                allowDecimals={false}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null;
                                    
                                    // Find current month index
                                    const currentMonthIndex = MONTH_NAMES.indexOf(label as string);
                                    const prevMonthData = currentMonthIndex > 0 ? formattedChartData[currentMonthIndex - 1] : null;
                                    
                                    // Check if all values are 0
                                    const hasAnyData = payload.some((p: any) => (p.value ?? 0) > 0);
                                    
                                    return (
                                        <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 min-w-[180px]">
                                            <p className="font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">
                                                {label} 2026
                                            </p>
                                            {!hasAnyData ? (
                                                <p className="text-xs text-gray-400 italic">Belum ada data</p>
                                            ) : (
                                                <div className="space-y-1.5">
                                                    {payload.map((entry: any) => {
                                                        const cat = CATEGORIES.find(c => c.key === entry.dataKey);
                                                        const currentValue = entry.value ?? 0;
                                                        const prevValue = prevMonthData ? (prevMonthData[entry.dataKey as CategoryKey] ?? 0) : 0;
                                                        const diff = currentValue - prevValue;
                                                        const hasPrevData = currentMonthIndex > 0;
                                                        
                                                        return (
                                                            <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span 
                                                                        className="w-2 h-2 rounded-full" 
                                                                        style={{ backgroundColor: cat?.color }}
                                                                    />
                                                                    <span className="text-xs text-gray-600">{cat?.label}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs font-semibold text-gray-900">{currentValue}</span>
                                                                    {hasPrevData && currentValue > 0 && (
                                                                        <span className={`text-[10px] font-medium ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                                            {diff > 0 ? `↑${diff}` : diff < 0 ? `↓${Math.abs(diff)}` : '—'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }}
                            />
                            {CATEGORIES.map((cat, index) => (
                                activeCategories.has(cat.key) && (
                                    <Area
                                        key={cat.key}
                                        type="monotone"
                                        dataKey={cat.key}
                                        stroke={cat.color}
                                        strokeWidth={2 + (index * 0.3)}
                                        fill={`url(#color-${cat.key})`}
                                        name={cat.key}
                                        dot={{ 
                                            fill: cat.color, 
                                            stroke: 'white', 
                                            strokeWidth: 2, 
                                            r: 4 + (index * 0.5) 
                                        }}
                                        activeDot={{ 
                                            r: 7, 
                                            fill: cat.color, 
                                            stroke: 'white', 
                                            strokeWidth: 3 
                                        }}
                                        connectNulls
                                    />
                                )
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                </div>

            {/* Footer Stats */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Total Pemeriksaan 2026</p>
                    <p className="text-xl font-black text-gray-900">{totalVisits.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end">
                    {growth.hasData ? (
                        <>
                            <div className={`flex items-center gap-1 text-sm font-bold ${growth.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                <TrendingUp className={`w-4 h-4 ${growth.value < 0 ? 'rotate-180' : ''}`} />
                                <span>{growth.value > 0 ? '+' : ''}{growth.value}%</span>
                            </div>
                            <p className="text-[10px] text-gray-500 whitespace-nowrap">Pertumbuhan Tahunan</p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-gray-400">—</p>
                            <p className="text-[10px] text-gray-500 whitespace-nowrap">Belum cukup data</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
