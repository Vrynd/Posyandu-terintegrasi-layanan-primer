export type MetricVariant =
    | 'violet'
    | 'pink'
    | 'blue'
    | 'tosca'
    | 'orange'
    | 'yellow'
    | 'emerald'
    | 'indigo'
    | 'amber'
    | 'rose'
    | 'default';

export type MetricTrend = 'up' | 'down' | 'neutral';

export interface MetricStat {
    value: number;
    change?: number | null;
    trend?: MetricTrend | null;
    period?: string | null;
}

export type TrendCategory =
    'pregnant' | 'toddler' | 'teenager' | 'productive' | 'adult';

export interface MonthlyExamination {
    month: string;
    fullMonth: string;
    pregnant: number;
    toddler: number;
    teenager: number;
    productive: number;
    adult: number;
}

export interface FollowUpItem {
    id: number | string;
    ulid?: string;
    name: string;
    category: TrendCategory;
    issues: string[];
    examinationDate: string;
    location: string;
    examinerName: string;
}
