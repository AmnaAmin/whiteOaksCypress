import { Box, Flex, Text } from '@chakra-ui/react'
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
        alignItems="center"
        justifyContent="space-between"
        border="1px solid transparent"
        borderTop="4px solid transparent"
        pointerEvents={props.disabled ? 'none' : 'auto'}
        onClick={() => props.onSelectCard(props.selectedCard !== props.id && props.id)}
        borderColor={props.selectedCard === props.id ? '#4E87F8' : ''}
        _hover={{ bg: 'blue.50' }}
      >
        <Flex height="100%">
          <Text marginLeft={'20px'}> {props.IconElement}</Text>
          <Box marginRight={{ base: '5px', md: '24px', xl: '24px' }}>
            <Text fontSize="16px" fontWeight="400" marginTop="4px" paddingLeft={'20px'} color="gray.600">
              {props.title}
            </Text>
            <Text fontWeight="600" fontSize="18px" fontStyle="normal" color="gray.600" paddingLeft={'20px'}>
              {props.number}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}
