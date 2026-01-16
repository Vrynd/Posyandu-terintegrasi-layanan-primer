    import { useParams, Link } from 'react-router-dom';
    import type { LucideIcon } from 'lucide-react';
    import { ChevronRight, Home, User, Stethoscope, Calendar, ClipboardCheck, ArrowLeft, RotateCcw, History, Pencil } from 'lucide-react';
    import { usePemeriksaanForm } from '@/presentation/hooks/usePemeriksaanForm';
    import { useDocumentTitle } from '@/presentation/hooks/useDocumentTitle';
    import { StepIndicator, FullPageLoading } from '@/presentation/components/common';
    import { 
        Step1Verifikasi, 
        Step2Pemeriksaan, 
        Step3WaktuLokasi, 
        Step4Konfirmasi, 
        PemeriksaanWizardFooter,
        PemeriksaanAddSkeleton 
    } from '@/presentation/components/pemeriksaan';
    import { kategoriConfig } from '@/presentation/constants/kategoriConfig';

    const steps = [
        { id: 1, title: 'Verifikasi', icon: User as LucideIcon },
        { id: 2, title: 'Hasil Medis', icon: Stethoscope as LucideIcon },
        { id: 3, title: 'Waktu & Lokasi', icon: Calendar as LucideIcon },
        { id: 4, title: 'Konfirmasi', icon: ClipboardCheck as LucideIcon },
    ];

    export function PemeriksaanAddPage() {
        const { id } = useParams<{ id: string }>();
        const {
            selectedPeserta,
            isLoading,
            isSaving,
            error,
            currentStep,
            formData,
            lastVisitDate,
            isPreFilled,
            isEditing,
            handleFormChange,
            handleSkriningTbcChange,
            handleMentalChange,
            handlePumaChange,
            handleAdlChange,
            handleNext,
            handlePrev,
            handleSubmit,
            handleBack,
            handleReset,
            handleStartEditing,
        } = usePemeriksaanForm(id);

        // Dynamic page title
        useDocumentTitle(selectedPeserta ? `Pemeriksaan: ${selectedPeserta.nama}` : 'Pemeriksaan');

        if (isLoading) {
            return <PemeriksaanAddSkeleton />;
        }

        if (isSaving) {
            return <FullPageLoading message="Menyimpan hasil pemeriksaan..." />;
        }

        if (error || !selectedPeserta) {
            return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
                        <p className="text-gray-600 mb-8 max-w-sm mx-auto">{error || 'Peserta tidak ditemukan.'}</p>
                        <button onClick={handleBack} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                            Kembali ke Daftar
                        </button>
                    </div>
                </div>
            );
        }

        const renderStepContent = () => {
            switch (currentStep) {
                case 1: return <Step1Verifikasi peserta={selectedPeserta} />;
                case 2: return (
                    <Step2Pemeriksaan 
                        peserta={selectedPeserta} 
                        formData={formData} 
                        onChange={handleFormChange}
                        onSkriningTbcChange={handleSkriningTbcChange}
                        onMentalChange={handleMentalChange}
                        onPumaChange={handlePumaChange}
                        onAdlChange={handleAdlChange}
                        readOnly={isPreFilled && !isEditing}
                    />
                );
                case 3: return <Step3WaktuLokasi formData={formData} onChange={handleFormChange} />;
                case 4: return <Step4Konfirmasi peserta={selectedPeserta} formData={formData} />;
                default: return null;
            }
        };

        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Pemeriksaan {kategoriConfig[selectedPeserta.kategori].label}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-gray-500">{selectedPeserta.nama}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-400">{selectedPeserta.nik}</span>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400">
                        <Link to="/dashboard" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                            <Home className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link to="/dashboard/examinations" className="text-gray-500 hover:text-gray-700 transition-colors">Pemeriksaan</Link>

                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900">Catat Pemeriksaan</span>
                    </nav>
                </div>

                <StepIndicator steps={steps} currentStep={currentStep} />

                <div className=" bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                {currentStep === 1 && 'Verifikasi Data Peserta'}
                                {currentStep === 2 && 'Hasil Medis Pemeriksaan'}
                                {currentStep === 3 && 'Data Kunjungan'}
                                {currentStep === 4 && 'Konfirmasi & Simpan'}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {currentStep === 1 && 'Pastikan data identitas peserta sudah sesuai'}
                                {currentStep === 2 && 'Lengkapi hasil pemeriksaan kesehatan sesuai kategori'}
                                {currentStep === 3 && 'Tentukan waktu, lokasi, dan status rujukan'}
                                {currentStep === 4 && 'Periksa kembali semua data sebelum disimpan ke sistem'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {currentStep === 2 && isPreFilled && lastVisitDate && (
                                <div className="inline-flex border border-amber-100 items-center gap-1.5 px-3 h-9 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
                                    <History className="w-3.5 h-3.5" />
                                    <span>Terakhir, {new Date(lastVisitDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                            )}
                            {currentStep === 2 && isPreFilled && !isEditing && (
                                <button
                                    type="button"
                                    onClick={handleStartEditing}
                                    title="Perbarui Data"
                                    className="inline-flex items-center justify-center w-9 h-8 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                            {currentStep === 2 && isEditing && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    title="Reset Form"
                                    className="inline-flex items-center justify-center w-9 h-9 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="p-6">
                        {renderStepContent()}
                    </div>
                </div>

                <div className="mt-6">
                    <PemeriksaanWizardFooter
                        currentStep={currentStep}
                        isSaving={isSaving}
                        onBack={handlePrev}
                        onNext={handleNext}
                        onSubmit={handleSubmit}
                        onCancel={handleBack}
                    />
                </div>
            </div>
        );
    }
