import { Box, Button, Stack } from '@chakra-ui/react'

type weekdayCardTypes = {
  id: number | string
  dayName: string
  dueDate: string
  count: string | number
  selectedDay: string
  onSelectDay: (string) => void
  disabled?: boolean
  isLoading,
}

const clearFilterCount = {
  width: '24px',
  height: '24px',
  m: 1,
  borderRadius: '50%',
  fontSize: '14px',
  paddingTop: 2,
  display: 'flex',
  justifyContent: 'center',
}

export const WeekdayCard = (props: weekdayCardTypes) => {
  return (
    <Stack direction="row" justify="left" marginTop={1} marginLeft={15}>
      <Button
        variant={'pill'}
        bg={props.selectedDay === props.id ? '#4E87F8' : 'none'}
        color={props.selectedDay === props.id ? 'white' : 'black'}
        onClick={() => props.onSelectDay(props.selectedDay !== props.id && props.id)}
        disabled={props.count ? false : true}
      >
        {props.dayName}
        <Box
          ml="5px"
          style={clearFilterCount}
          bg={props.selectedDay === props.id ? 'white' : '#E2E8F0'}
          color={props.selectedDay === props.id ? '#4E87F8' : 'black'}
          _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
          fontSize="14px"
          mt={2}
          paddingLeft={2}
          data-testid={`value-of-${props.dayName.toLocaleLowerCase()}`}
        >
          {props.count}
        </Box>
      </Button>
    </Stack>
  )
}
