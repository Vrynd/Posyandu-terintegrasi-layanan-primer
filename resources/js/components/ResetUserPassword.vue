<script setup lang="ts">
import { Form, usePage } from '@inertiajs/vue3';
import {
    Check,
    Copy,
    Eye,
    EyeOff,
    Loader2,
    KeyRound,
    ShieldAlert,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClipboard } from '@/composables/useClipboard';
import { resetPassword } from '@/routes/users';
import type { UserItem } from '@/types';

interface Props {
    user: UserItem;
}

const props = defineProps<Props>();
const { copyToClipboard, copied } = useClipboard();

const tempPassword = computed(
    () => (usePage().props as any).flash?.temp_password as string | undefined,
);

const isPasswordVisible = ref(false);
const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

const MASKED_PLACEHOLDER = '••••••••••••';
const displayPassword = computed(() =>
    isPasswordVisible.value ? tempPassword.value : MASKED_PLACEHOLDER,
);
</script>

<template>
    <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
        <CardHeader
            class="flex items-center justify-between gap-0 border-b border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
        >
            <CardTitle class="text-sm font-medium"> Keamanan Akun </CardTitle>
            <Form
                v-bind="resetPassword.form(props.user.id)"
                v-slot="{ processing }"
            >
                <button
                    type="submit"
                    :disabled="processing"
                    class="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-indigo-500 transition-colors hover:text-indigo-400 focus:outline-none disabled:opacity-50"
                >
                    <Loader2
                        v-if="processing"
                        class="h-3.5 w-3.5 animate-spin"
                    />
                    <KeyRound v-else class="h-3.5 w-3.5" />
                    <span>{{
                        processing ? 'Memproses...' : 'Buat Kata sandi'
                    }}</span>
                </button>
            </Form>
        </CardHeader>

        <CardContent class="space-y-4 p-4 sm:p-5">
            <div
                class="mt-0 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5"
            >
                <ShieldAlert class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p class="text-xs leading-relaxed text-amber-200/90">
                    Membuat kata sandi sementara akan langsung menggantikan kata
                    sandi lama akun ini secara aman.
                </p>
            </div>

            <output
                v-if="tempPassword"
                class="relative flex w-full flex-col gap-1 rounded-xl border border-border/80 bg-muted/20 p-3.5 pr-20"
            >
                <span class="text-xs font-medium text-muted-foreground/90">
                    Kata Sandi Baru
                </span>
                <code
                    class="block truncate font-mono text-sm font-semibold tracking-wider text-foreground"
                >
                    {{ displayPassword }}
                </code>

                <div class="absolute top-3 right-3 flex items-center gap-1.5">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        @click="togglePasswordVisibility"
                        :aria-label="
                            isPasswordVisible
                                ? 'Sembunyikan kata sandi'
                                : 'Tampilkan kata sandi'
                        "
                        class="h-7 w-7 shrink-0 cursor-pointer border-border/80 text-muted-foreground hover:bg-muted/40"
                    >
                        <component
                            :is="isPasswordVisible ? EyeOff : Eye"
                            class="h-3.5 w-3.5"
                        />
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        @click="copyToClipboard(String(tempPassword))"
                        :aria-label="
                            copied ? 'Kata sandi tersalin' : 'Salin kata sandi'
                        "
                        class="h-7 w-7 shrink-0 cursor-pointer border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20"
                    >
                        <component
                            :is="copied ? Check : Copy"
                            class="h-3.5 w-3.5"
                        />
                    </Button>
                </div>
            </output>
        </CardContent>
    </Card>
</template>
