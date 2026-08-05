import { ref } from 'vue';

/**
 * Composable untuk generate kata sandi acak yang kuat
 * di sisi frontend, agar dapat diisi langsung ke input form
 * sebelum dikirim ke server.
 */
export function useGeneratePassword() {
    const generatedPassword = ref('');

    const generate = (): void => {
        const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lower = 'abcdefghijkmnpqrstuvwxyz';
        const numbers = '23456789';
        const symbols = '!@#$%&*';
        const all = upper + lower + numbers + symbols;

        const base =
            upper[Math.floor(Math.random() * upper.length)] +
            lower[Math.floor(Math.random() * lower.length)] +
            numbers[Math.floor(Math.random() * numbers.length)] +
            symbols[Math.floor(Math.random() * symbols.length)] +
            Array.from(
                { length: 12 },
                () => all[Math.floor(Math.random() * all.length)],
            ).join('');

        const shuffled = base
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');

        generatedPassword.value = shuffled;

        fillInputById('password', generatedPassword.value);
        fillInputById('password_confirmation', generatedPassword.value);
    };

    /**
     * Isi nilai native HTML input secara langsung agar
     * komponen yang tidak menggunakan v-model (seperti <Form>
     * dari Inertia) tetap bisa membaca nilai tersebut saat submit.
     */
    const fillInputById = (id: string, value: string): void => {
        const el = document.getElementById(id) as HTMLInputElement | null;

        if (!el) {
            return;
        }

        const setter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value',
        )?.set;

        if (setter) {
            setter.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    return {
        generatedPassword,
        generate,
    };
}
