import { BeatLoader } from 'react-spinners';
import { TARGET_SERVICES, type TargetService } from './config';

// Definisi properti komponen layanan dan kartu sasaran
interface ServiceProps {
   stats: Record<string, number> | undefined;
   isLoading: boolean;
}

interface ServiceCardProps {
   item: TargetService;
   value: number;
   isLoading: boolean;
   index: number;
}

function ServiceCard({
   item,
   value,
   isLoading,
   index,
}: ServiceCardProps) {
   const IconComponent = item.icon;
   const colSpanClass = index < 3 ? 'col-span-2 lg:col-span-1' : 'col-span-3 lg:col-span-1';

   return (
      <div
         className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${item.gradient} p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer ${colSpanClass}`}
      >
         <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
         <div className="relative">
            <div
               className={`w-10 h-10 rounded-xl ${item.iconBg} border border-white/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
               <IconComponent className={`w-5 h-5 ${item.iconColor}`} strokeWidth={2.5} />
            </div>
            {isLoading ? (
               <BeatLoader color="#ffffff" size={8} margin={2} />
            ) : (
               <>
                  <p className="text-3xl font-bold text-white mb-1">{value}</p>
                  <p className="text-sm font-medium text-white/80">{item.label}</p>
               </>
            )}
         </div>
         <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
      </div>
   );
}

export function Service({ stats, isLoading }: ServiceProps) {

   // Render grid layanan sasaran dashboard
   return (
      <div className="grid grid-cols-6 lg:grid-cols-5 gap-3">
         {TARGET_SERVICES.map((item, index) => (
            <ServiceCard
               key={item.id}
               item={item}
               value={stats?.[item.id] || 0}
               isLoading={isLoading}
               index={index}
            />
         ))}
      </div>
   );
}
