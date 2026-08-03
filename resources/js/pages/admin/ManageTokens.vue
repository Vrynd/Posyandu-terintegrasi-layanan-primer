<script setup lang="ts">
import { Form, Head, usePage } from '@inertiajs/vue3';
import { KeyRound, Copy, Check, TriangleAlert, X } from '@lucide/vue';
import { computed } from 'vue';
import Heading from '@/components/Heading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import UserAvatar from '@/components/UserAvatar.vue';
import { useClickToFill } from '@/composables/useClickToFill';
import { useClipboard } from '@/composables/useClipboard';
import { dashboard } from '@/routes';
import { store } from '@/routes/tokens';
import type { TokenItem, GeneratedTokenData } from '@/types';
defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
        ],
    },
});

interface Props {
    tokens?: {
        data: TokenItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

const props = defineProps<Props>();
const { copied, copyToClipboard } = useClipboard();

const page = usePage();
const generatedTokenData = computed<GeneratedTokenData | null>(
    () => (page.props.flash as any)?.generated_token ?? null,
);

const {
    filledValue: selectedEmail,
    fillAndFocus: fillEmail,
    clearFilledValue: clearEmail,
} = useClickToFill('email');
</script>

<template>
    <Head title="Kelola Token" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <Heading
            title="Kelola Token"
            description="Manajemen penerbitan dan verifikasi token akses pengguna"
        />

        <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
            <CardHeader
                class="gap-0 border-b border-border px-4 py-5 sm:px-5 [.border-b]:pb-4"
            >
                <CardTitle
                    class="font-display text-sm font-medium tracking-tight text-foreground/90 sm:text-base"
                >
                    Token Verifikasi
                </CardTitle>
                <CardDescription>
                    Masukkan alamat email yang terdaftar di sistem.
                </CardDescription>
            </CardHeader>

            <CardContent class="p-4 sm:p-5">
                <Form
                    v-bind="store.form()"
                    #default="{ errors, processing }"
                    class="space-y-1"
                >
                    <Alert
                        v-if="errors.email"
                        variant="destructive"
                        class="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    >
                        <TriangleAlert class="h-4 w-4 text-rose-500" />
                        <AlertTitle class="font-semibold"
                            >Gagal Menerbitkan Token</AlertTitle
                        >
                        <AlertDescription>
                            {{ errors.email }}
                        </AlertDescription>
                    </Alert>
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div class="min-w-0 flex-1 space-y-2">
                            <Label
                                for="email"
                                class="text-xs font-medium text-foreground/90"
                            >
                                Alamat Email Kader
                            </Label>
                            <div class="relative flex items-center">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    v-model="selectedEmail"
                                    required
                                    placeholder="masukkan.email@kader.test"
                                    class="h-10 pr-12 text-sm sm:h-9.5"
                                />
                                <Button
                                    v-if="selectedEmail"
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    class="absolute right-1 h-7 w-7 rounded-full p-0 text-muted-foreground hover:text-foreground dark:hover:bg-muted/60"
                                    title="Bersihkan Email"
                                    @click="clearEmail"
                                >
                                    <X class="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>

                        <div class="w-full shrink-0 space-y-1.5 sm:w-64">
                            <Label
                                for="generated-token"
                                class="text-xs font-medium text-foreground/90"
                            >
                                Hasil Token (6 Digit)
                            </Label>
                            <div class="relative flex items-center">
                                <Input
                                    id="generated-token"
                                    type="text"
                                    readonly
                                    :value="generatedTokenData?.token ?? ''"
                                    placeholder="------"
                                    class="h-10 bg-secondary/30 pr-10 text-center font-mono text-base font-bold tracking-widest text-indigo-400 sm:h-9.5"
                                />
                                <Button
                                    v-if="generatedTokenData?.token"
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    class="absolute right-1 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                    title="Salin Token"
                                    @click="
                                        copyToClipboard(
                                            generatedTokenData.token,
                                        )
                                    "
                                >
                                    <Check
                                        v-if="copied"
                                        class="h-4 w-4 text-emerald-400"
                                    />
                                    <Copy v-else class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div class="w-full shrink-0 sm:w-auto">
                            <Button
                                type="submit"
                                variant="metalic"
                                class="gap-2"
                                :disabled="processing"
                            >
                                <Spinner v-if="processing" class="h-4 w-4" />
                                <KeyRound v-else class="h-4 w-4" />
                                <span>Buat Token</span>
                            </Button>
                        </div>
                    </div>

                    <InputError :message="errors.email" />
                </Form>
            </CardContent>
        </Card>

        <Card
            class="mt-6 flex flex-col gap-5 overflow-hidden border-border bg-card p-4 shadow-xs sm:gap-6 sm:p-5"
        >
            <CardHeader class="flex flex-row items-center justify-between p-0">
                <div class="space-y-0.5 sm:space-y-0">
                    <CardTitle
                        class="font-display text-sm font-medium tracking-tight text-foreground/90 sm:text-base"
                    >
                        Riwayat & Status Token
                    </CardTitle>
                    <CardDescription>
                        Daftar seluruh token verifikasi yang diterbitkan sistem
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent class="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Penerima</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status Token</TableHead>
                            <TableHead>Waktu Diterbitkan</TableHead>
                            <TableHead>Masa Berlaku</TableHead>
                            <TableHead>Waktu Digunakan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="item in props.tokens?.data"
                            :key="item.id"
                            class="transition-colors hover:bg-muted/30"
                        >
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <UserAvatar
                                        :name="item.user.name"
                                        size="md"
                                    />
                                    <span> {{ item.user.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell
                                @click="fillEmail(item.user.email)"
                                class="cursor-pointer transition-colors hover:text-accent"
                            >
                                {{ item.user.email }}
                            </TableCell>
                            <TableCell>
                                <StatusBadge
                                    v-if="item.is_used"
                                    color="emerald"
                                    text="Terpakai"
                                />
                                <StatusBadge
                                    v-else-if="item.is_valid"
                                    color="indigo"
                                    text="Aktif"
                                />
                                <StatusBadge
                                    v-else
                                    color="rose"
                                    text="Kedaluwarsa"
                                />
                            </TableCell>
                            <TableCell>
                                {{ item.created_at }}
                            </TableCell>
                            <TableCell>
                                {{ item.expires_at }}
                            </TableCell>
                            <TableCell>
                                {{ item.used_at ?? '-' }}
                            </TableCell>
                        </TableRow>
                        <TableRow
                            v-if="
                                !props.tokens?.data ||
                                props.tokens.data.length === 0
                            "
                        >
                            <TableCell
                                colspan="5"
                                class="h-32 text-center text-muted-foreground"
                            >
                                Belum ada riwayat token verifikasi yang
                                diterbitkan.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>

            <CardFooter
                v-if="props.tokens && props.tokens.last_page > 1"
                class="border-t border-border/60 p-0 pt-4"
            >
                <Pagination
                    :links="props.tokens.links"
                    :current-count="props.tokens.data.length"
                    :total="props.tokens.total"
                    :last-page="props.tokens.last_page"
                    class="mt-0 w-full border-0 bg-transparent py-0 shadow-none"
                />
            </CardFooter>
        </Card>
    </div>
</template>
