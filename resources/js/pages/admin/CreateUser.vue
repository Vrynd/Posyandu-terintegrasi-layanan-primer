<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { KeyRound, Loader, ShieldAlert, UserPlus } from '@lucide/vue';
import { toast } from 'vue-sonner';
import AlertError from '@/components/AlertError.vue';
import Heading from '@/components/Heading.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

const { generatedPassword, generate: generatePassword } = useGeneratePassword();

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
            v-bind="store.form()"
            v-slot="{ errors, processing }"
            @success="onSuccess"
        >
            <div
                class="mx-auto grid w-full grid-cols-1 gap-5 sm:max-w-4xl lg:grid-cols-2"
            >
                <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                    <CardHeader
                        class="gap-0 border-b border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                    >
                        <CardTitle class="text-sm font-medium">
                            Informasi Pribadi
                        </CardTitle>
                    </CardHeader>

                    <CardContent class="space-y-4 p-4 sm:p-5">
                        <AlertError
                            v-if="errors.name || errors.role"
                            :errors="
                                [errors.name, errors.role].filter(
                                    Boolean,
                                ) as string[]
                            "
                            title="Kesalahan Data Pribadi"
                        />

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
                                class="h-10 font-mono text-sm sm:h-9.5"
                            />
                        </div>

                        <div class="space-y-2">
                            <Label
                                for="role"
                                class="text-xs font-medium text-foreground/90"
                            >
                                Peran Pengguna
                            </Label>
                            <Select name="role" default-value="kader">
                                <SelectTrigger
                                    id="role"
                                    class="h-10 w-full text-sm sm:h-9.5"
                                    :aria-invalid="!!errors.role"
                                >
                                    <SelectValue
                                        placeholder="Pilih peran pengguna"
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
                    </CardContent>
                </Card>

                <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                    <CardHeader
                        class="gap-0 border-b border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                    >
                        <CardTitle class="text-sm font-medium">
                            Kredensial Akun
                        </CardTitle>
                    </CardHeader>

                    <CardContent class="space-y-4 p-4 sm:p-5">
                        <AlertError
                            v-if="
                                errors.email ||
                                errors.password ||
                                errors.password_confirmation
                            "
                            :errors="
                                [
                                    errors.email,
                                    errors.password,
                                    errors.password_confirmation,
                                ].filter(Boolean) as string[]
                            "
                            title="Kesalahan Kredensial Akun"
                        />

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
                                :aria-invalid="!!errors.password_confirmation"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card
                class="mx-auto mt-5 w-full gap-0 border-border/80 bg-card py-0 shadow-xs sm:max-w-4xl"
            >
                <CardContent class="space-y-3 px-4 py-4 sm:px-5">
                    <Alert
                        v-if="generatedPassword"
                        class="border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400"
                    >
                        <ShieldAlert class="size-4 text-indigo-500" />
                        <AlertDescription class="text-xs">
                            Kata sandi yang digenerate:
                            <span
                                class="ml-1 font-mono font-semibold tracking-wide"
                            >
                                {{ generatedPassword }}
                            </span>
                            <br />
                            Catat dan sampaikan kepada kader secara aman.
                        </AlertDescription>
                    </Alert>
                    <Alert class="border-amber-500/20 bg-amber-500/5">
                        <ShieldAlert class="size-4 text-amber-500" />
                        <AlertDescription
                            class="text-xs text-amber-700 dark:text-amber-400"
                        >
                            Akun yang dibuat akan langsung berstatus
                            <strong>Aktif</strong> dan siap digunakan untuk
                            login ke sistem. Pastikan menyampaikan kata sandi
                            kepada kader secara aman.
                        </AlertDescription>
                    </Alert>
                </CardContent>

                <CardFooter
                    class="flex items-center justify-end gap-3 border-t border-border px-4 py-3.5 sm:px-5 [.border-t]:pt-4"
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
                        Simpan Data Kader
                    </Button>
                </CardFooter>
            </Card>
        </Form>
    </div>
</template>
