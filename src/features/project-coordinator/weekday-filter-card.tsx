import { Button, Center, Stack } from '@chakra-ui/react'
type weekdayCardTypes = {
  id: number | string
  dayName: string
  dueDate?: string
  count: string | number
  selectedDay: string
  onSelectDay: (string) => void
  disabled?: boolean
  isLoading?: boolean
}

export const WeekdayCard = (props: weekdayCardTypes) => {
  return (
    <Stack direction="row" justify="left" marginTop={1} marginLeft={15}>
      <Button
        bg={props.selectedDay === props.id ? '#4E87F8' : 'none'}
        border="none"
        rounded="20"
        _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
        _focus={{ border: 'none' }}
        fontSize="16px"
        fontStyle="normal"
        fontWeight={400}
        alignContent="right"
        color={props.selectedDay === props.id ? 'white' : '#4A5568'}
        onClick={() => props.onSelectDay(props.selectedDay !== props.id && props.id)}
        disabled={props.count ? false : true}
      >
        {props.dayName}
        <Center
          minW="22px"
          h="22px"
          ml="4px"
          px="2px"
          rounded="full"
          bg={props.selectedDay === props.id ? 'white' : '#E2E8F0'}
          color={props.selectedDay === props.id ? '#4E87F8' : '#4A5568'}
          _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
          fontSize="16px"
          fontWeight={600}
          data-testid={`value-of-${props.dayName.toLocaleLowerCase()}`}
        >
          {props.count}
        </Center>
      </Button>
    </Stack>
  )
}
