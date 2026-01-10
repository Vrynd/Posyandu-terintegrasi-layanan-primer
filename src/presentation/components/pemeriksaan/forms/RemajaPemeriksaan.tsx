import { Stethoscope, ClipboardCheck, Heart, BookOpen } from 'lucide-react';
import { FormCard, FormInput, FormSelect, TagSelector, YesNoToggle } from '../../common/form';
import { 
    skriningTbcOptions, 
    riwayatKeluargaOptions, 
    perilakuBerisikoOptions, 
    imtOptions, 
    kadarHbOptions, 
    edukasiRemajaOptions 
} from '@/domain/entities/Pemeriksaan';
import type { PemeriksaanFormData } from '@/presentation/hooks/usePemeriksaanForm';

interface RemajaPemeriksaanProps {
    formData: PemeriksaanFormData;
    onChange: (field: keyof PemeriksaanFormData, value: any) => void;
    onSkriningTbcChange: (tags: string[]) => void;
    onMentalChange: (key: string, value: boolean | null) => void;
    isPerempuan: boolean;
    readOnly?: boolean;
}

const skriningMentalQuestions = [
    { key: 'nyamanDirumah', label: 'Merasa nyaman di rumah?' },
    { key: 'bebanSekolah', label: 'Terbebani tugas sekolah?' },
    { key: 'sukaTubuh', label: 'Menyukai bentuk tubuh?' },
    { key: 'temanDiluarGrup', label: 'Punya teman diluar grup?' },
    { key: 'konsumsiRokokAlkoholNarkoba', label: 'Konsumsi rokok/alkohol/narkoba?' },
    { key: 'hubunganSeksual', label: 'Pernah hubungan seksual?' },
    { key: 'tidakAmanLingkungan', label: 'Merasa tidak aman?' },
    { key: 'inginBunuhDiri', label: 'Keinginan bunuh diri?' },
];

export function RemajaPemeriksaan({ 
    formData, 
    onChange, 
    onSkriningTbcChange, 
    onMentalChange,
    isPerempuan,
    readOnly = false
}: RemajaPemeriksaanProps) {
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
                        label="Tinggi Badan (cm)"
                        value={formData.tinggi_badan}
                        onChange={(v: string) => onChange('tinggi_badan', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 165"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="Berat Badan (kg)"
                        value={formData.berat_badan}
                        onChange={(v: string) => onChange('berat_badan', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 55"
                        disabled={readOnly}
                    />
                    <FormSelect
                        label="IMT"
                        value={formData.imt}
                        onChange={(v: string) => onChange('imt', v)}
                        options={imtOptions}
                        disabled={readOnly}
                    />
                    <FormInput
                        label="Lingkar Perut (cm)"
                        value={formData.lingkar_perut}
                        onChange={(v: string) => onChange('lingkar_perut', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 75"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="Tekanan Darah (mmHg)"
                        value={formData.tekanan_darah}
                        onChange={(v: string) => onChange('tekanan_darah', v)}
                        placeholder="Contoh: 120/80"
                        disabled={readOnly}
                    />
                    <FormInput
                        label="Gula Darah (mg/dL)"
                        value={formData.gula_darah}
                        onChange={(v: string) => onChange('gula_darah', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 100"
                        disabled={readOnly}
                    />
                    {isPerempuan && (
                        <FormSelect
                            label="Kadar HB"
                            value={formData.kadar_hb}
                            onChange={(v: string) => onChange('kadar_hb', v)}
                            options={kadarHbOptions}
                            disabled={readOnly}
                        />
                    )}
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
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Skrining Mental (HEEADSSS)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skriningMentalQuestions.map((q) => (
                            <YesNoToggle
                                key={q.key}
                                label={q.label}
                                value={formData.skrining_mental[q.key as keyof typeof formData.skrining_mental]}
                                onChange={(v: boolean | null) => onMentalChange(q.key, v)}
                                disabled={readOnly}
                            />
                        ))}
                    </div>
                </div>
            </FormCard>

            {/* Card 3: Layanan */}
            <FormCard
                title="Layanan"
                icon={<Heart className="w-5 h-5 text-green-600" />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
            >
                <div className="space-y-6">
                    <TagSelector
                        label="Riwayat Penyakit Keluarga"
                        selectedTags={formData.riwayat_keluarga}
                        options={[...riwayatKeluargaOptions]}
                        onChange={(tags: string[]) => {
                            const hasNotAda = tags.includes('Tidak Ada');
                            const prevHadNotAda = formData.riwayat_keluarga.includes('Tidak Ada');
                            if (hasNotAda && !prevHadNotAda) {
                                onChange('riwayat_keluarga', ['Tidak Ada']);
                            } else if (hasNotAda && prevHadNotAda && tags.length > 1) {
                                onChange('riwayat_keluarga', tags.filter(t => t !== 'Tidak Ada'));
                            } else {
                                onChange('riwayat_keluarga', tags);
                            }
                        }}
                        disabled={readOnly}
                    />
                    
                    <TagSelector
                        label="Perilaku Berisiko"
                        selectedTags={formData.perilaku_berisiko}
                        options={[...perilakuBerisikoOptions]}
                        onChange={(tags: string[]) => {
                            const hasNotAda = tags.includes('Tidak Ada');
                            const prevHadNotAda = formData.perilaku_berisiko.includes('Tidak Ada');
                            if (hasNotAda && !prevHadNotAda) {
                                onChange('perilaku_berisiko', ['Tidak Ada']);
                            } else if (hasNotAda && prevHadNotAda && tags.length > 1) {
                                onChange('perilaku_berisiko', tags.filter(t => t !== 'Tidak Ada'));
                            } else {
                                onChange('perilaku_berisiko', tags);
                            }
                        }}
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
                    label="Edukasi yang Diberikan"
                    selectedTags={formData.edukasi}
                    options={[...edukasiRemajaOptions]}
                    onChange={(tags: string[]) => onChange('edukasi', tags)}
                    disabled={readOnly}
                />
            </FormCard>
        </div>
    );
}
