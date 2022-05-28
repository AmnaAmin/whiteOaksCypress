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
import { ProjectWorkOrderType } from 'types/project.type'
import WorkOrderDetailTab from './work-order-detail-tab'
import { LienWaiverTab } from './lien-waiver-tab'
import InvoicingAndPaymentTab from './invoicing-and-payment-tab'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import { InvoiceTab } from './invoice-tab'
import { ProjectType } from 'types/project.type'
import { TransactionType } from 'types/transaction.type'
import Status from '../status'
import { WorkOrderNotes } from './work-order-notes'
import { countInCircle } from 'theme/common-style'
import { useDocuments } from 'utils/vendor-projects'
import { useParams } from 'react-router-dom'

const WorkOrderDetails = ({
  workOrder,
  onClose: close,
  onProjectTabChange,
  projectData,
  transactions,
}: {
  workOrder: ProjectWorkOrderType
  onClose: () => void
  onProjectTabChange?: any
  projectData: ProjectType
  transactions: Array<TransactionType>
}) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [tabIndex, setTabIndex] = useState(0)
  const [notesCount, setNotesCount] = useState(0)
  const { projectId } = useParams<'projectId'>()
  const { documents: documentsData = [] } = useDocuments({
    projectId,
  })

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

      <ModalContent w={1200} rounded={[0]} borderTop="2px solid #4E87F8">
        <ModalHeader h="64px" py={4} display="flex" alignItems="center">
          {tabIndex === 2 && (
            <Box>
              <HStack fontSize="16px" fontWeight={500} h="32px">
                <Text borderRight="2px solid black" color="#4E87F8" lineHeight="22px" h="22px" pr={2}>
                  WO {workOrder?.id ? `#` + workOrder?.id : ''}
                </Text>
                <Text lineHeight="22px" h="22px">
                  {workOrder?.companyName}
                </Text>
              </HStack>
            </Box>
          )}

          {tabIndex !== 2 && (
            <HStack spacing={4}>
              <Text fontWeight={500} fontSize="16px" fontStyle="normal" color="gray.600">
                {t('editVendorWorkOrder')}
              </Text>
              {workOrder?.statusLabel && <Status value={workOrder?.statusLabel} id={workOrder?.statusLabel} />}
            </HStack>
          )}
        </ModalHeader>

        <ModalCloseButton m={3} _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />

        <Divider mb={3} />
        <Stack spacing={5}>
          <Tabs variant="enclosed" onChange={index => setTabIndex(index)} colorScheme="brand" size="md">
            <TabList color="gray.500">
              <Tab minW={180}>{t('workOrderDetails')}</Tab>
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
                <WorkOrderDetailTab projectData={projectData} workOrder={workOrder} onClose={onClose} />
              </TabPanel>
              <TabPanel p="0px">
                <LienWaiverTab
                  documentsData={documentsData}
                  onProjectTabChange={onProjectTabChange}
                  lienWaiverData={workOrder}
                  onClose={onClose}
                />
              </TabPanel>
              <TabPanel p={0}>
                <InvoiceTab
                  documentsData={documentsData}
                  projectData={projectData}
                  workOrder={workOrder}
                  transactions={transactions}
                  onClose={onClose}
                />
              </TabPanel>
              <TabPanel p="0px">
                <InvoicingAndPaymentTab
                  onClose={onClose}
                  invoiceAndPaymentData={{
                    dateInvoiceSubmitted: workOrder?.dateInvoiceSubmitted,
                    paymentTermDate: workOrder?.paymentTermDate,
                    datePaymentProcessed: workOrder?.datePaymentProcessed ?? '',
                    expectedPaymentDate: workOrder?.expectedPaymentDate,
                    paymentTerm: workOrder?.paymentTerm,
                    workOrderPayDateVariance: workOrder?.workOrderPayDateVariance ?? '',
                    datePaid: workOrder?.datePaid ?? '',
                    clientOriginalApprovedAmount: workOrder?.clientOriginalApprovedAmount,
                    invoiceAmount: workOrder?.invoiceAmount,
                    finalInvoiceAmount: workOrder?.finalInvoiceAmount,
                    dateLeanWaiverSubmitted: workOrder?.dateLeanWaiverSubmitted ?? '',
                    datePermitsPulled: workOrder?.datePermitsPulled ?? '',
                  }}
                />
              </TabPanel>
              <TabPanel p="20px">
                <WorkOrderNotes workOrder={workOrder} onClose={onClose} setNotesCount={setNotesCount} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </ModalContent>
    </Modal>
  )
}

export default WorkOrderDetails
