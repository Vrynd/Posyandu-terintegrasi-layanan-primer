import { User, Save } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import type { ProfileData } from '@/presentation/hooks/useAccountSettings';
import { ProfilePhoto } from './profile_photo';
import { ProfileForm } from './profile_form';

interface ProfileProps {
   profileData: ProfileData;
   isProfileSaving: boolean;
   isEditMode: boolean;
   handleProfileChange: (field: keyof ProfileData, value: string) => void;
   handleProfileSave: () => void;
   toggleEditMode: () => void;
}

interface ProfileHeaderProps {
   isEditMode: boolean;
   toggleEditMode: () => void;
}

interface ProfileFooterProps {
   isProfileSaving: boolean;
   handleProfileSave: () => void;
   toggleEditMode: () => void;
}

function ProfileHeader({ isEditMode, toggleEditMode }: ProfileHeaderProps) {
   return (
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
         <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
               <User className="w-4 h-4 text-blue-600" />
            </div>
            Profile Kader
         </h2>
         <button
            onClick={toggleEditMode}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-all ${isEditMode ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
               }`}
         >
            {isEditMode ? 'Batal' : 'Edit Profil'}
         </button>
      </div>
   );
}

function ProfileFooter({ isProfileSaving, handleProfileSave, toggleEditMode }: ProfileFooterProps) {
   return (
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
         <button
            onClick={toggleEditMode}
            className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
         >
            Batal
         </button>
         <button
            onClick={handleProfileSave}
            disabled={isProfileSaving}
            className="px-6 py-2.5 bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all"
         >
            <CircleSaveIcon isSaving={isProfileSaving} />
            {isProfileSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
         </button>
      </div>
   );
}

function CircleSaveIcon({ isSaving }: { isSaving: boolean }) {
   return isSaving ? (
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
   ) : (
      <Save className="w-4 h-4" />
   );
}


export function Profile({
   profileData,
   isProfileSaving,
   isEditMode,
   handleProfileChange,
   handleProfileSave,
   toggleEditMode
}: ProfileProps) {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [previewUrl, setPreviewUrl] = useState<string>(profileData.foto || '');

   // Singkronisasi pratinjau saat foto di profileData berubah
   useEffect(() => {
      setPreviewUrl(profileData.foto || '');
   }, [profileData.foto]);

   // Handler untuk interaksi foto
   const handlePhotoClick = () => fileInputRef.current?.click();

   const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         const url = URL.createObjectURL(file);
         setPreviewUrl(url);
         handleProfileChange('foto', url);
      }
   };

   const handleRemovePhoto = () => {
      setPreviewUrl('');
      handleProfileChange('foto', '');
      if (fileInputRef.current) fileInputRef.current.value = '';
   };

   return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
         <ProfileHeader isEditMode={isEditMode} toggleEditMode={toggleEditMode} />

         <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
               <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />

               <ProfilePhoto
                  profileData={profileData}
                  previewUrl={previewUrl}
                  handlePhotoClick={handlePhotoClick}
                  handleRemovePhoto={handleRemovePhoto}
               />

               <ProfileForm
                  profileData={profileData}
                  isEditMode={isEditMode}
                  handleProfileChange={handleProfileChange}
               />
            </div>
         </div>

         {isEditMode && (
            <ProfileFooter
               isProfileSaving={isProfileSaving}
               handleProfileSave={handleProfileSave}
               toggleEditMode={toggleEditMode}
            />
         )}
      </div>
   );
}
