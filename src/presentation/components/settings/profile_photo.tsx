import { Camera, X } from 'lucide-react';
import type { ProfileData } from '@/presentation/hooks/useAccountSettings';

interface ProfilePhotoProps {
   profileData: ProfileData;
   previewUrl: string;
   handlePhotoClick: () => void;
   handleRemovePhoto: () => void;
}

const getInitial = (name: string) =>
   name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';

export function ProfilePhoto({
   profileData,
   previewUrl,
   handlePhotoClick,
   handleRemovePhoto
}: ProfilePhotoProps) {
   return (
      <div className="flex flex-col items-center gap-4 lg:w-1/4">
         <div className="relative group">
            {previewUrl ? (
               <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-3xl object-cover shadow-md border-4 border-white"
               />
            ) : (
               <div className="w-32 h-32 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-blue-500/30">
                  {getInitial(profileData.nama)}
               </div>
            )}
            <button
               onClick={handlePhotoClick}
               className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors border-2 border-white"
            >
               <Camera className="w-5 h-5" />
            </button>
         </div>
         <div className="text-center">
            <h3 className="font-bold text-gray-900 text-lg">{profileData.nama}</h3>
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{profileData.role}</p>
            <div className="flex flex-col gap-1 mt-4">
               <button
                  onClick={handlePhotoClick}
                  className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium transition-colors"
               >
                  Ganti Foto Profil
               </button>
               {previewUrl && (
                  <button
                     onClick={handleRemovePhoto}
                     className="text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                     <X className="w-3 h-3" /> Hapus Foto
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}
