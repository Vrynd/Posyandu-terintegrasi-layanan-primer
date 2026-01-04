/**
 * SortModal Component
 * Modal for sorting options
 */

import { X, Check, ArrowUpDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { SortType } from './PemeriksaanToolbar';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedSort: SortType;
    onApply: (sort: SortType) => void;
}

const sortOptions: { value: SortType; label: string; description: string }[] = [
    { value: 'nama-asc', label: 'Nama A-Z', description: 'Urutkan berdasarkan nama A ke Z' },
    { value: 'nama-desc', label: 'Nama Z-A', description: 'Urutkan berdasarkan nama Z ke A' },
    { value: 'kunjungan-desc', label: 'Pemeriksaan Terbaru', description: 'Pemeriksaan paling baru dahulu' },
    { value: 'kunjungan-asc', label: 'Pemeriksaan Terlama', description: 'Pemeriksaan paling lama dahulu' },
];

export function SortModal({
    isOpen,
    onClose,
    selectedSort,
    onApply,
}: Props) {
    const [tempSort, setTempSort] = useState<SortType>(selectedSort);

    // Sync with props when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempSort(selectedSort);
        }
    }, [isOpen, selectedSort]);

    // Close on ESC and handle body overflow
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleApply = () => {
        onApply(tempSort);
        onClose();
    };

    const hasChanges = tempSort !== selectedSort;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Content */}
                <div className="text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                        <ArrowUpDown className="w-10 h-10 text-purple-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Urutkan Data
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-6">
                        Pilih urutan tampilan data peserta
                    </p>

                    {/* Sort Options */}
                    <div className="space-y-2 mb-6 text-left">
                        {sortOptions.map((option) => {
                            const isSelected = tempSort === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => setTempSort(option.value)}
                                    className={`w-full flex items-start justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                                        isSelected
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <div>
                                        <p className={`text-sm font-medium ${
                                            isSelected ? 'text-purple-700' : 'text-gray-700'
                                        }`}>
                                            {option.label}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                                    </div>
                                    {isSelected && (
                                        <Check className="w-5 h-5 text-purple-600 shrink-0 ml-2" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTempSort('nama-asc')}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!hasChanges}
                            className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all ${
                                hasChanges
                                    ? 'bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Terapkan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
