/**
 * usePesertaAdd Hook
 * Logic for multi-step participant registration form
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { KategoriKey } from "@/domain/entities/Peserta";
import type { CreatePesertaRequest } from "@/data/models/PesertaApiTypes";
import { pesertaApiDataSource } from "@/data/datasources/PesertaApiDataSource";
import { queryClient, queryKeys } from "@/data/queries";
import { kategoriConfig } from "@/presentation/constants/kategoriConfig";

export interface FormData {
  // Base fields
  kategori: KategoriKey | null;
  nama: string;
  nik: string;
  tanggalLahir: Date | null;
  jenisKelamin: "Laki-Laki" | "Perempuan" | "";
  kepesertaanBpjs: boolean | null;
  nomorBpjs: string;
  alamat: string;
  rt: string;
  rw: string;
  telepon: string;
  // Category-specific required fields
  namaSuami: string; // bumil
  namaOrtu: string;  // balita, remaja
  pekerjaan: string; // produktif, lansia
}

export interface UsePesertaAddReturn {
  currentStep: number;
  isLoading: boolean;
  form: FormData;
  handleChange: (field: keyof FormData, value: string | boolean | Date | null) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSubmit: () => Promise<void>;
  getCategoryRequiredLabel: () => { field: keyof FormData; label: string; placeholder: string } | null;
  getCategoryFieldValue: () => string;
  setCurrentStep: (step: number) => void;
  handleResetStep: (step: number) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function usePesertaAdd(): UsePesertaAddReturn {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);

  const [currentStep, setCurrentStep] = useState(() => {
    const step = searchParams.get("step");
    return step ? parseInt(step, 10) : 1;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    kategori: null,
    nama: "",
    nik: "",
    tanggalLahir: null,
    jenisKelamin: "",
    kepesertaanBpjs: null,
    nomorBpjs: "",
    alamat: "",
    rt: "",
    rw: "",
    telepon: "",
    namaSuami: "",
    namaOrtu: "",
    pekerjaan: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Synchronize state with URL on mount or URL change
  useEffect(() => {
    if (category) {
      // Find internal category key from URL slug
      const internalKategori = (Object.keys(kategoriConfig) as KategoriKey[]).find(
        (key) => kategoriConfig[key].urlSlug === category
      );

      if (internalKategori) {
        setForm(prev => ({ ...prev, kategori: internalKategori }));
        
        // Auto-advance ONLY on INITIAL MOUNT for deep links
        if (isInitialMount.current && currentStep === 1) {
          setCurrentStep(2);
        }
      }
    } else {
      // If no category in URL and we are at step 1, reset category
      if (currentStep === 1) {
        setForm(prev => ({ ...prev, kategori: null }));
      }
    }
    
    // After first run, it's no longer the initial mount
    isInitialMount.current = false;
  }, [category]);

  // Sync currentStep to URL search params
  useEffect(() => {
    const stepInUrl = searchParams.get("step");
    if (stepInUrl !== currentStep.toString()) {
      setSearchParams(
        (prev: URLSearchParams) => {
          prev.set("step", currentStep.toString());
          return prev;
        },
        { replace: true }
      );
    }
  }, [currentStep, searchParams, setSearchParams]);

  const handleChange = (field: keyof FormData, value: string | boolean | Date | null) => {
    let finalValue = value;

    // Input Restrictions based on field type
    if (typeof value === "string") {
      if (["nama", "namaSuami", "namaOrtu", "pekerjaan"].includes(field)) {
        // Only letters and spaces
        finalValue = value.replace(/[^a-zA-Z\s]/g, "");
      } else if (["nik", "nomorBpjs", "telepon", "rt", "rw"].includes(field)) {
        // Only numbers and enforce max length
        const numericValue = value.replace(/\D/g, "");
        if (field === "nik") finalValue = numericValue.slice(0, 16);
        else if (field === "nomorBpjs" || field === "telepon") finalValue = numericValue.slice(0, 13);
        else if (["rt", "rw"].includes(field)) finalValue = numericValue.slice(0, 3);
        else finalValue = numericValue;
      }
    }

    setForm((prev) => ({ ...prev, [field]: finalValue }));
    
    // Clear error for the field being changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // If category changes, update URL but DO NOT advance step automatically
    if (field === "kategori" && finalValue) {
      const config = kategoriConfig[finalValue as KategoriKey];
      if (config?.urlSlug) {
        navigate(`/dashboard/participants/register/${config.urlSlug}?step=${currentStep}`, { replace: true });
      }
    }
  };

  const getCategoryRequiredLabel = (): { field: keyof FormData; label: string; placeholder: string } | null => {
    switch (form.kategori) {
      case "bumil":
        return { field: "namaSuami", label: "Nama Suami", placeholder: "Masukkan nama suami" };
      case "balita":
      case "remaja":
        return { field: "namaOrtu", label: "Nama Orang Tua/Wali", placeholder: "Masukkan nama orang tua/wali" };
      case "produktif":
      case "lansia":
        return { field: "pekerjaan", label: "Pekerjaan", placeholder: "Masukkan pekerjaan" };
      default:
        return null;
    }
  };

  const getCategoryFieldValue = (): string => {
    switch (form.kategori) {
      case "bumil":
        return form.namaSuami;
      case "balita":
      case "remaja":
        return form.namaOrtu;
      case "produktif":
      case "lansia":
        return form.pekerjaan;
      default:
        return "";
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (step) {
      case 1:
        if (!form.kategori) {
          toast.error("Silakan pilih kategori peserta");
          return false;
        }
        return true;
      case 2:
        if (!form.nama.trim()) {
          newErrors.nama = "Nama lengkap wajib diisi";
        }
        if (!form.nik.trim()) {
          newErrors.nik = "Nomor induk kependudukan wajib diisi";
        } else if (form.nik.length !== 16) {
          newErrors.nik = "NIK harus 16 digit";
        }
        if (!form.tanggalLahir) {
          newErrors.tanggalLahir = "Tanggal lahir wajib diisi" as any;
        }
        if (!form.jenisKelamin) {
          newErrors.jenisKelamin = "Jenis kelamin wajib diisi" as any;
        }
        if (form.kepesertaanBpjs === null) {
          newErrors.kepesertaanBpjs = "Status BPJS wajib dipilih" as any;
        }
        if (form.kepesertaanBpjs) {
          if (!form.nomorBpjs.trim()) {
            newErrors.nomorBpjs = "Nomor BPJS wajib diisi";
          } else if (form.nomorBpjs.length !== 13) {
            newErrors.nomorBpjs = "Nomor BPJS harus 13 digit";
          }
        }
        // Validate category-specific required field
        const categoryField = getCategoryRequiredLabel();
        if (categoryField && !getCategoryFieldValue().trim()) {
          newErrors[categoryField.field] = `${categoryField.label} wajib diisi`;
        }
        break;
      case 3:
        if (!form.alamat.trim()) {
          newErrors.alamat = "Alamat wajib diisi";
        }
        if (!form.rt.trim()) {
          newErrors.rt = "RT wajib diisi";
        }
        if (!form.rw.trim()) {
          newErrors.rw = "RW wajib diisi";
        }
        if (!form.telepon.trim()) {
          newErrors.telepon = "Nomor telepon wajib diisi";
        } else if (form.telepon.length < 10) {
          newErrors.telepon = "Nomor telepon minimal 10 digit";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    const prevStep = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStep);
    
    // If going back to step 1, clear category from URL
    if (prevStep === 1) {
      navigate("/dashboard/participants/register?step=1", { replace: true });
    }
  };

  const handleResetStep = (step: number) => {
    if (step === 2) {
      setForm((prev) => ({
        ...prev,
        nama: "",
        nik: "",
        tanggalLahir: null,
        jenisKelamin: "",
        kepesertaanBpjs: null,
        nomorBpjs: "",
        namaSuami: "",
        namaOrtu: "",
        pekerjaan: "",
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        ["nama", "nik", "tanggalLahir", "jenisKelamin", "kepesertaanBpjs", "nomorBpjs", "namaSuami", "namaOrtu", "pekerjaan"].forEach(field => {
          delete newErrors[field as keyof FormData];
        });
        return newErrors;
      });
      toast.success("Form berhasil direset");
    } else if (step === 3) {
      setForm((prev) => ({
        ...prev,
        alamat: "",
        rt: "",
        rw: "",
        telepon: "",
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        ["alamat", "rt", "rw", "telepon"].forEach(field => {
          delete newErrors[field as keyof FormData];
        });
        return newErrors;
      });
      toast.success("Form berhasil direset");
    }
  };

  const buildApiRequest = (): CreatePesertaRequest => {
    const request: CreatePesertaRequest = {
      nik: form.nik,
      nama: form.nama,
      kategori: form.kategori as KategoriKey,
      tanggal_lahir: form.tanggalLahir 
        ? `${form.tanggalLahir.getFullYear()}-${String(form.tanggalLahir.getMonth() + 1).padStart(2, '0')}-${String(form.tanggalLahir.getDate()).padStart(2, '0')}`
        : '',
      jenis_kelamin: form.jenisKelamin as "Laki-Laki" | "Perempuan",
      alamat: form.alamat,
      rt: form.rt,
      rw: form.rw,
      telepon: form.telepon,
      kepesertaan_bpjs: form.kepesertaanBpjs ?? false,
    };

    if (form.kepesertaanBpjs && form.nomorBpjs) {
      request.nomor_bpjs = form.nomorBpjs;
    }

    // Add category-specific fields
    switch (form.kategori) {
      case "bumil":
        request.nama_suami = form.namaSuami;
        break;
      case "balita":
      case "remaja":
        request.nama_ortu = form.namaOrtu;
        break;
      case "produktif":
      case "lansia":
        request.pekerjaan = form.pekerjaan;
        break;
    }

    return request;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const request = buildApiRequest();
      console.log("[usePesertaAdd] Submitting:", request);
      
      const response = await pesertaApiDataSource.createPeserta(request);
      
      if (response.success) {
        // Auto-invalidate related queries to refresh dashboard and list
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.peserta.all });

        toast.success(`Berhasil! ${form.nama} telah terdaftar sebagai peserta.`);
        // Direct redirect to participant list
        navigate(`/dashboard/participants?success=1&nama=${encodeURIComponent(form.nama)}&nik=${encodeURIComponent(form.nik)}`, { replace: true });
      } else {
        // Handle validation errors
        if (response.errors) {
          const firstError = Object.values(response.errors)[0];
          toast.error(firstError?.[0] || "Gagal mendaftarkan peserta");
        } else {
          toast.error(response.message || "Gagal mendaftarkan peserta");
        }
      }
    } catch (error: unknown) {
      console.error("[usePesertaAdd] Error:", error);
      
      // Handle axios error response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
        if (axiosError.response?.data?.errors) {
          const firstError = Object.values(axiosError.response.data.errors)[0];
          toast.error(firstError?.[0] || "Gagal mendaftarkan peserta");
        } else if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error("Gagal mendaftarkan peserta. Silakan coba lagi.");
        }
      } else {
        toast.error("Gagal mendaftarkan peserta. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    isLoading,
    form,
    handleChange,
    handleNext,
    handlePrev,
    handleSubmit,
    getCategoryRequiredLabel,
    getCategoryFieldValue,
    setCurrentStep,
    handleResetStep,
    errors,
  };
}
