import participants from '@/routes/participants';
import reports from '@/routes/reports';
import type { ActionCardItem } from '@/types';

/**
 * 6 Layanan Operasional Posyandu Terintegrasi ILP
 */
export const posyanduServices: ActionCardItem[] = [
    {
        id: 'pendaftaran-peserta',
        title: 'Pendaftaran Peserta',
        description:
            'Registrasi sasaran baru dan verifikasi NIK seluruh siklus hidup.',
        image: '/images/pendaftaran-peserta.png',
        href: participants.create(),
        gradient:
            'from-indigo-500/12 via-indigo-500/4 to-transparent dark:from-indigo-500/20 dark:via-indigo-500/5',
        glow: 'bg-indigo-400/25 dark:bg-indigo-500/15',
    },
    {
        id: 'catat-pemeriksaan',
        title: 'Catat Pemeriksaan',
        description:
            'Input antropometri, tanda vital, dan skrining berkala sasaran.',
        image: '/images/catat-pemeriksaan.png',
        href: participants.index(),
        gradient:
            'from-emerald-500/12 via-emerald-500/4 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/5',
        glow: 'bg-emerald-400/25 dark:bg-emerald-500/15',
    },
    {
        id: 'tindak-lanjut',
        title: 'Peserta Tindak Lanjut',
        description:
            'Pemantauan sasaran berisiko klinis dan status rujukan Puskesmas.',
        image: '/images/tindak-lanjut.png',
        href: participants.index(),
        gradient:
            'from-rose-500/12 via-rose-500/4 to-transparent dark:from-rose-500/20 dark:via-rose-500/5',
        glow: 'bg-rose-400/25 dark:bg-rose-500/15',
    },
    {
        id: 'data-warga',
        title: 'Data Warga',
        description:
            'Direktori kependudukan lengkap sasaran dan pencarian NIK keluarga.',
        image: '/images/data-warga.png',
        href: participants.index(),
        gradient:
            'from-blue-500/12 via-blue-500/4 to-transparent dark:from-blue-500/20 dark:via-blue-500/5',
        glow: 'bg-blue-400/25 dark:bg-blue-500/15',
    },
    {
        id: 'kelola-laporan',
        title: 'Kelola Laporan',
        description:
            'Rekapitulasi bulanan posyandu dan unduh laporan resmi format SKDN.',
        image: '/images/kelola-laporan.png',
        href: reports.index(),
        gradient:
            'from-amber-500/12 via-amber-500/4 to-transparent dark:from-amber-500/20 dark:via-amber-500/5',
        glow: 'bg-amber-400/25 dark:bg-amber-500/15',
    },
    {
        id: 'laporkan-masalah',
        title: 'Laporkan Masalah',
        description:
            'Kanal pengaduan kendala teknis dan anomali data sistem posyandu.',
        image: '/images/laporkan-masalah.png',
        href: '#',
        isLocked: true,
        lockedTooltip:
            'Kanal Laporkan Masalah sedang disiapkan untuk tahap operasional berikutnya.',
        gradient:
            'from-sky-500/12 via-sky-500/4 to-transparent dark:from-sky-500/20 dark:via-sky-500/5',
        glow: 'bg-sky-400/25 dark:bg-sky-500/15',
    },
];

export default posyanduServices;
