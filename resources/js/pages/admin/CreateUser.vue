<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { KeyRound, Loader, ShieldAlert, UserPlus } from '@lucide/vue';
import { toast } from 'vue-sonner';
import AlertError from '@/components/AlertError.vue';
import Heading from '@/components/Heading.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useGeneratePassword } from '@/composables/useGeneratePassword';
import { dashboard } from '@/routes';
import { index as usersIndex, store } from '@/routes/users';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Manajemen Pengguna', href: usersIndex() },
            { title: 'Tambah Kader', href: '/users/create' },
        ],
    },
});

const { generate: generatePassword } = useGeneratePassword();

const onSuccess = () => {
    const pageProps = usePage().props as Record<string, any>;
    const flashMessage = pageProps.flash?.success;

    toast.success(flashMessage ?? 'Akun kader baru berhasil dibuat.');
};
</script>

<template>
    <Head title="Tambah Kader Baru" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <Heading
            title="Tambah Kader Baru"
            description="Tambahkan data akun kader posyandu baru ke dalam sistem"
        />

        <Form
            novalidate
            v-bind="store.form()"
            v-slot="{ errors, processing }"
            @success="onSuccess"
        >
            <div class="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
                <Card
                    class="gap-0 border-border/80 bg-card py-0 shadow-xs lg:col-span-2"
                >
                    <CardHeader
                        class="gap-0 border-b border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                    >
                        <CardTitle class="text-sm font-medium">
                            Data Kader Baru
                        </CardTitle>
                    </CardHeader>

                    <CardContent class="space-y-4 p-4 sm:p-5">
                        <AlertError
                            v-if="
                                errors.name ||
                                errors.role ||
                                errors.email ||
                                errors.password ||
                                errors.password_confirmation
                            "
                            :errors="
                                [
                                    errors.name,
                                    errors.role,
                                    errors.email,
                                    errors.password,
                                    errors.password_confirmation,
                                ].filter(Boolean) as string[]
                            "
                            title="Kesalahan Data Kader"
                        />

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div class="space-y-2">
                                <Label
                                    for="name"
                                    class="text-xs font-medium text-foreground/90"
                                >
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="contoh: Ani Suryani, S.Keb"
                                    autocomplete="name"
                                    autofocus
                                    required
                                    class="h-10 text-sm sm:h-9.5"
                                    :aria-invalid="!!errors.name"
                                />
                            </div>

                            <div class="space-y-2">
                                <Label
                                    for="nik"
                                    class="text-xs font-medium text-foreground/90"
                                >
                                    NIK (Nomor Induk Kependudukan)
                                </Label>
                                <Input
                                    id="nik"
                                    type="text"
                                    name="nik"
                                    inputmode="numeric"
                                    maxlength="16"
                                    placeholder="Masukkan 16 digit NIK"
                                    class="h-10 font-mono text-sm placeholder:font-sans sm:h-9.5"
                                />
                            </div>

                            <div class="space-y-2">
                                <Label
                                    for="role"
                                    class="text-xs font-medium text-foreground/90"
                                >
                                    Peran
                                </Label>
                                <Select name="role">
                                    <SelectTrigger
                                        id="role"
                                        class="h-10 w-full text-sm sm:h-9.5"
                                        :aria-invalid="!!errors.role"
                                    >
                                        <SelectValue
                                            placeholder="Pilih peran"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kader">
                                            Kader Posyandu
                                        </SelectItem>
                                        <SelectItem value="administrator">
                                            Administrator
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="space-y-2">
                                <Label
                                    for="email"
                                    class="text-xs font-medium text-foreground/90"
                                >
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="contoh: ani.suryani@posyandu.id"
                                    autocomplete="email"
                                    required
                                    class="h-10 text-sm sm:h-9.5"
                                    :aria-invalid="!!errors.email"
                                />
                            </div>

                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <Label
                                        for="password"
                                        class="text-xs font-medium text-foreground/90"
                                    >
                                        Kata Sandi
                                    </Label>
                                    <button
                                        type="button"
                                        class="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 transition-colors hover:text-indigo-400"
                                        @click="generatePassword"
                                    >
                                        <KeyRound class="h-3 w-3" />
                                        Buat Kata Sandi
                                    </button>
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="Minimal 8 karakter"
                                    autocomplete="new-password"
                                    required
                                    class="h-10 text-sm sm:h-9.5"
                                    :aria-invalid="!!errors.password"
                                />
                            </div>

                            <div class="space-y-2">
                                <Label
                                    for="password_confirmation"
                                    class="text-xs font-medium text-foreground/90"
                                >
                                    Konfirmasi Kata Sandi
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi di atas"
                                    autocomplete="new-password"
                                    required
                                    class="h-10 text-sm sm:h-9.5"
                                    :aria-invalid="
                                        !!errors.password_confirmation
                                    "
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter
                        class="flex items-center justify-end gap-3 border-t border-border px-4 py-4 sm:px-5 [.border-t]:pt-4"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            class="h-9"
                            as-child
                        >
                            <Link :href="usersIndex()">Batal</Link>
                        </Button>
                        <Button
                            type="submit"
                            variant="metalic"
                            class="h-9 gap-2 disabled:cursor-not-allowed"
                            :disabled="processing"
                        >
                            <Loader
                                v-if="processing"
                                class="h-4 w-4 animate-spin"
                            />
                            <UserPlus v-else class="h-4 w-4" />
                            Simpan Data
                        </Button>
                    </CardFooter>
                </Card>

                <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                    <CardHeader
                        class="gap-0 border-b border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                    >
                        <CardTitle
                            class="flex items-center gap-2 text-sm font-medium text-foreground"
                        >
                            <ShieldAlert class="size-4 text-indigo-500" />
                            Panduan Penting
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="p-4 sm:p-5">
                        <ol class="space-y-3">
                            <li
                                class="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5 sm:p-3"
                            >
                                <span
                                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-xs font-semibold text-foreground"
                                >
                                    1
                                </span>
                                <div class="space-y-0.5 text-xs">
                                    <p class="font-medium text-foreground">
                                        Pengisian Kredensial
                                    </p>
                                    <p class="text-muted-foreground">
                                        Isi nama lengkap, email, NIK (opsional),
                                        dan kata sandi kader baru.
                                    </p>
                                </div>
                            </li>
                            <li
                                class="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5 sm:p-3"
                            >
                                <span
                                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-xs font-semibold text-foreground"
                                >
                                    2
                                </span>
                                <div class="space-y-0.5 text-xs">
                                    <p class="font-medium text-foreground">
                                        Penyampaian Akun
                                    </p>
                                    <p class="text-muted-foreground">
                                        Catat dan sampaikan email & kata sandi
                                        kepada kader secara aman.
                                    </p>
                                </div>
                            </li>
                            <li
                                class="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5 sm:p-3"
                            >
                                <span
                                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-xs font-semibold text-foreground"
                                >
                                    3
                                </span>
                                <div class="space-y-0.5 text-xs">
                                    <p class="font-medium text-foreground">
                                        Verifikasi Token
                                    </p>
                                    <p class="text-muted-foreground">
                                        Terbitkan 6-digit token verifikasi via
                                        menu
                                        <strong class="text-foreground"
                                            >Kelola Token</strong
                                        >
                                        untuk aktivasi.
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </Form>
    </div>
</template>
