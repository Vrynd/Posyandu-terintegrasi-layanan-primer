/**
 * DeskripsiStep - Step 2: Deskripsi masalah dan screenshot
 * Layout: 2 columns with matching heights
 */

import { useRef, useState } from 'react';
import { FileText, Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeskripsiStepProps {
    judul: string;
    deskripsi: string;
    langkah: string;
    images: File[];
    imagePreview: string[];
    onJudulChange: (value: string) => void;
    onDeskripsiChange: (value: string) => void;
    onLangkahChange: (value: string) => void;
    onImagesChange: (files: File[], previews: string[]) => void;
}

export function DeskripsiStep({ 
    judul, 
    deskripsi, 
    langkah,
    images,
    imagePreview,
    onJudulChange,
    onDeskripsiChange,
    onLangkahChange,
    onImagesChange
}: DeskripsiStepProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewModal, setPreviewModal] = useState<string | null>(null);

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

        const newImages = [...images, ...validFiles];
        const newPreviews = [...imagePreview];
        
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === newImages.length) {
                    onImagesChange(newImages, newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });

        if (validFiles.length === 0) return;
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreview.filter((_, i) => i !== index);
        onImagesChange(newImages, newPreviews);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 flex flex-col">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Detail Masalah</h2>
                            <p className="text-sm text-gray-500">Jelaskan masalah dengan detail</p>
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="space-y-5 flex-1 flex flex-col">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Judul Pengaduan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={judul}
                                onChange={(e) => onJudulChange(e.target.value)}
                                placeholder="Contoh: Tidak bisa menyimpan data kunjungan"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi Masalah <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={deskripsi}
                                onChange={(e) => onDeskripsiChange(e.target.value)}
                                placeholder="Jelaskan masalah yang Anda alami dengan detail..."
                                rows={4}
                                className="w-full h-[calc(100%-2rem)] min-h-[100px] px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Langkah Reproduksi <span className="text-gray-400">(Opsional)</span>
                            </label>
                            <textarea
                                value={langkah}
                                onChange={(e) => onLangkahChange(e.target.value)}
                                placeholder="1. Buka halaman kunjungan&#10;2. Isi form kunjungan&#10;3. Klik tombol simpan"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Screenshot */}
            <div className="lg:col-span-1 flex flex-col">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-indigo-600" />
                            <h2 className="font-semibold text-gray-900">Screenshot</h2>
                        </div>
                        <span className="text-xs text-gray-400">{images.length}/3 gambar</span>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                    />

                    {/* Flex container for upload + images */}
                    <div className="flex-1 flex flex-col">
                        {/* Upload Zone - ALWAYS visible */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={images.length >= 3}
                            className={`border-2 border-dashed rounded-xl p-6 min-h-[200px] flex flex-col items-center justify-center transition-all ${
                                images.length >= 3
                                    ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                                    : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
                            }`}
                        >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">
                                {images.length >= 3 ? 'Maksimum tercapai' : 'Klik untuk upload'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG max 5MB</p>
                        </button>

                        {/* Image Previews Grid - below upload */}
                        {imagePreview.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {imagePreview.map((preview, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            onClick={() => setPreviewModal(preview)}
                                            className="w-full h-full object-cover rounded-lg border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Help text at bottom */}
                        <p className="text-xs text-gray-400 mt-auto pt-4 text-center">
                            Screenshot membantu kami memahami masalah lebih cepat
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewModal && (
                <div 
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setPreviewModal(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img
                            src={previewModal}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setPreviewModal(null)}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-white text-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
