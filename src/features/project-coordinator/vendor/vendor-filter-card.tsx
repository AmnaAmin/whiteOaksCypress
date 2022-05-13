import { Center, HStack, VStack, Text } from '@chakra-ui/react'
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
      height="120px"
      borderBottom="5px solid transparent"
      border="1px solid transparent"
      onClick={() => props.onSelectCard(props.selectedCard !== props.id && props.id)}
      borderColor={props.selectedCard === props.id ? '#4E87F8' : ''}
    >
      <HStack spacing="4" mt="15px" ml="13px">
        <Center bg={props.bgColor} w="52px" h="52px" rounded="full">
          {props.IconElement}
        </Center>

        <VStack alignItems="start" spacing={1}>
          <Text fontSize="16px" fontWeight={400} color="gray.600">
            {props.title}
          </Text>
          <Text fontSize="18px" fontWeight={600} color="gray.600">
            {props.number}
          </Text>
        </VStack>
      </HStack>
    </Card>
  )
}

export default VendorFilterCard
