import { router } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';

export function initializeFlashToast(): void {
    const handleFlash = (page: any): void => {
        const flash = page?.props?.flash;

        if (!flash) {
            return;
        }

        if (flash.success) {
            toast.success(flash.success);
            flash.success = null;
        } else if (flash.error) {
            toast.error(flash.error);
            flash.error = null;
        }
    };

    router.on('success', (event) => {
        handleFlash(event.detail.page);
    });
}
