import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import type { ScheduleItem } from '@/types';

export interface CalendarDay {
    dateString: string; // Format 'YYYY-MM-DD'
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    schedules: ScheduleItem[];
}

export const MONTH_NAMES_ID = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

export const DAY_NAMES_ID = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
];

export function useCalendar(schedules: Ref<ScheduleItem[]>) {
    const now = new Date();
    const currentYear = ref(now.getFullYear());
    const currentMonth = ref(now.getMonth()); // 0 = Januari, 11 = Desember

    // Format tanggal awal ke YYYY-MM-DD
    const pad = (n: number) => String(n).padStart(2, '0');
    const todayString = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    // State tanggal yang sedang diklik kader (default: hari ini)
    const selectedDate = ref<string>(todayString);

    // Label Bulan & Tahun (misal: "September 2026")
    const monthYearLabel = computed(() => {
        return `${MONTH_NAMES_ID[currentMonth.value]} ${currentYear.value}`;
    });

    // Menghasilkan Grid Kotak-Kotak Tanggal (35 atau 42 kotak)
    const calendarGrid = computed<CalendarDay[]>(() => {
        const year = currentYear.value;
        const month = currentMonth.value;

        // Hari pertama bulan ini (0 = Minggu, 1 = Senin, dst)
        const firstDayIndex = new Date(year, month, 1).getDay();
        // Total hari dalam bulan ini
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Total hari dalam bulan sebelumnya
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days: CalendarDay[] = [];

        // 1. Kotak sisa dari bulan sebelumnya
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNumber = daysInPrevMonth - i;
            const prevMonthDate = new Date(year, month - 1, dayNumber);
            const dateString = `${prevMonthDate.getFullYear()}-${pad(prevMonthDate.getMonth() + 1)}-${pad(dayNumber)}`;

            days.push({
                dateString,
                dayNumber,
                isCurrentMonth: false,
                isToday: dateString === todayString,
                isSelected: dateString === selectedDate.value,
                schedules: schedules.value.filter((s) => s.date === dateString),
            });
        }

        // 2. Kotak hari-hari di bulan aktif
        for (let i = 1; i <= daysInMonth; i++) {
            const dateString = `${year}-${pad(month + 1)}-${pad(i)}`;

            days.push({
                dateString,
                dayNumber: i,
                isCurrentMonth: true,
                isToday: dateString === todayString,
                isSelected: dateString === selectedDate.value,
                schedules: schedules.value.filter((s) => s.date === dateString),
            });
        }

        // 3. Kotak sisa untuk bulan berikutnya agar genap kelipatan 7
        const remainingCells = (7 - (days.length % 7)) % 7;

        for (let i = 1; i <= remainingCells; i++) {
            const nextMonthDate = new Date(year, month + 1, i);
            const dateString = `${nextMonthDate.getFullYear()}-${pad(nextMonthDate.getMonth() + 1)}-${pad(i)}`;

            days.push({
                dateString,
                dayNumber: i,
                isCurrentMonth: false,
                isToday: dateString === todayString,
                isSelected: dateString === selectedDate.value,
                schedules: schedules.value.filter((s) => s.date === dateString),
            });
        }

        return days;
    });

    // Navigasi Bulan
    const prevMonth = () => {
        if (currentMonth.value === 0) {
            currentMonth.value = 11;
            currentYear.value -= 1;
        } else {
            currentMonth.value -= 1;
        }
    };

    const nextMonth = () => {
        if (currentMonth.value === 11) {
            currentMonth.value = 0;
            currentYear.value += 1;
        } else {
            currentMonth.value += 1;
        }
    };

    const goToToday = () => {
        currentYear.value = now.getFullYear();
        currentMonth.value = now.getMonth();
        selectedDate.value = todayString;
    };

    // Lompat langsung ke bulan tertentu (0 = Januari, 11 = Desember)
    const jumpToMonth = (month: number) => {
        currentMonth.value = month;
    };
    // Lompat langsung ke tahun tertentu
    const jumpToYear = (year: number) => {
        currentYear.value = year;
    };

    const selectDate = (dateString: string) => {
        selectedDate.value = dateString;
    };

    const prevDay = () => {
        const [y, m, d] = selectedDate.value.split('-').map(Number);
        const prev = new Date(y, m - 1, d - 1);
        selectedDate.value = `${prev.getFullYear()}-${pad(prev.getMonth() + 1)}-${pad(prev.getDate())}`;
        currentYear.value = prev.getFullYear();
        currentMonth.value = prev.getMonth();
    };

    const nextDay = () => {
        const [y, m, d] = selectedDate.value.split('-').map(Number);
        const next = new Date(y, m - 1, d + 1);
        selectedDate.value = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
        currentYear.value = next.getFullYear();
        currentMonth.value = next.getMonth();
    };

    // Daftar kegiatan khusus untuk tanggal yang sedang diklik
    const selectedDateSchedules = computed(() => {
        return schedules.value.filter((s) => s.date === selectedDate.value);
    });

    return {
        currentYear,
        currentMonth,
        selectedDate,
        monthYearLabel,
        calendarGrid,
        selectedDateSchedules,
        prevMonth,
        nextMonth,
        goToToday,
        jumpToMonth,
        jumpToYear,
        selectDate,
        prevDay,
        nextDay,
    };
}
