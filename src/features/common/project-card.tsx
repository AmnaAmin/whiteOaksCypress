import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import React from 'react'

type ProjectCardProps = {
  id: number | string
  title: string
  value: string
  number: string | number
  IconElement: React.ReactNode
  selectedCard: string
  onSelectCard: (string) => void
  isLoading: boolean
  disabled?: boolean
}

export const ProjectCard = ({
  title,
  disabled,
  selectedCard,
  onSelectCard,
  value,
  number,
  isLoading,
  IconElement,
}: ProjectCardProps) => {
  return (
    <Box as="label" boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
      <Flex
        boxShadow=" 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
        minH="63px"
        borderRadius="5px"
        bg="#FFFFFF"
        alignItems="center"
        transition="0.3s all"
        cursor={disabled ? 'not-allowed' : 'pointer'}
        justifyContent="space-between"
        border="1px solid transparent"
        borderTop="4px solid transparent"
        // pointerEvents={disabled ? 'none' : 'auto'}
        onClick={() => !disabled && onSelectCard(selectedCard !== value && value)}
        borderColor={selectedCard === value ? '#4E87F8' : ''}
        _hover={{ bg: 'blue.50' }}
      >
        <Flex w="100%" mb="5px">
          <Text marginLeft={'7.87px'}>{IconElement}</Text>
          <HStack w="100%" justifyContent="space-between">
            <Text fontSize="14px" fontWeight="400" marginTop="4px" paddingLeft={'9.89px'} color="gray.700">
              {title}
            </Text>
            <Text
              fontWeight="600"
              fontSize="20px"
              fontStyle="normal"
              color="gray.700"
              pr="19.27px"
              data-testid={`value-of-${title.toLocaleLowerCase()}`}
            >
              {isLoading ? <BlankSlate /> : number}
            </Text>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  )
}
