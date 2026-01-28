import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SKELETON_COLORS = {
   base: "#f1f5f9",
   highlight: "#f8fafc"
};

export function ReportSkeleton() {
   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

         {/* 1. Header & Breadcrumb */}
         <div className="flex items-center justify-between mb-6">
            <div>
               <Skeleton width={180} height={28} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
               <Skeleton width={340} height={16} className="mt-1" baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
            </div>
            <div className="hidden md:flex items-center gap-2">
               <Skeleton width={90} height={20} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
               <Skeleton width={12} height={12} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
               <Skeleton width={70} height={20} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
            </div>
         </div>

         {/* 2. Langkah 1: Pilih Jenis Laporan */}
         <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
               <div className="flex items-center gap-2">
                  <Skeleton width={24} height={24} borderRadius={6} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                  <Skeleton width={140} height={18} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
               </div>
            </div>

            <div className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                     <div key={i} className="p-5 rounded-xl border-2 border-gray-200 bg-white">
                        <Skeleton width={48} height={48} borderRadius={12} className="mb-4" baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                        <Skeleton width={160} height={18} className="mb-2" baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                        <Skeleton width={200} height={14} className="mb-3" baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                        <div className="flex flex-wrap gap-2">
                           {[...Array(4)].map((_, j) => (
                              <Skeleton key={j} width={90 + (j * 5)} height={24} borderRadius={12} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* 3. Langkah 2: Pilih Periode & Unduh */}
         <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
               <div className="flex items-center gap-2">
                  <Skeleton width={24} height={24} borderRadius={6} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                  <Skeleton width={160} height={18} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
               </div>
            </div>

            <div className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <Skeleton width={50} height={12} className="mb-2" baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                     <Skeleton height={44} borderRadius={12} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                  </div>
                  <div>
                     <Skeleton width={45} height={12} className="mb-2" baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                     <Skeleton height={44} borderRadius={12} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
                  </div>
               </div>

               <div className="flex justify-end mt-6">
                  <Skeleton width={150} height={44} borderRadius={12} baseColor={SKELETON_COLORS.base} highlightColor={SKELETON_COLORS.highlight} />
               </div>
            </div>
         </div>
      </div>
   );
}
