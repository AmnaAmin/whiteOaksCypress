import { Button, Divider, Stack } from '@chakra-ui/react'
import { WeekdayCard } from 'features/project-coordinator/weekday-filter-card'
import { t } from 'i18next'

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

export const WeekDayFilters: React.FC<WeekDayFiltersProps> = ({
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
      <Stack direction="row" justify="left" marginTop={1} alignItems="center">
        
        {/* Hiding All and Clear Filter for now */}

        {/* <Button
          bg={selectedDay === 'All' ? '#4E87F8' : 'none'}
          color={selectedDay === 'All' ? 'white' : 'black'}
          variant={'pill'}
          onClick={allDays}
          p={0}
        >
          {t('All')}
        </Button> */}
        {/* <Divider orientation="vertical" height="23px" border="1px solid #A0AEC0 !important" /> */}
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

        {/* Hiding All and Clear Filter for now */}

        {/* <Divider orientation="vertical" height="23px" border="1px solid #A0AEC0 !important" /> */}
        {/* <Button variant="ghost" colorScheme="brand" onClick={clear}>
          {t('clearFilter')}
        </Button> */}
      </Stack>
    </>
  )
}
