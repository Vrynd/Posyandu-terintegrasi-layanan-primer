import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { TARGET_SERVICES } from './config';

// Konstanta visual untuk sinkronisasi tampilan kerangka komponen (skeleton)
const SKELETON_COLORS = {
   base: "#334155",
   highlight: "#475569",
   overlayBase: "#1e293b",
   cardBase: "rgba(255,255,255,0.2)",
   cardHighlight: "rgba(255,255,255,0.3)"
};

// Menampilkan kerangka pemuatan (skeleton) untuk seluruh halaman dashboard utama
export function DashboardSkeleton() {
   // Render kerangka dashboard yang menyerupai struktur visual komponen asli
   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
         {/* Kerangka Hero Overview (Salam & Informasi Cuaca) */}
         <section>
            <div className="space-y-5">
               <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
                  {/* Dekorasi latar belakang grafis */}
                  <div className="absolute inset-0 overflow-hidden">
                     <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
                     <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
                  </div>

                  {/* Kerangka pesan sambutan dan aksi cepat */}
                  <div className="relative flex items-center justify-between">
                     <div className="shrink-0 flex flex-col">
                        <Skeleton width={280} height={28} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                        <Skeleton width={220} height={16} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} className="mt-2" />
                     </div>
                     <div className="flex items-center gap-2">
                        <Skeleton width={36} height={36} borderRadius={12} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                        <Skeleton width={36} height={36} borderRadius={12} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                     </div>
                  </div>

                  {/* Kerangka baris informasi tanggal, waktu, dan cuaca */}
                  <div className="relative mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                     <Skeleton width={180} height={34} borderRadius={12} baseColor={SKELETON_COLORS.overlayBase} highlightColor={SKELETON_COLORS.base} />
                     <Skeleton width={80} height={34} borderRadius={12} baseColor={SKELETON_COLORS.overlayBase} highlightColor={SKELETON_COLORS.base} />
                     <Skeleton width={130} height={34} borderRadius={12} baseColor={SKELETON_COLORS.overlayBase} highlightColor={SKELETON_COLORS.base} />
                  </div>
               </div>

               {/* Kerangka grid 5 kartu sasaran layanan */}
               <div className="grid grid-cols-6 lg:grid-cols-5 gap-3">
                  {TARGET_SERVICES.map((service, i) => (
                     <div
                        key={service.id}
                        className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${service.gradient} p-4 ${i < 3 ? 'col-span-2 lg:col-span-1' : 'col-span-3 lg:col-span-1'}`}
                     >
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                        <div className="relative">
                           <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 mb-3" />
                           <Skeleton width={50} height={32} baseColor={SKELETON_COLORS.cardBase} highlightColor={SKELETON_COLORS.cardHighlight} />
                           <Skeleton width={80} height={16} baseColor="rgba(255,255,255,0.15)" highlightColor="rgba(255,255,255,0.25)" className="mt-1" />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Kerangka Aksi Cepat dan Grafik Kunjungan */}
         <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Kerangka Kartu Aksi Cepat */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <Skeleton width={32} height={32} borderRadius={8} />
                     <Skeleton width={90} height={22} />
                  </div>
                  <Skeleton width={100} height={16} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                     <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <Skeleton width={40} height={40} borderRadius={12} className="mb-3" />
                        <Skeleton width={80} height={16} className="mb-1" />
                        <Skeleton width={100} height={12} />
                        <Skeleton width={50} height={12} className="mt-2" />
                     </div>
                  ))}
               </div>
            </div>

            {/* Kerangka Grafik Kunjungan Bulanan */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
               <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Skeleton width={32} height={32} borderRadius={8} />
                     <Skeleton width={180} height={22} />
                  </div>
                  <Skeleton width={80} height={24} borderRadius={12} />
               </div>
               <div className="p-5 flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                     {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} width={95} height={28} borderRadius={14} />
                     ))}
                  </div>
                  <Skeleton height={180} borderRadius={12} />
               </div>
               <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                     <Skeleton width={140} height={12} className="mb-1" />
                     <Skeleton width={60} height={28} />
                  </div>
                  <div className="text-right">
                     <Skeleton width={50} height={20} />
                     <Skeleton width={100} height={12} className="mt-1" />
                  </div>
               </div>
            </div>
         </section>

         {/* Kerangka Grafik Peserta Baru dan Distribusi */}
         <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Kerangka Grafik Peserta Baru */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
               <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Skeleton width={32} height={32} borderRadius={8} />
                     <Skeleton width={120} height={22} />
                  </div>
                  <Skeleton width={80} height={24} borderRadius={12} />
               </div>
               <div className="p-5 flex-1">
                  <div className="flex items-center gap-2 mb-6">
                     <Skeleton width={16} height={16} />
                     <Skeleton width={220} height={14} />
                  </div>
                  <Skeleton height={180} borderRadius={12} />
               </div>
               <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                     <Skeleton width={100} height={12} className="mb-1" />
                     <Skeleton width={40} height={28} />
                  </div>
                  <div className="text-right">
                     <Skeleton width={80} height={20} borderRadius={4} />
                     <Skeleton width={140} height={12} className="mt-1" />
                  </div>
               </div>
            </div>

            {/* Kerangka Grafik Distribusi Peserta */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
               <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Skeleton width={32} height={32} borderRadius={8} />
                     <Skeleton width={130} height={22} />
                  </div>
                  <Skeleton width={16} height={16} circle />
               </div>
               <div className="p-5 flex-1 flex flex-col items-center justify-center">
                  <div className="relative">
                     <Skeleton width={180} height={180} circle />
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Skeleton width={40} height={28} />
                        <Skeleton width={30} height={12} className="mt-1" />
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                     {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} width={75} height={18} borderRadius={10} />
                     ))}
                  </div>
               </div>
               <div className="px-5 py-3 flex items-center justify-around border-t border-gray-100">
                  <div className="text-center">
                     <Skeleton width={60} height={12} className="mb-1" />
                     <Skeleton width={50} height={14} />
                  </div>
                  <div className="w-px h-6 bg-gray-200" />
                  <div className="text-center">
                     <Skeleton width={50} height={12} className="mb-1" />
                     <Skeleton width={45} height={14} />
                  </div>
               </div>
            </div>
         </section>

         {/* Kerangka Alur Pelayanan Sistem */}
         <section>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <div>
                     <Skeleton width={180} height={22} />
                     <Skeleton width={300} height={14} className="mt-1" />
                  </div>
                  <Skeleton width={80} height={24} borderRadius={12} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                     <div key={i} className="flex flex-col items-center text-center">
                        <Skeleton width={80} height={80} borderRadius={16} className="mb-4" />
                        <Skeleton width={90} height={16} className="mb-1" />
                        <Skeleton width={140} height={12} />
                     </div>
                  ))}
               </div>
               <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-center">
                  <Skeleton width={400} height={12} />
               </div>
            </div>
         </section>
      </div>
   );
}
