import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bug, FileText, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePengaduan } from "../hooks/usePengaduan";
import {
  StepIndicator,
  FullPageLoading,
  type Step,
} from "../components/common";
import { PengaduanPageHeader } from "../components/pengaduan";
import {
  KategoriStep,
  DeskripsiStep,
  KonfirmasiStep,
  PengaduanFormFooter,
} from "../components/pengaduan/form";
import type {
  PengaduanKategori,
  PengaduanPrioritas,
} from "../../domain/entities/Pengaduan";

// Form steps configuration
const FORM_STEPS: Step[] = [
  { id: 1, title: "Kategori", icon: Bug },
  { id: 2, title: "Deskripsi", icon: FileText },
  { id: 3, title: "Konfirmasi", icon: CheckCircle },
];

export function AddComplaintPage() {
  useDocumentTitle("Buat Pengaduan");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPengaduan, isSubmitting } = usePengaduan();

  // Step wizard state
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [kategori, setKategori] = useState<PengaduanKategori | null>(null);
  const [prioritas, setPrioritas] = useState<PengaduanPrioritas | null>(null);
  const [kategoriLainnya, setKategoriLainnya] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [langkah, setLangkah] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Form handlers
  const handleImagesChange = (files: File[], previews: string[]) => {
    setImages(files);
    setImagePreview(previews);
  };

  const handleNext = () => {
    // Validation for step 1
    if (currentStep === 1) {
      if (!kategori) {
        toast.error("Pilih kategori masalah");
        return;
      }
      if (!prioritas) {
        toast.error("Pilih tingkat prioritas");
        return;
      }
      if (kategori === "lainnya" && !kategoriLainnya.trim()) {
        toast.error("Jelaskan kategori masalah Anda");
        return;
      }
    }
    // Validation for step 2
    if (currentStep === 2) {
      if (!judul.trim()) {
        toast.error("Judul pengaduan wajib diisi");
        return;
      }
      if (!deskripsi.trim()) {
        toast.error("Deskripsi masalah wajib diisi");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
  };

  const handlePrev = () => {
    if (currentStep === 1) {
      navigate("/dashboard/complaints");
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!kategori || !prioritas) return;

    const success = await createPengaduan({
      kategori,
      prioritas,
      judul: kategori === "lainnya" ? `[${kategoriLainnya}] ${judul}` : judul,
      deskripsi,
      langkah_reproduksi: langkah,
      browser_info: navigator.userAgent,
      images,
    });

    if (success) {
      toast.success("Pengaduan berhasil dikirim!");
      navigate("/dashboard/complaints");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Loading Overlay */}
      {isSubmitting && <FullPageLoading message="Mengirim pengaduan..." />}

      {/* Header */}
      <PengaduanPageHeader
        title="Buat Pengaduan"
        description="Laporkan bug atau masalah sistem"
        breadcrumbs={[
          { label: "Complaints", path: "/dashboard/complaints" },
          { label: "New", isCurrent: true },
        ]}
      />

      {/* Step Indicator */}
      <StepIndicator steps={FORM_STEPS} currentStep={currentStep} />

      {/* Step Content */}
      <div className="mb-6">
        {currentStep === 1 && (
          <KategoriStep
            kategori={kategori}
            prioritas={prioritas}
            kategoriLainnya={kategoriLainnya}
            onKategoriChange={setKategori}
            onPrioritasChange={setPrioritas}
            onKategoriLainnyaChange={setKategoriLainnya}
          />
        )}

        {currentStep === 2 && (
          <DeskripsiStep
            judul={judul}
            deskripsi={deskripsi}
            langkah={langkah}
            images={images}
            imagePreview={imagePreview}
            onJudulChange={setJudul}
            onDeskripsiChange={setDeskripsi}
            onLangkahChange={setLangkah}
            onImagesChange={handleImagesChange}
          />
        )}

        {currentStep === 3 && kategori && prioritas && (
          <KonfirmasiStep
            kategori={kategori}
            prioritas={prioritas}
            judul={
              kategori === "lainnya" ? `[${kategoriLainnya}] ${judul}` : judul
            }
            deskripsi={deskripsi}
            langkah={langkah}
            imageCount={images.length}
            userName={user?.name || "User"}
          />
        )}
      </div>

      {/* Footer Navigation */}
      <PengaduanFormFooter
        currentStep={currentStep}
        totalSteps={FORM_STEPS.length}
        isSubmitting={isSubmitting}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
