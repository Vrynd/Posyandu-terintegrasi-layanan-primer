// resources/js/composables/useClipboard.ts

import { ref } from 'vue';

export function useClipboard() {
    const copied = ref(false);

    const copyToClipboard = async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            copied.value = true;
            setTimeout(() => {
                copied.value = false;
            }, 2000);

            return true;
        } catch (error) {
            console.error('Gagal menyalin teks ke clipboard:', error);

            return false;
        }
    };

    return {
        copied,
        copyToClipboard,
    };
}
