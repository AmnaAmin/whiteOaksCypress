import { Box, Divider, Flex, Stack, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { AccountIcon } from './accounts-Icon'

type AccountPaybleCardType = {
  IconColor: string
  value: string
  number: number
  text: string
  Id: string
  onSelected: (string) => void
  cardSelected: string
}

export const AccountFilterCard = (props: AccountPaybleCardType) => {
  return (
    <Card
      bg="white"
      _hover={{ bg: '#EBF8FF' }}
      p={6}
      borderRadius={8}
      border="1px solid transparent"
      borderTop="4px solid transparent"
      borderColor={props.cardSelected === props.Id ? '#4E87F8' : ''}
      onClick={() => props.onSelected(props.cardSelected !== props.Id && props.Id)}
      id={props.Id}
    >
      <Stack>
        <Box lineHeight="32px">
          <Text fontSize="18px" fontWeight={600}>
            {props.value}
          </Text>
          <Flex alignItems="center">
            <AccountIcon color={props.IconColor} />
            <Text ml={2} fontSize="16px" fontWeight={400} color="gray.600">
              {props.text}
            </Text>
          </Flex>
        </Box>
        <Divider h="4px" bg="blue.200" opacity="30%" />
        <Box>
          <Text fontSize="16px" fontWeight={400} color="gray.600">
            {props.number}
          </Text>
        </Box>
      </Stack>
    </Card>
  )
}
