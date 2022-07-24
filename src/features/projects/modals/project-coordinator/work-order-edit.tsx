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
  Box,
  Checkbox,
  Center,
} from '@chakra-ui/react'
import { ProjectType, ProjectWorkOrderType } from 'types/project.type'
import { LienWaiverTab } from './lien-waiver-tab'
import { useTranslation } from 'react-i18next'
// import WorkOrderDetailTab from './work-order-edit-tab'
import PaymentInfoTab from './payment-tab-pc'
import { InvoiceTabPC } from './invoice-tab-pc'
import Status from 'features/projects/status'
import WorkOrderNotes from '../work-order-notes'
import { countInCircle } from 'theme/common-style'
import WorkOrderDetailTab from './work-order-edit-tab'

const WorkOrderDetails = ({
  projectData,
  workOrder,
  onClose: close,
}: {
  projectData: ProjectType
  workOrder: ProjectWorkOrderType
  onClose: () => void
}) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [tabIndex, setTabIndex] = useState(0)
  const [notesCount, setNotesCount] = useState(0)
  const [rejectChecked, setRejectChecked] = useState(false)

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
      setRejectChecked(false)
    }
  }, [onCloseDisclosure, onOpen, workOrder])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />

      <ModalContent rounded={3} borderTop="2px solid #4E87F8">
        <ModalHeader>
          {tabIndex === 4 && (
            <Box>
              <HStack fontSize="16px" fontWeight={500}>
                <Text borderRight="2px solid black" color="#4E87F8" lineHeight="22px" h="22px" pr={2}>
                  Invoice # 432022
                </Text>
                <Text lineHeight="22px" h="22px">
                  ADT RENOVATIONS
                </Text>
              </HStack>
            </Box>
          )}

          {tabIndex !== 4 && (
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500}>
                <Text borderRight="1px solid #E2E8F0" lineHeight="22px" h="22px" pr={2}>
                  WO {workOrder?.id}
                </Text>
                <Text lineHeight="22px" h="22px">
                  {workOrder?.companyName}
                </Text>
              </HStack>

              <Status value={workOrder?.statusLabel} id={workOrder?.statusLabel} />
            </HStack>
          )}
        </ModalHeader>

        <ModalCloseButton _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />

        <Divider mb={3} />
        <ModalBody p="0">
          <Stack spacing={5}>
            <Tabs
              variant="enclosed"
              colorScheme="brand"
              size="md"
              onChange={index => setTabIndex(index)}
              whiteSpace="nowrap"
            >
              <TabList color="gray.600" mx="32px">
                <Tab>{t('workOrderDetails')}</Tab>
                <Tab>{t('lienWaiver')}</Tab>
                <Tab>{t('invoice')}</Tab>
                <Tab>{t('payments')}</Tab>
                <Tab>
                  {t('notes')}
                  <Box ml="5px" style={countInCircle}>
                    {notesCount}
                  </Box>
                </Tab>
                {tabIndex === 1 && (
                  <Center w="100%" justifyContent="end">
                    {workOrder?.lienWaiverAccepted && (
                      <Checkbox
                        onChange={() => setRejectChecked(!rejectChecked)}
                        color="#4A5568"
                        fontSize="14px"
                        fontWeight={500}
                      >
                        Reject Lien Waiver
                      </Checkbox>
                    )}
                  </Center>
                )}
              </TabList>

              <TabPanels>
                <TabPanel p="0">
                  <WorkOrderDetailTab workOrder={workOrder} onClose={onClose} />
                </TabPanel>
                <TabPanel p="1.4px">
                  <LienWaiverTab lienWaiverData={workOrder} onClose={onClose} rejectChecked={!rejectChecked} />
                </TabPanel>
                <TabPanel>
                  <InvoiceTabPC workOrder={workOrder} onClose={onClose} />
                </TabPanel>
                <TabPanel>
                  <PaymentInfoTab projectData={projectData} workOrder={workOrder} onClose={onClose} />
                </TabPanel>

                <TabPanel>
                  <WorkOrderNotes workOrder={workOrder} onClose={onClose} setNotesCount={setNotesCount} />
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
