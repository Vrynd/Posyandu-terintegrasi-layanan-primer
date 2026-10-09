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
