/**
 * FormSelect - Reusable dropdown select component
 */

interface FormSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[] | readonly { value: string; label: string }[];
    required?: boolean;
    disabled?: boolean;
    error?: string;
}

export function FormSelect({
    label,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    error
}: FormSelectProps) {
    return (
        <div className="relative">
            <label className="block text-[13px] font-normal tracking-wide mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`w-full px-3 py-2 text-sm text-gray-600 border rounded-lg bg-white focus:ring-2 outline-none transition-all appearance-none cursor-pointer ${
                        error 
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100' 
                            : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
                    } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                >
                    <option value="">Pilih</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500 font-normal">{error}</p>
            )}
        </div>
    );
}

/**
 * Yes/No options constant
 */
export const yesNoOptions = [
    { value: 'true', label: 'Ya' },
    { value: 'false', label: 'Tidak' }
] as const;
