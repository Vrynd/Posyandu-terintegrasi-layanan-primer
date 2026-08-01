<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import {
    ArrowLeft,
    Calendar,
    Clock,
    History,
    Loader,
    Lock,
    Pencil,
    ShieldCheck,
    User,
    UserCheck,
    UserX,
} from '@lucide/vue';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import AlertError from '@/components/AlertError.vue';
import Heading from '@/components/Heading.vue';
import ResetUserPassword from '@/components/ResetUserPassword.vue';
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
import { TileGroup, TileItem } from '@/components/ui/tile';
import UserAvatar from '@/components/UserAvatar.vue';
import { dashboard } from '@/routes';
import { update } from '@/routes/users';
import type { UserItem as UserType } from '@/types';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Manajemen Pengguna', href: '/users' },
            { title: 'Profil', href: '#' },
        ],
    },
});

interface Props {
    user?: UserType;
}

const props = defineProps<Props>();

const isEditing = ref(false);
const toggleEditing = () => {
    isEditing.value = !isEditing.value;
};

const submitSucces = () => {
    isEditing.value = false;
    const pageProps = usePage().props as Record<string, any>;
    const flashMessage = pageProps.flash?.success;
    toast.success(flashMessage ?? 'Data profil kader berhasil diperbarui.');
};
</script>

