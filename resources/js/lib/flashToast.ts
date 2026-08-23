import { router } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';

let lastToastMessage = '';
let lastToastTime = 0;

function showToast(message: string, type: 'success' | 'error'): void {
    const now = Date.now();

    if (message === lastToastMessage && now - lastToastTime < 500) {
        return;
    }

    lastToastMessage = message;
    lastToastTime = now;

    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message);
    }
}

export function initializeFlashToast(): void {
    const handleFlash = (page: any): void => {
        const flash = page?.props?.flash;

        if (flash?.success) {
            showToast(flash.success, 'success');
        } else if (flash?.error) {
            showToast(flash.error, 'error');
        }
    };

    router.on('navigate', (event) => {
        handleFlash(event.detail.page);
    });

    router.on('success', (event) => {
        handleFlash(event.detail.page);
    });
}
