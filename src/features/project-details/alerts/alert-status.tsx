import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Box,
  Center,
  VStack,
  HStack,
  Spacer,
  useMediaQuery,
  Icon,
  Divider,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { BiCalendar, BiCheck } from 'react-icons/bi'
import { Button } from 'components/button/button'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'

type AlertStatusProps = {
  isOpen: boolean
  onClose: () => void
  alert: any
}

const AlertCard = props => {
  const { t } = useTranslation()
  return (
    <Box
      w="100%"
      borderRadius="8px"
      boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
      outline="1px solid #CBD5E0"
      rounded="8px"
      mb={{ base: '33px', sm: '64px' }}
      mx="36px"
    >
      <Flex minH="80px">
        <Center w={{ base: '100px', sm: '68px' }} bg="#345EA6" color="white" borderLeftRadius="8px">
          <BiCheck fontSize="30px" />
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
          color="#345EA6"
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
  return (
    <Box mt="5" mx={{ md: '36px', sm: '0px' }}>
      <Wrap justify="space-between" w="100%">
        <WrapItem>
          <HStack spacing="10px" align="start">
            <VStack align="start">
              <Box fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600">
                Project Id
              </Box>

              <Box fontSize="14px" fontStyle="normal" color="gray.500" fontWeight={400}>
                2793
              </Box>
            </VStack>
          </HStack>
        </WrapItem>
        <WrapItem>
          <HStack spacing="5px" align="start" mb={{ base: '4px', sm: '0px' }}>
            <Box mt="2px">
              <Icon as={BiCalendar} fontSize="20px" color="gray.600" />
            </Box>
            <VStack align="start">
              <Box fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600">
                WO Start
              </Box>

              <Box fontSize="14px" fontStyle="normal" color="gray.500" fontWeight={400}>
                2021-10-24
              </Box>
            </VStack>
          </HStack>
        </WrapItem>
        <Divider color="#CBD5E0" mb="44px" display={{ base: 'block', sm: 'none' }} />
        <WrapItem>
          <HStack spacing="5px" align="start">
            <Box mt="2px">
              <Icon as={BiCalendar} fontSize="20px" color="gray.600" />
            </Box>
            <VStack align="start">
              <Box fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600">
                WO Expected Completion
              </Box>

              <Box fontSize="14px" fontStyle="normal" color="gray.500" fontWeight={400}>
                2021/10/24
              </Box>
            </VStack>
          </HStack>
        </WrapItem>
      </Wrap>

      <Divider color="#CBD5E0" mt="7px" mb="44px" display={{ base: 'none', sm: 'block' }} />
      <Wrap justify={{ base: 'none', sm: 'space-between' }}>
        <WrapItem>
          <HStack spacing="10px" align="start" mt={{ base: '14px', sm: '0px' }} mb={{ base: '4px', sm: '0px' }}>
            <VStack align="start">
              <Box fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600">
                Address
              </Box>

              <Box fontSize="14px" fontStyle="normal" color="gray.500" fontWeight={400}>
                133 CUMBERL
              </Box>
            </VStack>
          </HStack>
        </WrapItem>
        <Divider color="#CBD5E0" display={{ base: 'block', sm: 'none' }} />
        <WrapItem flex={{ base: '1', sm: '0' }}>
          <HStack spacing="10px" align="start">
            <VStack align="start">
              <Box fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600">
                City
              </Box>

              <Box fontSize="14px" fontStyle="normal" color="gray.500" fontWeight={400}>
                Cary
              </Box>
            </VStack>
          </HStack>
        </WrapItem>

        <WrapItem flex={{ base: '1', sm: '0' }}>
          <HStack spacing="10px" align="start">
            <VStack align="start">
              <Box fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600">
                State
              </Box>

              <Box fontSize="14px" fontStyle="normal" color="gray.500" fontWeight={400}>
                NC
              </Box>
            </VStack>
          </HStack>
        </WrapItem>
        <Divider borderWidth="0px" display={{ base: 'block', sm: 'none' }} />
        <WrapItem>
          <HStack spacing="10px" align="start" mb={{ base: '10px', sm: '0px' }}>
            <VStack align="start">
              <Box fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.600">
                Zipcode
              </Box>

              <Box fontSize="14px" fontStyle="normal" color="gray.500" fontWeight={400}>
                27513
              </Box>
            </VStack>
          </HStack>
        </WrapItem>
      </Wrap>
      <Divider color="#CBD5E0" mt="7px" />
    </Box>
  )
}
export const AlertStatusModal: React.FC<AlertStatusProps> = ({ isOpen, onClose, alert }) => {
  const { t } = useTranslation()
  const [alertResolved, setAlertResolved] = useState(false)
  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const [modalSize, setModalSize] = useState<string>('3xl')

  useEffect(() => {
    isMobile ? setModalSize('sm') : setModalSize('3xl')
  }, [isMobile])

  return (
    <>
      {alert && (
        <Modal isOpen={isOpen} onClose={onClose} variant="custom" size={modalSize}>
          <ModalOverlay />
          <ModalContent bg="#F2F3F4">
            <ModalHeader bg="#FFFFFF">
              {/* {alert.name} */}
              11 Joel CT
            </ModalHeader>
            <ModalCloseButton _hover={{ bg: 'blue.50' }} />
            <Card m="12px" p="0px !important">
              <ModalBody pt="30px" px="13px">
                <Box
                  borderRadius={'12px'}
                  border={{ base: 'none', sm: '1px solid #CBD5E0' }}
                  px={{ base: '16px', sm: '0px' }}
                >
                  <Box>
                    {<AlertInfo />}
                    <Flex justifyContent="center" mt={'45px'}>
                      <AlertCard resloved={alertResolved} reslove={setAlertResolved} />
                    </Flex>
                  </Box>
                </Box>
              </ModalBody>
              <ModalFooter bg="white" mt={{ base: '0px', sm: '10' }} border={{ base: 'none', sm: '1px solid #E2E8F0' }}>
                <HStack spacing="16px" w="100%">
                  <Button variant="outline" colorScheme="brand" m="0">
                    {t('seeProjectDetails')}
                  </Button>
                  <Spacer />
                  {/* <Button variant="outline" onClick={onClose} colorScheme="brand">
                  {t('close')}
                </Button> */}
                  <Button type="submit" disabled={!alertResolved} form="newTransactionForm" colorScheme="brand">
                    {t('save')}
                  </Button>
                </HStack>
              </ModalFooter>
            </Card>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
