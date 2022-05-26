import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { ClientsTable } from 'features/project-coordinator/clients/clients-table'
import { useRef } from 'react'

const Clients = () => {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  return (
    <Box>
      <Flex h="52px" alignItems="center" justifyContent="space-between" px={2}>
        <Text fontSize="18px" fontWeight={500} color="gray.600">
          Clients Overview
        </Text>
        <Button colorScheme="brand" variant="ghost">
          + New Client
        </Button>
      </Flex>
      <Flex
        px={7}
        alignItems="center"
        bg="gray.50"
        h="52px"
        borderBottom="1px solid #E2E8F0"
        borderTopRadius={6}
        fontSize="18px"
        fontWeight={500}
        color="gray.600"
      >
        <Text flex={1}>Business Name</Text>
        <Divider orientation="vertical" border="1px solid" />
        <Text pl={5} flex={1}>
          Accounts Payable{' '}
        </Text>
      </Flex>
      <Box>
        <ClientsTable ref={tabsContainerRef} />
      </Box>
    </Box>
  )
}

export default Clients
