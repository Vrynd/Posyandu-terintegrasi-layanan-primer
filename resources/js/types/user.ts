export interface UserItem {
    id: number;
    name: string;
    nik?: string | null;
    email: string;
    role: string;
    is_profile_complete: boolean;
    is_active: boolean;
    created_at: string;
}

export interface UserMetrics {
    totalCount: number;
    activeCount: number;
    suspendedCount: number;
    verifiedProfileCount: number;
}
