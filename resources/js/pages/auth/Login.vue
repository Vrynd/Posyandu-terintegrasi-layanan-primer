<script setup lang="ts">
import { Form, Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

defineOptions({
    layout: {
        title: 'Masuk ke Akun Anda',
        description: 'Masukkan Email dan Password untuk melanjutkan',
    },
});

defineProps<{
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}>();

const isAdminSheetOpen = ref(false);
const invitationForm = useForm({
    code: '',
});

const handleSendInvitationCode = () => {
    invitationForm.post('/login/invitation', {
        onSuccess: () => {
            isAdminSheetOpen.value = false;
            invitationForm.reset();
        },
    });
};
</script>

<template>
    <Head title="Masuk ke Akun" />

    <div
        v-if="status"
        class="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-semibold text-emerald-400"
    >
        {{ status }}
    </div>

    <Form
        v-bind="store.form()"
        :reset-on-success="['password']"
        v-slot="{ errors, processing }"
        class="flex flex-col gap-6"
    >
        <div class="grid gap-5">
            <div class="grid gap-2.5">
                <Label
                    for="email"
                    class="text-xs font-medium text-foreground/90"
                    >Email atau NIK</Label
                >
                <Input
                    id="email"
                    type="text"
                    name="email"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="username"
                    placeholder="email@example.com"
                    class="h-11 rounded-xl px-3.5 text-sm"
                />
                <InputError :message="errors.email" />
            </div>

            <div class="grid gap-2.5">
                <div class="flex items-center justify-between">
                    <Label
                        for="password"
                        class="text-xs font-medium text-foreground/90"
                        >Password</Label
                    >
                    <TextLink
                        v-if="canResetPassword"
                        :href="request()"
                        class="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        :tabindex="5"
                    >
                        Lupa password?
                    </TextLink>
                </div>

                <PasswordInput
                    id="password"
                    name="password"
                    required
                    :tabindex="2"
                    autocomplete="current-password"
                    placeholder="Password"
                    class="h-11 rounded-xl px-3.5 text-sm"
                />
                <InputError :message="errors.password" />
            </div>

            <Button
                type="submit"
                class="mt-1 h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-pink-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                size="lg"
                :tabindex="4"
                :disabled="processing"
                data-test="login-button"
            >
                <Spinner v-if="processing" class="mr-2 h-4 w-4 text-white" />
                <span>Masuk Ke Dashboard</span>
            </Button>

            <p class="mt-2 text-center text-xs text-muted-foreground">
                Belum memiliki akun?
                <button
                    type="button"
                    @click="isAdminSheetOpen = true"
                    class="cursor-pointer font-semibold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    Silakan hubungi Admin
                </button>
            </p>
        </div>
    </Form>

    <!-- 1. Desktop Modal Dialog (>= sm screens) -->
    <Dialog v-model:open="isAdminSheetOpen">
        <DialogContent
            class="hidden rounded-2xl border border-border bg-card p-6 text-card-foreground sm:block sm:max-w-md"
        >
            <DialogHeader class="pb-2 text-left">
                <DialogTitle
                    class="font-display text-xl font-bold text-card-foreground"
                >
                    Masuk via Kode Undangan
                </DialogTitle>
                <DialogDescription class="text-xs text-muted-foreground">
                    Masukkan kode undangan yang telah dibuat oleh Administrator
                </DialogDescription>
            </DialogHeader>

            <form
                @submit.prevent="handleSendInvitationCode"
                class="grid gap-4 py-2"
            >
                <div
                    v-if="invitationForm.errors.code"
                    class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-300"
                >
                    {{ invitationForm.errors.code }}
                </div>

                <div class="grid gap-2">
                    <Label
                        for="desktop-invitation-code"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Kode Undangan
                    </Label>
                    <Input
                        id="desktop-invitation-code"
                        v-model="invitationForm.code"
                        type="text"
                        required
                        maxlength="16"
                        placeholder="Contoh: KDR1689204751XYZ"
                        class="h-11 rounded-xl px-3.5 font-mono text-sm tracking-wider uppercase"
                    />
                </div>

                <Button
                    type="submit"
                    :disabled="invitationForm.processing"
                    class="mt-2 h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-pink-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                >
                    <Spinner
                        v-if="invitationForm.processing"
                        class="mr-2 h-4 w-4 text-white"
                    />
                    <span>Masuk via Kode Undangan</span>
                </Button>
            </form>
        </DialogContent>
    </Dialog>

    <!-- 2. Mobile Bottom Sheet (< sm screens) -->
    <Sheet v-model:open="isAdminSheetOpen">
        <SheetContent
            side="bottom"
            class="rounded-t-3xl border-t border-border bg-card p-6 text-card-foreground sm:hidden"
        >
            <SheetHeader class="text-left p-0">
                <SheetTitle
                    class="font-display text-lg font-bold text-card-foreground"
                >
                    Masuk via Kode Undangan
                </SheetTitle>
                <SheetDescription class="text-xs text-muted-foreground">
                    Masukkan kode undangan yang telah dibuat oleh Administrator
                </SheetDescription>
            </SheetHeader>

            <form
                @submit.prevent="handleSendInvitationCode"
                class="grid gap-4 py-2"
            >
                <div
                    v-if="invitationForm.errors.code"
                    class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-300"
                >
                    {{ invitationForm.errors.code }}
                </div>

                <div class="grid gap-2">
                    <Label
                        for="mobile-invitation-code"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Kode Undangan
                    </Label>
                    <Input
                        id="mobile-invitation-code"
                        v-model="invitationForm.code"
                        type="text"
                        required
                        maxlength="16"
                        placeholder="Contoh: KDR1689204751XYZ"
                        class="h-11 rounded-xl px-3.5 font-mono text-sm tracking-wider uppercase"
                    />
                </div>

                <Button
                    type="submit"
                    :disabled="invitationForm.processing"
                    class="mt-1 h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-pink-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                >
                    <Spinner
                        v-if="invitationForm.processing"
                        class="mr-2 h-4 w-4 text-white"
                    />
                    <span>Masuk via Kode Undangan</span>
                </Button>
            </form>
        </SheetContent>
    </Sheet>
</template>
