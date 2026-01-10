import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users2, Info } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { BeatLoader } from 'react-spinners';

/**
 * ParticipantDistributionChart - Donut chart showing distribution of participants by category
 */
export function ParticipantDistributionChart() {
    const { stats, isLoading } = useDashboard();

    // Prepare data for Recharts
    const data = useMemo(() => {
        if (!stats?.kategori) return [];

        const rawData = [
            { name: 'Ibu Hamil', value: stats.kategori.bumil, color: '#ec4899' },
            { name: 'Bayi & Balita', value: stats.kategori.balita, color: '#3b82f6' },
            { name: 'Anak remaja & sekolah', value: stats.kategori.remaja, color: '#f59e0b' },
            { name: 'Usia Produktif', value: stats.kategori.produktif, color: '#10b981' },
            { name: 'Lansia', value: stats.kategori.lansia, color: '#a855f7' },
        ].filter(item => item.value > 0);

        const total = rawData.reduce((acc, curr) => acc + curr.value, 0);

        return rawData.map(item => ({
            ...item,
            percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
        }));
    }, [stats]);

    const totalParticipants = stats?.total_peserta || 0;
    const hasData = data.length > 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Users2 className="w-4 h-4 text-indigo-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Distribusi Peserta</h3>
                </div>
                <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                        Menunjukkan pembagian jumlah peserta terdaftar berdasarkan kategori layanan kesehatan.
                    </div>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <BeatLoader color="#6366f1" size={10} margin={3} />
                        <p className="text-xs text-gray-500">Memuat data distribusi...</p>
                    </div>
                ) : !hasData ? (
                    <div className="text-center px-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users2 className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium whitespace-pre-wrap">
                            Belum ada data peserta untuk ditampilkan
                        </p>
                    </div>
                ) : (
                    <div className="w-full h-[240px] relative">
                        {/* Center Text for Donut */}
                        <div 
                            className="absolute inset-x-0 top-0 flex flex-col items-center justify-center pointer-events-none"
                            style={{ bottom: '40px' }} 
                        >
                            <span className="text-2xl font-black text-gray-900 leading-none">{totalParticipants}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1.5">Total</span>
                        </div>

                        {/* Custom Label Renderer for Percentages */}
                        {/* We use a separate function to render the badges atop the segments */}
                        {(() => {
                            const renderCustomizedLabel = (props: any) => {
                                const { 
                                    cx, 
                                    cy, 
                                    midAngle, 
                                    outerRadius, 
                                    percent, 
                                    color 
                                } = props;
                                const RADIAN = Math.PI / 180;
                                const sin = Math.sin(-RADIAN * midAngle);
                                const cos = Math.cos(-RADIAN * midAngle);
                                
                                // Point on outer edge of the donut
                                const sx = cx + (outerRadius) * cos;
                                const sy = cy + (outerRadius) * sin;
                                
                                // First break point
                                const mx = cx + (outerRadius + 10) * cos;
                                const my = cy + (outerRadius + 10) * sin;
                                
                                // Final point (horizontal line)
                                const ex = mx + (cos >= 0 ? 8 : -8); // Adjusted horizontal extension
                                const ey = my;
                                
                                const textAnchor = cos >= 0 ? 'start' : 'end';

                                return (
                                    <g>
                                        <path 
                                            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} 
                                            stroke={color} 
                                            fill="none" 
                                            strokeWidth={1.2}
                                            opacity={0.5}
                                        />
                                        <text 
                                            x={ex + (cos >= 0 ? 4 : -4)} 
                                            y={ey} 
                                            textAnchor={textAnchor} 
                                            fill="#475569" 
                                            dominantBaseline="central"
                                            className="text-[10px] font-extrabold"
                                        >
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    </g>
                                );
                            };

                            return (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={0}
                                            dataKey="value"
                                            animationDuration={1000}
                                            stroke="none"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #f1f5f9',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                padding: '10px'
                                            }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                            formatter={(value: any) => [`${value ?? 0} orang`, 'Jumlah']}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            height={36} 
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={(value) => (
                                                <span className="text-[11px] font-semibold text-gray-600 ml-1">{value}</span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            );
                        })()}
                    </div>
                )}
            </div>
            
            {/* Legend/Footer for Quick Stats */}
            {!isLoading && hasData && (
                <div className="px-5 py-3 flex items-center justify-around border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Terbanyak</p>
                        <p className="text-xs font-bold text-gray-800">
                            {data.reduce((prev, current) => (prev.value > current.value) ? prev : current).name}
                        </p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Kategori</p>
                        <p className="text-xs font-bold text-gray-800">{data.length} Aktif</p>
                    </div>
                </div>
            )}
        </div>
    );
}
