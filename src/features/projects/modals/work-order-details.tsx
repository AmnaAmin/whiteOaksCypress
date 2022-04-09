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
} from '@chakra-ui/react'
import { ProjectWorkOrderType } from 'types/project.type'
import WorkOrderDetailTab from './work-order-detail-tab'
import { LienWaiverTab } from './lien-waiver-tab'
import InvoicingAndPaymentTab from './invoicing-and-payment-tab'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import { InvoiceTab } from './invoice-tab'

const TabStyle = {
  fontWeight: 500,
  fontSize: '14px',
  fontStyle: 'normal',
  color: 'gray.600',
}

const WorkOrderDetails = ({ workOrder, onClose: close }: { workOrder: ProjectWorkOrderType; onClose: () => void }) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [header, setHeader] = useState(false)

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

      <ModalContent w={1200} rounded={0} borderTop="2px solid #4E87F8">
        <ModalHeader h="64px" py={4} display="flex" alignItems="center">
          {header ? (
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
          ) : (
            <HStack spacing={4}>
              <Text fontWeight={500} fontSize="16px" fontStyle="normal" color="gray.600">
                {t('editVendorWorkOrder')}
              </Text>
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
            <Tabs variant="enclosed">
              <TabList>
                <Tab
                  _focus={{ border: 'none' }}
                  minW={180}
                  sx={TabStyle}
                  _selected={{ color: 'white', bg: '#4E87F8', fontWeight: 600 }}
                  onClick={() => setHeader(false)}
                >
                  {t('workOrderDetails')}
                </Tab>
                <Tab
                  _focus={{ border: 'none' }}
                  _selected={{ color: 'white', bg: '#4E87F8', fontWeight: 600 }}
                  sx={TabStyle}
                  onClick={() => setHeader(false)}
                >
                  {t('lienWaiver')}
                </Tab>
                <Tab
                  _focus={{ border: 'none' }}
                  _selected={{ color: 'white', bg: '#4E87F8', fontWeight: 600 }}
                  sx={TabStyle}
                  onClick={() => setHeader(false)}
                >
                  {t('Payments')}
                </Tab>

                <Tab
                  _focus={{ border: 'none' }}
                  _selected={{ color: 'white', bg: '#4E87F8', fontWeight: 600, id: 'checkId' }}
                  sx={TabStyle}
                  onClick={() => setHeader(true)}
                >
                  {t('Invoice')}
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

                <TabPanel p={0}>
                  <InvoiceTab onClose={onClose} />
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
