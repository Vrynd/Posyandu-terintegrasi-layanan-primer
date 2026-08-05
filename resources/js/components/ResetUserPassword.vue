<script setup lang="ts">
import { Form, usePage } from '@inertiajs/vue3';
import {
    Check,
    Copy,
    Eye,
    EyeOff,
    RotateCcwKey,
    KeyRound,
    Loader2,
    ShieldAlert,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TileItem } from '@/components/ui/tile';
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
                    class="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-indigo-500 transition-colors hover:text-rose-500 focus:outline-none disabled:opacity-50"
                >
                    <Loader2
                        v-if="processing"
                        class="h-3.5 w-3.5 animate-spin"
                    />
                    <RotateCcwKey v-else class="h-3.5 w-3.5" />
                    <span>{{
                        processing ? 'Memproses...' : 'Reset Kata sandi'
                    }}</span>
                </button>
            </Form>
        </CardHeader>

        <CardContent class="p-4 sm:p-5">
            <TileItem
                v-if="tempPassword"
                label="Kata Sandi Baru"
                :icon="KeyRound"
                icon-class="text-indigo-400"
                class="h-10 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 font-medium text-indigo-500"
            >
                <div class="flex items-center gap-2">
                    <code
                        class="truncate font-mono text-xs font-semibold tracking-wider text-foreground sm:text-sm"
                    >
                        {{ displayPassword }}
                    </code>

                    <div class="flex shrink-0 items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            @click="togglePasswordVisibility"
                            :aria-label="
                                isPasswordVisible
                                    ? 'Sembunyikan kata sandi'
                                    : 'Tampilkan kata sandi'
                            "
                            class="h-6 w-6 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground dark:hover:bg-indigo-500/20"
                        >
                            <component
                                :is="isPasswordVisible ? EyeOff : Eye"
                                class="h-3 w-3"
                            />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            @click="copyToClipboard(String(tempPassword))"
                            :aria-label="
                                copied
                                    ? 'Kata sandi tersalin'
                                    : 'Salin kata sandi'
                            "
                            class="h-6 w-6 shrink-0 cursor-pointer text-emerald-400 hover:text-emerald-300 dark:hover:bg-emerald-500/20"
                        >
                            <component
                                :is="copied ? Check : Copy"
                                class="h-3 w-3"
                            />
                        </Button>
                    </div>
                </div>
            </TileItem>

            <TileItem
                v-else
                label="Kata sandi sementara akan dibuat dan langsung menggantikan kata sandi lama, bagikan kata sandi secara aman"
                :icon="ShieldAlert"
                icon-class="text-amber-500 shrink-0 mt-0.5"
                class="h-10 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 text-amber-200"
            />
        </CardContent>
    </Card>
</template>
