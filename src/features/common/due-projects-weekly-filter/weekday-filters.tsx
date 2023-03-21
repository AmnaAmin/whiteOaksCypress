import { Button, Stack } from '@chakra-ui/react'
import { WeekdayCard } from 'features/common/due-projects-weekly-filter/weekday-filter-card'
import { useWeekDayProjectsDue } from 'api/projects'
import { t } from 'i18next'

const useWeekdayCardJson = days => {
  return [
    {
      id: 'Monday',
      title: 'Mon',
      number: days?.find(c => c.dayName === 'Monday')?.count,
      date: days?.find(c => c.dayName === 'Monday')?.dueDate,
    },
    {
      id: 'Tuesday',
      title: 'Tue',
      number: days?.find(c => c.dayName === 'Tuesday')?.count,
      date: days?.find(c => c.dayName === 'Tuesday')?.dueDate,
    },
    {
      id: 'Wednesday',
      title: 'Wed',
      number: days?.find(c => c.dayName === 'Wednesday')?.count,
      date: days?.find(c => c.dayName === 'Wednesday')?.dueDate,
    },
    {
      id: 'Thursday',
      title: 'Thu',
      number: days?.find(c => c.dayName === 'Thursday')?.count,
      date: days?.find(c => c.dayName === 'Thursday')?.dueDate,
    },
    {
      id: 'Friday',
      title: 'Fri',
      number: days?.find(c => c.dayName === 'Friday')?.count,
      date: days?.find(c => c.dayName === 'Friday')?.dueDate,
    },
    {
      id: 'Saturday',
      title: 'Sat',
      number: days?.find(c => c.dayName === 'Saturday')?.count,
      date: days?.find(c => c.dayName === 'Saturday')?.dueDate,
    },
    {
      id: 'Sunday',
      title: 'Sun',
      number: days?.find(c => c.dayName === 'Sunday')?.count,
      date: days?.find(c => c.dayName === 'Sunday')?.dueDate,
    },
  ]
}

export type WeekDayFiltersProps = {
  onSelectDay: (string) => void
  selectedDay: string
  clear?: () => void
  selectedFPM?: any
}

export const WeekDayFilters: React.FC<WeekDayFiltersProps> = ({ onSelectDay, selectedDay, clear, selectedFPM }) => {
  const { data: values, isLoading } = useWeekDayProjectsDue(selectedFPM?.id)
  const days = useWeekdayCardJson(values)

  // const allDays = () => {
  //   onSelectDay('All')
  // }

  return (
    <>
      <Stack flexWrap={'wrap'} direction="row" justify="left" alignItems="center">
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
              dueDate={day.date}
              dayName={day.title}
              count={day.number ? day.number : 0}
              key={day.id}
              {...day}
              onSelectDay={onSelectDay}
              selectedDay={selectedDay}
              isLoading={isLoading}
              clear={clear}
            />
          )
        })}

        {/* <Divider orientation="vertical" height="23px" border="1px solid #A0AEC0 !important" /> */}
        <Button variant="ghost" colorScheme="brand" onClick={clear}>
          {t('clearFilter')}
        </Button>
      </Stack>
    </>
  )
}
