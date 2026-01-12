/**
 * PesertaEditModal Component
 * Edit form modal for peserta data
 */

import { X, Edit2 } from 'lucide-react';
import type { PesertaEditForm } from '../../../domain/entities/Peserta';
import { FormInput, FormDatePicker } from '../common/form/FormInput';
import { FormSelect } from '../common/form/FormSelect';

interface Props {
    isOpen: boolean;
    editForm: PesertaEditForm;
    onClose: () => void;
    onChange: (field: string, value: string | boolean) => void;
    onSave: () => void;
    errors: Partial<Record<keyof PesertaEditForm, string>>;
}

export function PesertaEditModal({ isOpen, editForm, onClose, onChange, onSave, errors }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-blue-600" />
                        Edit Data Peserta
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Nama */}
                        <FormInput
                            label="Nama Lengkap"
                            value={editForm.nama}
                            onChange={(val) => onChange('nama', val)}
                            placeholder="Masukkan Nama Lengkap"
                            required
                            error={errors.nama}
                        />

                        {/* NIK */}
                        <div className="relative">
                            <FormInput
                                label="NIK"
                                value={editForm.nik}
                                onChange={(val) => onChange('nik', val)}
                                placeholder="Masukkan 16 Digit Angka"
                                required
                                error={errors.nik}
                                maxLength={16}
                            />
                            <span className={`absolute right-4 top-[38px] text-xs font-medium pointer-events-none ${editForm.nik.length === 16 ? 'text-green-500' : 'text-gray-400'}`}>
                                {editForm.nik.length}/16
                            </span>
                        </div>

                        {/* Jenis Kelamin */}
                        <FormSelect
                            label="Jenis Kelamin"
                            value={editForm.jenisKelamin}
                            onChange={(val) => onChange('jenisKelamin', val)}
                            options={[
                                { value: 'Laki-Laki', label: 'Laki-Laki' },
                                { value: 'Perempuan', label: 'Perempuan' }
                            ]}
                            required
                            error={errors.jenisKelamin}
                        />

                        {/* Tanggal Lahir */}
                        <FormDatePicker
                            label="Tanggal Lahir"
                            value={editForm.tanggalLahir}
                            onChange={(val) => onChange('tanggalLahir', val)}
                            placeholder="Pilih Tanggal Lahir"
                            required
                            error={errors.tanggalLahir}
                        />

                        {/* Telepon */}
                        <FormInput
                            label="Telepon"
                            value={editForm.telepon}
                            onChange={(val) => onChange('telepon', val)}
                            placeholder="Contoh: 0812XXXXXXXX"
                            required
                            error={errors.telepon}
                            maxLength={13}
                        />

                        {/* Desa */}
                        <FormInput
                            label="Desa / Kelurahan"
                            value={editForm.desa}
                            onChange={(val) => onChange('desa', val)}
                            placeholder="Contoh: Desa Tondomulyo"
                            required
                            error={errors.desa}
                        />

                        {/* RT */}
                        <FormInput
                            label="RT"
                            value={editForm.rt}
                            onChange={(val) => onChange('rt', val)}
                            placeholder="001"
                            required
                            error={errors.rt}
                            maxLength={3}
                        />

                        {/* RW */}
                        <FormInput
                            label="RW"
                            value={editForm.rw}
                            onChange={(val) => onChange('rw', val)}
                            placeholder="001"
                            required
                            error={errors.rw}
                            maxLength={3}
                        />

                        {/* BPJS Status */}
                        <FormSelect
                            label="Status BPJS"
                            value={editForm.kepesertaanBpjs ? 'ya' : 'tidak'}
                            onChange={(val) => {
                                const isYa = val === 'ya';
                                onChange('kepesertaanBpjs', isYa);
                                if (!isYa) onChange('nomorBpjs', '');
                            }}
                            options={[
                                { value: 'ya', label: 'Terdaftar BPJS' },
                                { value: 'tidak', label: 'Tidak Terdaftar' }
                            ]}
                            required
                            error={errors.kepesertaanBpjs}
                        />

                        {/* Nomor BPJS */}
                        <div className={`relative ${!editForm.kepesertaanBpjs ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            <FormInput
                                label="Nomor BPJS"
                                value={editForm.nomorBpjs}
                                onChange={(val) => onChange('nomorBpjs', val)}
                                placeholder="13 Digit Nomor BPJS"
                                required={editForm.kepesertaanBpjs}
                                error={errors.nomorBpjs}
                                maxLength={13}
                                disabled={!editForm.kepesertaanBpjs}
                            />
                            {editForm.kepesertaanBpjs && (
                                <span className={`absolute right-4 top-[38px] text-xs font-medium pointer-events-none ${editForm.nomorBpjs.length === 13 ? 'text-green-500' : 'text-gray-400'}`}>
                                    {editForm.nomorBpjs.length}/13
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 cursor-pointer text-gray-700 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSave}
                        className="px-6 py-2 cursor-pointer text-white bg-linear-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}
