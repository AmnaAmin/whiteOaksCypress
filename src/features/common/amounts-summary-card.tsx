import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { AccountIcon } from 'features/recievable/accounts-Icon'

type AmountsSummaryType = {
  IconColor: string
  isLoading?: boolean
  value: string
  number: number | string
  text: string
  Id: string
  onSelected: (string) => void
  cardSelected: string
  enabled?: boolean
}

export const AmountsSummaryCard: React.FC<AmountsSummaryType> = ({
  children,
  IconColor,
  isLoading,
  value,
  text,
  Id,
  onSelected,
  cardSelected,
  enabled,
}) => {
  return (
    <Card
      bg="white"
      _hover={{ bg: '#EBF8FF' }}
      p={6}
      cursor={enabled ? 'pointer' : 'not-allowed'}
      borderRadius={8}
      border="1px solid transparent"
      borderTop="4px solid transparent"
      borderColor={cardSelected === Id ? '#4E87F8' : ''}
      onClick={() => {
        if (enabled) {
          onSelected(cardSelected !== Id && Id)
        }
      }}
      id={Id}
    >
      <Stack>
        <Box lineHeight="32px">
          {isLoading ? <BlankSlate size="sm" /> : children}
          {!isLoading && (
            <Text fontSize="18px" fontWeight={600} color="gray.600">
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
      </Stack>
      {isLoading ? <BlankSlate size="sm" /> : children}
    </Card>
  )
}
