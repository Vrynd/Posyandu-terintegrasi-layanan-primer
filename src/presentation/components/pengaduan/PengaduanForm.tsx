/**
 * PengaduanForm - Kader complaint form with image upload
 */

import { useRef, useState } from 'react';
import { Bug, Send, AlertCircle, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import type { CreatePengaduanParams } from '../../../domain/entities/Pengaduan';
import { KATEGORI_OPTIONS, PRIORITAS_OPTIONS } from '../../../domain/entities/Pengaduan';

interface PengaduanFormProps {
    userName: string;
    isSubmitting: boolean;
    onSubmit: (params: CreatePengaduanParams) => Promise<boolean>;
    onSuccess: () => void;
}

export function PengaduanForm({ userName, isSubmitting, onSubmit, onSuccess }: PengaduanFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [form, setForm] = useState<CreatePengaduanParams>({
        kategori: 'error',
        prioritas: 'sedang',
        judul: '',
        deskripsi: '',
        langkah_reproduksi: '',
        browser_info: navigator.userAgent,
    });

    const handleChange = (field: keyof CreatePengaduanParams, value: string) => {
        setForm((prev: CreatePengaduanParams) => ({ ...prev, [field]: value }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const validFiles = newFiles.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} bukan file gambar`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} terlalu besar (max 5MB)`);
                return false;
            }
            return true;
        });

        if (images.length + validFiles.length > 3) {
            toast.error('Maksimal 3 gambar');
            return;
        }

        setImages(prev => [...prev, ...validFiles]);
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!form.judul.trim()) {
            toast.error('Judul pengaduan wajib diisi');
            return;
        }
        if (!form.deskripsi.trim()) {
            toast.error('Deskripsi masalah wajib diisi');
            return;
        }

        const success = await onSubmit({ ...form, images });
        if (success) {
            toast.success('Pengaduan berhasil dikirim!');
            setForm({
                kategori: 'error',
                prioritas: 'sedang',
                judul: '',
                deskripsi: '',
                langkah_reproduksi: '',
                browser_info: navigator.userAgent,
            });
            setImages([]);
            setImagePreview([]);
            onSuccess();
        }
    };

    return (
        <>
            {/* Info Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-amber-800 font-medium">Informasi Penting</p>
                    <p className="text-xs text-amber-700 mt-1">
                        Jelaskan masalah dengan detail dan sertakan screenshot jika memungkinkan.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {/* Category & Priority */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Bug className="w-5 h-5 text-amber-600" />
                            <h2 className="font-semibold text-gray-900">Kategori Masalah</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
                            {KATEGORI_OPTIONS.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleChange('kategori', category.id)}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                                        form.kategori === category.id
                                            ? 'border-amber-500 bg-amber-50'
                                            : 'border-gray-100 bg-gray-50'
                                    }`}
                                >
                                    <p className="font-medium text-sm text-gray-900">{category.label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 hidden md:block">{category.description}</p>
                                </button>
                            ))}
                        </div>

                        <label className="block text-sm font-medium text-gray-700 mb-3">Tingkat Prioritas</label>
                        <div className="flex gap-2">
                            {PRIORITAS_OPTIONS.map((priority) => (
                                <button
                                    key={priority.id}
                                    onClick={() => handleChange('prioritas', priority.id)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                        form.prioritas === priority.id
                                            ? priority.color + ' border-current'
                                            : 'bg-gray-50 text-gray-600 border-gray-200'
                                    }`}
                                >
                                    {priority.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Judul Pengaduan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.judul}
                                onChange={(e) => handleChange('judul', e.target.value)}
                                placeholder="Contoh: Tidak bisa menyimpan data kunjungan"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-400 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi Masalah <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={form.deskripsi}
                                onChange={(e) => handleChange('deskripsi', e.target.value)}
                                placeholder="Jelaskan masalah yang Anda alami dengan detail..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-400 outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Langkah-langkah Reproduksi <span className="text-gray-400">(Opsional)</span>
                            </label>
                            <textarea
                                value={form.langkah_reproduksi}
                                onChange={(e) => handleChange('langkah_reproduksi', e.target.value)}
                                placeholder="1. Buka halaman kunjungan&#10;2. Isi form kunjungan&#10;3. Klik tombol simpan"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-400 outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Image Upload */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ImageIcon className="w-5 h-5 text-indigo-600" />
                            <h2 className="font-semibold text-gray-900">Screenshot</h2>
                            <span className="text-xs text-gray-400 ml-auto">Max 3 gambar</span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={images.length >= 3}
                            className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                                images.length >= 3
                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                    : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
                            }`}
                        >
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 font-medium">Klik untuk upload</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG max 5MB</p>
                        </button>

                        {imagePreview.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {imagePreview.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-xl border border-gray-100"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <p className="text-xs text-gray-400 mb-4">
                            Pelapor: <span className="font-medium text-gray-600">{userName}</span>
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-amber-700 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Mengirim...</>
                            ) : (
                                <><Send className="w-5 h-5" /> Kirim Pengaduan</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
