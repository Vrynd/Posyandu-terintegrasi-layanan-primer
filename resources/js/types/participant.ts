export interface ToddlerDetail {
    parent_name?: string | null;
}

export interface PregnancyDetail {
    husband_name?: string | null;
    pregnancy_number?: number | null;
    birth_spacing_years?: number | null;
    weight_before_pregnancy?: number | null;
    height?: number | null;
    last_menstrual_period?: string | null;
    status?: string;
}

export interface TeenDetail {
    parent_name?: string | null;
}

export interface AdultDetail {
    employment?: string | null;
    employment_other?: string | null;
    marital_status?: string | null;
}

/**
 * Data entitas peserta posyandu.
 */
export interface ParticipantItem {
    id: number;
    ulid: string;
    name: string;
    nik?: string | null;
    nik_masked?: string | null;
    category:
        | 'toddler'
        | 'pregnant_mother'
        | 'teenager'
        | 'productive'
        | 'adult'
        | string;
    birth_date: string;
    gender: 'male' | 'female' | string;
    address?: string | null;
    rt?: string | null;
    rw?: string | null;
    phone?: string | null;
    has_bpjs: boolean;
    bpjs_number?: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    toddler?: ToddlerDetail | null;
    latest_pregnancy?: PregnancyDetail | null;
    teen?: TeenDetail | null;
    adult?: AdultDetail | null;
}

/**
 * Format opsi filter / dropdown [{ label, value }].
 */
export interface FilterOption {
    label: string;
    value: string;
}

/**
 * State filter yang diterima dari controller.
 */
export interface ParticipantFilters {
    search?: string | null;
    category?: string | null;
    sort?: string | null;
}
