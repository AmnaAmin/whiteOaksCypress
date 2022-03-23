import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Button,
  Grid,
  GridItem,
  Flex,
  Box,
  Center,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { RiErrorWarningLine } from 'react-icons/ri'
import { BiListMinus, BiMapPin, BiWorld, BiUser, BiCalendar } from 'react-icons/bi'

type AlertStatusProps = {
  isOpen: boolean
  onClose: () => void
  alert: any
}

const alertStatusInfo = [
  {
    id: 'projectId',
    title: 'Project Id',
    value: '2793',
    icon: BiListMinus,
  },
  {
    id: 'address',
    title: 'Address',
    value: '133 CUMBERLAND GREEN DR',
    icon: BiMapPin,
  },
  {
    id: 'city',
    title: 'City',
    value: 'Cary',
    icon: BiWorld,
  },
  {
    id: 'state',
    title: 'State/Zipcode',
    value: 'NC / 27513',
    icon: BiUser,
  },
  {
    id: 'woStartDate',
    title: 'Work Order Start Date',
    value: '2021-10-24',
    icon: BiCalendar,
  },
  {
    id: 'woCompletionDate',
    title: 'Work Order Completion Date',
    value: '2021-11-22',
    icon: BiCalendar,
  },
]

const AlertCard = () => {
  return (
    <Box
      borderRadius="8px"
      minH="7.25em"
      boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
    >
      <Flex>
        <Center flexGrow={0.75} bg="blue.500" color="white" borderLeftRadius="8px">
          <RiErrorWarningLine fontSize="30px" />
        </Center>
        <VStack align="start" flexGrow={3} padding="12px" maxW="28em">
          <Box fontSize="16px" fontWeight="bold" color="gray.800">
            WARNING - 11 JOEL CT GREEN DR
          </Box>
          <Box fontSize="14px">Project Project manager Changed from NateFeleciano to Jonathan Kelly.</Box>
          <Box color="gray.500" cursor="pointer">
            Close
          </Box>
        </VStack>
        <Center flexGrow={1} color="blue.600" cursor="pointer" borderLeft="1px solid #E2E8F0">
          Resolve
        </Center>
      </Flex>
    </Box>
  )
}

const AlertInfo = () => {
  return (
    <>
      {alertStatusInfo.map((al, index) => {
        return (
          <GridItem key={index} w="100%" minH="20" borderBottom="1px solid #E2E8F0">
            <HStack spacing="10px" align="start">
              <Box mt="2px">
                {React.createElement(al.icon, {
                  fontSize: '20px',
                  opacity: '0.4',
                })}
              </Box>
              <VStack align="start">
                <Box fontSize="16px" fontWeight="bold" color="gray.700">
                  {al.title}
                </Box>
                <Box fontSize="14px" color="gray.600">
                  {al.value}
                </Box>
              </VStack>
            </HStack>
          </GridItem>
        )
      })}
    </>
  )
}
export const AlertStatusModal: React.FC<AlertStatusProps> = ({ isOpen, onClose, alert }) => {
  return (
    <>
      {alert && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent minW="46em">
            <ModalHeader bg="gray.50" borderBottom="1px solid #eee" borderTop="2px solid #4E87F8">
              {alert.name}
            </ModalHeader>
            <ModalBody>
              <Box border="1px solid #E2E8F0" margin="20px 10px 10px 10px" minH="33em" borderRadius="8px">
                {<AlertCard />}
                <Grid templateColumns="repeat(2, 1fr)" gap={6} margin="20px">
                  {<AlertInfo />}
                </Grid>
              </Box>
            </ModalBody>
            <ModalFooter display="flex" alignItems="center">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="button" type="submit" form="newTransactionForm" ml="3">
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
