import { Box, Flex, Text } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import React from 'react'

type ProjectCardProps = {
  id: number | string
  title: string
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
  id,
  number,
  isLoading,
  IconElement,
}: ProjectCardProps) => {
  return (
    <Box as="label" boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
      {isLoading ? (
        <BlankSlate />
      ) : (
        <Flex
          boxShadow=" 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
          minH="112px"
          borderRadius="8px"
          bg="#FFFFFF"
          alignItems="center"
          transition="0.3s all"
          cursor="pointer"
          justifyContent="space-between"
          border="1px solid transparent"
          borderTop="4px solid transparent"
          pointerEvents={disabled ? 'none' : 'auto'}
          onClick={() => onSelectCard(selectedCard !== id && id)}
          borderColor={selectedCard === id ? '#4E87F8' : ''}
          _hover={{ bg: 'blue.50' }}
        >
          <Flex height="100%">
            <Text marginLeft={'20px'}> {IconElement}</Text>
            <Box>
              <Text fontSize="16px" fontWeight="400" marginTop="4px" paddingLeft={'20px'} color="gray.600">
                {title}
              </Text>
              <Text
                fontWeight="600"
                fontSize="18px"
                fontStyle="normal"
                color="gray.600"
                paddingLeft={'20px'}
                data-testid={`value-of-${title.toLocaleLowerCase()}`}
              >
                {isLoading ? <BlankSlate /> : number}
              </Text>
            </Box>
          </Flex>
        </Flex>
      )}
    </Box>
  )
}
