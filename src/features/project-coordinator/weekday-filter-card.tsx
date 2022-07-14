import { Button, Flex, Stack } from '@chakra-ui/react'

type weekdayCardTypes = {
  id: number | string
  dayName: string
  dueDate: string
  count: string | number
  selectedDay: string
  onSelectDay: (string) => void
  disabled?: boolean
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
        fontWeight={500}
        alignContent="right"
        color={props.selectedDay === props.id ? 'white' : 'black'}
        onClick={() => props.onSelectDay(props.selectedDay !== props.id && props.id)}
        disabled={props.count ? false : true}
      >
        {props.dayName}
        <Flex
          w="22px"
          h="22px !important"
          m={1}
          rounded="50"
          bg={props.selectedDay === props.id ? 'white' : '#E2E8F0'}
          color={props.selectedDay === props.id ? '#4E87F8' : 'black'}
          _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
          fontSize="14px"
          paddingTop={1}
          paddingLeft={2}
          paddingRight={2}
          mb={2}
        >
          {props.count}
        </Flex>
      </Button>
    </Stack>
  )
}
