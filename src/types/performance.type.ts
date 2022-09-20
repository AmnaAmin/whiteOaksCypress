
export type Performance = {
    revenue: string,
    profit: number,
    target: number,
    newTarget: string,
    newBonus: 0,
    badge: BADGES[0],
    currentBonus: number,
    previousBonus: number,
    ignoreQuota: number,
    removeCards: boolean,
    name: string,
}

export type BADGES = ['NONE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

