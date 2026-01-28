import { DELETE_CONFIRMATION_TEXT } from './config';

interface DeleteFormProps {
   deleteConfirmText: string;
   handleDeleteConfirmChange: (value: string) => void;
}

export function DeleteForm({
   deleteConfirmText,
   handleDeleteConfirmChange
}: DeleteFormProps) {
   return (
      <div className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
               Ketik <span className="font-bold text-red-600">{DELETE_CONFIRMATION_TEXT}</span> untuk konfirmasi
            </label>
            <input
               type="text"
               value={deleteConfirmText}
               onChange={(e) => handleDeleteConfirmChange(e.target.value)}
               placeholder="Ketik di sini..."
               className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all"
            />
         </div>
      </div>
   );
}
