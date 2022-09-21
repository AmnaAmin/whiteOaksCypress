export type PerformanceType = {
    userId: number,
    revenue?: string,
    profit?: number,
    target?: number,
    newTarget?: string,
    newBonus?: { value: number; label: string; },
    badge: { value: string; label: string; },
    currentBonus?: number,
    previousBonus?: number,
    ignoreQuota?: { value: number; label: string; },
    removeCards?: boolean,
    name?: any,
}


