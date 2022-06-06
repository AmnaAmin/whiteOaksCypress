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
} from '@chakra-ui/react'
import { ProjectType, ProjectWorkOrderType } from 'types/project.type'
import { LienWaiverTab } from './lien-waiver-tab'
import { useTranslation } from 'react-i18next'
import WorkOrderDetailTab from './work-order-edit-tab'
import PaymentInfoTab from './payment-tab-pc'
import { InvoiceTabPC } from './invoice-tab-pc'
import Status from 'features/projects/status'
import WorkOrderNotes from '../work-order-notes'
import { countInCircle } from 'theme/common-style'

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
          {tabIndex === 4 && (
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

          {tabIndex !== 4 && (
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500} h="32px">
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

        <ModalCloseButton m={3} _focus={{ outline: 'none' }} />

        <Divider mb={3} />
        <ModalBody>
          <Stack spacing={5}>
            <Tabs
              variant="enclosed"
              colorScheme="brand"
              size="md"
              onChange={index => setTabIndex(index)}
              whiteSpace="nowrap"
            >
              <TabList color="gray.600">
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
              </TabList>

              <TabPanels>
                <TabPanel p="0px">
                  <WorkOrderDetailTab workOrder={workOrder} onClose={onClose} />
                </TabPanel>
                <TabPanel>
                  <LienWaiverTab lienWaiverData={workOrder} onClose={onClose} />
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
