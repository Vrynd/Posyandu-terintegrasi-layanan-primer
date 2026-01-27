import { MoveRight } from 'lucide-react';
import { SYSTEM_FLOW_STEPS, type FlowStep } from './config';

// Definisi properti komponen kartu langkah alur
interface StepCardProps {
   step: FlowStep;
   index: number;
   totalSteps: number;
}

function StepCard({ step, index, totalSteps }: StepCardProps) {
   const Icon = step.icon;
   return (
      <div className="relative z-10 group">
         <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-2xl ${step.bg} flex items-center justify-center mb-4 border-4 border-white shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
               <Icon className={`w-8 h-8 ${step.color}`} />
            </div>
            <div className="absolute top-0 right-1/2 translate-x-12 translate-y-2 w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
               {index + 1}
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h4>
            <p className="text-[0.73rem] text-gray-500 leading-relaxed px-4">
               {step.desc}
            </p>
            {index < totalSteps - 1 && (
               <div className="md:hidden my-4">
                  <MoveRight className="w-5 h-5 text-gray-300 rotate-90" />
               </div>
            )}
         </div>
      </div>
   );
}


export function SystemFlow() {
   // Render visualisasi alur pelayanan sistem
   return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 overflow-hidden">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-lg font-bold text-gray-900">Alur Pelayanan Digital</h3>
               <p className="text-xs text-gray-500 mt-1">Panduan langkah-langkah penggunaan sistem Posyandu ILP</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
               <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
               <span className="text-[0.65rem] font-semibold text-slate-500 uppercase tracking-wider">Workflow</span>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px border-t border-dashed border-gray-200 z-0" />
            {SYSTEM_FLOW_STEPS.map((step, index) => (
               <StepCard
                  key={index}
                  step={step}
                  index={index}
                  totalSteps={SYSTEM_FLOW_STEPS.length}
               />
            ))}
         </div>
         <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-center">
            <p className="text-[0.70rem] text-slate-400 italic">
               * Pastikan browser tetap terbuka saat proses penginputan data untuk menjamin sinkronisasi lokal.
            </p>
         </div>
      </div>
   );
}
