export interface ScheduleItem {
    id: number;
    ulid: string;
    user_id?: number | null;
    title: string;
    activity_type?: string | null;
    date: string;
    start_time?: string | null;
    end_time?: string | null;
    location: string;
    description?: string | null;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    effective_status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    created_at?: string;
    updated_at?: string;
    creator?: {
        id: number;
        name: string;
    } | null;
}

export interface StatusOption {
    label: string;
    value: string;
    color: string;
}

export interface ScheduleFilters {
    search?: string | null;
    sort?: string | null;
}
