<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import { useMediaQuery } from '@vueuse/core';
import InputError from '@/components/InputError.vue';
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
import { token } from '@/routes/login';

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
                    Verifikasi Token
                </DialogTitle>
                <DialogDescription class="text-xs text-muted-foreground">
                    Masukkan token yang telah dibuat oleh Administrator
                </DialogDescription>
            </DialogHeader>

            <Form
                v-bind="token.form()"
                reset-on-success
                @success="isOpen = false"
                #default="{ errors, processing }"
                class="mt-5 grid gap-4"
            >
                <div class="grid gap-2">
                    <Label
                        for="desktop-invitation-code"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Token
                    </Label>
                    <Input
                        id="desktop-invitation-code"
                        name="token"
                        type="text"
                        inputmode="numeric"
                        required
                        maxlength="6"
                        placeholder="Contoh: 123456"
                        class="h-10 font-mono text-sm"
                        @input="
                            (e: Event) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(
                                    /[^0-9]/g,
                                    '',
                                );
                            }
                        "
                    />
                    <InputError :message="errors.code" />
                </div>

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
                    <span>Verifikasi</span>
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
                v-bind="token.form()"
                reset-on-success
                @success="isOpen = false"
                #default="{ errors, processing }"
                class="mt-5 grid gap-4"
            >
                <div class="grid gap-2">
                    <Label
                        for="desktop-invitation-code"
                        class="text-xs font-medium text-foreground/90"
                    >
                        Token
                    </Label>
                    <Input
                        id="desktop-invitation-code"
                        name="token"
                        type="text"
                        inputmode="numeric"
                        required
                        maxlength="6"
                        placeholder="Contoh: 123456"
                        class="h-10 font-mono text-sm"
                        @input="
                            (e: Event) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(
                                    /[^0-9]/g,
                                    '',
                                );
                            }
                        "
                    />
                    <InputError :message="errors.code" />
                </div>

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
                    <span>Verifikasi</span>
                </Button>
            </Form>
        </SheetContent>
    </Sheet>
</template>
