import { Flex } from '@chakra-ui/react'
import { WeekdayCard } from './weekday-filter-card'

export type WeekDayFiltersProps = {
  onSelectDay: (string) => void
  selectedDay: string
  clear?: () => void
  monday?: any
  tuesday?: any
  wednesday?: any
  thursday?: any
  friday?: any
  saturday?: any
  sunday?: any
}

// temporarly making this component for now to fullfill RFT for integration of due filter, it will be refactored.

export const WeekDayFiltersAR: React.FC<WeekDayFiltersProps> = ({
  onSelectDay,
  selectedDay,
  clear,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
}) => {
  const useWeekdayCardJson = () => {
    return [
      {
        id: 'Monday',
        title: 'Mon',
        number: monday?.count,
        // date: days?.find(c => c.dayName === 'Monday')?.dueDate,
      },
      {
        id: 'Tuesday',
        title: 'Tue',
        number: tuesday?.count,
      },
      {
        id: 'Wednesday',
        title: 'Wed',
        number: wednesday?.count,
      },
      {
        id: 'Thursday',
        title: 'Thu',
        number: thursday?.count,
      },
      {
        id: 'Friday',
        title: 'Fri',
        number: friday?.count,
      },
      {
        id: 'Saturday',
        title: 'Sat',
        number: saturday?.count,
      },
      {
        id: 'Sunday',
        title: 'Sun',
        number: sunday?.count,
      },
    ]
  }

  const days = useWeekdayCardJson()

  // const allDays = () => {
  //   onSelectDay('All')
  // }

  return (
    <>
      <Flex>
        {/* <Button
          bg={selectedDay === 'All' ? '#4E87F8' : 'none'}
          color={selectedDay === 'All' ? 'white' : 'black'}
          variant={'pill'}
          onClick={allDays}
          p={0}
        >
          {t('All')}
        </Button> */}
        {days.map(day => {
          return (
            <WeekdayCard
              dayName={day.title}
              count={day.number ? day.number : 0}
              key={day.id}
              {...day}
              onSelectDay={onSelectDay}
              selectedDay={selectedDay}
            />
          )
        })}
        {/* <Button variant="ghost" colorScheme="brand" onClick={clear}>
          {t('clearFilter')}
        </Button> */}
      </Flex>
    </>
  )
}