<template>
    <Head :title="`${props.user?.name ?? 'Pengguna'} - Manajemen Pengguna`" />

    <main class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <header class="mb-6 flex items-center justify-between sm:mb-8">
            <Heading
                :title="props.user?.name ?? 'Pengguna'"
                description="Kelola informasi akun, kata sandi, dan hak akses"
                variant="small"
                class="max-w-40 sm:max-w-none"
            />
            <Button
                variant="outline"
                size="sm"
                class="md:hidden lg:hidden"
                as-child
            >
                <Link href="/users">
                    <ArrowLeft class="mr-1.5 h-4 w-4" />
                    Kembali
                </Link>
            </Button>
        </header>

        <div class="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
            <aside
                class="space-y-6 lg:col-span-1"
                aria-label="Ringkasan profil kader"
            >
                <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                    <CardHeader
                        class="gap-0 border-b border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                    >
                        <CardTitle class="text-sm font-medium">
                            Profil Pengguna
                        </CardTitle>
                    </CardHeader>

                    <CardContent class="space-y-3.5 p-4 sm:p-5">
                        <div
                            class="flex items-center gap-3.5 rounded-xl border border-border/80 bg-muted/20 p-3.5 sm:p-4"
                        >
                            <UserAvatar
                                :name="props.user?.name ?? 'Kader'"
                                size="lg"
                                class="ring-indigo/20 h-14 w-14 shrink-0 text-base font-bold ring-2"
                            />
                            <hgroup
                                class="min-w-0 flex-1 space-y-0.5 text-left"
                            >
                                <h3
                                    class="truncate text-base font-semibold tracking-tight text-foreground"
                                    :title="props.user?.name"
                                >
                                    {{ props.user?.name }}
                                </h3>
                                <p
                                    class="truncate text-xs text-muted-foreground"
                                    :title="props.user?.email"
                                >
                                    {{ props.user?.email }}
                                </p>
                            </hgroup>
                        </div>

                        <TileGroup>
                            <TileItem
                                label="Peran"
                                :value="
                                    props.user?.role === 'administrator'
                                        ? 'Administrator'
                                        : props.user?.role === 'kader'
                                          ? 'Kader Posyandu'
                                          : (props.user?.role ?? '-')
                                "
                                :icon="User"
                                icon-class="text-indigo-400"
                            />
                            <TileItem
                                label="Status Akun"
                                :value="
                                    props.user?.is_active ? 'Aktif' : 'Nonaktif'
                                "
                                :icon="
                                    props.user?.is_active ? UserCheck : UserX
                                "
                                :icon-class="
                                    props.user?.is_active
                                        ? 'text-emerald-500'
                                        : 'text-rose-500'
                                "
                            />
                            <TileItem
                                label="Status NIK"
                                :value="
                                    props.user?.nik ? 'Lengkap' : 'Belum Ada'
                                "
                                :icon="ShieldCheck"
                                icon-class="text-amber-500"
                            />
                            <TileItem
                                label="Terdaftar"
                                :value="props.user?.created_at"
                                :icon="Calendar"
                                icon-class="text-cyan-400"
                            />
                        </TileGroup>
                        <TileGroup>
                            <TileItem
                                label="Terakhir Login"
                                :value="
                                    props.user?.last_login_at ?? 'Belum Pernah'
                                "
                                :icon="Clock"
                                icon-class="text-violet-400"
                            />
                            <TileItem
                                label="Terakhir Diperbarui"
                                :value="props.user?.updated_at ?? '-'"
                                :icon="History"
                                icon-class="text-emerald-400"
                            />
                        </TileGroup>
                    </CardContent>
                </Card>
            </aside>

            <section
                class="space-y-5 lg:col-span-2"
                aria-label="Formulir edit informasi pribadi"
            >
                <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                    <CardHeader
                        class="flex items-center justify-between gap-0 border-b border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                    >
                        <CardTitle class="text-sm font-medium"
                            >Informasi Pribadi</CardTitle
                        >
                        <button
                            type="button"
                            @click="toggleEditing"
                            class="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors focus:outline-none"
                            :class="
                                isEditing
                                    ? 'text-rose-500 hover:text-rose-400'
                                    : 'text-indigo-500 hover:text-indigo-400'
                            "
                        >
                            <component
                                :is="isEditing ? Lock : Pencil"
                                class="h-3.5 w-3.5"
                            />
                            <span>{{
                                isEditing ? 'Batal Edit' : 'Edit Profil'
                            }}</span>
                        </button>
                    </CardHeader>

                    <Form
                        v-if="props.user"
                        v-bind="update.form(props.user.id)"
                        v-slot="{ errors, processing }"
                        :key="String(isEditing)"
                        @success="submitSucces"
                    >
                        <CardContent class="space-y-4 p-4 sm:p-5">
                            <AlertError
                                v-if="Object.keys(errors).length > 0"
                                :errors="Object.values(errors)"
                                title="Gagal Memperbarui Profil"
                            />

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label
                                        for="name"
                                        class="text-xs font-medium"
                                        :class="
                                            isEditing
                                                ? 'text-foreground/90'
                                                : 'text-muted-foreground/80'
                                        "
                                    >
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        :default-value="props.user.name"
                                        required
                                        :disabled="!isEditing"
                                        class="h-10 text-sm disabled:cursor-not-allowed sm:h-9.5"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <Label
                                        for="email"
                                        class="text-xs font-medium text-muted-foreground/80"
                                    >
                                        Alamat Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        :default-value="props.user.email"
                                        disabled
                                        class="h-10 text-sm disabled:cursor-not-allowed sm:h-9.5"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <Label
                                        for="nik"
                                        class="text-xs font-medium"
                                        :class="
                                            isEditing
                                                ? 'text-foreground/90'
                                                : 'text-muted-foreground/80'
                                        "
                                    >
                                        Nomor Induk Kependudukan
                                    </Label>
                                    <Input
                                        id="nik"
                                        type="text"
                                        name="nik"
                                        inputmode="numeric"
                                        maxlength="16"
                                        :default-value="props.user.nik ?? ''"
                                        required
                                        :disabled="!isEditing"
                                        class="h-10 font-mono text-sm disabled:cursor-not-allowed sm:h-9.5"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <Label
                                        for="role"
                                        class="text-xs font-medium"
                                        :class="
                                            isEditing
                                                ? 'text-foreground/90'
                                                : 'text-muted-foreground/80'
                                        "
                                    >
                                        Peran Pengguna
                                    </Label>
                                    <select
                                        id="role"
                                        name="role"
                                        :default-value="props.user.role"
                                        :disabled="!isEditing"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-9.5"
                                    >
                                        <option value="kader">
                                            Kader Posyandu
                                        </option>
                                        <option value="administrator">
                                            Administrator
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter
                            class="flex justify-end border-t border-border px-4 py-3.5 sm:px-5 [.border-t]:pt-4"
                        >
                            <Button
                                type="submit"
                                variant="metalic"
                                class="h-9 disabled:cursor-not-allowed"
                                :disabled="!isEditing || processing"
                            >
                                <Loader
                                    v-if="processing"
                                    class="mr-2 h-4 w-4 animate-spin"
                                />
                                Simpan Perubahan
                            </Button>
                        </CardFooter>
                    </Form>
                </Card>

                <ResetUserPassword v-if="props.user" :user="props.user" />
            </section>
        </div>
    </main>
</template>
