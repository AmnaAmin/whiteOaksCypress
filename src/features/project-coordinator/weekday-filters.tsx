import { Button } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import { Divider } from '@chakra-ui/react'
import { Box, Center } from '@chakra-ui/react'
import { WeekdayCard } from 'features/project-coordinator/weekday-filter-card'
import React, { useState } from 'react'
import { useWeekDayProjectsDue } from 'utils/projects'
import { ProjectCard } from '../projects/project-card'

const useWeekdayCardJson = days => {
  return [
    {
      id: 'mon',
      title: 'Mon',
      number: days?.find(c => c.dayName === 'Monday')?.count,
      date: days?.find(c => c.dayName === 'Monday')?.dueDate,
    },
    {
      id: 'tue',
      title: 'Tue',
      number: days?.find(c => c.dayName === 'Tuesday')?.count,
      date: days?.find(c => c.dayName === 'Tuesday')?.dueDate,
    },
    {
      id: 'wed',
      title: 'Wed',
      number: days?.find(c => c.dayName === 'Wednesday')?.count,
      date: days?.find(c => c.dayName === 'Wednesday')?.dueDate,
    },
    {
      id: 'thu',
      title: 'Thu',
      number: days?.find(c => c.dayName === 'Thursday')?.count,
      date: days?.find(c => c.dayName === 'Thursday')?.dueDate,
    },
    {
      id: 'fri',
      title: 'Fri',
      number: days?.find(c => c.dayName === 'Friday')?.count,
      date: days?.find(c => c.dayName === 'Friday')?.dueDate,
    },
    {
      id: 'sat',
      title: 'Sat',
      number: days?.find(c => c.dayName === 'Saturday')?.count,
      date: days?.find(c => c.dayName === 'Saturday')?.dueDate,
    },
    {
      id: 'sun',
      title: 'Sun',
      number: days?.find(c => c.dayName === 'Sunday')?.count,
      date: days?.find(c => c.dayName === 'Sunday')?.dueDate,
    },
  ]
}

export const ProjectDayFilters = ({ onSelectCard, selectedCard }) => {
  const [dayClicked, setDayClicked] = useState(null)

  const { data: values } = useWeekDayProjectsDue()
  console.log(values)
  const days = useWeekdayCardJson(values)

  const clearAll = () => {
    setDayClicked(null)
  }

  return (
    <>
      <Stack direction="row" justify="left" marginTop={1} marginLeft={15}>
        <Button
          bg="none"
          border="none"
          rounded="20"
          _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          alignContent="right"
          color="black"
        >
          All
        </Button>
        <Divider orientation="vertical" height="35px" border="1px solid #A0AEC0 !important" />
        {days.map(day => {
          return (
            <WeekdayCard
              dueDate={day.date}
              dayName={day.title}
              count={day.number ? day.number : 0}
              key={day.id}
              {...day}
              onSelectCard={onSelectCard}
              selectedCard={selectedCard}
            />
          )
        })}
        <Divider orientation="vertical" height="35px" border="1px solid #A0AEC0 !important" />

        <Button
          bg="none"
          color="#4E87F8"
          _hover={{ bg: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          onClick={clearAll}
        >
          Clear Filter
        </Button>
      </Stack>
    </>
  )
}
