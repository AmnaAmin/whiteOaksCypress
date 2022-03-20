import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import React from 'react'

type multitypes = {
  id: number | string
  title: string
  number: string | number
  IconElement: React.ReactNode
  selectedCard: string
  onSelectCard: (string) => void
  disabled?: boolean
}

export const ProjectCard = (props: multitypes) => {
  return (
    <Box as="label" boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
      <Flex
        boxShadow=" 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
        minH="112px"
        borderRadius="8px"
        bg="#FFFFFF"
        justifyContent="space-between"
        border="2px solid transparent"
        pointerEvents={props.disabled ? 'none' : 'auto'}
        onClick={() => props.onSelectCard(props.selectedCard !== props.id && props.id)}
        borderColor={props.selectedCard === props.id ? 'brand.300' : ''}
      >
        <HStack w="95%" justifyContent="space-between">
          <Box>
            <Text fontSize="18px" color="#A0AEC0" fontWeight="500" marginTop="4px" paddingLeft={'20px'}>
              {props.title}
            </Text>
            <Text fontWeight="800" color="#4A5568" fontSize="20px" padding="8px 0 10px 20px">
              {props.number}
            </Text>
          </Box>
          <Flex h="100%" pt={5}>
            {props.IconElement}
          </Flex>
        </HStack>
      </Flex>
    </Box>
  )
}
