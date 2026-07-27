<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import { useMediaQuery } from '@vueuse/core';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
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
import { invitation } from '@/routes/login';

const isOpen = defineModel<boolean>('open', { default: false });
const isDesktop = useMediaQuery('(min-width: 640px)');
</script>

<template>
    <Dialog v-if="isDesktop" v-model:open="isOpen">
        <DialogContent
            class="rounded-2xl border border-border bg-card p-5 text-card-foreground sm:max-w-md"
        >
            <DialogHeader class="gap-1.5">
                <DialogTitle class="font-display text-card-foreground">
                    Masuk via Kode Undangan
                </DialogTitle>
                <DialogDescription class="text-xs text-muted-foreground">
                    Masukkan kode undangan yang telah dibuat oleh Administrator
                </DialogDescription>
            </DialogHeader>

            <Form
                v-bind="invitation.form()"
                reset-on-success
                @success="isOpen = false"
                #default="{ errors, processing }"
                class="mt-5 grid gap-4"
            >
                <!-- Field 1: Kode Undangan -->
                <div class="grid gap-2">
                    <Label
                        for="desktop-invitation-code"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Kode Undangan
                    </Label>
                    <Input
                        id="desktop-invitation-code"
                        name="code"
                        type="text"
                        required
                        maxlength="16"
                        placeholder="Contoh: YGB7UZ5NXC4155WN"
                        class="h-10 rounded-md font-mono text-sm tracking-wider uppercase"
                    />
                    <InputError :message="errors.code" />
                </div>

                <!-- Field 2: Password Baru -->
                <div class="grid gap-2">
                    <Label
                        for="desktop-password"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Password Baru
                    </Label>
                    <PasswordInput
                        id="desktop-password"
                        name="password"
                        required
                        placeholder="Minimal 8 karakter"
                        class="h-10 rounded-md text-sm"
                    />
                </div>

                <!-- Field 3: Konfirmasi Password -->
                <div class="grid gap-2">
                    <Label
                        for="desktop-password-confirmation"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Konfirmasi Password
                    </Label>
                    <PasswordInput
                        id="desktop-password-confirmation"
                        name="password_confirmation"
                        required
                        placeholder="Ulangi password baru"
                        class="h-10 rounded-md text-sm"
                    />
                    <InputError :message="errors.password" />
                </div>

                <!-- Submit Button -->
                <Button
                    type="submit"
                    :disabled="processing"
                    variant="default"
                    size="lg"
                    class="mt-2 shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                >
                    <Spinner
                        v-if="processing"
                        class="mr-2 h-4 w-4 text-white"
                    />
                    <span>Masuk via Kode Undangan</span>
                </Button>
            </Form>
        </DialogContent>
    </Dialog>

    <Sheet v-else v-model:open="isOpen">
        <SheetContent
            side="bottom"
            class="gap-0 rounded-t-3xl border-t border-border bg-card p-5 text-card-foreground"
        >
            <SheetHeader class="gap-1.5 p-0">
                <SheetTitle
                    class="font-display text-lg leading-none text-card-foreground"
                >
                    Masuk via Kode Undangan
                </SheetTitle>
                <SheetDescription class="text-xs text-muted-foreground">
                    Masukkan kode undangan yang telah dibuat oleh Administrator
                </SheetDescription>
            </SheetHeader>

            <Form
                v-bind="invitation.form()"
                reset-on-success
                @success="isOpen = false"
                #default="{ errors, processing }"
                class="mt-5 grid gap-4"
            >
                <!-- Field 1: Kode Undangan -->
                <div class="grid gap-2">
                    <Label
                        for="mobile-invitation-code"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Kode Undangan
                    </Label>
                    <Input
                        id="mobile-invitation-code"
                        name="code"
                        type="text"
                        required
                        maxlength="16"
                        placeholder="Contoh: YGB7UZ5NXC4155WN"
                        class="h-10 rounded-md font-mono text-sm tracking-wider uppercase"
                    />
                    <InputError :message="errors.code" />
                </div>

                <!-- Field 2: Password Baru -->
                <div class="grid gap-2">
                    <Label
                        for="mobile-password"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Password Baru
                    </Label>
                    <PasswordInput
                        id="mobile-password"
                        name="password"
                        required
                        placeholder="Minimal 8 karakter"
                        class="h-10 rounded-md text-sm"
                    />
                </div>

                <!-- Field 3: Konfirmasi Password -->
                <div class="grid gap-2">
                    <Label
                        for="mobile-password-confirmation"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Konfirmasi Password
                    </Label>
                    <PasswordInput
                        id="mobile-password-confirmation"
                        name="password_confirmation"
                        required
                        placeholder="Ulangi password baru"
                        class="h-10 rounded-md text-sm"
                    />
                    <InputError :message="errors.password" />
                </div>

                <!-- Submit Button -->
                <Button
                    type="submit"
                    :disabled="processing"
                    variant="default"
                    size="lg"
                    class="mt-2 shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                >
                    <Spinner
                        v-if="processing"
                        class="mr-2 h-4 w-4 text-white"
                    />
                    <span>Masuk via Kode Undangan</span>
                </Button>
            </Form>
        </SheetContent>
    </Sheet>
</template>
