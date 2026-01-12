/**
 * PersonalDataStep - Step 2: Personal details and category-specific fields
 */

import { RotateCcw } from "lucide-react";
import { FormInput, FormSelect, FormDatePicker } from "../../common/form";
import type { FormData } from "@/presentation/hooks/usePesertaAdd";

interface PersonalDataStepProps {
  form: FormData;
  handleChange: (field: keyof FormData, value: string | boolean | Date | null) => void;
  categoryRequiredLabel: { field: keyof FormData; label: string; placeholder: string } | null;
  categoryFieldValue: string;
  onReset?: () => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function PersonalDataStep({ 
  form, 
  handleChange, 
  categoryRequiredLabel, 
  categoryFieldValue,
  onReset,
  errors
}: PersonalDataStepProps) {
  const isNikValid = form.nik.length === 16;
  const isBpjsValid = form.nomorBpjs.length === 13;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Data Pribadi</h2>
          <p className="text-xs text-gray-500 mt-0.5">Lengkapi data pribadi dan informasi BPJS</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex cursor-pointer items-center justify-center w-9 h-9 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-4">
            {/* Row 1: Nama & Tanggal Lahir */}
            <div className="md:col-span-3">
              <FormInput
                label="Nama Lengkap"
                value={form.nama}
                onChange={(val) => handleChange("nama", val)}
                placeholder="Masukkan nama lengkap"
                required
                error={errors.nama}
              />
            </div>

            <div className="md:col-span-3">
              <FormDatePicker
                label="Tanggal Lahir"
                value={form.tanggalLahir ? form.tanggalLahir.toISOString().split('T')[0] : ""}
                onChange={(val) => handleChange("tanggalLahir", val ? new Date(val) : null)}
                maxDate={new Date()}
                required
                error={errors.tanggalLahir as any}
              />
            </div>

            {/* Row 2: NIK & Status BPJS */}
            <div className="md:col-span-3">
              <div className="relative">
                <FormInput
                  label="Nomor Induk Kependudukan"
                  value={form.nik}
                  onChange={(val) => handleChange("nik", val)}
                  placeholder="Masukkan 16 digit angka"
                  required
                  error={errors.nik}
                  maxLength={16}
                />
                <span
                  className={`absolute right-4 top-[38px] text-xs font-medium pointer-events-none ${
                    isNikValid ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {form.nik.length}/16
                </span>
              </div>
            </div>

            <div className="md:col-span-3">
              <FormSelect
                label="Status BPJS"
                value={form.kepesertaanBpjs === null ? "" : (form.kepesertaanBpjs ? "ya" : "tidak")}
                onChange={(val) => {
                   if (val === "") {
                     handleChange("kepesertaanBpjs", null);
                     return;
                   }
                   const isYa = val === "ya";
                   handleChange("kepesertaanBpjs", isYa);
                   if (!isYa) handleChange("nomorBpjs", "");
                }}
                options={[
                  { value: "tidak", label: "Tidak Terdaftar" },
                  { value: "ya", label: "Terdaftar BPJS" }
                ]}
                required
                error={errors.kepesertaanBpjs as any}
              />
            </div>

            {/* Row 3: Jenis Kelamin, Category Field, Nomor BPJS */}
            <div className="md:col-span-2">
              <FormSelect
                label="Jenis Kelamin"
                value={form.jenisKelamin}
                onChange={(val) => handleChange("jenisKelamin", val)}
                options={[
                  { value: "Laki-Laki", label: "Laki-Laki" },
                  { value: "Perempuan", label: "Perempuan" }
                ]}
                required
                error={errors.jenisKelamin as any}
              />
            </div>

            {categoryRequiredLabel && (
              <div className="md:col-span-2">
                <FormInput
                  label={categoryRequiredLabel.label}
                  value={categoryFieldValue}
                  onChange={(val) => handleChange(categoryRequiredLabel.field, val)}
                  placeholder={categoryRequiredLabel.placeholder}
                  required
                  error={errors[categoryRequiredLabel.field]}
                />
              </div>
            )}

            <div className="md:col-span-2">
              <div className="relative">
                <FormInput
                  label="Nomor BPJS"
                  value={form.nomorBpjs}
                  onChange={(val) => handleChange("nomorBpjs", val)}
                  disabled={!form.kepesertaanBpjs}
                  placeholder="13 digit nomor BPJS"
                  error={errors.nomorBpjs}
                  maxLength={13}
                />
                {form.kepesertaanBpjs && (
                  <span
                    className={`absolute right-4 top-[38px] text-xs font-medium pointer-events-none ${
                      isBpjsValid ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {form.nomorBpjs.length}/13
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
