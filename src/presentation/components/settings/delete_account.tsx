import { Trash2, AlertTriangle } from 'lucide-react';
import { DeleteForm } from './delete_form';
import { DELETE_CONFIRMATION_TEXT, DELETE_WARNING_ITEMS } from './config';

interface DeleteAccountProps {
   deleteConfirmText: string;
   isDeleting: boolean;
   handleDeleteConfirmChange: (value: string) => void;
   handleDeleteAccount: () => void;
}

interface DeleteFooterProps {
   isDeleting: boolean;
   isDeleteConfirmed: boolean;
   handleDeleteAccount: () => void;
}

function DeleteHeader() {
   return (
      <div className="px-6 py-4 border-b border-red-200">
         <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
               <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            Hapus Akun
         </h2>
      </div>
   );
}

function DeleteWarning() {
   return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
         <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
               <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
               <h4 className="font-semibold text-red-800 mb-1">Peringatan!</h4>
               <p className="text-sm text-red-700">Menghapus akun akan menghapus semua data termasuk:</p>
               <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                  {DELETE_WARNING_ITEMS.map((item, index) => (
                     <li key={index}>{item}</li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
   );
}

function DeleteFooter({
   isDeleting,
   isDeleteConfirmed,
   handleDeleteAccount
}: DeleteFooterProps) {
   return (
      <div className="px-6 py-4 border-t border-red-200 flex justify-end">
         <button
            onClick={handleDeleteAccount}
            disabled={isDeleting || !isDeleteConfirmed}
            className="px-6 py-2.5 bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-red-100 transition-all"
         >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Menghapus...' : 'Hapus Akun Saya'}
         </button>
      </div>
   );
}

export function DeleteAccount({
   deleteConfirmText,
   isDeleting,
   handleDeleteConfirmChange,
   handleDeleteAccount
}: DeleteAccountProps) {
   const isDeleteConfirmed = deleteConfirmText.toUpperCase() === DELETE_CONFIRMATION_TEXT;

   return (
      <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
         <DeleteHeader />

         <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <DeleteWarning />
               <DeleteForm
                  deleteConfirmText={deleteConfirmText}
                  handleDeleteConfirmChange={handleDeleteConfirmChange}
               />
            </div>
         </div>

         <DeleteFooter
            isDeleting={isDeleting}
            isDeleteConfirmed={isDeleteConfirmed}
            handleDeleteAccount={handleDeleteAccount}
         />
      </div>
   );
}
