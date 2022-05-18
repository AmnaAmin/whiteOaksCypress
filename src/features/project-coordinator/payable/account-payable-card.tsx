import { Box, Divider, Flex, Stack, Icon, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { BsFillCalendar3Fill } from 'react-icons/bs'

type AccountPaybleCardType = {
  IconColor: string
  value: string
  number: number
  text: string
  Id: string
  onSelected: (string) => void
  cardSelected: string
}

export const AccountPaybleCard = (props: AccountPaybleCardType) => {
  return (
    <Card
      bg="white"
      p={5}
      borderRadius={8}
      border="1px solid transparent"
      borderTop="4px solid transparent"
      borderColor={props.cardSelected === props.Id ? '#4E87F8' : ''}
      onClick={() => props.onSelected(props.cardSelected !== props.Id && props.Id)}
      id={props.Id}
    >
      <Stack>
        <Box>
          <Text fontSize="18px" fontWeight={600}>
            {props.value}
          </Text>
          <Flex alignItems="center">
            <Icon as={BsFillCalendar3Fill} color={props.IconColor} />
            <Text ml={2} fontSize="16px" fontWeight={400} color="gray.600">
              {props.text}
            </Text>
          </Flex>
        </Box>
        <Divider border="3px solid" borderColor="blue.200" />
        <Box>
          <Text fontSize="16px" fontWeight={400} color="gray.600">
            {props.number}
          </Text>
        </Box>
      </Stack>
    </Card>
  )
}
