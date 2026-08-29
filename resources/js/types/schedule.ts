export interface ScheduleItem {
    id: number;
    ulid: string;
    user_id?: number | null;
    title: string;
    start_date: string;
    end_date: string;
    start_time?: string | null;
    end_time?: string | null;
    location: string;
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
    sort?: string | null;
}

export interface HistoryFilters {
    month?: number | null;
    year?: number | null;
}
