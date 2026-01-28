import { Shield, Save } from 'lucide-react';
import type { PasswordData } from '@/presentation/hooks/useAccountSettings';
import { PasswordForm } from './password_form';
import { MIN_PASSWORD_LENGTH } from './config';

interface ChangePasswordProps {
   passwordData: PasswordData;
   isPasswordSaving: boolean;
   handlePasswordChange: (field: keyof PasswordData, value: string) => void;
   handlePasswordSave: () => void;
}

interface PasswordFooterProps {
   isPasswordSaving: boolean;
   isPasswordValid: boolean;
   handlePasswordSave: () => void;
}

function PasswordHeader() {
   return (
      <div className="px-6 py-4 border-b border-gray-100">
         <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
               <Shield className="w-4 h-4 text-amber-600" />
            </div>
            Ganti Password
         </h2>
      </div>
   );
}

function PasswordFooter({
   isPasswordSaving,
   isPasswordValid,
   handlePasswordSave
}: PasswordFooterProps) {
   return (
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
         <button
            onClick={handlePasswordSave}
            disabled={isPasswordSaving || !isPasswordValid}
            className="px-6 py-2.5 bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all"
         >
            <CircleSaveIcon isSaving={isPasswordSaving} />
            {isPasswordSaving ? 'Menyimpan...' : 'Ganti Password'}
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

export function ChangePassword({
   passwordData,
   isPasswordSaving,
   handlePasswordChange,
   handlePasswordSave
}: ChangePasswordProps) {
   const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;
   const isPasswordValid = Boolean(
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.confirmPassword &&
      passwordsMatch &&
      passwordData.newPassword.length >= MIN_PASSWORD_LENGTH
   );

   return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
         <PasswordHeader />
         <div className="p-6">
            <PasswordForm
               passwordData={passwordData}
               handlePasswordChange={handlePasswordChange}
               passwordsMatch={passwordsMatch}
            />
         </div>
         <PasswordFooter
            isPasswordSaving={isPasswordSaving}
            isPasswordValid={isPasswordValid}
            handlePasswordSave={handlePasswordSave}
         />
      </div>
   );
}
