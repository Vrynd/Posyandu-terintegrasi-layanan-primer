/**
 * FormInput - Reusable floating label input component
 */

import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface FormInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
    type?: 'text' | 'number';
    disabled?: boolean;
    error?: string;
    maxLength?: number;
}

export function FormInput({
    label,
    value,
    onChange,
    required = false,
    placeholder = '',
    type = 'text',
    disabled = false,
    error,
    maxLength
}: FormInputProps) {
    return (
        <div className="relative">
            <label className="block text-[13px] font-normal tracking-wide mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className={`w-full px-3 py-2 text-sm capitalize text-gray-600 border rounded-lg bg-white focus:ring-2 outline-none transition-all ${
                    error 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
                } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500 font-normal">{error}</p>
            )}
        </div>
    );
}

/**
 * FormDateInput - Date input with label
 */
interface FormDateInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    error?: string;
}

export function FormDateInput({
    label,
    value,
    onChange,
    required = false,
    error
}: FormDateInputProps) {
    return (
        <div>
            <label className="block text-[13px] font-normal tracking-wide mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-3 py-2 text-sm text-gray-600 border rounded-lg bg-white focus:ring-2 outline-none transition-all ${
                    error 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
                }`}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500 font-normal">{error}</p>
            )}
        </div>
    );
}

/**
 * FormDatePicker - Date picker using react-datepicker library
 * Works with string format (YYYY-MM-DD) for compatibility
 */
interface FormDatePickerProps {
    label: string;
    value: string; // YYYY-MM-DD format
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
    maxDate?: Date;
    error?: string;
}

export function FormDatePicker({
    label,
    value,
    onChange,
    required = false,
    placeholder = 'Pilih tanggal',
    maxDate,
    error
}: FormDatePickerProps) {
    // Convert string to Date for DatePicker
    const dateValue = value ? new Date(value) : null;
    
    // Convert Date back to string (YYYY-MM-DD)
    const handleChange = (date: Date | null) => {
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            onChange(`${year}-${month}-${day}`);
        } else {
            onChange('');
        }
    };

    return (
        <div>
            <label className="block text-[13px] font-normal tracking-wide mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <DatePicker
                    selected={dateValue}
                    onChange={handleChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={placeholder}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    maxDate={maxDate}
                    className={`w-full px-3 py-2 text-sm text-gray-600 border rounded-lg bg-white focus:ring-2 outline-none transition-all ${
                        error 
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100' 
                            : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
                    }`}
                    wrapperClassName="w-full"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500 font-normal">{error}</p>
            )}
        </div>
    );
}
