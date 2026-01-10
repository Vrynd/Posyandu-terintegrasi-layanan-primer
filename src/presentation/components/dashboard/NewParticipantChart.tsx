import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserPlus, TrendingUp } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { BeatLoader } from 'react-spinners';

// (Removed mock data constant)

/**
 * NewParticipantChart - Bar chart showing monthly registration of new participants
 * NOTE: Currently uses mock data until backend endpoint is available.
 */
export function NewParticipantChart() {
    const { registrationsChartData, isLoading } = useDashboard();
    const data = registrationsChartData;

    const totalRegistrations = useMemo(() => {
        return data.reduce((sum, item) => sum + item.total, 0);
    }, [data]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Peserta Baru</h3>
                </div>
                <div className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-full">
                    Tahun 2026
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                {/* Info summary */}
                <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>Tren pendaftaran peserta baru setiap bulan</span>
                </div>

                <div className="flex-1 min-h-[180px] relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                            <BeatLoader color="#10b981" size={8} margin={2} />
                            <p className="text-[10px] text-gray-400">Memuat data pendaftaran...</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                cursor={{ fill: '#f8fafc', radius: 8 }}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #f1f5f9',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    padding: '12px'
                                }}
                                itemStyle={{ fontSize: '11px', padding: '1px 0' }}
                                labelStyle={{ fontWeight: 700, marginBottom: 8, color: '#1e293b' }}
                                formatter={(value: any) => [`${value ?? 0} peserta`, 'Terdaftar']}
                            />
                            <Bar
                                dataKey="total"
                                radius={[6, 6, 0, 0]}
                                barSize={24}
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.total > 0 ? '#10b981' : '#e2e8f0'} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Total Registrasi</p>
                    <p className="text-xl font-black text-gray-900">{totalRegistrations}</p>
                </div>
                <div className="text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                        {isLoading ? '...' : 'Data Real-time'}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">Berdasarkan tanggal registrasi</p>
                </div>
            </div>
        </div>
    );
}
