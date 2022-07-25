import { Button, Divider, Stack } from '@chakra-ui/react'
import { WeekdayCard } from 'features/project-coordinator/weekday-filter-card'
import { t } from 'i18next'
import { useWeekDayProjectsDue } from 'utils/projects'

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

export const WeekDayFilters = ({ onSelectDay, selectedDay }) => {
  const { data: values } = useWeekDayProjectsDue()
  const days = useWeekdayCardJson(values)

  const allDays = () => {
    onSelectDay('All')
  }

  return (
    <>
      <Stack direction="row" justify="left" marginTop={1} alignItems="center">
        <Button
          bg={selectedDay === 'All' ? '#4E87F8' : 'none'}
          color={selectedDay === 'All' ? 'white' : 'black'}
          variant={'pill'}
          onClick={allDays}
          p={0}
        >
          {t('All')}
        </Button>
        <Divider orientation="vertical" height="23px" border="1px solid #A0AEC0 !important" />
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
            />
          )
        })}
        <Divider orientation="vertical" height="23px" border="1px solid #A0AEC0 !important" />
      </Stack>
    </>
  )
}
