import type { DeepReadonly, Ref } from 'vue';
import { onMounted, onUnmounted, readonly, ref } from 'vue';

export type UseDateTimeReturn = {
    currentTime: DeepReadonly<Ref<string>>;
    currentDate: DeepReadonly<Ref<string>>;
};

export function useDateTime(): UseDateTimeReturn {
    const currentTime = ref('');
    const currentDate = ref('');

    const updateDateTime = () => {
        const now = new Date();

        currentTime.value = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        currentDate.value = now.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    let timer: ReturnType<typeof setInterval> | null = null;

    onMounted(() => {
        updateDateTime();
        timer = setInterval(updateDateTime, 1000);
    });

    onUnmounted(() => {
        if (timer) {
            clearInterval(timer);
        }
    });

    return {
        currentTime: readonly(currentTime),
        currentDate: readonly(currentDate),
    };
}
