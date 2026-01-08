import { Stethoscope, ClipboardCheck, Heart, BookOpen } from 'lucide-react';
import { FormCard, FormInput, FormSelect, TagSelector, YesNoToggle } from '../../common/form';
import { 
    skriningTbcOptions, 
    riwayatDiriOptions, 
    imtOptions, 
    statusPerkawinanOptions,
    tesMataTelingaOptions,
    alatKontrasepsiOptions,
    edukasiProduktifOptions,
    adlPengendalianBabOptions,
    adlPengendalianBakOptions,
    adlKebersihanDiriOptions,
    adlPenggunaanWcOptions,
    adlMakanMinumOptions,
    adlMobilitasOptions,
    adlBerjalanOptions,
    adlNaikTurunTanggaOptions
} from '@/domain/entities/Pemeriksaan';
import type { PemeriksaanFormData } from '@/presentation/hooks/usePemeriksaanForm';

interface DewasaPemeriksaanProps {
    formData: PemeriksaanFormData;
    onChange: (field: keyof PemeriksaanFormData, value: any) => void;
    onSkriningTbcChange: (tags: string[]) => void;
    onPumaChange: (key: string, value: boolean | null) => void;
    onAdlChange: (key: string, value: number) => void;
    isLansia: boolean;
    isPerempuan: boolean;
}

