import type { InertiaForm } from '@inertiajs/vue3';
import { watch } from 'vue';

/**

 * @param form Objek Inertia Form dari `useForm()`
 */
export function useAutoClear<TForm extends Record<string, any>>(
    form: InertiaForm<TForm>,
) {
    watch(
        () => ({ ...form.data() }),
        (newVal: TForm, oldVal?: TForm) => {
            if (!oldVal) {
                return;
            }

            const errors = form.errors as Record<string, string | undefined>;
            const newValues = newVal as Record<string, any>;
            const oldValues = oldVal as Record<string, any>;

            for (const key of Object.keys(errors)) {
                if (errors[key] && newValues[key] !== oldValues[key]) {
                    (form.clearErrors as (field?: string) => void)(key);
                }
            }
        },
    );
}

// Alias untuk fleksibilitas penamaan
export const useAutoClearErrors = useAutoClear;
