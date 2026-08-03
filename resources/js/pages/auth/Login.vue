<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { usePage } from '@inertiajs/vue3';
import { TriangleAlert } from '@lucide/vue';
import { ref, watchEffect } from 'vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import VerifyToken from '@/components/VerifyToken.vue';
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

const isVerifyOpen = ref(false);
const page = usePage();
watchEffect(() => {
    const errors = page.props.errors as Record<string, string>;
    const flash = page.props.flash as any;

    if (
        flash?.requires_token ||
        errors?.email?.toLowerCase().includes('verifikasi token')
    ) {
        isVerifyOpen.value = true;
    }
});
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
        <Alert
            v-if="errors.email || errors.password"
            variant="destructive"
            class="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
        >
            <TriangleAlert class="h-4 w-4 text-rose-500" />
            <AlertTitle class="font-semibold">Gagal Masuk</AlertTitle>
            <AlertDescription>
                {{ errors.email || errors.password }}
            </AlertDescription>
        </Alert>

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
                    class="h-10 rounded-md text-sm"
                />
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
                    class="h-10 rounded-md text-sm"
                />
            </div>

            <Button
                type="submit"
                variant="default"
                size="lg"
                class="shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                :tabindex="4"
                :disabled="processing"
                data-test="login-button"
            >
                <Spinner v-if="processing" class="mr-2 h-4 w-4 text-white" />
                <span>Masuk Ke Dashboard</span>
            </Button>

            <p class="mt-2 text-center text-xs text-muted-foreground">
                Belum memiliki akun?
                <span class="font-semibold text-foreground/80">
                    Silakan hubungi Admin
                </span>
            </p>
        </div>
    </Form>

    <VerifyToken v-model:open="isVerifyOpen" />
</template>
