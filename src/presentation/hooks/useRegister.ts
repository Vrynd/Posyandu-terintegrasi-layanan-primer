/**
 * useRegister - Custom hook for register page
 * Handles form state and validation for registration
 * NIK and Phone Number are now mandatory
 */

import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from './useAuth';
import type { RegisterParams } from '../../domain/entities/User';
import {
    validateName,
    validateEmail,
    validateNIK,
    validatePhoneNumber,
    getUserFriendlyError,
} from '../../utils/security';

interface UseRegisterReturn {
    // Form fields
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    nik: string;
    phoneNumber: string;
    
    // Setters
    setName: (value: string) => void;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    setPasswordConfirmation: (value: string) => void;
    setNik: (value: string) => void;
    setPhoneNumber: (value: string) => void;
    
    // State
    fieldErrors: Record<string, string>;
    generalError: string;
    isLoading: boolean;
    
    // Password strength
    passwordStrength: {
        checks: {
            length: boolean;
            lowercase: boolean;
            uppercase: boolean;
            number: boolean;
        };
        passed: number;
        strength: 'weak' | 'fair' | 'good' | 'strong';
        color: string;
        label: string;
        percentage: number;
    };
    
    // Actions
    handleSubmit: (e: FormEvent) => void;
}

export function useRegister(): UseRegisterReturn {
    const navigate = useNavigate();
    const { register } = useAuth();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [nik, setNik] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Error state
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState('');

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    // Password strength calculation
    const passwordStrength = useMemo(() => {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
        };

        const passed = Object.values(checks).filter(Boolean).length;
        let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
        let color = 'bg-red-500';
        let label = 'Lemah';

        if (passed === 4) {
            strength = 'strong';
            color = 'bg-emerald-500';
            label = 'Kuat';
        } else if (passed === 3) {
            strength = 'good';
            color = 'bg-blue-500';
            label = 'Baik';
        } else if (passed === 2) {
            strength = 'fair';
            color = 'bg-amber-500';
            label = 'Cukup';
        }

        return { checks, passed, strength, color, label, percentage: (passed / 4) * 100 };
    }, [password]);

    const clearErrors = () => {
        setFieldErrors({});
        setGeneralError('');
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Validate name with security checks
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            errors.name = nameValidation.error!;
        }

        // Validate email with security checks
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            errors.email = emailValidation.error!;
        }

        // Validate password with strength requirement
        if (!password) {
            errors.password = 'Password wajib diisi';
        } else if (password.length < 8) {
            errors.password = 'Password minimal 8 karakter';
        } else if (passwordStrength.passed < 3) {
            errors.password = 'Password harus memenuhi minimal 3 kriteria keamanan';
        }

        // Validate password confirmation
        if (!passwordConfirmation) {
            errors.passwordConfirmation = 'Konfirmasi password wajib diisi';
        } else if (password !== passwordConfirmation) {
            errors.passwordConfirmation = 'Password tidak cocok';
        }

        // Validate NIK with security checks
        const nikValidation = validateNIK(nik);
        if (!nikValidation.isValid) {
            errors.nik = nikValidation.error!;
        }

        // Validate phone number with security checks
        const phoneValidation = validatePhoneNumber(phoneNumber);
        if (!phoneValidation.isValid) {
            errors.phoneNumber = phoneValidation.error!;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const params: RegisterParams = {
                name: name.trim(),
                email: email.trim(),
                password,
                password_confirmation: passwordConfirmation,
                nik: nik.trim(),
                phone_number: phoneNumber.trim(),
            };

            await register(params);
            // Navigate to dashboard on success
            toast.success('Pendaftaran akun berhasil!');
            navigate('/dashboard');
        } catch (err: unknown) {
            // Extract error message from axios response or Error object
            let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
            
            // Check if it's an axios error with response data
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                if (axiosError.response?.data?.message) {
                    // Use backend message directly (already in Indonesian)
                    errorMessage = axiosError.response.data.message;
                }
            } else if (err instanceof Error) {
                // Fallback to getUserFriendlyError for other errors
                errorMessage = getUserFriendlyError(err.message);
            }
            
            setGeneralError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name,
        email,
        password,
        passwordConfirmation,
        nik,
        phoneNumber,
        setName,
        setEmail,
        setPassword,
        setPasswordConfirmation,
        setNik,
        setPhoneNumber,
        fieldErrors,
        generalError,
        isLoading,
        passwordStrength,
        handleSubmit,
    };
}
