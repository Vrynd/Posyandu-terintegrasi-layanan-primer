export interface InvitationItem {
    id: number;
    recipient_name: string;
    recipient_email: string;
    is_used: boolean;
    is_expired: boolean;
    expires_at: string;
    created_at: string;
    user?: {
        name: string;
        email: string;
    } | null;
}

export interface InvitationMetrics {
    activeCount: number;
    usedCount: number;
    expiredCount: number;
    totalCount: number;
}
