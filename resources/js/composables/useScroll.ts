import { nextTick, ref, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';

export interface UseScrollOptions {
    /** Jarak geser statis (opsional). Jika kosong, otomatis menggeser 1 halaman penuh */
    scrollAmount?: number;
    /** Jarak gap antar kolom (piksel) agar pergeseran 1 halaman pas di batas kolom */
    gap?: MaybeRefOrGetter<number>;
    /** Batas toleransi piksel untuk menentukan apakah masih bisa di-scroll */
    threshold?: number;
}

export function useScroll(
    containerRef: Ref<HTMLElement | null>,
    { scrollAmount, gap = 0, threshold = 10 }: UseScrollOptions = {},
) {
    const containerWidth = ref(0);
    const scrollOffset = ref(0);
    const canScrollLeft = ref(false);
    const canScrollRight = ref(true);

    let resizeObserver: ResizeObserver | null = null;

    function updateScrollState(): void {
        if (!containerRef.value) {
            return;
        }

        const { scrollLeft, scrollWidth, clientWidth } = containerRef.value;
        containerWidth.value = clientWidth;
        scrollOffset.value = scrollLeft;
        canScrollLeft.value = scrollLeft > threshold;
        canScrollRight.value =
            scrollLeft < scrollWidth - clientWidth - threshold;
    }

    function getStep(el: HTMLElement): number {
        return scrollAmount ?? el.clientWidth + toValue(gap);
    }

    function scrollPrev(): void {
        const el = containerRef.value;

        if (!el) {
            return;
        }

        el.scrollBy({
            left: -getStep(el),
            behavior: 'smooth',
        });
    }

    function scrollNext(): void {
        const el = containerRef.value;

        if (!el) {
            return;
        }

        el.scrollBy({
            left: getStep(el),
            behavior: 'smooth',
        });
    }

    function scrollToEnd(behavior: ScrollBehavior = 'instant'): void {
        const el = containerRef.value;

        if (!el) {
            return;
        }

        el.scrollTo({
            left: el.scrollWidth - el.clientWidth,
            behavior,
        });
        updateScrollState();
    }

    watch(
        containerRef,
        (el, _, onCleanup) => {
            if (!el) {
                return;
            }

            nextTick(() => {
                updateScrollState();
            });

            el.addEventListener('scroll', updateScrollState, { passive: true });

            if (typeof ResizeObserver !== 'undefined') {
                resizeObserver = new ResizeObserver(() => {
                    updateScrollState();
                });
                resizeObserver.observe(el);
            }

            onCleanup(() => {
                el.removeEventListener('scroll', updateScrollState);
                resizeObserver?.disconnect();
                resizeObserver = null;
            });
        },
        { immediate: true },
    );

    return {
        containerWidth,
        scrollOffset,
        canScrollLeft,
        canScrollRight,
        scrollPrev,
        scrollNext,
        scrollToEnd,
    };
}
