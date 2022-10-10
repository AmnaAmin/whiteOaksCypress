import {
  Box,
  Divider,
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { countInCircle } from 'theme/common-style'
import { Project, ProjectWorkOrderType } from 'types/project.type'
import { TransactionType } from 'types/transaction.type'
import { useDocuments } from 'api/vendor-projects'
import { InvoiceTab } from '../../work-order/invoice/invoice-tab'
import InvoicingAndPaymentTab from './payment/invoicing-and-payment-tab'
import { LienWaiverTab } from '../../work-order/lien-waiver/lien-waiver'
import WorkOrderDetailTab from './details/work-order-detail-tab'
import { WorkOrderNotes } from 'features/work-order/notes/work-order-notes'
import Status from '../../common/status'

export const WorkOrderDetails = ({
  workOrder,
  onClose: close,
  onProjectTabChange,
  projectData,
  transactions,
}: {
  workOrder: ProjectWorkOrderType
  onClose: () => void
  onProjectTabChange?: any
  projectData: Project
  transactions: Array<TransactionType>
}) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [notesCount, setNotesCount] = useState(0)
  const { projectId } = useParams<'projectId'>()
  const { documents: documentsData = [], isLoading } = useDocuments({
    projectId,
  })
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
    }
  }, [onCloseDisclosure, onOpen, workOrder])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="flexible" closeOnOverlayClick={false}>
      <ModalOverlay />
      {workOrder && (
        <ModalContent rounded={[0]} borderTop="2px solid #4E87F8">
          <ModalHeader h="64px" py={4} display="flex" alignItems="center">
            <Box>
              <HStack fontSize="16px" fontWeight={500} h="32px" color="gray.600">
                <Text borderRight="2px solid #E2E8F0" lineHeight="22px" h="22px" pr={2} data-testid="work-order-id">
                  WO {workOrder?.id ? workOrder?.id : ''}
                </Text>
                <Text lineHeight="22px" h="22px" data-testid="work-order-company">
                  {workOrder?.companyName}
                </Text>
                {workOrder?.statusLabel && <Status value={workOrder?.statusLabel} id={workOrder?.statusLabel} />}
              </HStack>
            </Box>
          </ModalHeader>

          <ModalCloseButton m={3} _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />

          <Divider mb={3} />
          <Stack spacing={5}>
            <Tabs
              variant="enclosed"
              colorScheme="brand"
              size="md"
              index={tabIndex}
              onChange={index => setTabIndex(index)}
            >
              <TabList mr="30px" ml="30px" color="gray.500">
                <Tab data-testid="workOrderDetails">{t('workOrderDetails')}</Tab>
                <Tab data-testid="lienWaiver">{t('lienWaiver')}</Tab>
                <Tab data-testid="invoice">{t('invoice')}</Tab>
                <Tab data-testid="payments">{t('payments')}</Tab>
                <Tab data-testid="notes">
                  {t('notes')}

                  <Box ml="5px" style={countInCircle}>
                    {notesCount}
                  </Box>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <WorkOrderDetailTab projectData={projectData} workOrder={workOrder} onClose={onClose} />
                </TabPanel>
                <TabPanel p={0}>
                  {isLoading ? (
                    <BlankSlate />
                  ) : (
                    <LienWaiverTab
                      documentsData={documentsData}
                      onProjectTabChange={onProjectTabChange}
                      workOrder={workOrder}
                      onClose={onClose}
                    />
                  )}
                </TabPanel>
                <TabPanel p={0}>
                  {isLoading ? (
                    <BlankSlate />
                  ) : (
                    <InvoiceTab
                      documentsData={documentsData}
                      projectData={projectData}
                      workOrder={workOrder}
                      transactions={transactions}
                      onClose={onClose}
                      setTabIndex={setTabIndex}
                      rejectInvoiceCheck={null}
                      navigateToProjectDetails={null}
                      onSave={null}
                    />
                  )}
                </TabPanel>
                <TabPanel p={0}>
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
                <TabPanel p={0}>
                  <WorkOrderNotes workOrder={workOrder} onClose={onClose} setNotesCount={setNotesCount} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </ModalContent>
      )}
    </Modal>
  )
}

export default WorkOrderDetails
