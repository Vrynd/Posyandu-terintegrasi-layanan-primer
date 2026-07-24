import type { DeepReadonly, Ref } from 'vue';
import { readonly, ref } from 'vue';

const isSearchOpen = ref(false);

const openSearchModal = () => {
    isSearchOpen.value = true;
};

const closeSearchModal = () => {
    isSearchOpen.value = false;
};

const toggleSearchModal = () => {
    isSearchOpen.value = !isSearchOpen.value;
};

if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            isSearchOpen.value = !isSearchOpen.value;
        } else if (e.key === 'Escape' && isSearchOpen.value) {
            isSearchOpen.value = false;
        }
    });
}

export type UseSearchModalReturn = {
    isSearchOpen: DeepReadonly<Ref<boolean>>;
    openSearchModal: () => void;
    closeSearchModal: () => void;
    toggleSearchModal: () => void;
};

export function useSearchModal(): UseSearchModalReturn {
    return {
        isSearchOpen: readonly(isSearchOpen),
        openSearchModal,
        closeSearchModal,
        toggleSearchModal,
    };
}
