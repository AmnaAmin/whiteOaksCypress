import { Box, Button, Divider, Flex, Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

type multitypes = {
  id: number | string
  dayName: string
  dueDate: string
  count: string | number
  selectedCard: string
  onSelectCard: (string) => void
  disabled?: boolean
}

export const WeekdayCard = (props: multitypes) => {
  // const handleClick = (day, count, date) => {
  //   if (count > 0) {
  //     setDayClicked(day)
  //     props.search(date)
  //   }
  // }
  // const { dayClicked, setDayClicked } = useState(false)

  const handleClick = e => {
    console.log('this is working fine')
    e.preventDefault()
    e.target.style.color = 'red'
    console.log(e.target)
    // setDayClicked(true)
    alert(props.selectedCard)
    alert(props.id)
    alert(props.dayName)
    alert(props.dueDate)
  }

  return (
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
        onClick={() => props.onSelectCard(props.selectedCard !== props.id && props.id)}
        borderColor={props.selectedCard === props.id ? 'black' : ''}
      >
        {props.dayName}
        <Flex
          w="22px"
          h="22px !important"
          margin={1}
          rounded="50"
          bg="#E2E8F0"
          color="black"
          _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
          fontSize="12px"
          paddingTop={1}
          paddingLeft={2}
        >
          {props.count}
        </Flex>
      </Button>
    </Stack>
  )
}
