/**
 * KonfirmasiStep - Step 3: Review sebelum mengirim pengaduan
 * Clean layout with organized sections and matched heights
 */

import { CheckCircle2, Bug, Image as ImageIcon, AlertTriangle, FileText, User } from 'lucide-react';
import type { PengaduanKategori, PengaduanPrioritas } from '../../../../domain/entities/Pengaduan';
import { KATEGORI_OPTIONS, PRIORITAS_OPTIONS } from '../../../../domain/entities/Pengaduan';

interface KonfirmasiStepProps {
    kategori: PengaduanKategori;
    prioritas: PengaduanPrioritas;
    judul: string;
    deskripsi: string;
    langkah: string;
    imageCount: number;
    userName: string;
}

export function KonfirmasiStep({ 
    kategori, 
    prioritas, 
    judul, 
    deskripsi, 
    langkah,
    imageCount,
    userName
}: KonfirmasiStepProps) {
    const kategoriLabel = KATEGORI_OPTIONS.find(k => k.id === kategori)?.label || kategori;
    const prioritasOption = PRIORITAS_OPTIONS.find(p => p.id === prioritas);

    return (
        <div className="space-y-4">
            {/* Info Banner */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-green-800 font-medium">Siap untuk dikirim</p>
                    <p className="text-xs text-green-700 mt-1">
                        Periksa kembali data pengaduan Anda sebelum mengirim.
                    </p>
                </div>
            </div>

            {/* Kategori & Prioritas - Full width */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Bug className="w-4 h-4 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Kategori & Prioritas</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Kategori</p>
                        <p className="font-medium text-gray-900">{kategoriLabel}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Prioritas</p>
                        <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${prioritasOption?.color}`}>
                            {prioritasOption?.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content - 2 column with matching heights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                {/* Left Column - Detail Masalah */}
                <div className="lg:col-span-2 flex flex-col">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <h3 className="font-medium text-gray-900">Detail Masalah</h3>
                        </div>
                        <div className="space-y-5 flex-1">
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Judul Pengaduan</p>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="font-medium text-gray-900">{judul || '-'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Deskripsi Masalah</p>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-gray-700 text-sm whitespace-pre-line">
                                        {deskripsi || '-'}
                                    </p>
                                </div>
                            </div>
                            {langkah && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Langkah Reproduksi</p>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-700 text-sm whitespace-pre-line">
                                            {langkah}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Screenshot, Pelapor & Warning */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {/* Screenshot */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <ImageIcon className="w-4 h-4 text-indigo-600" />
                            <h3 className="font-medium text-gray-900">Screenshot</h3>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900">{imageCount}</p>
                            <p className="text-xs text-gray-500">gambar dilampirkan</p>
                        </div>
                    </div>

                    {/* Pelapor */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-4 h-4 text-blue-600" />
                            <h3 className="font-medium text-gray-900">Pelapor</h3>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                    {userName.split(' ').slice(0, 2).map(n => n.charAt(0).toUpperCase()).join('')}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Kader</p>
                                <p className="font-medium text-gray-900">{userName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-amber-800 font-medium">Perhatian</p>
                            <p className="text-xs text-amber-700 mt-1">
                                Pengaduan yang sudah dikirim tidak dapat diedit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
