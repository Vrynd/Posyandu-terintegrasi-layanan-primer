<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    BookOpen,
    Briefcase,
    CalendarDays,
    ChevronDown,
    ClipboardList,
    Database,
    GraduationCap,
    Heart,
    HeartPulse,
    LayoutDashboard,
    Lock,
    LogIn,
    Monitor,
    ShieldCheck,
    UserPlus,
    Users,
} from '@lucide/vue';
import { computed } from 'vue';
import { dashboard, login } from '@/routes';

interface Props {
    userCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
    userCount: 0,
});

const page = usePage();
const authUser = computed(() => page.props.auth?.user);
const currentYear = computed(() => new Date().getFullYear());

const categories = [
    {
        icon: HeartPulse,
        label: 'Ibu Hamil',
        sub: 'ANC & pemantauan',
        color: 'pink',
        bar: 75,
    },
    {
        icon: Activity,
        label: 'Balita',
        sub: 'Tumbuh kembang',
        color: 'indigo',
        bar: 90,
    },
    {
        icon: GraduationCap,
        label: 'Anak Remaja',
        sub: 'Usia 10–18 tahun',
        color: 'pink',
        bar: 60,
    },
    {
        icon: Briefcase,
        label: 'Usia Produktif',
        sub: '18–59 tahun',
        color: 'indigo',
        bar: 85,
    },
    {
        icon: Heart,
        label: 'Lansia',
        sub: 'Pemantauan 60+',
        color: 'pink',
        bar: 70,
    },
];
</script>

