import React, { useCallback, useEffect, useState } from 'react'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Divider,
  HStack,
  TagLabel,
  Tag,
  Box,
  Flex,
} from '@chakra-ui/react'
import { ProjectWorkOrderType } from 'types/project.type'
import { LienWaiverTab } from './lien-waiver-tab'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import WorkOrderDetailTab from './work-order-edit-tab'

const TabStyle = {
  fontWeight: 500,
  fontSize: '14px',
  fontStyle: 'normal',
  color: 'gray.600',
  _hover: {
    backgroundColor: 'gray.200',
  },
}

const WorkOrderDetails = ({ workOrder, onClose: close }: { workOrder: ProjectWorkOrderType; onClose: () => void }) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [tabIndex, setTabIndex] = useState(0)

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (workOrder) {
      onOpen()
    } else {
      onCloseDisclosure()
      setTabIndex(0)
    }
  }, [onCloseDisclosure, onOpen, workOrder])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="none">
      <ModalOverlay />

      <ModalContent w="1137px" rounded={3} borderTop="2px solid #4E87F8">
        <ModalHeader h="64px" py={4} display="flex" alignItems="center">
          {tabIndex === 3 && (
            <Box>
              <HStack fontSize="16px" fontWeight={500} h="32px">
                <Text borderRight="2px solid black" color="#4E87F8" lineHeight="22px" h="22px" pr={2}>
                  Invoice # 432022
                </Text>
                <Text lineHeight="22px" h="22px">
                  ADT RENOVATIONS
                </Text>
              </HStack>
            </Box>
          )}

          {tabIndex !== 3 && (
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500} h="32px">
                <Text borderRight="1px solid #E2E8F0" lineHeight="22px" h="22px" pr={2}>
                  WO 2705
                </Text>
                <Text lineHeight="22px" h="22px">
                  ADT RENOVATIONS
                </Text>
              </HStack>

              <Tag size="lg" rounded="6px" variant="solid" color="#2AB450" bg="#E7F8EC">
                <TagLabel fontSize="16px" fontStyle="normal" fontWeight={500} lineHeight="24px">
                  Active
                </TagLabel>
              </Tag>
            </HStack>
          )}
        </ModalHeader>

        <ModalCloseButton m={3} _focus={{ outline: 'none' }} />

        <Divider mb={3} />
        <ModalBody>
          <Stack spacing={5}>
            <Tabs variant="enclosed" onChange={index => setTabIndex(index)} whiteSpace="nowrap">
              <TabList height="50px" alignItems={'end'}>
                <Flex h="40px">
                  <Tab
                    _focus={{ border: 'none' }}
                    minW={180}
                    sx={TabStyle}
                    _selected={{
                      color: 'white',
                      bg: '#4E87F8',
                      fontWeight: 600,
                      _hover: { backgroundColor: '#4E87F8' },
                    }}
                  >
                    {t('workOrderDetails')}
                  </Tab>
                  <Tab
                    _focus={{ border: 'none' }}
                    _selected={{
                      color: 'white',
                      bg: '#4E87F8',
                      fontWeight: 600,
                      _hover: { backgroundColor: '#4E87F8' },
                    }}
                    sx={TabStyle}
                  >
                    {t('lienWaiver')}
                  </Tab>
                  <Tab
                    _focus={{ border: 'none' }}
                    _selected={{
                      color: 'white',
                      bg: '#4E87F8',
                      fontWeight: 600,
                      _hover: { backgroundColor: '#4E87F8' },
                    }}
                    sx={TabStyle}
                  >
                    {t('Payments')}
                  </Tab>

                  <Tab
                    _focus={{ border: 'none' }}
                    _selected={{
                      color: 'white',
                      bg: '#4E87F8',
                      fontWeight: 600,
                      id: 'checkId',
                      _hover: { backgroundColor: '#4E87F8' },
                    }}
                    sx={TabStyle}
                  >
                    {t('Invoice')}
                  </Tab>
                </Flex>
              </TabList>

              <TabPanels>
                <TabPanel p="0px">
                  <WorkOrderDetailTab onClose={onClose} />
                </TabPanel>
                <TabPanel>
                  <LienWaiverTab lienWaiverData={workOrder} onClose={onClose} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default WorkOrderDetails
