// resources/js/composables/useFlash.ts
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { GeneratedTokenData } from '@/types/token';

export function useFlash() {
    const page = usePage();

    const flash = computed(() => page.props.flash);
    const success = computed(() => page.props.flash?.success);
    const error = computed(() => page.props.flash?.error);
    const tempPassword = computed(() => page.props.flash?.temp_password);
    const tokenIssuance = computed(
        () =>
            page.props.flash?.generated_token as GeneratedTokenData | undefined,
    );
    const tokenCode = computed(() => tokenIssuance.value?.token);

    return {
        flash,
        success,
        error,
        tempPassword,
        tokenIssuance,
        tokenCode,
    };
}
