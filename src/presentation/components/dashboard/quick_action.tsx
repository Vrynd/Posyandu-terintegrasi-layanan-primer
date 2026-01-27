import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
   ArrowRight,
   Zap,
   Loader2,
} from "lucide-react";
import { ComingSoonModal } from "../common/ComingSoonModal";
import { QUICK_ACTIONS, type QuickAction } from "./config";

// Definisi properti untuk komponen kartu aksi
interface ActionCardProps {
   action: QuickAction;
   isLoading: boolean;
   onClick: (action: QuickAction) => void;
   onPrefetch: (route?: string) => void;
}

// Pemetaan route ke fungsi prefetch untuk optimasi navigasi
const PREFETCH_MAP: Record<string, () => Promise<unknown>> = {
   "/dashboard/participants": () => import("../../pages/participant_page"),
   "/dashboard/examinations": () => import("../../pages/examination_page"),
   "/dashboard/reports": () => import("../../pages/report_page"),
   "/dashboard/complaints": () => import("../../pages/complaint_page"),
};

// State global untuk melacak route yang telah diprefetch dan dikunjungi
const prefetchedRoutes = new Set<string>();
const visitedRoutes = new Set<string>();

function ActionCard({ action, isLoading, onClick, onPrefetch }: ActionCardProps) {
   const Icon = action.icon;

   return (
      <button
         onClick={() => onClick(action)}
         onMouseEnter={() => onPrefetch(action.route)}
         onFocus={() => onPrefetch(action.route)}
         disabled={isLoading}
         className={`group bg-gray-50 hover:bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-left ${action.comingSoon ? "relative" : ""
            } ${isLoading ? "opacity-80 cursor-wait" : ""}`}
      >
         {action.comingSoon && (
            <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
               SOON
            </div>
         )}
         <div
            className={`w-10 h-10 rounded-xl bg-linear-to-br ${action.bgGradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${action.comingSoon ? "opacity-70" : ""
               }`}>
            {isLoading ? (
               <Loader2 className="w-5 h-5 text-white animate-spin" strokeWidth={2} />
            ) : (
               <Icon className="w-5 h-5 text-white" strokeWidth={2} />
            )}
         </div>
         <p className={`font-semibold text-sm mb-1 ${action.comingSoon ? "text-gray-600" : "text-gray-900"}`}>
            {action.label}
         </p>
         <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {action.description}
         </p>
         <div className="mt-2 flex items-center text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
            <span>{action.comingSoon ? "Segera" : "Mulai"}</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
         </div>
      </button>
   );
}

export function QuickActions() {
   //  Inisialisasi state dan navigasi utama komponen
   const navigate = useNavigate();
   const [showModal, setShowModal] = useState(false);
   const [modalFeature, setModalFeature] = useState("");
   const [loadingAction, setLoadingAction] = useState<string | null>(null);

   // Menangani prefetch halaman saat interaksi awal pengguna
   const handlePrefetch = useCallback((route?: string) => {
      if (!route || prefetchedRoutes.has(route)) return;

      const prefetchFn = PREFETCH_MAP[route];
      if (prefetchFn) {
         prefetchedRoutes.add(route);
         prefetchFn().catch(() => prefetchedRoutes.delete(route));
      }
   }, []);

   // Menangani klik pada kartu aksi
   const handleClick = async (action: QuickAction) => {
      if (action.comingSoon) {
         setModalFeature(action.label);
         setShowModal(true);
         return;
      }

      if (!action.route) return;
      if (visitedRoutes.has(action.route)) {
         navigate(action.route);
         return;
      }

      // Menjalankan prefetch dan navigasi untuk kunjungan pertama
      setLoadingAction(action.id);
      const prefetchFn = PREFETCH_MAP[action.route];
      if (prefetchFn && !prefetchedRoutes.has(action.route)) {
         try {
            await prefetchFn();
            prefetchedRoutes.add(action.route);
         } catch {

         }
      }

      visitedRoutes.add(action.route);
      navigate(action.route);
   };

   // Merender tampilan antar muka blok Aksi Cepat
   return (
      <>
         <div className="bg-white rounded-2xl p-5 border border-gray-100">
            {/* Header: Judul dan Ikon */}
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                     <Zap className="w-4 h-4 text-amber-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Aksi Cepat</h3>
               </div>
               <span className="text-xs text-gray-500">Pilih untuk memulai</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {QUICK_ACTIONS.map((action) => (
                  <ActionCard
                     key={action.id}
                     action={action}
                     isLoading={loadingAction === action.id}
                     onClick={handleClick}
                     onPrefetch={handlePrefetch}
                  />
               ))}
            </div>
         </div>
         <ComingSoonModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            featureName={modalFeature}
         />
      </>
   );
}
