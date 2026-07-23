<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Form } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

const props = defineProps<{
    class?: HTMLAttributes['class'];
    canResetPassword?: boolean;
    status?: string;
}>();
</script>

<template>
    <div :class="cn('flex flex-col gap-6', props.class)">
        <Card class="rounded-2xl border-zinc-800 bg-zinc-900/90 text-white shadow-2xl backdrop-blur-xl">
            <CardHeader class="space-y-1.5 px-6 pt-6 pb-2 text-left">
                <CardTitle class="font-display text-xl font-bold tracking-tight text-white">
                    Masuk ke Akun Anda
                </CardTitle>
                <CardDescription class="text-xs leading-relaxed text-zinc-400">
                    Masukkan Email atau 16 Digit NIK dan password Anda untuk melanjutkan
                </CardDescription>
            </CardHeader>
            <CardContent class="px-6 py-5">
                <div v-if="status" class="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-semibold text-emerald-400">
                    {{ status }}
                </div>

                <Form
                    v-bind="store.form()"
                    :reset-on-success="['password']"
                    v-slot="{ errors, processing }"
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel for="email" class="text-xs font-medium text-zinc-300">
                                Email atau NIK
                            </FieldLabel>
                            <Input
                                id="email"
                                type="text"
                                name="email"
                                required
                                autofocus
                                :tabindex="1"
                                autocomplete="username"
                                placeholder="email@example.com atau 16 digit NIK"
                                class="h-10 rounded-xl border-zinc-700 bg-zinc-950 px-3.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <InputError :message="errors.email" />
                        </Field>

                        <Field>
                            <div class="flex items-center justify-between">
                                <FieldLabel for="password" class="text-xs font-medium text-zinc-300">
                                    Password
                                </FieldLabel>
                                <TextLink
                                    v-if="canResetPassword"
                                    :href="request()"
                                    class="text-xs text-indigo-400 transition-colors hover:text-white"
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
                                placeholder="Masukkan Password"
                                class="h-10 rounded-xl border-zinc-700 bg-zinc-950 px-3.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <InputError :message="errors.password" />
                        </Field>

                        <Field>
                            <div class="flex items-center justify-between pt-0.5">
                                <FieldLabel
                                    for="remember"
                                    class="flex cursor-pointer items-center space-x-2 text-xs font-normal text-zinc-400 hover:text-zinc-200"
                                >
                                    <Checkbox id="remember" name="remember" :tabindex="3" />
                                    <span>Ingat saya</span>
                                </FieldLabel>
                            </div>
                        </Field>

                        <Field>
                            <Button
                                type="submit"
                                class="h-10 w-full rounded-xl bg-linear-to-r from-indigo-500 to-pink-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:opacity-90 disabled:opacity-50 cursor-pointer"
                                :tabindex="4"
                                :disabled="processing"
                                data-test="login-button"
                            >
                                <Spinner v-if="processing" class="mr-2 h-4 w-4 text-white" />
                                <span>Masuk ke Sistem</span>
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                class="h-10 w-full rounded-xl border-zinc-700 bg-transparent text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                            >
                                Masuk dengan Google
                            </Button>
                            <FieldDescription class="mt-2 text-center text-xs text-zinc-400">
                                Belum punya akun?
                                <a href="#" class="font-medium text-white underline underline-offset-4 hover:text-indigo-400">
                                    Hubungi Admin
                                </a>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </Form>
            </CardContent>
        </Card>
    </div>
</template>