<template>
    <Head title="Sistem Pelayanan Kesehatan Terpadu - Posyandu Tondomulyo" />

    <div class="min-h-screen bg-zinc-950 font-sans text-white antialiased selection:bg-indigo-500 selection:text-white">
        <!-- Ambient Background (Grid Contours) -->
        <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <!-- Gradient Orbs -->
            <div
                class="absolute -top-56 -right-40 h-162.5 w-162.5 rounded-full bg-indigo-500/10 blur-3xl"
            ></div>
            <div
                class="absolute bottom-0 -left-40 h-137.5 w-137.5 rounded-full bg-pink-500/5 blur-3xl"
            ></div>

            <!-- Layer 1: Minor Grid Contour (10px x 10px) -->
            <svg class="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                    <pattern
                        id="minor-grid-contour"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 10 0 L 0 0 0 10"
                            fill="none"
                            stroke="#818CF8"
                            stroke-width="0.35"
                            stroke-opacity="0.05"
                        />
                    </pattern>
                    <radialGradient id="minor-grid-fade" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" stop-color="white" stop-opacity="1" />
                        <stop offset="100%" stop-color="white" stop-opacity="0" />
                    </radialGradient>
                    <mask id="minor-grid-mask">
                        <rect width="100%" height="100%" fill="url(#minor-grid-fade)" />
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#minor-grid-contour)"
                    mask="url(#minor-grid-mask)"
                />
            </svg>

            <!-- Layer 2: Major Grid Contour (40px x 40px) -->
            <svg class="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                    <pattern
                        id="major-grid-contour"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="#818CF8"
                            stroke-width="0.6"
                            stroke-opacity="0.12"
                        />
                        <!-- Plus accent at intersections -->
                        <path
                            d="M 0 4 L 0 -4 M -4 0 L 4 0"
                            stroke="#818CF8"
                            stroke-width="0.8"
                            stroke-opacity="0.25"
                        />
                    </pattern>
                    <radialGradient id="major-grid-fade" cx="50%" cy="25%" r="65%">
                        <stop offset="0%" stop-color="white" stop-opacity="1" />
                        <stop offset="100%" stop-color="white" stop-opacity="0" />
                    </radialGradient>
                    <mask id="major-grid-mask">
                        <rect width="100%" height="100%" fill="url(#major-grid-fade)" />
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#major-grid-contour)"
                    mask="url(#major-grid-mask)"
                />
            </svg>
        </div>


        <div class="relative z-10 flex min-h-screen flex-col">
            <!-- ===== NAVBAR ===== -->
            <header
                class="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl"
            >
                <div
                    class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
                >
                    <!-- Brand -->
                    <Link href="/" class="group flex items-center gap-2.5">
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-brrom-indigo-400 to-pink-400 text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105"
                        >
                            <HeartPulse class="h-4 w-4" />
                        </div>
                        <div class="leading-tight">
                            <div
                                class="font-display text-base font-bold tracking-tight text-white"
                            >
                                Posyandu Tondomulyo
                            </div>
                        </div>
                    </Link>

                    <!-- Right Side Navigation -->
                    <div class="flex items-center gap-3 sm:gap-5">
                        <nav
                            class="hidden items-center gap-5 text-sm text-zinc-400 md:flex"
                        >
                            <a
                                href="#layanan"
                                class="transition-colors duration-200 hover:text-white"
                                >Layanan</a
                            >
                            <a
                                href="#fitur"
                                class="transition-colors duration-200 hover:text-white"
                                >Fitur</a
                            >
                            <a
                                href="#statistik"
                                class="transition-colors duration-200 hover:text-white"
                                >Statistik</a
                            >
                        </nav>
                        <Link
                            v-if="authUser"
                            :href="dashboard()"
                            id="nav-dashboard-btn"
                            class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/10 sm:px-5 sm:py-2.5"
                        >
                            <span class="hidden sm:inline">Buka Dashboard</span>
                            <LayoutDashboard class="h-4 w-4" />
                        </Link>
                        <Link
                            v-else
                            :href="login()"
                            id="nav-login-btn"
                            class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/10 sm:px-5 sm:py-2.5"
                        >
                            <span class="hidden sm:inline">Masuk</span>
                            <LogIn class="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </header>

            <main class="grow">
                <!-- ===== SECTION 1: HERO ===== -->
                <section
                    id="hero"
                    class="relative overflow-hidden py-16 lg:py-28"
                >
                    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div
                            class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
                        >
                            <!-- Left: Copy -->
                            <div class="text-center lg:text-left">
                                <div
                                    class="mb-6 flex items-center justify-center gap-2 lg:justify-start"
                                >
                                    <span class="relative flex h-2 w-2">
                                        <span
                                            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"
                                        ></span>
                                        <span
                                            class="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"
                                        ></span>
                                    </span>
                                    <span
                                        class="font-display text-xs font-semibold tracking-wider text-indigo-400 uppercase"
                                        >Integrasi Layanan Primer (ILP)</span
                                    >
                                </div>
                                <h1
                                    class="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]"
                                >
                                    Posyandu Lebih
                                    <span
                                        class="block bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                        >Digital &amp; Terpadu</span
                                    >
                                </h1>
                                <p
                                    class="mx-auto mt-5 max-w-xl text-base text-zinc-400 leading-relaxed sm:text-lg lg:mx-0"
                                >
                                    Platform pencatatan dan pengelolaan
                                    posyandu untuk seluruh kelompok sasaran
                                    kesehatan &mdash; dari Ibu Hamil hingga
                                    Lansia.
                                </p>
                                <div
                                    class="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
                                >
                                    <Link
                                        v-if="authUser"
                                        :href="dashboard()"
                                        id="hero-cta-btn"
                                        class="inline-flex items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-indigo-400 to-pink-400 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
                                    >
                                        Buka Dashboard
                                        <ArrowRight class="h-5 w-5" />
                                    </Link>
                                    <Link
                                        v-else
                                        :href="login()"
                                        id="hero-cta-btn"
                                        class="inline-flex items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-indigo-400 to-pink-400 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
                                    >
                                        Masuk ke Sistem
                                        <LogIn class="h-5 w-5" />
                                    </Link>
                                    <a
                                        href="#layanan"
                                        id="hero-explore-btn"
                                        class="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-7 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-zinc-800"
                                    >
                                        Lihat Layanan
                                        <ChevronDown class="h-4 w-4" />
                                    </a>
                                </div>

                                <!-- Mini Trust Row -->
                                <div
                                    class="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 lg:justify-start"
                                >
                                    <span class="flex items-center gap-1.5"
                                        ><ShieldCheck
                                            class="h-3.5 w-3.5 text-indigo-400"
                                        />
                                        Data aman &amp; terenkripsi</span
                                    >
                                    <span class="flex items-center gap-1.5"
                                        ><Users
                                            class="h-3.5 w-3.5 text-indigo-400"
                                        />
                                        Kader &amp; Administrator</span
                                    >
                                    <span class="flex items-center gap-1.5"
                                        ><Monitor
                                            class="h-3.5 w-3.5 text-indigo-400"
                                        />
                                        7 Modul terintegrasi</span
                                    >
                                </div>
                            </div>

                            <!-- Right: Visual Card Panel -->
                            <div class="relative hidden lg:block">
                                <div
                                    class="absolute inset-0 -m-8 rounded-3xl bg-linear-to-br from-indigo-500/10 to-pink-500/10 blur-3xl"
                                ></div>

                                <div
                                    class="relative space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                                >
                                    <!-- Card Header -->
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2.5">
                                            <div
                                                class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-400 to-pink-400 text-white"
                                            >
                                                <HeartPulse class="h-4 w-4" />
                                            </div>
                                            <span
                                                class="font-display text-sm font-semibold text-white"
                                                >Ringkasan Layanan</span
                                            >
                                        </div>
                                        <span
                                            class="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400"
                                        >
                                            <span
                                                class="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500"
                                            ></span>
                                            Aktif
                                        </span>
                                    </div>

                                    <!-- Category Rows -->
                                    <div class="space-y-2">
                                        <div
                                            v-for="cat in categories"
                                            :key="cat.label"
                                            class="flex items-center gap-3 rounded-xl bg-zinc-950/60 px-4 py-3"
                                        >
                                            <div
                                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                                :class="
                                                    cat.color === 'pink'
                                                        ? 'bg-pink-500/10 text-pink-400'
                                                        : 'bg-indigo-500/10 text-indigo-400'
                                                "
                                            >
                                                <component
                                                    :is="cat.icon"
                                                    class="h-4 w-4"
                                                />
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <div
                                                    class="mb-1 flex items-center justify-between"
                                                >
                                                    <span
                                                        class="text-xs font-semibold text-white"
                                                        >{{ cat.label }}</span
                                                    >
                                                    <span
                                                        class="text-xs text-zinc-500"
                                                        >{{ cat.bar }}%</span
                                                    >
                                                </div>
                                                <div
                                                    class="relative h-1 w-full overflow-visible rounded-full bg-zinc-800"
                                                >
                                                    <div
                                                        class="h-1 rounded-full bg-linear-to-r"
                                                        :class="
                                                            cat.color === 'pink'
                                                                ? 'from-pink-500 to-rose-400'
                                                                : 'from-indigo-500 to-sky-400'
                                                        "
                                                        :style="{
                                                            width: `${cat.bar}%`,
                                                        }"
                                                    ></div>
                                                    <span
                                                        class="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                                        :class="
                                                            cat.color === 'pink'
                                                                ? 'bg-pink-400 ring-4 ring-pink-500/30'
                                                                : 'bg-indigo-400 ring-4 ring-indigo-500/30'
                                                        "
                                                        :style="{
                                                            left: `${cat.bar}%`,
                                                        }"
                                                    ></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Bottom Stat Row -->
                                    <div
                                        class="grid grid-cols-3 gap-3 border-t border-zinc-800 pt-2"
                                    >
                                        <div class="text-center">
                                            <div
                                                class="font-display text-xl font-bold text-white"
                                            >
                                                {{ props.userCount || 2 }}
                                            </div>
                                            <div
                                                class="mt-0.5 text-xs text-zinc-400"
                                            >
                                                Pengguna
                                            </div>
                                        </div>
                                        <div
                                            class="border-x border-zinc-800 text-center"
                                        >
                                            <div
                                                class="font-display text-xl font-bold text-white"
                                            >
                                                5
                                            </div>
                                            <div
                                                class="mt-0.5 text-xs text-zinc-400"
                                            >
                                                Layanan
                                            </div>
                                        </div>
                                        <div class="text-center">
                                            <div
                                                class="font-display text-xl font-bold text-white"
                                            >
                                                7
                                            </div>
                                            <div
                                                class="mt-0.5 text-xs text-zinc-400"
                                            >
                                                Modul
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ===== SECTION 2: KATEGORI LAYANAN ===== -->
                <section id="layanan" class="relative py-16 lg:py-24">
                    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div class="mb-12 text-center">
                            <h2
                                class="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
                            >
                                Kategori Pelayanan
                            </h2>
                            <p
                                class="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base"
                            >
                                Lima kelompok sasaran kesehatan yang dilayani
                                Posyandu Primer secara terintegrasi.
                            </p>
                        </div>

                        <!-- 5 Horizontal Cards -->
                        <div
                            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
                        >
                            <!-- Ibu Hamil -->
                            <div
                                class="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40"
                            >
                                <div
                                    class="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-pink-500/5 transition-all duration-300 group-hover:bg-pink-500/10"
                                ></div>
                                <div class="relative">
                                    <div
                                        class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white"
                                    >
                                        <HeartPulse class="h-6 w-6" />
                                    </div>
                                    <div
                                        class="mb-1 text-xs font-semibold text-pink-400 uppercase tracking-widest"
                                    >
                                        01
                                    </div>
                                    <h3 class="text-base font-bold text-white">
                                        Ibu Hamil
                                    </h3>
                                    <p
                                        class="mt-1.5 text-xs text-zinc-500 leading-relaxed"
                                    >
                                        Pemantauan kehamilan, ANC, dan
                                        persiapan persalinan.
                                    </p>
                                </div>
                            </div>

                            <!-- Balita -->
                            <div
                                class="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40"
                            >
                                <div
                                    class="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-indigo-500/5 transition-all duration-300 group-hover:bg-indigo-500/10"
                                ></div>
                                <div class="relative">
                                    <div
                                        class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white"
                                    >
                                        <Activity class="h-6 w-6" />
                                    </div>
                                    <div
                                        class="mb-1 text-xs font-semibold text-indigo-400 uppercase tracking-widest"
                                    >
                                        02
                                    </div>
                                    <h3 class="text-base font-bold text-white">
                                        Balita
                                    </h3>
                                    <p
                                        class="mt-1.5 text-xs text-zinc-500 leading-relaxed"
                                    >
                                        Pemantauan tumbuh kembang anak usia 0
                                        sampai 5 tahun.
                                    </p>
                                </div>
                            </div>

                            <!-- Anak Remaja -->
                            <div
                                class="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40"
                            >
                                <div
                                    class="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-pink-500/5 transition-all duration-300 group-hover:bg-pink-500/10"
                                ></div>
                                <div class="relative">
                                    <div
                                        class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white"
                                    >
                                        <GraduationCap class="h-6 w-6" />
                                    </div>
                                    <div
                                        class="mb-1 text-xs font-semibold text-pink-400 uppercase tracking-widest"
                                    >
                                        03
                                    </div>
                                    <h3 class="text-base font-bold text-white">
                                        Anak Remaja
                                    </h3>
                                    <p
                                        class="mt-1.5 text-xs text-zinc-500 leading-relaxed"
                                    >
                                        Kesehatan reproduksi dan nutrisi remaja
                                        10 sampai 18 tahun.
                                    </p>
                                </div>
                            </div>

                            <!-- Usia Produktif -->
                            <div
                                class="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40"
                            >
                                <div
                                    class="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-indigo-500/5 transition-all duration-300 group-hover:bg-indigo-500/10"
                                ></div>
                                <div class="relative">
                                    <div
                                        class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white"
                                    >
                                        <Briefcase class="h-6 w-6" />
                                    </div>
                                    <div
                                        class="mb-1 text-xs font-semibold text-indigo-400 uppercase tracking-widest"
                                    >
                                        04
                                    </div>
                                    <h3 class="text-base font-bold text-white">
                                        Usia Produktif
                                    </h3>
                                    <p
                                        class="mt-1.5 text-xs text-zinc-500 leading-relaxed"
                                    >
                                        Deteksi dini penyakit tidak menular
                                        pada usia 18 sampai 59 tahun.
                                    </p>
                                </div>
                            </div>

                            <!-- Lansia -->
                            <div
                                class="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 sm:col-span-2 hover:-translate-y-1 hover:border-pink-500/40 lg:col-span-1"
                            >
                                <div
                                    class="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-pink-500/5 transition-all duration-300 group-hover:bg-pink-500/10"
                                ></div>
                                <div class="relative">
                                    <div
                                        class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white"
                                    >
                                        <Heart class="h-6 w-6" />
                                    </div>
                                    <div
                                        class="mb-1 text-xs font-semibold text-pink-400 uppercase tracking-widest"
                                    >
                                        05
                                    </div>
                                    <h3 class="text-base font-bold text-white">
                                        Lansia
                                    </h3>
                                    <p
                                        class="mt-1.5 text-xs text-zinc-500 leading-relaxed"
                                    >
                                        Pemantauan kesehatan dan kualitas hidup
                                        warga 60 tahun ke atas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ===== SECTION 3: STATISTIK PUBLIK ===== -->
                <section id="statistik" class="relative py-16 lg:py-24">
                    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div class="mb-12 text-center">
                            <h2
                                class="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
                            >
                                Dampak Nyata di Lapangan
                            </h2>
                            <p
                                class="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base"
                            >
                                Angka-angka di bawah mencerminkan ketercapaian
                                layanan posyandu yang dikelola melalui sistem
                                ini.
                            </p>
                        </div>
                        <div
                            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            <!-- Jadwal Terlaksana -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center transition-all duration-300 hover:border-indigo-500/40"
                            >
                                <div
                                    class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"
                                >
                                    <CalendarDays class="h-6 w-6" />
                                </div>
                                <div
                                    class="font-display text-4xl font-bold text-white"
                                >
                                    100<span class="text-2xl text-indigo-400"
                                        >%</span
                                    >
                                </div>
                                <div class="mt-1 text-sm text-zinc-400">
                                    Jadwal Terlaksana
                                </div>
                                <p
                                    class="mt-3 text-xs text-zinc-500 leading-relaxed"
                                >
                                    Seluruh jadwal kegiatan posyandu
                                    terdokumentasi dan terpantau secara
                                    digital.
                                </p>
                            </div>

                            <!-- Kelompok Sasaran -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center transition-all duration-300 hover:border-pink-500/40"
                            >
                                <div
                                    class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400"
                                >
                                    <HeartPulse class="h-6 w-6" />
                                </div>
                                <div
                                    class="font-display text-4xl font-bold text-white"
                                >
                                    5
                                </div>
                                <div class="mt-1 text-sm text-zinc-400">
                                    Kelompok Sasaran
                                </div>
                                <p
                                    class="mt-3 text-xs text-zinc-500 leading-relaxed"
                                >
                                    Mulai dari Ibu Hamil, Balita, Remaja, Usia
                                    Produktif, hingga Lansia terlayani dalam
                                    satu platform.
                                </p>
                            </div>

                            <!-- Laporan Otomatis -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center transition-all duration-300 hover:border-indigo-500/40"
                            >
                                <div
                                    class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"
                                >
                                    <BarChart3 class="h-6 w-6" />
                                </div>
                                <div
                                    class="font-display text-4xl font-bold text-white"
                                >
                                    12<span class="text-2xl text-indigo-400"
                                        >/thn</span
                                    >
                                </div>
                                <div class="mt-1 text-sm text-zinc-400">
                                    Laporan Otomatis
                                </div>
                                <p
                                    class="mt-3 text-xs text-zinc-500 leading-relaxed"
                                >
                                    Laporan bulanan dihasilkan otomatis dan
                                    siap dikirim ke Puskesmas setiap bulan.
                                </p>
                            </div>

                            <!-- Data Tercadangkan -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center transition-all duration-300 hover:border-pink-500/40"
                            >
                                <div
                                    class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400"
                                >
                                    <Database class="h-6 w-6" />
                                </div>
                                <div
                                    class="font-display text-4xl font-bold text-white"
                                >
                                    &infin;
                                </div>
                                <div class="mt-1 text-sm text-zinc-400">
                                    Data Tercadangkan
                                </div>
                                <p
                                    class="mt-3 text-xs text-zinc-500 leading-relaxed"
                                >
                                    Backup data posyandu terjadwal otomatis
                                    sehingga data warga tidak pernah hilang.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ===== SECTION 4: FITUR SISTEM ===== -->
                <section id="fitur" class="relative py-16 lg:py-24">
                    <div class="mx-auto max-w-7xl px-6 lg:px-8">
                        <div class="mb-14 text-center">
                            <h2
                                class="font-display text-3xl font-bold text-white sm:text-4xl"
                            >
                                Fitur Sistem
                            </h2>
                            <p
                                class="mx-auto mt-3 max-w-xl text-base text-zinc-400"
                            >
                                Rangkaian modul operasional yang dirancang
                                mendukung kelancaran layanan posyandu dari hulu
                                ke hilir.
                            </p>
                        </div>
                        <div
                            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            <!-- Pendaftaran -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-indigo-500/40"
                            >
                                <div
                                    class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:text-white"
                                >
                                    <UserPlus class="h-5 w-5" />
                                </div>
                                <h3 class="font-semibold text-white">
                                    Pendaftaran
                                </h3>
                                <p
                                    class="mt-2 text-sm text-zinc-400 leading-relaxed"
                                >
                                    Registrasi warga, ibu hamil, dan balita ke
                                    sistem secara mudah dan terstruktur.
                                </p>
                            </div>

                            <!-- Pemeriksaan -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-pink-500/40"
                            >
                                <div
                                    class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-colors duration-300 group-hover:bg-pink-500 group-hover:text-white"
                                >
                                    <ClipboardList class="h-5 w-5" />
                                </div>
                                <h3 class="font-semibold text-white">
                                    Pemeriksaan
                                </h3>
                                <p
                                    class="mt-2 text-sm text-zinc-400 leading-relaxed"
                                >
                                    Pencatatan hasil pemeriksaan kesehatan,
                                    antropometri, dan status gizi secara
                                    digital.
                                </p>
                            </div>

                            <!-- Laporan -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-indigo-500/40"
                            >
                                <div
                                    class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:text-white"
                                >
                                    <BarChart3 class="h-5 w-5" />
                                </div>
                                <h3 class="font-semibold text-white">
                                    Laporan
                                </h3>
                                <p
                                    class="mt-2 text-sm text-zinc-400 leading-relaxed"
                                >
                                    Rekapitulasi laporan bulanan otomatis siap
                                    dikirim ke Puskesmas dan Dinas Kesehatan.
                                </p>
                            </div>

                            <!-- Jadwal Kegiatan -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-pink-500/40"
                            >
                                <div
                                    class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-colors duration-300 group-hover:bg-pink-500 group-hover:text-white"
                                >
                                    <CalendarDays class="h-5 w-5" />
                                </div>
                                <h3 class="font-semibold text-white">
                                    Jadwal Kegiatan
                                </h3>
                                <p
                                    class="mt-2 text-sm text-zinc-400 leading-relaxed"
                                >
                                    Manajemen jadwal posyandu rutin, imunisasi,
                                    dan kegiatan kesehatan komunitas.
                                </p>
                            </div>

                            <!-- Pengaduan -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-indigo-500/40"
                            >
                                <div
                                    class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:text-white"
                                >
                                    <AlertTriangle class="h-5 w-5" />
                                </div>
                                <h3 class="font-semibold text-white">
                                    Pengaduan
                                </h3>
                                <p
                                    class="mt-2 text-sm text-zinc-400 leading-relaxed"
                                >
                                    Kanal penerimaan dan pengelolaan pengaduan
                                    warga terkait layanan posyandu.
                                </p>
                            </div>

                            <!-- Backup -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-pink-500/40"
                            >
                                <div
                                    class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-colors duration-300 group-hover:bg-pink-500 group-hover:text-white"
                                >
                                    <Database class="h-5 w-5" />
                                </div>
                                <h3 class="font-semibold text-white">
                                    Backup Data
                                </h3>
                                <p
                                    class="mt-2 text-sm text-zinc-400 leading-relaxed"
                                >
                                    Pencadangan data posyandu secara berkala dan
                                    terjadwal untuk keamanan informasi.
                                </p>
                            </div>

                            <!-- Log Aktivitas -->
                            <div
                                class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-indigo-500/40"
                            >
                                <div
                                    class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:text-white"
                                >
                                    <BookOpen class="h-5 w-5" />
                                </div>
                                <h3 class="font-semibold text-white">
                                    Log Aktivitas
                                </h3>
                                <p
                                    class="mt-2 text-sm text-zinc-400 leading-relaxed"
                                >
                                    Rekam jejak seluruh aktivitas pengguna untuk
                                    keperluan audit dan akuntabilitas sistem.
                                </p>
                            </div>

                            <!-- Keamanan Ganda CTA Card -->
                            <div
                                class="flex flex-col justify-between rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/10 to-pink-500/10 p-6"
                            >
                                <div>
                                    <div
                                        class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white"
                                    >
                                        <Lock class="h-5 w-5" />
                                    </div>
                                    <h3 class="font-semibold text-white">
                                        Keamanan Ganda
                                    </h3>
                                    <p
                                        class="mt-2 text-sm text-zinc-400 leading-relaxed"
                                    >
                                        Login dengan Email atau NIK 16-digit
                                        &amp; password enkripsi kuat untuk
                                        setiap pengguna.
                                    </p>
                                </div>
                                <Link
                                    :href="login()"
                                    class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition-colors hover:text-white"
                                >
                                    Masuk Sekarang
                                    <ArrowRight class="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ===== SECTION 5: CALL TO ACTION ===== -->
                <section id="cta" class="relative py-16 lg:py-24">
                    <div class="mx-auto max-w-7xl px-6 lg:px-8">
                        <div
                            class="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-20 text-center lg:px-20"
                        >
                            <div
                                class="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
                            ></div>
                            <div
                                class="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-pink-500/5 blur-3xl"
                            ></div>
                            <div
                                class="absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent"
                            ></div>
                            <div class="relative mx-auto max-w-2xl">
                                <h2
                                    class="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
                                >
                                    Siap Mulai Mengelola<br />
                                    <span
                                        class="bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent"
                                        >Posyandu Anda?</span
                                    >
                                </h2>
                                <p
                                    class="mt-6 text-lg text-zinc-400 leading-relaxed"
                                >
                                    Masuk ke sistem menggunakan akun Kader atau
                                    Administrator dan mulai catat, pantau, serta
                                    kelola data kesehatan masyarakat secara
                                    digital.
                                </p>
                                <div
                                    class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                                >
                                    <Link
                                        v-if="authUser"
                                        :href="dashboard()"
                                        id="cta-primary-btn"
                                        class="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-indigo-400 to-pink-400 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
                                    >
                                        Buka Dashboard
                                        <ArrowRight class="h-5 w-5" />
                                    </Link>
                                    <Link
                                        v-else
                                        :href="login()"
                                        id="cta-primary-btn"
                                        class="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-indigo-400 to-pink-400 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
                                    >
                                        Masuk ke Sistem
                                        <LogIn class="h-5 w-5" />
                                    </Link>
                                    <a
                                        href="#layanan"
                                        class="inline-flex w-full items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-zinc-800 sm:w-auto"
                                    >
                                        Lihat Kategori Layanan
                                    </a>
                                </div>
                                <div
                                    class="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-400"
                                >
                                    <span class="flex items-center gap-2"
                                        ><span class="text-indigo-400"
                                            >&#10003;</span
                                        >
                                        Gratis untuk Kader &amp; Posyandu</span
                                    >
                                    <span class="flex items-center gap-2"
                                        ><span class="text-indigo-400"
                                            >&#10003;</span
                                        >
                                        Mudah digunakan di HP &amp;
                                        komputer</span
                                    >
                                    <span class="flex items-center gap-2"
                                        ><span class="text-indigo-400"
                                            >&#10003;</span
                                        >
                                        Data warga aman &amp; tersimpan</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <!-- ===== FOOTER ===== -->
            <footer
                class="w-full border-t border-zinc-800 bg-zinc-950 pt-12 pb-8"
            >
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <!-- Brand Row -->
                    <div
                        class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
                    >
                        <div class="max-w-md">
                            <div class="flex items-center gap-2.5">
                                <div
                                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-400 to-pink-400 text-white"
                                >
                                    <HeartPulse class="h-4 w-4" />
                                </div>
                                <span class="font-bold text-white"
                                    >Posyandu<span class="text-indigo-400"
                                        >Primer</span
                                    ></span
                                >
                            </div>
                            <p class="mt-3 text-sm text-zinc-400 leading-relaxed">
                                Platform digital pengelolaan posyandu berbasis
                                Integrasi Layanan Primer (ILP) untuk mendukung
                                kesehatan masyarakat Indonesia.
                            </p>
                        </div>
                    </div>

                    <!-- Link Columns -->
                    <div
                        class="grid grid-cols-2 gap-6 border-t border-zinc-800 pt-10 sm:grid-cols-3 sm:gap-8"
                    >
                        <!-- Kategori Layanan -->
                        <div>
                            <h4
                                class="mb-4 text-xs font-semibold text-white uppercase tracking-wider"
                            >
                                Kategori Layanan
                            </h4>
                            <ul class="space-y-2.5 text-sm text-zinc-400">
                                <li>Ibu Hamil</li>
                                <li>Balita</li>
                                <li>Anak Remaja</li>
                                <li>Usia Produktif</li>
                                <li>Lansia</li>
                            </ul>
                        </div>

                        <!-- Modul Sistem -->
                        <div>
                            <h4
                                class="mb-4 text-xs font-semibold text-white uppercase tracking-wider"
                            >
                                Modul Sistem
                            </h4>
                            <ul class="space-y-2.5 text-sm text-zinc-400">
                                <li>Pendaftaran</li>
                                <li>Pemeriksaan</li>
                                <li>Laporan</li>
                                <li>Jadwal Kegiatan</li>
                                <li>Pengaduan &amp; Log</li>
                            </ul>
                        </div>

                        <!-- Akses Sistem -->
                        <div class="col-span-2 sm:col-span-1">
                            <h4
                                class="mb-4 text-xs font-semibold text-white uppercase tracking-wider"
                            >
                                Akses Sistem
                            </h4>
                            <ul class="mb-5 space-y-2.5 text-sm">
                                <li>
                                    <Link
                                        :href="login()"
                                        class="text-zinc-400 transition-colors hover:text-white"
                                        >Halaman Masuk</Link
                                    >
                                </li>
                                <li>
                                    <Link
                                        :href="login()"
                                        class="text-zinc-400 transition-colors hover:text-white"
                                        >Login Administrator</Link
                                    >
                                </li>
                                <li>
                                    <Link
                                        :href="login()"
                                        class="text-zinc-400 transition-colors hover:text-white"
                                        >Login Kader</Link
                                    >
                                </li>
                            </ul>
                            <div
                                class="rounded-xl border border-zinc-800 bg-zinc-900 p-3.5"
                            >
                                <p class="text-xs text-zinc-400">
                                    Butuh bantuan?
                                </p>
                                <p class="mt-1 text-sm font-medium text-white">
                                    Hubungi Puskesmas setempat
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Bar -->
                    <div
                        class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-800 pt-5 text-xs text-zinc-400 sm:flex-row"
                    >
                        <span
                            >&copy; {{ currentYear }} Posyandu Primer. Seluruh
                            hak cipta dilindungi.</span
                        >
                        <span class="text-center sm:text-right"
                            >Integrasi Layanan Primer &mdash; Kemenkes RI</span
                        >
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>
