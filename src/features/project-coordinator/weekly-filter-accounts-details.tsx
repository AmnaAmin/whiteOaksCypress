import { Flex } from '@chakra-ui/react'
import { WeekdayCard } from './weekday-filter-card'

export type WeekDayFiltersProps = {
  onSelectDay: (string) => void
  selectedDay: string
  clear?: () => void
  weekDayFilters: any[]
}

// temporarly making this component for now to fullfill RFT for integration of due filter, it will be refactored.

export const WeekDayFiltersAR: React.FC<WeekDayFiltersProps> = ({
  onSelectDay,
  selectedDay,
  clear,
  weekDayFilters,
}) => {
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
        {weekDayFilters.map(day => {
          return (
            <WeekdayCard
              dayName={day.title}
              count={day.count ? day.count : 0}
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
