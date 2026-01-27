import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserPlus, TrendingUp } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { BeatLoader } from 'react-spinners';
import { DASHBOARD_YEAR } from './config';

// Definisi properti komponen pendukung grafik pendaftaran
interface RegistrationHeaderProps {
   title: string;
}

interface RegistrationFooterProps {
   total: number;
   isLoading: boolean;
}

// Konfigurasi visual untuk Tooltip Recharts
const TOOLTIP_STYLES = {
   contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #f1f5f9',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      padding: '12px'
   },
   itemStyle: { fontSize: '11px', padding: '1px 0' },
   labelStyle: { fontWeight: 700, marginBottom: 8, color: '#1e293b' },
   cursor: { fill: '#f8fafc', radius: 8 }
};

function RegistrationHeader({ title }: RegistrationHeaderProps) {
   return (
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
               <UserPlus className="w-4 h-4 text-emerald-600" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
         </div>
         <div className="text-xs text-gray-400 font-medium bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            Tahun {DASHBOARD_YEAR}
         </div>
      </div>
   );
}

function RegistrationTooltip({ active, payload, label }: any) {
   if (!active || !payload?.length) return null;

   return (
      <div style={TOOLTIP_STYLES.contentStyle} className="shadow-xl">
         <p style={TOOLTIP_STYLES.labelStyle}>{label} {DASHBOARD_YEAR}</p>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span style={TOOLTIP_STYLES.itemStyle}>
               Terdaftar: <span className="font-bold text-gray-900">{payload[0].value} peserta</span>
            </span>
         </div>
      </div>
   );
}

function RegistrationFooter({ total, isLoading }: RegistrationFooterProps) {
   return (
      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
         <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5 whitespace-nowrap">Total Peserta Baru</p>
            <p className="text-xl font-black text-gray-900">{total}</p>
         </div>
         <div className="text-right flex flex-col items-end">
            <span className="inline-flex tracking-wide items-center px-2 py-1 rounded text-[0.69rem] font-normal bg-emerald-100 text-emerald-800">
               {isLoading ? (
                  <BeatLoader color="#059669" size={4} margin={1} />
               ) : (
                  'Data Bersifat Real-time'
               )}
            </span>
            <p className="text-[0.72rem] text-gray-400 mt-1">Berdasarkan tanggal pendaftaran</p>
         </div>
      </div>
   );
}

export function NewParticipantChart() {
   const { registrationsChartData, isLoading } = useDashboard();
   const chartData = registrationsChartData;

   // Menghitung total pendaftaran peserta baru secara efisien
   const totalRegistrations = useMemo(() => {
      return chartData.reduce((sum, item) => sum + item.total, 0);
   }, [chartData]);

   // Merender antar muka grafik batang peserta baru
   return (
      <div className="bg-white rounded-2xl border border-gray-100 h-full flex flex-col overflow-hidden">
         <RegistrationHeader title="Peserta Baru" />

         <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
               <TrendingUp className="w-4 h-4 text-emerald-500" />
               <span>Tren pendaftaran peserta baru setiap bulan</span>
            </div>

            <div className="flex-1 min-h-[180px] relative">
               {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                     <BeatLoader color="#10b981" size={8} margin={2} />
                     <p className="text-xs text-gray-500 tracking-wider capitalize">Memuat data peserta baru...</p>
                  </div>
               ) : (
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                           cursor={TOOLTIP_STYLES.cursor}
                           content={<RegistrationTooltip />}
                        />
                        <Bar
                           dataKey="total"
                           radius={[6, 6, 0, 0]}
                           barSize={24}
                        >
                           {chartData.map((entry, index) => (
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
         <RegistrationFooter total={totalRegistrations} isLoading={isLoading} />
      </div>
   );
}
