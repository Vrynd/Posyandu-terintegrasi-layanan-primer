import { ref } from 'vue';

export function useClickToFill(defaultTargetId: string = 'email') {
    const filledValue = ref('');

    const fillAndFocus = (
        value: string,
        targetId: string = defaultTargetId,
    ) => {
        filledValue.value = value;
        const element = document.getElementById(targetId);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
        }
    };

    const clearFilledValue = () => {
        filledValue.value = '';
    };

    return {
        filledValue,
        fillAndFocus,
        clearFilledValue,
    };
}
