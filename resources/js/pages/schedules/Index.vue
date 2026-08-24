<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import { computed } from 'vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import type { ScheduleItem } from '@/types';
import ScheduleKanban from './partials/ScheduleKanban.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Jadwal Kegiatan' },
        ],
    },
});

interface Props {
    schedules?: ScheduleItem[];
}

const props = withDefaults(defineProps<Props>(), {
    schedules: () => [],
});

const page = usePage();
const isAdmin = computed(() => page.props.auth?.user?.role === 'administrator');
</script>

<template>
    <Head title="Jadwal Kegiatan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- 1. Header Halaman -->
        <header class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                title="Jadwal Kegiatan"
                description="Papan pantau agenda kegiatan posyandu berdasarkan status pelaksanaan"
                variant="small"
            />
            <!-- Tombol Tambah Jadwal (Khusus Admin) -->
            <Button
                v-if="isAdmin"
                variant="default"
                class="h-9 bg-linear-to-br"
                as-child
            >
                <Link href="#">
                    <Plus class="h-4 w-4" />
                    <span class="hidden sm:inline">Tambah Jadwal</span>
                </Link>
            </Button>
        </header>

        <!-- 2. Papan Kanban Jadwal Kegiatan -->
        <section class="flex-1">
            <ScheduleKanban :schedules="props.schedules" :is-admin="isAdmin" />
        </section>
    </div>
</template>
