/**
 * AddressStep - Step 3: Address and contact info
 */

import { RotateCcw } from "lucide-react";
import { FormInput } from "../../common/form";
import type { FormData } from "@/presentation/hooks/usePesertaAdd";

interface AddressStepProps {
  form: FormData;
  handleChange: (field: keyof FormData, value: string | boolean | Date | null) => void;
  onReset?: () => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function AddressStep({ form, handleChange, onReset, errors }: AddressStepProps) {
  const isTeleponValid = form.telepon.length >= 10 && form.telepon.length <= 13;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Alamat & Kontak</h2>
          <p className="text-xs text-gray-500">Lengkapi alamat dan kontak peserta</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center w-9 h-9 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          title="Reset Form"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Alamat */}
            <div>
              <label className="block text-[13px] font-normal tracking-wide mb-2">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.alamat}
                onChange={(e) => handleChange("alamat", e.target.value)}
                placeholder="Nama jalan, nomor rumah, desa/kelurahan"
                rows={5}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 outline-none transition-all resize-none ${
                  errors.alamat 
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100" 
                    : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
              />
              {errors.alamat && (
                <p className="mt-1 text-xs text-red-500 font-normal">{errors.alamat}</p>
              )}
            </div>

            {/* Right Column - RT, RW, Telepon */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="RT"
                  value={form.rt}
                  onChange={(val) => handleChange("rt", val)}
                  placeholder="001"
                  required
                  error={errors.rt}
                  maxLength={3}
                />
                <FormInput
                  label="RW"
                  value={form.rw}
                  onChange={(val) => handleChange("rw", val)}
                  placeholder="001"
                  required
                  error={errors.rw}
                  maxLength={3}
                />
              </div>

              <div className="relative">
                <FormInput
                  label="Nomor Telepon"
                  value={form.telepon}
                  onChange={(val) => handleChange("telepon", val)}
                  placeholder="08xxxxxxxxxx"
                  required
                  error={errors.telepon}
                  maxLength={13}
                />
                <span
                  className={`absolute right-4 top-[38px] text-xs font-medium pointer-events-none ${
                    form.telepon.length > 0 && isTeleponValid ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {form.telepon.length}/13
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
