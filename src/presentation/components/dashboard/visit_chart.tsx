import { useMemo, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { BeatLoader } from 'react-spinners';
import { TARGET_SERVICES, MONTH_NAMES, DASHBOARD_YEAR } from './config';

// Definisi properti komponen pendukung grafik
interface CategoryLegendProps {
    activeCategories: Set<string>;
    onToggle: (id: string) => void;
}

interface ChartTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    chartData: any[];
}

interface ChartFooterProps {
    totalVisits: number;
    growth: { value: number; hasData: boolean };
}

function ChartHeader() {
    return (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Pemeriksaan Per Bulan</h3>
            </div>
            <div className="text-xs text-gray-400 font-medium bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                Tahun {DASHBOARD_YEAR}
            </div>
        </div>
    );
}


function CategoryLegend({ activeCategories, onToggle }: CategoryLegendProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {TARGET_SERVICES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onToggle(cat.id)}
                    className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium
            transition-all duration-200 border
            ${activeCategories.has(cat.id) ? 'bg-white shadow-sm' : 'bg-gray-50 opacity-50'}
          `}
                    style={{ borderColor: activeCategories.has(cat.id) ? cat.chartColor : '#e2e8f0' }}
                >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.chartColor }} />
                    <span className="text-gray-700">{cat.label}</span>
                </button>
            ))}
        </div>
    );
}

function ChartTooltip({ active, payload, label, chartData }: ChartTooltipProps) {
    if (!active || !payload?.length) return null;

    const currentMonthIndex = MONTH_NAMES.indexOf(label as string);
    const prevMonthData = currentMonthIndex > 0 ? chartData[currentMonthIndex - 1] : null;
    const hasAnyData = payload.some((p: any) => (p.value ?? 0) > 0);

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 min-w-[180px]">
            <p className="font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">
                {label} {DASHBOARD_YEAR}
            </p>
            {!hasAnyData ? (
                <p className="text-xs text-gray-400 italic">Belum ada data</p>
            ) : (
                <div className="space-y-1.5">
                    {payload.map((entry: any) => {
                        const cat = TARGET_SERVICES.find(c => c.id === entry.dataKey);
                        const currentValue = entry.value ?? 0;
                        const prevValue = prevMonthData ? (prevMonthData[entry.dataKey] ?? 0) : 0;
                        const diff = currentValue - prevValue;

                        return (
                            <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.chartColor }} />
                                    <span className="text-xs text-gray-600">{cat?.label}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-gray-900">{currentValue}</span>
                                    {currentMonthIndex > 0 && currentValue > 0 && (
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
}

function ChartFooter({ totalVisits, growth }: ChartFooterProps) {
    return (
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5 whitespace-nowrap">Total Pemeriksaan {DASHBOARD_YEAR}</p>
                <p className="text-xl font-black text-gray-900">{totalVisits.toLocaleString()}</p>
            </div>
            <div className="flex flex-col items-end">
                {growth.hasData ? (
                    <>
                        <div className={`flex items-center gap-1 text-sm font-bold ${growth.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            <TrendingUp className={`w-4 h-4 ${growth.value < 0 ? 'rotate-180' : ''}`} />
                            <span>{growth.value > 0 ? '+' : ''}{growth.value}%</span>
                        </div>
                        <p className="text-[0.72rem] text-gray-400 mt-1 whitespace-nowrap">Pertumbuhan Tahunan</p>
                    </>
                ) : (
                    <>
                        <p className="text-sm font-medium text-gray-400">—</p>
                        <p className="text-[0.72rem] text-gray-400 mt-1 whitespace-nowrap">Belum cukup data</p>
                    </>
                )}
            </div>
        </div>
    );
}

export function VisitChart() {
    // Inisialisasi state dan data utama grafik
    const { chartData, isLoading } = useDashboard();
    const [activeCategories, setActiveCategories] = useState<Set<string>>(
        new Set(TARGET_SERVICES.map(c => c.id))
    );

    // Pengolahan data grafik bulanan tahun berjalan
    const formattedChartData = useMemo(() => {
        const data = MONTH_NAMES.map((month, index) => ({
            label: month,
            month: index + 1,
            total: 0,
            bumil: 0,
            balita: 0,
            remaja: 0,
            produktif: 0,
            lansia: 0,
        }));

        chartData.forEach(item => {
            const parts = item.label.split(' ');
            const year = parts[1] ? parseInt(parts[1]) : new Date().getFullYear();

            if (year === DASHBOARD_YEAR) {
                const monthIndex = MONTH_NAMES.findIndex(m => m === parts[0] || item.label.includes(m));
                if (monthIndex !== -1) {
                    data[monthIndex].total = item.total;
                    data[monthIndex].bumil = item.bumil ?? 0;
                    data[monthIndex].balita = item.balita ?? 0;
                    data[monthIndex].remaja = item.remaja ?? 0;
                    data[monthIndex].produktif = item.produktif ?? 0;
                    data[monthIndex].lansia = item.lansia ?? 0;
                }
            }
        });

        return data;
    }, [chartData]);

    // Menghitung total seluruh pemeriksaan di tahun berjalan
    const totalVisits = useMemo(() => formattedChartData.reduce((sum, item) => sum + item.total, 0), [formattedChartData]);

    // Menghitung persentase pertumbuhan Year-To-Date (YTD)
    const growth = useMemo(() => {
        const monthsWithData = formattedChartData.filter(m => m.total > 0);
        if (monthsWithData.length < 2) return { value: 0, hasData: monthsWithData.length > 0 };
        const first = monthsWithData[0].total;
        const last = monthsWithData[monthsWithData.length - 1].total;
        return { value: first === 0 ? 0 : Math.round(((last - first) / first) * 100), hasData: true };
    }, [formattedChartData]);

    const toggleCategory = (id: string) => {
        setActiveCategories(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Render grafik pemeriksaan bulanan
    return (
        <div className="bg-white rounded-2xl border border-gray-100 h-full flex flex-col overflow-hidden">
            <ChartHeader />
            <div className="p-5 flex-1 flex flex-col">
                <CategoryLegend activeCategories={activeCategories} onToggle={toggleCategory} />
                <div className="flex-1 min-h-[180px] relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                            <div className="text-center">
                                <BeatLoader color="#3B82F6" size={10} margin={3} />
                                <p className="text-xs text-gray-500 mt-2">Memuat data pemeriksaan...</p>
                            </div>
                        </div>
                    ) : totalVisits === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-sm text-gray-400 font-medium text-center px-6">
                                Belum ada data pemeriksaan di tahun {DASHBOARD_YEAR}
                            </p>
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                {TARGET_SERVICES.map(cat => (
                                    <linearGradient key={cat.id} id={`color-${cat.id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={cat.chartColor} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={cat.chartColor} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }} allowDecimals={false} />
                            <Tooltip content={<ChartTooltip chartData={formattedChartData} />} />
                            {TARGET_SERVICES.map((cat, index) => activeCategories.has(cat.id) && (
                                <Area
                                    key={cat.id}
                                    type="monotone"
                                    dataKey={cat.id}
                                    stroke={cat.chartColor}
                                    strokeWidth={2 + (index * 0.3)}
                                    fill={`url(#color-${cat.id})`}
                                    name={cat.id}
                                    dot={{ fill: cat.chartColor, stroke: 'white', strokeWidth: 2, r: 4 + (index * 0.5) }}
                                    connectNulls
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <ChartFooter totalVisits={totalVisits} growth={growth} />
        </div>
    );
}
