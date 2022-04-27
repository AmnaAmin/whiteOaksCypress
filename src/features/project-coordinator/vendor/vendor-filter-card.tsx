import { Center, HStack, VStack, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import React from 'react'

const VendorFilterCard: React.FC<{
  id: string
  IconElement: React.ReactNode
  title: string
  number: number
  bgColor: string
}> = props => {
  return (
    <Card
      boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
      height="120px"
      rounded="8px"
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
