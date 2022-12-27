import React, { useEffect, useState } from 'react'
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
  Spacer,
  useMediaQuery,
} from '@chakra-ui/react'
import { RiErrorWarningLine } from 'react-icons/ri'
import { BiListMinus, BiMapPin, BiWorld, BiUser, BiCalendar } from 'react-icons/bi'
import { Button } from 'components/button/button'
import { useTranslation } from 'react-i18next'

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
    id: 'stateZipcode',
    title: 'State/Zipcode',
    value: 'NC / 27513',
    icon: BiUser,
  },
  {
    id: 'workOrderStart',
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

const AlertCard = props => {
  const { t } = useTranslation()
  return (
    <Box
      maxW="636px"
      borderRadius="8px"
      boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
    >
      <Flex minH="80px">
        <Center w="68px" bg="#4E87F8" color="white" borderLeftRadius="8px">
          <RiErrorWarningLine fontSize="30px" />
        </Center>
        <VStack align="start" padding="12px" maxW="32em">
          <Box fontSize="14px" fontWeight={600} color="gray.600">
            WARNING - 11 JOEL CT GREEN DR
          </Box>
          <Box fontSize="12px" fontWeight={400} color="gray.500" maxW="390px" wordBreak="break-all">
            Project Project manager Changed from NateFeleciano to Jonathan Kelly.
          </Box>
        </VStack>
        <Spacer w={50} />
        <Center
          w="112px"
          color="#4E87F8"
          borderLeft="1px solid #E2E8F0"
          fontSize="14px"
          fontWeight={500}
          fontStyle="normal"
        >
          <Button variant="unstyled" onClick={() => props.reslove(!props.resloved)} disabled={!!props.resloved}>
            {props.resloved ? t('resolved') : t('resolve')}
          </Button>
        </Center>
      </Flex>
    </Box>
  )
}

const AlertInfo = () => {
  const { t } = useTranslation()
  return (
    <>
      {alertStatusInfo.map((al, index) => {
        return (
          <GridItem key={index} w="100%" minH="20" borderBottom="1px solid #E2E8F0" mt={3}>
            <HStack spacing="10px" align="start">
              <Box mt="2px">
                {React.createElement(al.icon, {
                  fontSize: '20px',
                  color: '#718096',
                })}
              </Box>
              <VStack align="start">
                <Box fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600">
                  {t(al.id)}
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
  const { t } = useTranslation()
  const [alertResolved, setAlertResolved] = useState(false)
  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const [modalSize, setModalSize] = useState<string>('3xl')

  useEffect(() => {
    if (isMobile) {
      setModalSize('full')
    } else {
      setModalSize('3xl')
    }
  }, [isMobile])
  return (
    <>
      {alert && (
        <Modal isOpen={isOpen} onClose={onClose} variant="custom" size={modalSize}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {/* {alert.name} */}
              11 Joel CT
            </ModalHeader>
            <ModalCloseButton _hover={{ bg: 'blue.50' }} />
            <ModalBody>
              <Box minH="33.6em" boxShadow={'0px 1px 1px 1px rgba(0, 0, 0, 0.1)'} borderRadius={'12px'}>
                <Box>
                  <Grid templateColumns="repeat(2, 1fr)" gap={6} my="5" mx="100px">
                    {<AlertInfo />}
                  </Grid>
                  <Flex justifyContent="center" mt={20}>
                    <AlertCard resloved={alertResolved} reslove={setAlertResolved} />
                  </Flex>
                </Box>
              </Box>
            </ModalBody>
            <ModalFooter bg="white" mt={10}>
              <HStack spacing="16px" w="100%">
                <Button variant="outline" colorScheme="brand" m="0">
                  {t('seeProjectDetails')}
                </Button>
                <Spacer />
                <Button variant="outline" onClick={onClose} colorScheme="brand">
                  {t('close')}
                </Button>
                <Button type="submit" disabled={!alertResolved} form="newTransactionForm" colorScheme="brand">
                  {t('save')}
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
