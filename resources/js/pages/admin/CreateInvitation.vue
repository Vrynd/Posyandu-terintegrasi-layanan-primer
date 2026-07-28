<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { Check, Copy, KeyRound, Loader2, Sparkles } from '@lucide/vue';
import { computed } from 'vue';
import { store } from '@/actions/App/Http/Controllers/Admin/InvitationController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import { useClipboard } from '@/composables/useClipboard';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Kode Undangan', href: '/invitations' },
            { title: 'Buat Kode Baru', href: '/invitations/create' },
        ],
    },
});

const page = usePage();
const createdInvitation = computed(
    () => (page.props as any).flash?.success_invitation,
);

const { copied, copyToClipboard } = useClipboard();
const copyToken = () => {
    if (createdInvitation.value?.raw_code) {
        copyToClipboard(createdInvitation.value.raw_code);
    }
};
</script>

<template>
    <div>
        <Head title="Buat Kode Undangan Baru" />

        <section class="flex h-full flex-1 flex-col p-4 sm:p-6">
            <Heading
                title="Buat Kode Undangan Baru"
                description="Terbitkan kode registrasi akun untuk calon kader Posyandu"
                variant="small"
                class="mb-8"
            />

            <div class="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-5">
                <Form
                    class="sm:col-span-2"
                    v-bind="store.form()"
                    reset-on-success
                    preserve-scroll
                    v-slot="{ errors, processing }"
                >
                    <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                        <CardHeader
                            class="gap-0 border-b border-border px-0 [.border-b]:pb-0"
                        >
                            <CardTitle
                                class="px-4 py-4 text-sm font-medium sm:px-5"
                            >
                                Informasi Pengguna
                            </CardTitle>
                        </CardHeader>

                        <CardContent class="space-y-4 p-4 sm:p-5">
                            <div class="space-y-2">
                                <Label
                                    for="recipient_name"
                                    class="text-xs font-medium text-foreground/90"
                                >
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="recipient_name"
                                    type="text"
                                    name="recipient_name"
                                    placeholder="contoh: Ani Suryani"
                                    autocomplete="on"
                                    required
                                    autofocus
                                    class="h-10 text-sm sm:h-9.5"
                                />

                                <InputError :message="errors.recipient_name" />
                            </div>

                            <div class="space-y-2">
                                <Label
                                    for="recipient_email"
                                    class="text-xs font-medium text-foreground/90"
                                >
                                    Alamat Email
                                </Label>
                                <Input
                                    id="recipient_email"
                                    name="recipient_email"
                                    type="email"
                                    placeholder="contoh: ani.suryani@posyandu.id"
                                    autocomplete="on"
                                    required
                                    class="h-10 text-sm sm:h-9.5"
                                />
                                <InputError :message="errors.recipient_email" />
                            </div>
                        </CardContent>

                        <CardFooter
                            class="justify-end gap-3 border-t border-border px-4 py-4 sm:px-5 [.border-t]:pt-4"
                        >
                            <Button type="button" variant="outline" as-child>
                                <Link href="/invitations">Batal</Link>
                            </Button>
                            <Button
                                type="submit"
                                :disabled="processing"
                                variant="default"
                                class="font-semibold hover:bg-primary/85 hover:ring-2 hover:ring-primary/30"
                            >
                                <Loader2
                                    v-if="processing"
                                    class="h-4 w-4 animate-spin"
                                />
                                <Sparkles v-else class="h-4 w-4" />
                                Generate Kode
                            </Button>
                        </CardFooter>
                    </Card>
                </Form>

                <Card
                    class="gap-0 border-border/80 bg-card py-0 shadow-xs sm:col-span-3"
                >
                    <CardHeader
                        class="gap-0 border-b border-border px-0 [.border-b]:pb-0"
                    >
                        <CardTitle
                            class="flex items-center gap-2 px-4 py-4 text-sm font-medium sm:gap-3 sm:px-5"
                        >
                            Hasil Kode Undangan
                        </CardTitle>
                    </CardHeader>

                    <CardContent class="flex-1 p-4 sm:p-5">
                        <div v-if="createdInvitation" class="space-y-4">
                            <div class="space-y-1.5">
                                <span
                                    class="text-xs font-medium text-muted-foreground"
                                >
                                    Kode Undangan
                                </span>
                                <button
                                    type="button"
                                    @click="copyToken"
                                    class="group flex w-full items-center justify-between rounded-lg border border-emerald-500/20 bg-background/80 px-4 py-3 text-left transition-colors hover:border-emerald-500/40"
                                    title="Klik untuk menyalin"
                                >
                                    <span
                                        class="font-mono text-2xl font-bold tracking-[0.15em] text-foreground"
                                    >
                                        {{ createdInvitation.raw_code }}
                                    </span>
                                    <Check
                                        v-if="copied"
                                        class="h-4 w-4 shrink-0 text-emerald-500"
                                    />
                                    <Copy
                                        v-else
                                        class="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-emerald-500"
                                    />
                                </button>
                            </div>

                            <dl
                                class="space-y-2.5 rounded-lg border border-border/60 bg-background/50 px-4 py-3 text-sm"
                            >
                                <div class="flex items-center justify-between">
                                    <dt class="text-muted-foreground">
                                        Penerima
                                    </dt>
                                    <dd class="font-semibold text-foreground">
                                        {{ createdInvitation.recipient_name }}
                                    </dd>
                                </div>
                                <Separator />
                                <div class="flex items-center justify-between">
                                    <dt class="text-muted-foreground">
                                        Email Terdaftar
                                    </dt>
                                    <dd class="font-medium text-foreground">
                                        {{ createdInvitation.recipient_email }}
                                    </dd>
                                </div>
                                <Separator />
                                <div class="flex items-center justify-between">
                                    <dt class="text-muted-foreground">
                                        Masa Berlaku
                                    </dt>
                                    <dd>
                                        <Badge
                                            variant="outline"
                                            class="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                                        >
                                            7 Hari
                                        </Badge>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div
                            v-else
                            class="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground"
                        >
                            <KeyRound class="h-10 w-10 opacity-20" />
                            <p class="text-sm font-medium">
                                Belum ada kode yang diterbitkan.
                            </p>
                            <p class="text-xs opacity-60">
                                Isi formulir di sebelah kiri untuk menghasilkan
                                token kode undangan baru.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    </div>
</template>
