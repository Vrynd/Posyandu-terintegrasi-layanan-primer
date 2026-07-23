<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
</script>

<template>
    <Head title="Masuk ke Akun" />

    <div
        v-if="status"
        class="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-semibold text-emerald-400">
        {{ status }}
    </div>

    <Form
        v-bind="store.form()"
        :reset-on-success="['password']"
        v-slot="{ errors, processing }"
        class="flex flex-col gap-6">

        <div class="grid gap-5">
            <div class="grid gap-2.5">
                <Label for="email" class="text-xs font-medium text-zinc-300">Email atau NIK</Label>
                <Input
                    id="email"
                    type="text"
                    name="email"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="username"
                    placeholder="email@example.com"
                    class="h-11 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 text-sm text-white placeholder:text-zinc-500 transition-all duration-200 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20 focus:outline-none"
                />
                <InputError :message="errors.email" />
            </div>

            <div class="grid gap-2.5">
                <div class="flex items-center justify-between">
                    <Label for="password" class="text-xs font-medium text-zinc-300">Password</Label>
                    <TextLink
                        v-if="canResetPassword"
                        :href="request()"
                        class="text-xs text-zinc-400 transition-colors hover:text-white"
                        :tabindex="5">
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
                    class="h-11 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 text-sm text-white placeholder:text-zinc-500 transition-all duration-200 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20 focus:outline-none"
                />
                <InputError :message="errors.password" />
            </div>

            <Button
                type="submit"
                class="mt-1 h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-pink-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                size="lg"
                :tabindex="4"
                :disabled="processing"
                data-test="login-button">
                <Spinner v-if="processing" class="mr-2 h-4 w-4 text-white" />
                <span>Masuk Ke Dashboard</span>
            </Button>

            <p class="mt-2 text-center text-xs text-zinc-500">
                Belum memiliki akun?
                <TextLink
                    href="#"
                    class="font-medium text-zinc-400 transition-colors hover:text-indigo-400">
                    Silakan hubungi Admin
                </TextLink>
            </p>
        </div>
    </Form>
</template>

