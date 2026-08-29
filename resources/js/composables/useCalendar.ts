import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { Ref } from 'vue';
import type { ScheduleItem } from '@/types';

export interface CalendarDay {
    dateString: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    schedules: ScheduleItem[];
}

export function useCalendar(
    schedules: Ref<ScheduleItem[]>,
    initialYear?: number,
    initialMonth?: number,
) {
    const pad = (n: number) => String(n).padStart(2, '0');

    const getTodayString = () => {
        const d = new Date();

        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const now = new Date();
    const todayString = ref(getTodayString());
    const currentYear = ref(initialYear ?? now.getFullYear());
    const currentMonth = ref(initialMonth ?? now.getMonth());

    // State tanggal yang sedang diklik kader (default: hari ini)
    const selectedDate = ref<string>(todayString.value);

    let dayChangeInterval: ReturnType<typeof setInterval> | null = null;

    onMounted(() => {
        dayChangeInterval = setInterval(() => {
            const latestToday = getTodayString();

            if (latestToday !== todayString.value) {
                todayString.value = latestToday;
            }
        }, 60_000);
    });

    onUnmounted(() => {
        if (dayChangeInterval) {
            clearInterval(dayChangeInterval);
        }
    });

    // 1. Indexing O(N) sekali saja saat `schedules` berubah
    const schedulesByDate = computed<Record<string, ScheduleItem[]>>(() => {
        const map: Record<string, ScheduleItem[]> = {};

        for (const schedule of schedules.value) {
            const start = new Date(`${schedule.start_date}T00:00:00`);
            const end = new Date(`${schedule.end_date}T00:00:00`);

            for (
                const d = new Date(start);
                d <= end;
                d.setDate(d.getDate() + 1)
            ) {
                const dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                (map[dateKey] ??= []).push(schedule);
            }
        }

        return map;
    });

    // 2. Menghasilkan Grid Kotak-Kotak Tanggal
    const calendarGrid = computed<CalendarDay[]>(() => {
        const year = currentYear.value;
        const month = currentMonth.value;
        const today = todayString.value;
        const scheduleMap = schedulesByDate.value;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days: CalendarDay[] = [];

        // 2.1 Kotak sisa dari bulan sebelumnya
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNumber = daysInPrevMonth - i;
            const prevMonthDate = new Date(year, month - 1, dayNumber);
            const dateString = `${prevMonthDate.getFullYear()}-${pad(prevMonthDate.getMonth() + 1)}-${pad(dayNumber)}`;

            days.push({
                dateString,
                dayNumber,
                isCurrentMonth: false,
                isToday: dateString === today,
                schedules: scheduleMap[dateString] ?? [],
            });
        }

        // 2.2 Kotak hari-hari di bulan aktif
        for (let i = 1; i <= daysInMonth; i++) {
            const dateString = `${year}-${pad(month + 1)}-${pad(i)}`;

            days.push({
                dateString,
                dayNumber: i,
                isCurrentMonth: true,
                isToday: dateString === today,
                schedules: scheduleMap[dateString] ?? [],
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
                isToday: dateString === today,
                schedules: scheduleMap[dateString] ?? [],
            });
        }

        return days;
    });

    const prevMonth = () => {
        if (currentMonth.value === 0) {
            currentMonth.value = 11;
            currentYear.value -= 1;
        } else {
            currentMonth.value -= 1;
        }

        selectedDate.value = `${currentYear.value}-${pad(currentMonth.value + 1)}-01`;
    };

    const nextMonth = () => {
        if (currentMonth.value === 11) {
            currentMonth.value = 0;
            currentYear.value += 1;
        } else {
            currentMonth.value += 1;
        }

        selectedDate.value = `${currentYear.value}-${pad(currentMonth.value + 1)}-01`;
    };

    const goToToday = () => {
        todayString.value = getTodayString();
        const d = new Date();
        currentYear.value = d.getFullYear();
        currentMonth.value = d.getMonth();
        selectedDate.value = todayString.value;
    };

    const jumpToMonth = (month: number) => {
        currentMonth.value = month;
        selectedDate.value = `${currentYear.value}-${pad(month + 1)}-01`;
    };

    const jumpToYear = (year: number) => {
        currentYear.value = year;
        selectedDate.value = `${year}-${pad(currentMonth.value + 1)}-01`;
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

    // Daftar kegiatan khusus untuk tanggal yang sedang diklik (O(1))
    const selectedDateSchedules = computed(() => {
        return schedulesByDate.value[selectedDate.value] ?? [];
    });

    return {
        currentYear,
        currentMonth,
        selectedDate,
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
