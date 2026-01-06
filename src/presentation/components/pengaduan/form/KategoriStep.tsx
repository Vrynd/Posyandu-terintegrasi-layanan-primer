/**
 * KategoriStep - Step 1: Pilih kategori masalah dan tingkat prioritas
 * Two-column layout: left for category (2x2 + 1), right for priority
 */

import { Bug, AlertTriangle, Check } from 'lucide-react';
import type { PengaduanKategori, PengaduanPrioritas } from '../../../../domain/entities/Pengaduan';
import { KATEGORI_OPTIONS, PRIORITAS_OPTIONS } from '../../../../domain/entities/Pengaduan';

interface KategoriStepProps {
    kategori: PengaduanKategori | null;
    prioritas: PengaduanPrioritas | null;
    kategoriLainnya: string;
    onKategoriChange: (kategori: PengaduanKategori | null) => void;
    onPrioritasChange: (prioritas: PengaduanPrioritas | null) => void;
    onKategoriLainnyaChange: (value: string) => void;
}

export function KategoriStep({ 
    kategori, 
    prioritas, 
    kategoriLainnya,
    onKategoriChange, 
    onPrioritasChange,
    onKategoriLainnyaChange
}: KategoriStepProps) {
    // Toggle category selection
    const handleKategoriClick = (id: PengaduanKategori) => {
        if (kategori === id) {
            onKategoriChange(null);
        } else {
            onKategoriChange(id);
        }
    };

    // Toggle priority selection
    const handlePrioritasClick = (id: PengaduanPrioritas) => {
        if (prioritas === id) {
            onPrioritasChange(null);
        } else {
            onPrioritasChange(id);
        }
    };

    // Separate main categories (first 4) and "Lainnya"
    const mainCategories = KATEGORI_OPTIONS.slice(0, 4);
    const lainnyaCategory = KATEGORI_OPTIONS[4]; // 'lainnya'

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Column - Kategori Masalah */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Bug className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">Kategori Masalah</h2>
                        <p className="text-sm text-gray-500">Pilih jenis masalah yang Anda alami</p>
                    </div>
                </div>

                {/* 2x2 Grid for 4 main categories */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                    {mainCategories.map((cat) => {
                        const isSelected = kategori === cat.id;
                        
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleKategoriClick(cat.id)}
                                className={`p-3 rounded-xl border-2 text-left transition-all flex items-start gap-2 ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                                }`}
                            >
                                <div className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                                }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                        {cat.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{cat.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* "Lainnya" - Full width */}
                <button
                    onClick={() => handleKategoriClick(lainnyaCategory.id)}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-start gap-2 ${
                        kategori === lainnyaCategory.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                >
                    <div className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        kategori === lainnyaCategory.id ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                    }`}>
                        {kategori === lainnyaCategory.id && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div className="flex-1">
                        <p className={`font-medium text-sm ${kategori === lainnyaCategory.id ? 'text-blue-700' : 'text-gray-900'}`}>
                            {lainnyaCategory.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{lainnyaCategory.description}</p>
                    </div>
                </button>

                {/* Input for "Lainnya" */}
                {kategori === 'lainnya' && (
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jelaskan kategori masalah <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={kategoriLainnya}
                            onChange={(e) => onKategoriLainnyaChange(e.target.value)}
                            placeholder="Contoh: Masalah notifikasi tidak muncul"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                        />
                    </div>
                )}
            </div>

            {/* Right Column - Tingkat Prioritas */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">Tingkat Prioritas</h2>
                        <p className="text-sm text-gray-500">Seberapa mendesak masalah ini?</p>
                    </div>
                </div>

                {/* Priority Options */}
                <div className="space-y-2">
                    {PRIORITAS_OPTIONS.map((p) => {
                        const isSelected = prioritas === p.id;
                        
                        const iconColors = {
                            rendah: 'bg-green-500',
                            sedang: 'bg-yellow-500',
                            tinggi: 'bg-red-500',
                        };
                        
                        return (
                            <button
                                key={p.id}
                                onClick={() => handlePrioritasClick(p.id)}
                                className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                                }`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                                }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                </div>
                                <div className={`w-1.5 h-6 rounded-full ${iconColors[p.id]}`} />
                                <div className="flex-1">
                                    <p className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                        {p.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Help text */}
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">
                        <strong>Tips:</strong> Pilih prioritas berdasarkan seberapa besar dampak masalah terhadap 
                        pekerjaan Anda sehari-hari di Posyandu.
                    </p>
                </div>
            </div>
        </div>
    );
}
