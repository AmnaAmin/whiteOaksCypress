import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
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
import { Button } from 'components/button/button'

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
    <Box borderRadius="8px" boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)">
      <Flex>
        <Center flexGrow={0.3} bg="#4E87F8" color="white" borderLeftRadius="8px">
          <RiErrorWarningLine fontSize="30px" />
        </Center>
        <VStack align="start" flexGrow={3} padding="12px" maxW="28em">
          <Box fontSize="14px" fontWeight={600} color="gray.600">
            WARNING - 11 JOEL CT GREEN DR
          </Box>
          <Box fontSize="14px" fontWeight={400} color="gray.500" pb="4">
            Project Project manager Changed from NateFeleciano to Jonathan Kelly.
          </Box>
        </VStack>
        <Center
          flexGrow={1}
          color="#4E87F8"
          cursor="pointer"
          borderLeft="1px solid #E2E8F0"
          fontSize="14px"
          fontWeight={500}
          fontStyle="normal"
        >
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
                  color: '#718096',
                })}
              </Box>
              <VStack align="start">
                <Box fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600">
                  {al.title}
                </Box>
                <Box fontSize="14px" fontStyle="normal" color="gray.500" fontWeight={400}>
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
          <ModalContent minW="45em" bg="#FFFFFF" rounded="0">
            <ModalHeader
              bg="gray.50"
              borderBottom="1px solid #eee"
              borderTop="2px solid #4E87F8"
              fontSize="16px"
              fontWeight={500}
              color="gray.600"
              mb="3"
            >
              {/* {alert.name} */}
              11 Joel CT
            </ModalHeader>
            <ModalCloseButton size="lg" _focus={{ border: 'none' }} />
            <ModalBody>
              <Box
                minH="31.6em"
                borderRadius="8px"
                boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
              >
                <Grid templateColumns="repeat(2, 1fr)" gap={6} margin="20px" mb="10" pr="28">
                  {<AlertInfo />}
                </Grid>
                <Box>{<AlertCard />}</Box>
              </Box>
            </ModalBody>
            <ModalFooter display="flex" alignItems="center" mb="3">
              <Button
                variant="ghost"
                onClick={onClose}
                color="gray.600"
                mr={3}
                fontSize="14px"
                fontWeight={600}
                fontStyle="normal"
                h="48px"
                w="130px"
              >
                Close
              </Button>
              <Button
                colorScheme="brand"
                rounded="6px"
                type="submit"
                form="newTransactionForm"
                fontSize="14px"
                fontWeight={600}
                fontStyle="normal"
                h="48px"
                w="130px"
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
