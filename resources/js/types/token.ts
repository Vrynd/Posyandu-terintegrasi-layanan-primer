export interface TokenItem {
    id: number;
    user: {
        name: string;
        email: string;
    };
    is_used: boolean;
    is_valid: boolean;
    used_at: string | null;
    expires_at: string;
    created_at: string;
}

export interface GeneratedTokenData {
    name: string;
    email: string;
    token: string;
    expires_in_minutes: number;
}
