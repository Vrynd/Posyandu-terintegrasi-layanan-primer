/**
 * usePesertaDetail Hook
 * State and logic for PesertaDetailPage
 * Uses React Query for optimal caching
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { PesertaDetail } from '../../data/models/PesertaApiTypes';
import {
    type PesertaEditForm,
    calculateAge,
    createEmptyEditForm,
} from '../../domain/entities/Peserta';
import { kategoriConfig } from '../constants/kategoriConfig';
import { 
    usePesertaDetail as usePesertaDetailQuery, 
    useUpdatePeserta, 
    useDeletePeserta,
} from '../../data/queries';

// Format date to YYYY-MM-DD for HTML date input
function formatDateForInput(dateString: string | undefined | null): string {
    if (!dateString) return '';
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    
    // Try to parse and format
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch {
        return '';
    }
}

// Map API response to edit form
function pesertaDetailToEditForm(peserta: PesertaDetail): PesertaEditForm {
    const formattedDate = formatDateForInput(peserta.tanggal_lahir);
    
    return {
        nama: peserta.nama,
        nik: peserta.nik,
        jenisKelamin: peserta.jenis_kelamin,
        tanggalLahir: formattedDate,
        telepon: peserta.telepon || '',
        desa: peserta.alamat || '',
        rt: peserta.rt || '',
        rw: peserta.rw || '',
        kepesertaanBpjs: peserta.kepesertaan_bpjs || false,
        nomorBpjs: peserta.nomor_bpjs || ''
    };
}

export function usePesertaDetail(id: string | undefined) {
    const navigate = useNavigate();
    const numericId = id ? parseInt(id, 10) : 0;

    // Use React Query for fetching peserta detail
    const { 
        data: peserta, 
        isLoading, 
        error: queryError,
        refetch
    } = usePesertaDetailQuery(numericId);

    // Use React Query mutations
    const updateMutation = useUpdatePeserta();
    const deleteMutation = useDeletePeserta();

    // Modal states
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Errors state
    const [errors, setErrors] = useState<Partial<Record<keyof PesertaEditForm, string>>>({});

    // Edit form state
    const [editForm, setEditForm] = useState<PesertaEditForm>(createEmptyEditForm());

    const config = peserta ? kategoriConfig[peserta.kategori] : null;
    const error = queryError?.message || (numericId === 0 && id ? 'ID peserta tidak valid' : null);

    // Open edit modal with peserta data
    const openEditModal = useCallback(() => {
        if (peserta) {
            setEditForm(pesertaDetailToEditForm(peserta));
        }
        setErrors({});
        setShowEditModal(true);
    }, [peserta]);

    // Close edit modal
    const closeEditModal = useCallback(() => {
        setShowEditModal(false);
    }, []);

    // Handle edit form field change with validation and restrictions
    const handleEditChange = useCallback((field: string, value: string | boolean) => {
        let finalValue = value;

        // Apply input restrictions for numeric fields
        if (typeof value === 'string' && ['nik', 'telepon', 'rt', 'rw', 'nomorBpjs'].includes(field)) {
            const numericValue = value.replace(/\D/g, "");
            if (field === "nik") finalValue = numericValue.slice(0, 16);
            else if (field === "nomorBpjs" || field === "telepon") finalValue = numericValue.slice(0, 13);
            else if (["rt", "rw"].includes(field)) finalValue = numericValue.slice(0, 3);
            else finalValue = numericValue;
        }

        setEditForm(prev => ({ ...prev, [field]: finalValue }));
        
        // Clear error when field is edited
        if (errors[field as keyof PesertaEditForm]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[field as keyof PesertaEditForm];
                return next;
            });
        }
    }, [errors]);

    // Validate form before saving
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PesertaEditForm, string>> = {};
        
        if (!editForm.nama.trim()) newErrors.nama = "Nama lengkap wajib diisi";
        
        if (!editForm.nik.trim()) {
            newErrors.nik = "NIK wajib diisi";
        } else if (editForm.nik.length !== 16) {
            newErrors.nik = "NIK harus 16 digit";
        }
        
        if (!editForm.tanggalLahir) newErrors.tanggalLahir = "Tanggal lahir wajib diisi";
        if (!editForm.jenisKelamin) newErrors.jenisKelamin = "Jenis kelamin wajib diisi";
        
        if (!editForm.desa.trim()) newErrors.desa = "Alamat desa/kelurahan wajib diisi";
        if (!editForm.rt.trim()) newErrors.rt = "RT wajib diisi";
        if (!editForm.rw.trim()) newErrors.rw = "RW wajib diisi";
        
        if (!editForm.telepon.trim()) {
            newErrors.telepon = "Nomor telepon wajib diisi";
        } else if (editForm.telepon.length < 10) {
            newErrors.telepon = "Nomor telepon tidak valid";
        }
        
        if (editForm.kepesertaanBpjs) {
            if (!editForm.nomorBpjs.trim()) {
                newErrors.nomorBpjs = "Nomor BPJS wajib diisi";
            } else if (editForm.nomorBpjs.length !== 13) {
                newErrors.nomorBpjs = "Nomor BPJS harus 13 digit";
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save edit via mutation
    const handleSaveEdit = useCallback(async () => {
        if (!numericId || !peserta) return;
        
        if (!validateForm()) {
            toast.error('Mohon lengkapi data dengan benar');
            return;
        }

        try {
            const updateData = {
                nama: editForm.nama,
                tanggal_lahir: editForm.tanggalLahir,
                telepon: editForm.telepon,
                rt: editForm.rt,
                rw: editForm.rw,
                kepesertaan_bpjs: editForm.kepesertaanBpjs,
                nomor_bpjs: editForm.nomorBpjs,
            };

            await updateMutation.mutateAsync({ id: numericId, data: updateData });
            toast.success('Data peserta berhasil diperbarui');
            setShowEditModal(false);
        } catch (err) {
            console.error('[PesertaDetail] Update error:', err);
            toast.error('Gagal memperbarui data peserta');
        }
    }, [numericId, peserta, editForm, updateMutation, validateForm]);

    // Open delete confirmation
    const openDeleteConfirm = useCallback(() => {
        setShowDeleteConfirm(true);
    }, []);

    // Close delete confirmation
    const closeDeleteConfirm = useCallback(() => {
        setShowDeleteConfirm(false);
    }, []);

    // Handle delete via mutation
    const handleDelete = useCallback(async () => {
        if (!numericId || !peserta) return;

        try {
            await deleteMutation.mutateAsync(numericId);
            toast.success(`${peserta.nama} berhasil dihapus`);
            navigate('/dashboard/participants');
        } catch (err) {
            console.error('[PesertaDetail] Delete error:', err);
            toast.error('Gagal menghapus data peserta');
        } finally {
            setShowDeleteConfirm(false);
        }
    }, [numericId, peserta, deleteMutation, navigate]);

    // Navigate to new visit with pre-selected peserta
    const handleNewVisit = useCallback(() => {
        if (peserta) {
            const slug = kategoriConfig[peserta.kategori].urlSlug;
            navigate(`/dashboard/examinations/${slug}/${peserta.id}`);
        } else {
            navigate('/dashboard/examinations');
        }
    }, [navigate, peserta]);

    // Navigate back to list
    const handleBack = useCallback(() => {
        navigate('/dashboard/participants');
    }, [navigate]);

    // Refresh with React Query invalidation
    const refresh = useCallback(async () => {
        await refetch();
    }, [refetch]);

    return {
        // Data
        peserta: peserta || null,
        config,
        editForm,
        errors,
        isLoading,
        error,

        // Calculated
        age: peserta ? calculateAge(peserta.tanggal_lahir) : 0,

        // Modal states
        showDeleteConfirm,
        showEditModal,
        isSaving: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Actions
        openEditModal,
        closeEditModal,
        handleEditChange,
        handleSaveEdit,
        openDeleteConfirm,
        closeDeleteConfirm,
        handleDelete,
        handleNewVisit,
        handleBack,
        refresh,
    };
}
