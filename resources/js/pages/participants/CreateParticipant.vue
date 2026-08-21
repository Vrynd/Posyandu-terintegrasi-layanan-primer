<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { watch } from 'vue';
import CategorySelector from '@/components/CategorySelector.vue';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pendaftaran Peserta', href: '/participants' },
            { title: 'Tambah Peserta', href: '/participants/create' },
        ],
    },
});

defineProps<{
    category: Array<{ label: string; value: string }>;
    gender: Array<{ label: string; value: string }>;
    membershipBpjs: Array<{ label: string; value: string }>;
    employment: Array<{ label: string; value: string }>;
    martialStatus: Array<{ label: string; value: string }>;
}>();

const form = useForm({
    category: '',
    name: '',
    nik: '',
    birth_date: '',
    gender: '',
    address: '',
    rt: '',
    rw: '',
    phone: '',
    has_bpjs: '',
    bpjs_number: '',
    parent_name: '',
    husband_name: '',
    employment: '',
    employment_other: '',
    marital_status: '',
});

watch(
    () => form.category,
    (newCategory, oldCategory) => {
        form.parent_name = '';
        form.husband_name = '';
        form.marital_status = '';
        form.employment = '';
        form.employment_other = '';

        if (newCategory === 'pregnant_mother') {
            form.gender = 'female';
        } else if (oldCategory === 'pregnant_mother') {
            form.gender = '';
        }
    },
);

