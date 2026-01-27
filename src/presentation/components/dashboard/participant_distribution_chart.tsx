import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users2, Info } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { BeatLoader } from 'react-spinners';
import { TARGET_SERVICES } from './config';

// Definisi properti komponen pendukung grafik distribusi
interface DistributionLegendProps {
   data: any[];
}

interface DistributionTooltipProps {
   active?: boolean;
   payload?: any[];
}

interface DistributionFooterProps {
   topCategory: string;
   activeCount: number;
}

function DistributionHeader() {
   return (
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
               <Users2 className="w-4 h-4 text-indigo-600" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Distribusi Peserta</h3>
         </div>
         <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-xl border border-white/10">
               Menunjukkan pembagian jumlah peserta terdaftar berdasarkan kategori layanan kesehatan.
            </div>
         </div>
      </div>
   );
}

// Merender label persentase yang muncul di luar Donut Chart
const DistributionLabel = (props: any) => {
   const { cx, cy, midAngle, outerRadius, percent, color } = props;
   const RADIAN = Math.PI / 180;
   const sin = Math.sin(-RADIAN * midAngle);
   const cos = Math.cos(-RADIAN * midAngle);

   const sx = cx + outerRadius * cos;
   const sy = cy + outerRadius * sin;
   const mx = cx + (outerRadius + 10) * cos;
   const my = cy + (outerRadius + 10) * sin;
   const ex = mx + (cos >= 0 ? 8 : -8);
   const ey = my;

   const textAnchor = cos >= 0 ? 'start' : 'end';
   return (
      <g>
         <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={color} fill="none" strokeWidth={1.2} opacity={0.5} />
         <text x={ex + (cos >= 0 ? 4 : -4)} y={ey} textAnchor={textAnchor} fill="#475569" dominantBaseline="central" className="text-[10px] font-extrabold">
            {`${(percent * 100).toFixed(0)}%`}
         </text>
      </g>
   );
};

function DistributionTooltip({ active, payload }: DistributionTooltipProps) {
   if (!active || !payload?.length) return null;
   const data = payload[0].payload;

   return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 min-w-[140px]">
         <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            <p className="text-xs font-bold text-gray-900">{data.name}</p>
         </div>
         <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
               <span className="text-[10px] text-gray-500 uppercase font-medium">Jumlah</span>
               <span className="text-xs font-bold text-gray-900">{data.value} orang</span>
            </div>
            <div className="flex items-center justify-between gap-4">
               <span className="text-[10px] text-gray-500 uppercase font-medium">Porsi</span>
               <span className="text-xs font-bold text-gray-900">{data.percentage}%</span>
            </div>
         </div>
      </div>
   );
}

function DistributionLegend({ data }: DistributionLegendProps) {
   return (
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 pt-2">
         {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
               <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
               <span className="text-[0.71rem] font-semibold text-gray-600 capitalize tracking-tight">
                  {entry.name}
               </span>
               <span className="text-[0.71rem] font-semibold text-gray-400">
                  {entry.value}
               </span>
            </div>
         ))}
      </div>
   );
}

function DistributionFooter({ topCategory, activeCount }: DistributionFooterProps) {
   return (
      <div className="px-5 py-4 flex items-center justify-around border-t border-gray-100">
         <div className="text-center">
            <p className="text-[0.70rem] text-gray-400 mb-0.5">Peserta Terbanyak</p>
            <p className="text-[0.85rem] font-bold leading-tight tracking-wider text-gray-800">
               {topCategory}
            </p>
         </div>
         <div className="w-px h-6 bg-gray-200" />
         <div className="text-center">
            <p className="text-[0.70rem] text-gray-400 mb-0.5">Jumlah Kategori</p>
            <p className="text-[0.85rem] font-bold leading-tight tracking-wider text-gray-800">{activeCount} Aktif</p>
         </div>
      </div>
   );
}

export function ParticipantDistributionChart() {
   const { stats, isLoading } = useDashboard();

   const chartData = useMemo(() => {
      if (!stats?.kategori) return [];
      const mappedData = TARGET_SERVICES.map(service => ({
         name: service.label,
         value: (stats.kategori as any)[service.id] || 0,
         color: service.chartColor,
         id: service.id
      })).filter(item => item.value > 0);

      const total = mappedData.reduce((acc, curr) => acc + curr.value, 0);

      return mappedData.map(item => ({
         ...item,
         percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
      }));
   }, [stats]);

   // Variabel penunjang untuk elemen UI di dalam grafik
   const totalParticipants = stats?.total_peserta || 0;
   const hasData = chartData.length > 0;
   const topCategory = hasData
      ? chartData.reduce((prev, current) => (prev.value > current.value ? prev : current)).name
      : '—';

   // Render tampilan grafik distribusi peserta secara modular
   return (
      <div className="bg-white rounded-2xl border border-gray-100 h-full flex flex-col overflow-hidden">
         <DistributionHeader />

         <div className="p-5 flex-1 flex flex-col items-center justify-center">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center space-y-3">
                  <BeatLoader color="#6366f1" size={10} margin={3} />
                  <p className="text-xs text-gray-500 tracking-wider">Memuat data distribusi...</p>
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
               <div className="w-full flex-1 flex flex-col gap-4">
                  <div className="flex-1 min-h-[200px] relative">
                     <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-gray-900 leading-none">
                           {totalParticipants}
                        </span>
                        <span className="text-[0.65rem] text-gray-400 uppercase tracking-widest font-semibold mt-1">
                           Total Distribusi
                        </span>
                     </div>
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={85}
                              paddingAngle={0}
                              dataKey="value"
                              animationDuration={1000}
                              stroke="none"
                              labelLine={false}
                              label={DistributionLabel}
                           >
                              {chartData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                           </Pie>
                           <Tooltip content={<DistributionTooltip />} />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <DistributionLegend data={chartData} />
               </div>
            )}
         </div>
         {!isLoading && hasData && (
            <DistributionFooter topCategory={topCategory} activeCount={chartData.length} />
         )}
      </div>
   );
}
