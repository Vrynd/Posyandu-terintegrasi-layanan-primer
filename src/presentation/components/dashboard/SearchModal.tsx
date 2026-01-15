import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, X, ArrowRight, CornerDownLeft, Loader2 } from 'lucide-react';
import { usePesertaList } from '../../hooks/usePesertaList';
import { kategoriConfig } from '../../constants/kategoriConfig';

/**
 * SearchModal - Command Palette style search with live suggestions
 */
interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Reuse usePesertaList for filtering
    const { filteredPeserta, isLoading, handleHoverPeserta } = usePesertaList();

    // Filter suggestions based on local state query
    const suggestions = query.trim() === '' 
        ? [] 
        : filteredPeserta.filter(p => 
            p.nama.toLowerCase().includes(query.toLowerCase()) || 
            p.nik.includes(query)
          ).slice(0, 6); // Limit to top 6 suggestions

    // Auto focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (suggestions[selectedIndex]) {
                    handleSelect(suggestions[selectedIndex]);
                } else if (query.trim()) {
                    // Fallback to search result page
                    navigate(`/dashboard/participants?q=${encodeURIComponent(query)}`);
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, suggestions, selectedIndex, query, navigate, onClose]);

    const handleSelect = (peserta: any) => {
        const slug = kategoriConfig[peserta.kategori as keyof typeof kategoriConfig]?.urlSlug || 'all';
        navigate(`/dashboard/participants/${slug}/${peserta.id}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32 px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div 
                ref={modalRef}
                className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            >
                {/* Search Bar */}
                <div className="flex items-center px-4 py-4 border-b border-white/10 gap-3">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        placeholder="Ketik nama atau NIK peserta..."
                        className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 text-base"
                    />
                    <div className="flex items-center gap-2">
                        {query && (
                            <button 
                                onClick={() => {
                                    setQuery('');
                                    setSelectedIndex(0);
                                    inputRef.current?.focus();
                                }}
                                className="p-1 hover:bg-white/5 rounded-md transition-colors text-slate-500 hover:text-slate-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        {isLoading && <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />}
                        <button 
                            onClick={onClose}
                            className="p-1 hover:bg-white/5 rounded-md transition-colors border border-white/10 text-slate-500 hover:text-white"
                            title="Tutup (Esc)"
                        >
                            <span className="text-[10px] px-1 font-mono">ESC</span>
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {query.trim() === '' ? (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="w-6 h-6 text-slate-500" />
                            </div>
                            <h3 className="text-white font-medium mb-1">Pencarian Cepat</h3>
                            <p className="text-slate-500 text-sm">Cari data warga berdasarkan Nama atau NIK secara instan.</p>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="py-2">
                            <div className="px-4 py-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saran Peserta</span>
                            </div>
                            {suggestions.map((peserta, index) => {
                                const kategori = kategoriConfig[peserta.kategori as keyof typeof kategoriConfig];
                                const isSelected = index === selectedIndex;

                                return (
                                    <button
                                        key={peserta.id}
                                        onClick={() => handleSelect(peserta)}
                                        onMouseEnter={() => {
                                            setSelectedIndex(index);
                                            handleHoverPeserta(peserta.id);
                                        }}
                                        className={`w-full flex items-center gap-4 px-4 py-3 transition-colors text-left ${
                                            isSelected ? 'bg-blue-600/10' : 'hover:bg-white/5'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full bg-linear-to-br ${kategori.gradient} flex items-center justify-center text-white shrink-0`}>
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-semibold truncate ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                                                {peserta.nama}
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                NIK: {peserta.nik} • {kategori.label}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-500 font-mono">
                                                <span>Detail</span>
                                                <CornerDownLeft className="w-3 h-3" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                            
                            <button 
                                onClick={() => {
                                    navigate(`/dashboard/participants?q=${encodeURIComponent(query)}`);
                                    onClose();
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 mt-2 border-t border-white/5 text-slate-400 hover:text-white transition-colors text-sm"
                            >
                                <span className="flex items-center gap-2">
                                    Lihat semua hasil pencarian untuk "{query}"
                                </span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : !isLoading && (
                        <div className="p-8 text-center">
                            <p className="text-slate-500 text-sm">Tidak ada peserta yang cocok dengan "{query}"</p>
                        </div>
                    )}
                </div>

                {/* Footer / Shortcuts */}
                <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between gap-4 text-[11px] text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <span className="p-0.5 rounded bg-white/10 border border-white/10">↑↓</span> Navigasi
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="p-0.5 px-1 rounded bg-white/10 border border-white/10">Enter</span> Pilih
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="p-0.5 px-1 rounded bg-white/10 border border-white/10 uppercase">Esc</span> Tutup
                    </div>
                </div>
            </div>
        </div>
    );
}
