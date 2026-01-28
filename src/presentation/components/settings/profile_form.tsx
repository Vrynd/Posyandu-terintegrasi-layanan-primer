import { User, CreditCard, Briefcase, Mail, Phone } from 'lucide-react';
import type { ProfileData } from '@/presentation/hooks/useAccountSettings';
import { ROLE_OPTIONS } from './config';

interface ProfileFormProps {
   profileData: ProfileData;
   isEditMode: boolean;
   handleProfileChange: (field: keyof ProfileData, value: string) => void;
}

export function ProfileForm({
   profileData,
   isEditMode,
   handleProfileChange
}: ProfileFormProps) {
   return (
      <div className="lg:w-3/4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <User className="w-4 h-4 inline mr-1 text-gray-400" /> Nama Lengkap
               </label>
               <input
                  type="text"
                  value={profileData.nama}
                  onChange={(e) => handleProfileChange('nama', e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  readOnly={!isEditMode}
                  className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isEditMode
                     ? 'border-blue-400 ring-2 ring-blue-100 bg-white'
                     : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                     }`}
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <CreditCard className="w-4 h-4 inline mr-1 text-gray-400" /> NIK
               </label>
               <input
                  type="text"
                  value={profileData.nik}
                  onChange={(e) => handleProfileChange('nik', e.target.value)}
                  placeholder="Masukkan NIK 16 digit"
                  maxLength={16}
                  readOnly={!isEditMode}
                  className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isEditMode
                     ? 'border-blue-400 ring-2 ring-blue-100 bg-white'
                     : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                     }`}
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Briefcase className="w-4 h-4 inline mr-1 text-gray-400" /> Role / Jabatan
               </label>
               <select
                  value={profileData.role}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed outline-none transition-all"
               >
                  {ROLE_OPTIONS.map((option) => (
                     <option key={option.value} value={option.value}>
                        {option.label}
                     </option>
                  ))}
               </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Mail className="w-4 h-4 inline mr-1 text-gray-400" /> Email
               </label>
               <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  placeholder="Masukkan email"
                  readOnly={!isEditMode}
                  className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isEditMode
                     ? 'border-blue-400 ring-2 ring-blue-100 bg-white'
                     : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                     }`}
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Phone className="w-4 h-4 inline mr-1 text-gray-400" /> No. Telepon
               </label>
               <input
                  type="tel"
                  value={profileData.noHp}
                  onChange={(e) => handleProfileChange('noHp', e.target.value)}
                  placeholder="Masukkan nomor telepon"
                  readOnly={!isEditMode}
                  className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isEditMode
                     ? 'border-blue-400 ring-2 ring-blue-100 bg-white'
                     : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                     }`}
               />
            </div>
         </div>
      </div>
   );
}
