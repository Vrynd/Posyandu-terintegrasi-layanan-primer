import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { status } from '@/actions/App/Http/Controllers/Admin/UserController';
import type { UserItem } from '@/types';

export function useToggleStatus() {
    const isConfirmOpen = ref(false);
    const isProcessing = ref(false);
    const selectedUser = ref<UserItem | null>(null);

    const openConfirmModal = (user: UserItem) => {
        selectedUser.value = user;
        isConfirmOpen.value = true;
    };

    const confirmToggle = () => {
        if (!selectedUser.value) {
            return;
        }

        const userName = selectedUser.value.name;
        const nextStatusText = selectedUser.value.is_active
            ? 'dinonaktifkan'
            : 'diaktifkan';

        router.patch(
            status.url(selectedUser.value.id),
            {},
            {
                preserveScroll: true,
                onStart: () => {
                    isProcessing.value = true;
                },
                onSuccess: () => {
                    toast.success(
                        `Akun ${userName} berhasil ${nextStatusText}.`,
                    );
                },
                onError: () => {
                    toast.error('Gagal memperbarui status akun kader.');
                },
                onFinish: () => {
                    isProcessing.value = false;
                    isConfirmOpen.value = false;
                    selectedUser.value = null;
                },
            },
        );
    };

    return {
        isConfirmOpen,
        isProcessing,
        selectedUser,
        openConfirmModal,
        confirmToggle,
    };
}
