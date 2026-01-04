/**
 * PesertaAddFooter - Navigation buttons for the registration wizard
 */

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

interface PesertaAddFooterProps {
  currentStep: number;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function PesertaAddFooter({ 
  currentStep, 
  isLoading, 
  onPrev, 
  onNext, 
  onSubmit 
}: PesertaAddFooterProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4 flex items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        {currentStep === 1 ? "Batal" : "Kembali"}
      </button>

      {currentStep < 4 ? (
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Lanjut
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Simpan
            </>
          )}
        </button>
      )}
    </div>
  );
}
