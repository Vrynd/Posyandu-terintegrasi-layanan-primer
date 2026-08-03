export interface UserItem {
    id: string;
    name: string;
    email: string;
    nik?: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
    is_profile_complete?: boolean;
    last_login_at?: string | null;
    updated_at?: string | null;
}

export interface UserMetrics {
    totalCount: number;
    suspendedCount: number;
    verifiedProfileCount: number;
    pendingVerificationCount: number;
}