const submit = () => {
    form.post('/participants', {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head title="Tambah Peserta Baru" />

    <main class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <header>
            <Heading
                title="Tambah Peserta Baru"
                description="Isi formulir berikut untuk mendaftarkan sasaran posyandu baru"
            />
        </header>

        <form @submit.prevent="submit" class="flex flex-1 flex-col gap-6">
            <!-- SECTION 01: PILIH KATEGORI PESERTA -->
            <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                <CardHeader
                    class="gap-0 border-b border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-muted/60 ring-1 ring-muted/80"
                        >
                            <span
                                class="font-mono text-xs font-bold text-muted-foreground tabular-nums"
                            >
                                01
                            </span>
                        </div>
                        <CardTitle class="font-display text-sm font-medium">
                            Pilih Kategori Peserta
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent class="space-y-4 p-4 sm:p-5">
                    <CategorySelector
                        v-model="form.category"
                        :options="category"
                        :error="form.errors.category"
                    />
                </CardContent>
            </Card>

            <!-- SECTION 02: DATA DIRI PESERTA (Termasuk BPJS) -->
            <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                <CardHeader
                    class="gap-0 border-b border-dashed border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                >
                    <div class="flex items-center gap-2.5">
                        <div
                            class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30"
                        >
                            <span
                                class="font-mono text-[10px] font-bold text-primary tabular-nums"
                            >
                                02
                            </span>
                        </div>
                        <CardTitle class="text-sm font-medium">
                            Data Diri Peserta
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent class="p-4 sm:p-5">
                    <div
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <!-- 1. Nama Lengkap -->
                        <div class="space-y-2">
                            <Label
                                for="name"
                                class="text-xs font-medium text-foreground/90"
                                >Nama Lengkap</Label
                            >
                            <Input
                                id="name"
                                v-model="form.name"
                                type="text"
                                placeholder="Nama lengkap peserta"
                                class="placeholder:text-muted-secondary h-10 text-sm sm:h-9.5"
                                :class="{
                                    'border-destructive': form.errors.name,
                                }"
                            />
                            <InputError :message="form.errors.name" />
                        </div>

                        <!-- 2. NIK -->
                        <div class="space-y-2">
                            <Label
                                for="nik"
                                class="text-xs font-medium text-foreground/90"
                                >Nomor Induk Kependudukan (NIK)</Label
                            >
                            <Input
                                id="nik"
                                v-model="form.nik"
                                inputmode="numeric"
                                type="text"
                                maxlength="16"
                                placeholder="16 digit angka"
                                class="h-10 text-sm sm:h-9.5"
                                @input="form.nik = form.nik.replace(/\D/g, '')"
                                :class="{
                                    'border-destructive': form.errors.nik,
                                }"
                            />
                            <InputError :message="form.errors.nik" />
                        </div>

                        <!-- 3. Tanggal Lahir -->
                        <div class="space-y-2">
                            <Label
                                for="birth_date"
                                class="text-xs font-medium text-foreground/90"
                                >Tanggal Lahir</Label
                            >
                            <Input
                                id="birth_date"
                                v-model="form.birth_date"
                                type="date"
                                :max="new Date().toISOString().split('T')[0]"
                                class="h-10 text-sm sm:h-9.5"
                                :class="[
                                    !form.birth_date
                                        ? 'text-muted-foreground'
                                        : 'text-foreground',
                                    'dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100',
                                    form.errors.birth_date
                                        ? 'border-destructive'
                                        : '',
                                ]"
                            />
                            <InputError :message="form.errors.birth_date" />
                        </div>

                        <!-- 4. Jenis Kelamin -->
                        <div class="space-y-2">
                            <Label
                                for="gender"
                                class="text-xs font-medium text-foreground/90"
                                >Jenis Kelamin</Label
                            >
                            <Select
                                v-model="form.gender"
                                :disabled="form.category === 'pregnant_mother'"
                            >
                                <SelectTrigger
                                    id="gender"
                                    class="h-10 w-full text-sm sm:h-9.5"
                                    :class="{
                                        'border-destructive':
                                            form.errors.gender,
                                    }"
                                >
                                    <SelectValue
                                        placeholder="Pilih jenis kelamin"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="g in gender"
                                        :key="g.value"
                                        :value="g.value"
                                    >
                                        {{ g.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.gender" />
                        </div>

                        <!-- 5. Status BPJS -->
                        <div class="space-y-2">
                            <Label
                                for="has_bpjs"
                                class="text-xs font-medium text-foreground/90"
                                >Memiliki BPJS</Label
                            >
                            <Select v-model="form.has_bpjs">
                                <SelectTrigger
                                    id="has_bpjs"
                                    class="h-10 w-full text-sm sm:h-9.5"
                                    :class="{
                                        'border-destructive':
                                            form.errors.has_bpjs,
                                    }"
                                >
                                    <SelectValue
                                        placeholder="Pilih status BPJS"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="opt in membershipBpjs"
                                        :key="opt.value"
                                        :value="opt.value"
                                    >
                                        {{ opt.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.has_bpjs" />
                        </div>

                        <!-- 6. Nomor BPJS (Muncul jika '1') -->
                        <div v-if="form.has_bpjs === '1'" class="space-y-2">
                            <Label
                                for="bpjs_number"
                                class="text-xs font-medium text-foreground/90"
                                >Nomor BPJS Kesehatan</Label
                            >
                            <Input
                                id="bpjs_number"
                                v-model="form.bpjs_number"
                                type="text"
                                inputmode="numeric"
                                maxlength="13"
                                placeholder="13 digit nomor kartu BPJS"
                                class="h-10 text-sm sm:h-9.5"
                                @input="
                                    form.bpjs_number = form.bpjs_number.replace(
                                        /\D/g,
                                        '',
                                    )
                                "
                                :class="{
                                    'border-destructive':
                                        form.errors.bpjs_number,
                                }"
                            />
                            <InputError :message="form.errors.bpjs_number" />
                        </div>

                        <!-- 7. FIELD DINAMIS: Balita & Remaja -> Nama Orang Tua -->
                        <div
                            v-if="
                                form.category === 'toddler' ||
                                form.category === 'teenager'
                            "
                            class="space-y-2"
                        >
                            <Label
                                for="parent_name"
                                class="text-xs font-medium text-foreground/90"
                                >Nama Orang Tua / Wali</Label
                            >
                            <Input
                                id="parent_name"
                                v-model="form.parent_name"
                                type="text"
                                placeholder="Nama ayah / ibu / wali"
                                class="h-10 text-sm sm:h-9.5"
                                :class="{
                                    'border-destructive':
                                        form.errors.parent_name,
                                }"
                            />
                            <InputError :message="form.errors.parent_name" />
                        </div>

                        <!-- 8. FIELD DINAMIS: Ibu Hamil -> Nama Suami -->
                        <div
                            v-if="form.category === 'pregnant_mother'"
                            class="space-y-2"
                        >
                            <Label
                                for="husband_name"
                                class="text-xs font-medium text-foreground/90"
                                >Nama Suami</Label
                            >
                            <Input
                                id="husband_name"
                                v-model="form.husband_name"
                                type="text"
                                placeholder="Nama suami"
                                class="h-10 text-sm sm:h-9.5"
                                :class="{
                                    'border-destructive':
                                        form.errors.husband_name,
                                }"
                            />
                            <InputError :message="form.errors.husband_name" />
                        </div>

                        <!-- 9. FIELD DINAMIS: Usia Produktif & Lansia -> Status Perkawinan -->
                        <div
                            v-if="
                                form.category === 'productive' ||
                                form.category === 'adult'
                            "
                            class="space-y-2"
                        >
                            <Label
                                for="marital_status"
                                class="text-xs font-medium text-foreground/90"
                                >Status Perkawinan</Label
                            >
                            <Select v-model="form.marital_status">
                                <SelectTrigger
                                    id="marital_status"
                                    class="h-10 w-full text-sm sm:h-9.5"
                                    :class="{
                                        'border-destructive':
                                            form.errors.marital_status,
                                    }"
                                >
                                    <SelectValue
                                        placeholder="Pilih status perkawinan"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="ms in martialStatus"
                                        :key="ms.value"
                                        :value="ms.value"
                                    >
                                        {{ ms.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.marital_status" />
                        </div>

                        <!-- 10. FIELD DINAMIS: Usia Produktif & Lansia -> Pekerjaan -->
                        <div
                            v-if="
                                form.category === 'productive' ||
                                form.category === 'adult'
                            "
                            class="space-y-2"
                        >
                            <Label
                                for="employment"
                                class="text-xs font-medium text-foreground/90"
                                >Pekerjaan</Label
                            >
                            <Select v-model="form.employment">
                                <SelectTrigger
                                    id="employment"
                                    class="h-10 w-full text-sm sm:h-9.5"
                                    :class="{
                                        'border-destructive':
                                            form.errors.employment,
                                    }"
                                >
                                    <SelectValue
                                        placeholder="Pilih jenis pekerjaan"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="emp in employment"
                                        :key="emp.value"
                                        :value="emp.value"
                                    >
                                        {{ emp.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.employment" />
                        </div>

                        <!-- 11. FIELD DINAMIS: Usia Produktif & Lansia -> Pekerjaan Lainnya -->
                        <div
                            v-if="
                                (form.category === 'productive' ||
                                    form.category === 'adult') &&
                                form.employment === 'other'
                            "
                            class="space-y-2"
                        >
                            <Label
                                for="employment_other"
                                class="text-xs font-medium text-foreground/90"
                                >Sebutkan Pekerjaan</Label
                            >
                            <Input
                                id="employment_other"
                                v-model="form.employment_other"
                                type="text"
                                placeholder="Contoh: Seniman, Penjahit, dll."
                                class="h-10 text-sm sm:h-9.5"
                                :class="{
                                    'border-destructive':
                                        form.errors.employment_other,
                                }"
                            />
                            <InputError
                                :message="form.errors.employment_other"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- SECTION 03: KONTAK DAN ALAMAT -->
            <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                <CardHeader
                    class="gap-0 border-b border-dashed border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                >
                    <div class="flex items-center gap-2.5">
                        <div
                            class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30"
                        >
                            <span
                                class="font-mono text-[10px] font-bold text-primary tabular-nums"
                            >
                                03
                            </span>
                        </div>
                        <CardTitle class="text-sm font-medium">
                            Kontak dan Alamat
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent class="p-4 sm:p-5">
                    <!-- Grid: 1 kolom di mobile, 2 di tablet, 3 di desktop -->
                    <div
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <!-- 1. Nomor HP / WhatsApp -->
                        <div class="space-y-2">
                            <Label
                                for="phone"
                                class="text-xs font-medium text-foreground/90"
                                >Nomor HP / WhatsApp</Label
                            >
                            <Input
                                id="phone"
                                v-model="form.phone"
                                type="tel"
                                inputmode="tel"
                                maxlength="15"
                                placeholder="Contoh: +6281234567890"
                                class="h-10 text-sm sm:h-9.5"
                                @input="
                                    form.phone = form.phone.replace(
                                        /[^\d+]/g,
                                        '',
                                    )
                                "
                                :class="{
                                    'border-destructive': form.errors.phone,
                                }"
                            />
                            <InputError :message="form.errors.phone" />
                        </div>

                        <!-- 2. RT -->
                        <div class="space-y-2">
                            <Label
                                for="rt"
                                class="text-xs font-medium text-foreground/90"
                                >RT</Label
                            >
                            <Input
                                id="rt"
                                v-model="form.rt"
                                type="text"
                                inputmode="numeric"
                                maxlength="5"
                                placeholder="Contoh: 01"
                                class="h-10 text-sm sm:h-9.5"
                                @input="form.rt = form.rt.replace(/\D/g, '')"
                                :class="{
                                    'border-destructive': form.errors.rt,
                                }"
                            />
                            <InputError :message="form.errors.rt" />
                        </div>

                        <!-- 3. RW -->
                        <div class="space-y-2">
                            <Label
                                for="rw"
                                class="text-xs font-medium text-foreground/90"
                                >RW</Label
                            >
                            <Input
                                id="rw"
                                v-model="form.rw"
                                inputmode="numeric"
                                type="text"
                                maxlength="5"
                                placeholder="Contoh: 02"
                                class="h-10 text-sm sm:h-9.5"
                                @input="form.rw = form.rw.replace(/\D/g, '')"
                                :class="{
                                    'border-destructive': form.errors.rw,
                                }"
                            />
                            <InputError :message="form.errors.rw" />
                        </div>

                        <!-- 4. Alamat Lengkap (Membentang Penuh 1 Baris) -->
                        <div class="space-y-2 sm:col-span-2 lg:col-span-3">
                            <Label
                                for="address"
                                class="text-xs font-medium text-foreground/90"
                                >Alamat Lengkap</Label
                            >
                            <textarea
                                id="address"
                                v-model="form.address"
                                rows="3"
                                placeholder="Nama jalan, nomor rumah, dusun, atau patokan tempat tinggal"
                                :class="[
                                    'w-full min-w-0 resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-xs placeholder:text-muted-foreground focus-visible:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
                                    form.errors.address
                                        ? 'border-destructive'
                                        : '',
                                ]"
                            ></textarea>
                            <InputError :message="form.errors.address" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- TOMBOL AKSI -->
            <div class="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" as-child>
                    <Link href="/participants">Batal</Link>
                </Button>
                <Button
                    type="submit"
                    :disabled="form.processing"
                    class="min-w-[140px] cursor-pointer font-medium"
                >
                    <span v-if="form.processing">Menyimpan...</span>
                    <span v-else>Simpan Peserta</span>
                </Button>
            </div>
        </form>
    </main>
</template>
