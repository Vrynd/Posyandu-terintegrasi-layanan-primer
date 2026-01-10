import { Stethoscope, ClipboardCheck, Heart, BookOpen } from 'lucide-react';
import { FormCard, FormInput, TagSelector, YesNoToggle } from '../../common/form';
import { skriningTbcOptions, penyuluhanBumilOptions } from '@/domain/entities/Pemeriksaan';
import type { PemeriksaanFormData } from '@/presentation/hooks/usePemeriksaanForm';

interface BumilPemeriksaanProps {
    formData: PemeriksaanFormData;
    onChange: (field: keyof PemeriksaanFormData, value: any) => void;
    onSkriningTbcChange: (tags: string[]) => void;
    readOnly?: boolean;
}

export function BumilPemeriksaan({ formData, onChange, onSkriningTbcChange, readOnly = false }: BumilPemeriksaanProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Card 1: Pemeriksaan Fisik */}
            <FormCard
                title="Pemeriksaan Fisik"
                icon={<Stethoscope className="w-5 h-5 text-blue-600" />}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormInput
                        label="Hamil Anak Ke"
                        value={formData.hamil_anak_ke}
                        onChange={(v: string) => onChange('hamil_anak_ke', v.replace(/\D/g, ''))}
                        placeholder="Contoh: 2"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="Jarak Anak Sebelumnya"
                        value={formData.jarak_anak}
                        onChange={(v: string) => onChange('jarak_anak', v)}
                        placeholder="Contoh: 3 tahun"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="BB Sebelum Hamil (kg)"
                        value={formData.bb_sebelum_hamil}
                        onChange={(v: string) => onChange('bb_sebelum_hamil', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 55"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="Tinggi Badan (cm)"
                        value={formData.tinggi_badan}
                        onChange={(v: string) => onChange('tinggi_badan', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 160"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="Umur Kehamilan (minggu)"
                        value={formData.umur_kehamilan}
                        onChange={(v: string) => onChange('umur_kehamilan', v.replace(/\D/g, ''))}
                        placeholder="Contoh: 12"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="Berat Badan (kg)"
                        value={formData.berat_badan}
                        onChange={(v: string) => onChange('berat_badan', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 60.5"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="LILA (cm)"
                        value={formData.lila}
                        onChange={(v: string) => onChange('lila', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 25.5"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="Tekanan Darah (mmHg)"
                        value={formData.tekanan_darah}
                        onChange={(v: string) => onChange('tekanan_darah', v)}
                        placeholder="Contoh: 120/80"
                        disabled={readOnly}
                    />
                </div>
            </FormCard>

            {/* Card 2: Skrining */}
            <FormCard
                title="Skrining"
                icon={<ClipboardCheck className="w-5 h-5 text-orange-600" />}
                iconBgColor="bg-orange-100"
                iconColor="text-orange-600"
            >
                <TagSelector
                    label="Skrining TBC"
                    selectedTags={formData.skrining_tbc}
                    options={[...skriningTbcOptions]}
                    onChange={onSkriningTbcChange}
                    disabled={readOnly}
                />
            </FormCard>

            {/* Card 3: Layanan */}
            <FormCard
                title="Layanan"
                icon={<Heart className="w-5 h-5 text-green-600" />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <YesNoToggle 
                        label="Mendapat Tablet Tambah Darah?" 
                        value={formData.tablet_darah} 
                        onChange={(v: boolean | null) => onChange('tablet_darah', v)}
                        disabled={readOnly}
                    />
                    <YesNoToggle 
                        label="Konseling ASI Eksklusif?" 
                        value={formData.asi_eksklusif} 
                        onChange={(v: boolean | null) => onChange('asi_eksklusif', v)}
                        disabled={readOnly}
                    />
                    <YesNoToggle 
                        label="MT Bumil KEK?" 
                        value={formData.mt_bumil_kek} 
                        onChange={(v: boolean | null) => onChange('mt_bumil_kek', v)}
                        disabled={readOnly}
                    />
                    <YesNoToggle 
                        label="Ikut Kelas Bumil?" 
                        value={formData.kelas_bumil} 
                        onChange={(v: boolean | null) => onChange('kelas_bumil', v)}
                        disabled={readOnly}
                    />
                </div>
            </FormCard>

            {/* Card 4: Edukasi & Rujukan */}
            <FormCard
                title="Edukasi & Rujukan"
                icon={<BookOpen className="w-5 h-5 text-purple-600" />}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
            >
                <TagSelector
                    label="Materi Penyuluhan"
                    selectedTags={formData.penyuluhan}
                    options={[...penyuluhanBumilOptions]}
                    onChange={(tags: string[]) => onChange('penyuluhan', tags)}
                    disabled={readOnly}
                />
            </FormCard>
        </div>
    );
}