export function DewasaPemeriksaan({ 
    formData, 
    onChange, 
    onSkriningTbcChange, 
    onPumaChange,
    onAdlChange,
    isLansia,
    isPerempuan 
}: DewasaPemeriksaanProps) {
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
                    />
                    <FormInput 
                        label="Berat Badan (kg)" 
                        value={formData.berat_badan} 
                        onChange={(v: string) => onChange('berat_badan', v.replace(/[^\d.]/g, ''))} 
                        placeholder="Contoh: 55" 
                    />
                    <FormSelect 
                        label="IMT" 
                        value={formData.imt} 
                        onChange={(v: string) => onChange('imt', v)} 
                        options={imtOptions} 
                    />
                    <FormInput 
                        label="Lingkar Perut (cm)" 
                        value={formData.lingkar_perut} 
                        onChange={(v: string) => onChange('lingkar_perut', v.replace(/[^\d.]/g, ''))} 
                        placeholder="Contoh: 85" 
                    />
                    <FormInput 
                        label="Tekanan Darah (mmHg)" 
                        value={formData.tekanan_darah} 
                        onChange={(v: string) => onChange('tekanan_darah', v)} 
                        placeholder="Contoh: 120/80" 
                    />
                    <FormInput 
                        label="Gula Darah (mg/dL)" 
                        value={formData.gula_darah} 
                        onChange={(v: string) => onChange('gula_darah', v.replace(/[^\d.]/g, ''))} 
                        placeholder="Contoh: 100" 
                    />
                    <FormInput 
                        label="Asam Urat (mg/dL)" 
                        value={formData.asam_urat} 
                        onChange={(v: string) => onChange('asam_urat', v.replace(/[^\d.]/g, ''))} 
                        placeholder="Contoh: 5.5" 
                    />
                    <FormInput 
                        label="Kolesterol (mg/dL)" 
                        value={formData.kolesterol} 
                        onChange={(v: string) => onChange('kolesterol', v.replace(/[^\d.]/g, ''))} 
                        placeholder="Contoh: 180" 
                    />
                    <FormSelect 
                        label="Tes Mata" 
                        value={formData.tes_mata} 
                        onChange={(v: string) => onChange('tes_mata', v)} 
                        options={tesMataTelingaOptions} 
                    />
                    <FormSelect 
                        label="Tes Telinga" 
                        value={formData.tes_telinga} 
                        onChange={(v: string) => onChange('tes_telinga', v)} 
                        options={tesMataTelingaOptions} 
                    />
                    <FormSelect
                        label="Status Perkawinan"
                        value={formData.status_perkawinan}
                        onChange={(v: string) => onChange('status_perkawinan', v)}
                        options={statusPerkawinanOptions}
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
                />

                {/* PUMA untuk Produktif */}
                {!isLansia && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Skrining PUMA (PPOK)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <YesNoToggle label="Sering napas pendek?" value={formData.skrining_puma?.napasPendek} onChange={(v: boolean | null) => onPumaChange('napasPendek', v)} />
                            <YesNoToggle label="Sering berdahak saat tidak flu?" value={formData.skrining_puma?.dahakSaatTidakFlu} onChange={(v: boolean | null) => onPumaChange('dahakSaatTidakFlu', v)} />
                            <YesNoToggle label="Sering batuk saat tidak flu?" value={formData.skrining_puma?.batukSaatTidakFlu} onChange={(v: boolean | null) => onPumaChange('batukSaatTidakFlu', v)} />
                            <YesNoToggle label="Sudah tes spirometri?" value={formData.skrining_puma?.tesSpirometri} onChange={(v: boolean | null) => onPumaChange('tesSpirometri', v)} />
                        </div>
                        <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase font-bold text-rose-600 tracking-wider">Total Skor PUMA</p>
                                    <p className="text-2xl font-black text-rose-800">{formData.jumlah_skor_puma || 0}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs uppercase font-bold text-rose-600 tracking-wider">Status</p>
                                    <p className="text-lg font-bold text-rose-800">{formData.jumlah_skor_puma >= 2 ? 'Perlu Rujuk' : 'Normal'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ADL untuk Lansia */}
                {isLansia && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">ADL - Indeks Barthel</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormSelect label="Pengendalian BAB" value={String(formData.adl?.pengendalianBab ?? '')} onChange={(v) => onAdlChange('pengendalianBab', parseInt(v) || 0)} options={adlPengendalianBabOptions} />
                            <FormSelect label="Pengendalian BAK" value={String(formData.adl?.pengendalianBak ?? '')} onChange={(v) => onAdlChange('pengendalianBak', parseInt(v) || 0)} options={adlPengendalianBakOptions} />
                            <FormSelect label="Kebersihan Diri" value={String(formData.adl?.kebersihanDiri ?? '')} onChange={(v) => onAdlChange('kebersihanDiri', parseInt(v) || 0)} options={adlKebersihanDiriOptions} />
                            <FormSelect label="Penggunaan WC" value={String(formData.adl?.penggunaanWc ?? '')} onChange={(v) => onAdlChange('penggunaanWc', parseInt(v) || 0)} options={adlPenggunaanWcOptions} />
                            <FormSelect label="Makan & Minum" value={String(formData.adl?.makanMinum ?? '')} onChange={(v) => onAdlChange('makanMinum', parseInt(v) || 0)} options={adlMakanMinumOptions} />
                            <FormSelect label="Mobilitas" value={String(formData.adl?.mobilitas ?? '')} onChange={(v) => onAdlChange('mobilitas', parseInt(v) || 0)} options={adlMobilitasOptions} />
                            <FormSelect label="Berjalan Tempat Rata" value={String(formData.adl?.berjalanTempatRata ?? '')} onChange={(v) => onAdlChange('berjalanTempatRata', parseInt(v) || 0)} options={adlBerjalanOptions} />
                            <FormSelect label="Naik/Turun Tangga" value={String(formData.adl?.naikTurunTangga ?? '')} onChange={(v) => onAdlChange('naikTurunTangga', parseInt(v) || 0)} options={adlNaikTurunTanggaOptions} />
                        </div>
                        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase font-bold text-amber-600 tracking-wider">Total Skor ADL</p>
                                    <p className="text-2xl font-black text-amber-800">{formData.jumlah_skor_adl || 0}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs uppercase font-bold text-amber-600 tracking-wider">Tingkat Kemandirian</p>
                                    <p className="text-lg font-bold text-amber-800 capitalize">{formData.tingkat_kemandirian || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </FormCard>

            {/* Card 3: Layanan */}
            <FormCard
                title="Layanan"
                icon={<Heart className="w-5 h-5 text-green-600" />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
            >
                <TagSelector
                    label="Riwayat Penyakit Diri"
                    selectedTags={formData.riwayat_diri}
                    options={[...riwayatDiriOptions]}
                    onChange={(tags: string[]) => {
                        const hasNotAda = tags.includes('Tidak Ada');
                        const prevHadNotAda = formData.riwayat_diri.includes('Tidak Ada');
                        if (hasNotAda && !prevHadNotAda) {
                            onChange('riwayat_diri', ['Tidak Ada']);
                        } else if (hasNotAda && prevHadNotAda && tags.length > 1) {
                            onChange('riwayat_diri', tags.filter(t => t !== 'Tidak Ada'));
                        } else {
                            onChange('riwayat_diri', tags);
                        }
                    }}
                />

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Gaya Hidup</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <YesNoToggle label="Merokok?" value={formData.merokok} onChange={(v: boolean | null) => onChange('merokok', v)} />
                        <YesNoToggle label="Konsumsi Gula >4 sdm/hari?" value={formData.konsumsi_gula} onChange={(v: boolean | null) => onChange('konsumsi_gula', v)} />
                        <YesNoToggle label="Konsumsi Garam >1 sdt/hari?" value={formData.konsumsi_garam} onChange={(v: boolean | null) => onChange('konsumsi_garam', v)} />
                        <YesNoToggle label="Konsumsi Lemak >5 sdm/hari?" value={formData.konsumsi_lemak} onChange={(v: boolean | null) => onChange('konsumsi_lemak', v)} />
                    </div>
                </div>

                {!isLansia && isPerempuan && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <FormSelect 
                            label="Alat Kontrasepsi" 
                            value={formData.alat_kontrasepsi} 
                            onChange={(v) => onChange('alat_kontrasepsi', v)} 
                            options={[{ value: '', label: 'Pilih...' }, ...alatKontrasepsiOptions]} 
                        />
                    </div>
                )}
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
                    options={[...edukasiProduktifOptions]} 
                    onChange={(tags: string[]) => onChange('edukasi', tags)} 
                />
            </FormCard>
        </div>
    );
}
