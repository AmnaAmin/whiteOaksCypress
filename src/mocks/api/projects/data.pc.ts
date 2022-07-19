export const newCardValue = 4
export const activeCardValue = 1
export const punchCardValue = 1

export const PROJECT_FILTER_CARDS = [
  {
    status: 7,
    count: newCardValue,
  },
  {
    status: 8,
    count: activeCardValue,
  },
  {
    status: 9,
    count: punchCardValue,
  },
  {
    status: 72,
    count: 15,
  },
  {
    status: 62,
    count: 1,
  },
  {
    status: 63,
    count: 3,
  },
]

export const monDayValue = 0
export const tueDayValue = 0
export const wedDayValue = 5
export const allValue = 2

export const WEEKDAY_FILTER = [
  {
    dayName: 'All',
    count: allValue,
  },
  {
    dayName: 'Mon',
    count: monDayValue,
  },
  {
    dayName: 'Tue',
    count: tueDayValue,
  },
  {
    dayName: 'Wed',
    count: wedDayValue,
  },
  {
    dayName: 'Thu',
    count: 1,
  },
  {
    dayName: 'Fri',
    count: 0,
  },
  {
    dayName: 'Sat',
    count: 0,
  },
  {
    dayName: 'Sun',
    count: 0,
  },
]
