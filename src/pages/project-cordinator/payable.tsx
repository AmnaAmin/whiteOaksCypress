import { Box, Divider, Flex, Icon, Stack, Text } from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { PayableFiltter } from 'features/project-coordinator/payable/payable-filtter'
import { PayableTable } from 'features/project-coordinator/payable/payable-table'
import { WeekDayFilters } from 'features/project-coordinator/weekday-filters'
import { useState } from 'react'
import { BiExport, BiSync } from 'react-icons/bi'
import { FaAtom } from 'react-icons/fa'

export const Payable: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay, setSelectedDay] = useState<string>('')
  // const [cardSelected, setCardSelected] = useState(false)

  const clearAll = () => {
    setSelectedCard('')
    setIsClicked(false)
  }

  const allDays = () => {
    setSelectedCard('All')
    setIsClicked(true)
  }
  return (
    <Box>
      <Box mb={2}>
        <Text fontSize="18px" fontWeight={500} color="gray.600">
          Account Payable
        </Text>
      </Box>
      <Box>
        <PayableFiltter onSelected={setSelectedCard} cardSelected={selectedCard} />
      </Box>
      <Box mt={6} mb={2}>
        <Text fontSize="18px" fontWeight={500} color="gray.600">
          Due Projects
        </Text>
      </Box>
      <Stack w={{ base: '971px', xl: '100%' }} direction="row" spacing={1} marginTop={1} mb={3}>
        <Button
          colorScheme={isClicked ? 'brand' : 'none'}
          color={isClicked ? 'white' : 'black'}
          _hover={{ bg: '#4E87F8', color: 'white', border: 'none' }}
          alignContent="right"
          onClick={allDays}
          rounded={20}
          m={0}
        >
          All
        </Button>
        <WeekDayFilters onSelectDay={setSelectedDay} selectedDay={selectedDay} />
        <Button variant="ghost" colorScheme="brand" alignContent="right" onClick={clearAll}>
          Clear Filter
        </Button>
        <Button
          alignContent="right"
          // onClick={onNewProjectModalOpen}
          position="absolute"
          right={8}
          colorScheme="brand"
        >
          <Icon as={BiSync} fontSize="18px" mr={2} />
          Batch Process
        </Button>
      </Stack>
      <Divider border="2px solid #E2E8F0" />
      <Box mt={2}>
        <PayableTable />
      </Box>

      <Flex justifyContent="end" h="100px">
        <Button colorScheme="brand" variant="ghost">
          <Icon as={BiExport} fontSize="18px" mr={2} />
          Export
        </Button>
        <Divider orientation="vertical" height="30px" border="2px solid" />
        <Button colorScheme="brand" variant="ghost" m={0}>
          <Icon as={FaAtom} fontSize="18px" mr={2} />
          Settings
        </Button>
      </Flex>
    </Box>
  )
}
