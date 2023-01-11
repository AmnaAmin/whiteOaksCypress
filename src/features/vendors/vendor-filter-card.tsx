import { Center, HStack, Text, Spacer } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import React from 'react'

const VendorFilterCard: React.FC<{
  id: string
  IconElement: React.ReactNode
  title: string
  number: number
  bgColor: string
  selectedCard: string
  onSelectCard: (string) => void
}> = props => {
  return (
    <Card
      height="75px"
      borderTop="5px solid transparent"
      border="1px solid transparent"
      onClick={() => props.onSelectCard(props.selectedCard !== props.id && props.id)}
      borderColor={props.selectedCard === props.id ? '#345EA6' : ''}
      _hover={{ bg: 'blue.50' }}
      rounded="5px"
      px="0px"
    >
      <HStack spacing="4" alignItems="center" h="calc(100% - 5px)" ml="8px" mr="15.73px">
        <Center bg={props.bgColor} p="10px" rounded="full">
          {props.IconElement}
        </Center>

        <HStack alignItems="start" spacing={1} w="calc(100%)">
          <Text fontSize="16px" fontWeight={400} color="gray.600">
            {props.title}
          </Text>
          <Spacer />
          <Text fontSize="18px" fontWeight={600} color="gray.600">
            {props.number}
          </Text>
        </HStack>
      </HStack>
    </Card>
  )
}

export default VendorFilterCard
