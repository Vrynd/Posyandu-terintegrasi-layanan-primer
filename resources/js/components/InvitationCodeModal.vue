<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
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

const isOpen = defineModel<boolean>('open', { default: false });

const invitationForm = useForm({
    code: '',
});

const sendInvitationCode = () => {
    invitationForm.post('/login/invitation', {
        onSuccess: () => {
            isOpen.value = false;
            invitationForm.reset();
        },
    });
};

const resetCode = () => {
    invitationForm.reset('code');
    invitationForm.clearErrors();
};
</script>

<template>
    <!-- 1. Desktop Modal Dialog (>= sm screens) -->
    <Dialog v-model:open="isOpen">
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
                    Masukkan 16 digit kode undangan yang telah dibuat oleh
                    Administrator Posyandu Tondomulyo.
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="sendInvitationCode" class="grid gap-4 py-2">
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
                        Kode Undangan (16 Karakter)
                    </Label>
                    <Input
                        id="desktop-invitation-code"
                        v-model="invitationForm.code"
                        type="text"
                        required
                        maxlength="16"
                        placeholder="Contoh: YGB7UZ5NXC4155WN"
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

                <p class="mt-1 text-center text-xs text-muted-foreground">
                    Kode tidak valid atau sudah terpakai?
                    <button
                        type="button"
                        @click="resetCode"
                        class="cursor-pointer font-semibold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        Ganti Kode Lain
                    </button>
                </p>
            </form>
        </DialogContent>
    </Dialog>

    <!-- 2. Mobile Bottom Sheet (< sm screens) -->
    <Sheet v-model:open="isOpen">
        <SheetContent
            side="bottom"
            class="rounded-t-3xl border-t border-border bg-card p-6 text-card-foreground sm:hidden"
        >
            <SheetHeader class="p-0 text-left">
                <SheetTitle
                    class="font-display text-lg font-bold text-card-foreground"
                >
                    Masuk via Kode Undangan
                </SheetTitle>
                <SheetDescription class="text-xs text-muted-foreground">
                    Masukkan kode undangan yang telah dibuat oleh Administrator
                </SheetDescription>
            </SheetHeader>

            <form @submit.prevent="sendInvitationCode" class="grid gap-4 py-2">
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
                        placeholder="Contoh: YGB7UZ5NXC4155WN"
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
                    <span>Masuk Via Kode Undangan</span>
                </Button>

                <p class="mt-1 text-center text-xs text-muted-foreground">
                    Kode sudah terpakai?
                    <button
                        type="button"
                        @click="resetCode"
                        class="cursor-pointer font-semibold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        Ganti Kode Lain
                    </button>
                </p>
            </form>
        </SheetContent>
    </Sheet>
</template>
