import { Box, Button, Center, Divider, Flex } from '@chakra-ui/react'
type weekdayCardTypes = {
  id: number | string
  dayName: string
  dueDate?: string
  count: string | number
  selectedDay: string
  onSelectDay: (string) => void
  disabled?: boolean
  isLoading?: boolean
  clear?: () => void
}

export const WeekdayCard = (props: weekdayCardTypes) => {
  const clickHandler = () => {
    if (props.selectedDay === props.id) {
      props?.clear?.()
    } else {
      props.onSelectDay(props.selectedDay !== props.id && props.id)
    }
  }

  return (
    <Flex alignItems="center" cursor={props.count === 0 ? 'not-allowed' : ''} m="0 !important">
      <Button
        bg={props.selectedDay === props.id ? '#345EA6' : 'none'}
        border="none"
        rounded="20"
        _hover={{ bg: '#345EA6', color: 'white', rounded: '20', border: 'none' }}
        _focus={{ border: 'none' }}
        fontSize="16px"
        fontStyle="normal"
        fontWeight={400}
        alignContent="right"
        color={props.selectedDay === props.id ? 'white' : '#4A5568'}
        onClick={clickHandler}
        disabled={props.count ? false : true}
        mx="2"
      >
        {props.dayName}
        <Center
          minW="22px"
          h="22px"
          ml="4px"
          px="2px"
          rounded="full"
          bg={props.selectedDay === props.id ? 'white' : '#E2E8F0'}
          color={props.selectedDay === props.id ? '#345EA6' : '#4A5568'}
          _hover={{ bg: 'white', color: '#345EA6', rounded: '50', border: 'none' }}
          fontSize="16px"
          fontWeight={600}
          data-testid={`value-of-${props.dayName.toLocaleLowerCase()}`}
        >
          {props.count}
        </Center>
      </Button>
      <Box>
        <Divider orientation="vertical" borderColor="#A0AEC0" h="23px" />
      </Box>
    </Flex>
  )
}
