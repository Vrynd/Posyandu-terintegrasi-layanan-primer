/**
 * PengaduanFormFooter - Navigation footer for pengaduan form steps
 */

import { ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react';

interface PengaduanFormFooterProps {
    currentStep: number;
    totalSteps: number;
    isSubmitting: boolean;
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
}

export function PengaduanFormFooter({ 
    currentStep, 
    totalSteps,
    isSubmitting,
    onPrev, 
    onNext, 
    onSubmit 
}: PengaduanFormFooterProps) {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
            {/* Previous Button */}
            <button
                onClick={onPrev}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                {isFirstStep ? 'Batal' : 'Kembali'}
            </button>

            {/* Step Info */}
            <div className="hidden sm:block text-sm text-gray-500">
                Langkah {currentStep} dari {totalSteps}
            </div>

            {/* Next/Submit Button */}
            {isLastStep ? (
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                >
                    {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                    ) : (
                        <><Send className="w-4 h-4" /> Kirim Pengaduan</>
                    )}
                </button>
            ) : (
                <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all"
                >
                    Lanjut
                    <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
