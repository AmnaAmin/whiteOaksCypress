import { useAccountPayable } from 'api/account-payable'

const WEEK_FILTERS = [
  {
    id: 'Monday',
    title: 'Mon',
    day: 1,
    date: null,
    count: 0,
  },
  {
    id: 'Tuesday',
    title: 'Tue',
    day: 2,
    date: null,
    count: 0,
  },
  {
    id: 'Wednesday',
    title: 'Wed',
    day: 3,
    date: null,
    count: 0,
  },
  {
    id: 'Thursday',
    title: 'Thu',
    day: 4,
    date: null,
    count: 0,
  },
  {
    id: 'Friday',
    title: 'Fri',
    day: 5,
    date: null,
    count: 0,
  },
  {
    id: 'Saturday',
    title: 'Sat',
    day: 6,
    date: null,
    count: 0,
  },
  {
    id: 'Sunday',
    title: 'Sun',
    day: 0,
    date: null,
    count: 0,
  },
]

export const usePayableWeeklyCount = () => {
  const { data: PayableData } = useAccountPayable()

  const getWeekDates = () => {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0-6
    const numDay = now.getDate()

    const start = new Date(now) // copy
    start.setDate(numDay - dayOfWeek)
    start.setHours(0, 0, 0, 0)

    const end = new Date(now) // copy
    end.setDate(numDay + (7 - dayOfWeek))
    end.setHours(0, 0, 0, 0)

    return [start, end]
  }

  const filterDatesByCurrentWeek = d => {
    const [start, end] = getWeekDates()
    if (d >= start && d <= end) {
      return true
    }
    return false
  }

  const payableWeeeklyCount = (list, weekDays) => {
    if (!list) return weekDays
    return weekDays.map(weekDay => {
      const listOfDaysCount = list.filter(w => {
        if (w.expectedPaymentDate === null) return false

        const date = new Date(w.expectedPaymentDate)

        return filterDatesByCurrentWeek(date) && weekDay.day === date.getDay()
      })

      return {
        ...weekDay,
        count: listOfDaysCount?.length,
        date: listOfDaysCount[0]?.expectedPaymentDate?.split('T')[0],
      }
    })
  }

  const weekDayFilters = payableWeeeklyCount(PayableData?.workOrders, WEEK_FILTERS)

  return {
    weekDayFilters,
  }
}
