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
    employment_label?: string | null;
    marital_status?: string | null;
    marital_status_label?: string | null;
}

export interface ExaminationToddlerDetail {
    age_in_months?: number | null;
    weight_status?: string | null;
    weight_status_label?: string | null;
    height?: number | null;
    head_circumference?: number | null;
    arm_circumference?: number | null;
    has_illness_symptoms?: boolean;
    interventions?: string[] | null;
}

export interface ExaminationPregnantMotherDetail {
    pregnancy_id?: number | null;
    gestational_age_weeks?: number | null;
    upper_arm_circumference?: number | null;
    systolic_pressure?: number | null;
    diastolic_pressure?: number | null;
    has_iron_tablets?: boolean;
    exclusive_breastfeeding_counseling?: boolean;
    receives_pmt_kek?: boolean;
    attends_prenatal_class?: boolean;
}

export interface ExaminationTeenDetail {
    height?: number | null;
    abdominal_circumference?: number | null;
    systolic_pressure?: number | null;
    diastolic_pressure?: number | null;
    blood_sugar?: number | null;
    hemoglobin?: string | null;
    bmi_category?: string | null;
    bmi_category_label?: string | null;
    mental_screenings?: string[] | null;
}

export interface ExaminationAdultDetail {
    height?: number | null;
    abdominal_circumference?: number | null;
    systolic_pressure?: number | null;
    diastolic_pressure?: number | null;
    blood_sugar?: number | null;
    uric_acid?: number | null;
    cholesterol?: number | null;
    eye_test?: string | null;
    eye_test_label?: string | null;
    ear_test?: string | null;
    ear_test_label?: string | null;
    contraceptive?: string | null;
    bmi_category?: string | null;
    bmi_category_label?: string | null;
    is_smoking?: boolean;
    high_sugar_intake?: boolean;
    high_salt_intake?: boolean;
    high_fat_intake?: boolean;
    puma_score?: number | null;
    puma_screenings?: string[] | null;
    adl_score?: number | null;
    independence_level?: string | null;
    independence_level_label?: string | null;
    adl_screenings?: string[] | null;
}

export interface ExaminationItem {
    id: number;
    ulid: string;
    examination_date: string;
    weight?: number | null;
    is_referred: boolean;
    location: string;
    location_label?: string | null;
    skrining_tbc?: string[] | null;
    edukasi?: string[] | null;
    toddler?: ExaminationToddlerDetail | null;
    pregnant_mother?: ExaminationPregnantMotherDetail | null;
    teen?: ExaminationTeenDetail | null;
    adult?: ExaminationAdultDetail | null;
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
    latest_examination?: ExaminationItem | null;
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
