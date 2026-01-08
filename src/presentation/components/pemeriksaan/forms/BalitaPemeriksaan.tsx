import { Stethoscope, ClipboardCheck, Heart, BookOpen } from 'lucide-react';
import { FormCard, FormInput, FormSelect, TagSelector, YesNoToggle } from '../../common/form';
import { skriningTbcOptions, kesimpulanBbOptions, balitaMendapatkanOptions, edukasiKonselingOptions } from '@/domain/entities/Pemeriksaan';
import type { PemeriksaanFormData } from '@/presentation/hooks/usePemeriksaanForm';

interface BalitaPemeriksaanProps {
    formData: PemeriksaanFormData;
    onChange: (field: keyof PemeriksaanFormData, value: any) => void;
    onSkriningTbcChange: (tags: string[]) => void;
}

export function BalitaPemeriksaan({ formData, onChange, onSkriningTbcChange }: BalitaPemeriksaanProps) {
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
                        label="Umur (bulan)"
                        value={formData.umur_bulan}
                        onChange={(v: string) => onChange('umur_bulan', v.replace(/\D/g, ''))}
                        placeholder="Contoh: 24"
                    />
                    <FormInput
                        label="Berat Badan (kg)"
                        value={formData.berat_badan}
                        onChange={(v: string) => onChange('berat_badan', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 12.5"
                    />
                    <FormSelect
                        label="Kesimpulan Berat Badan"
                        value={formData.kesimpulan_bb}
                        onChange={(v: string) => onChange('kesimpulan_bb', v)}
                        options={kesimpulanBbOptions}
                    />
                    <FormInput
                        label="Panjang Badan (cm)"
                        value={formData.panjang_badan}
                        onChange={(v: string) => onChange('panjang_badan', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 85.5"
                    />
                    <FormInput
                        label="Lingkar Kepala (cm)"
                        value={formData.lingkar_kepala}
                        onChange={(v: string) => onChange('lingkar_kepala', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 45"
                    />
                    <FormInput
                        label="Lingkar Lengan (cm)"
                        value={formData.lingkar_lengan}
                        onChange={(v: string) => onChange('lingkar_lengan', v.replace(/[^\d.]/g, ''))}
                        placeholder="Contoh: 14.5"
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
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <YesNoToggle 
                        label="Ada Gejala Sakit?" 
                        value={formData.ada_gejala_sakit} 
                        onChange={(v: boolean | null) => onChange('ada_gejala_sakit', v)} 
                    />
                </div>
            </FormCard>

            {/* Card 3: Layanan */}
            <FormCard
                title="Layanan"
                icon={<Heart className="w-5 h-5 text-green-600" />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
            >
                <TagSelector
                    label="Balita Mendapatkan"
                    selectedTags={formData.balita_mendapatkan}
                    options={[...balitaMendapatkanOptions]}
                    onChange={(tags: string[]) => onChange('balita_mendapatkan', tags)}
                />
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
                    selectedTags={formData.edukasi_konseling}
                    options={[...edukasiKonselingOptions]}
                    onChange={(tags: string[]) => onChange('edukasi_konseling', tags)}
                />
            </FormCard>
        </div>
    );
}
