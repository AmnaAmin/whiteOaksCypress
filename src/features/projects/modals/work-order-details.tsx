import React, { useCallback, useEffect } from 'react'
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
  Center,
} from '@chakra-ui/react'
import { ProjectWorkOrderType } from '../../../types/project.type'
import WorkOrderDetailTab from './work-order-detail-tab'
import { LienWaiverTab } from './lien-waiver-tab'
import InvoicingAndPaymentTab from './invoicing-and-payment-tab'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'

const WorkOrderDetails = ({ workOrder, onClose: close }: { workOrder: ProjectWorkOrderType; onClose: () => void }) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()

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
    <Modal isOpen={isOpen} onClose={onClose} size="none">
      <ModalOverlay />

      <ModalContent w="70%">
        <ModalHeader h={68} pt={4} pb={4} display="flex" alignItems="center">
          <Text>{t('editVendorWorkOrder')}</Text>
          <Center color="green.400" bg="green.50" boxShadow="0px 0px 4px -2px " ml={8} w={73} h="32px" borderRadius={6}>
            Active
          </Center>
        </ModalHeader>

        <ModalCloseButton m={3} _focus={{ outline: 'none' }} />

        <Divider mb={3} />
        <ModalBody>
          <Stack spacing={5}>
            <Tabs variant="enclosed">
              <TabList>
                <Tab minW={180} fontWeight={600} _selected={{ color: 'white', bg: 'button.300' }}>
                  {t('workOrderDetails')}
                </Tab>
                <Tab _selected={{ color: 'white', bg: 'button.300' }} fontWeight={600}>
                  {t('lienWaiver')}
                </Tab>
                <Tab _selected={{ color: 'white', bg: 'button.300' }} fontWeight={600}>
                  {t('Payments')}
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p="0px">
                  <WorkOrderDetailTab
                    // onClose={onClose}
                    woDates={{
                      workOrderIssueDate: workOrder?.workOrderIssueDate,
                      workOrderCompletionDateVariance: workOrder?.workOrderCompletionDateVariance,
                      workOrderExpectedCompletionDate: workOrder?.workOrderExpectedCompletionDate,
                      workOrderStartDate: workOrder?.workOrderStartDate,
                      woStatus: {
                        id: String(workOrder?.status),
                        value: workOrder?.statusLabel,
                      },
                    }}
                  />
                </TabPanel>
                <TabPanel>
                  <LienWaiverTab lienWaiverData={workOrder} onClose={onClose} />
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
              </TabPanels>
            </Tabs>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default WorkOrderDetails
