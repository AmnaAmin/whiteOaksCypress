import { Box, Divider, Flex, Stack, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { AccountIcon } from './accounts-Icon'

type AccountPaybleCardType = {
  IconColor: string
  isLoading?: boolean
  value: string
  number: number
  text: string
  Id: string
  onSelected: (string) => void
  cardSelected: string
}

export const AccountFilterCard: React.FC<AccountPaybleCardType> = ({
  children,
  IconColor,
  isLoading,
  value,
  number,
  text,
  Id,
  onSelected,
  cardSelected,
}) => {
  return (
    <Card
      bg="white"
      _hover={{ bg: '#EBF8FF' }}
      p={6}
      borderRadius={8}
      border="1px solid transparent"
      borderTop="4px solid transparent"
      borderColor={cardSelected === Id ? '#4E87F8' : ''}
      onClick={() => onSelected(cardSelected !== Id && Id)}
      id={Id}
      boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
    >
      <Stack>
        <Box lineHeight="32px">
          {isLoading ? <BlankSlate size="sm" /> : children}
          {!isLoading && (
            <Text fontSize="18px" fontWeight={600}>
              {value}
            </Text>
          )}
          <Flex alignItems="center">
            <AccountIcon color={IconColor} />
            <Text ml={2} fontSize="16px" fontWeight={400} color="gray.600">
              {text}
            </Text>
          </Flex>
        </Box>
        <Divider h="4px" bg="blue.200" opacity="30%" />
        <Box>
          <Text fontSize="16px" fontWeight={400} color="gray.600">
            {number}
          </Text>
        </Box>
      </Stack>
      {isLoading ? <BlankSlate size="sm" /> : children}
    </Card>
  )
}
