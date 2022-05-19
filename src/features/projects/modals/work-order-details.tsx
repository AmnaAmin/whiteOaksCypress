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
  Flex,
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

const TabStyle = {
  fontWeight: 500,
  fontSize: '14px',
  fontStyle: 'normal',
  color: 'gray.600',
  _hover: {
    backgroundColor: 'gray.200',
  },
}

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

        <ModalCloseButton m={3} _focus={{ outline: 'none' }} />

        <Divider mb={3} />
        <ModalBody>
          <Stack spacing={5}>
            <Tabs variant="enclosed" onChange={index => setTabIndex(index)} whiteSpace="nowrap">
              <TabList height="50px" borderBottomWidth={2} alignItems={'end'}>
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
                      id: 'checkId',
                      _hover: { backgroundColor: '#4E87F8' },
                    }}
                    sx={TabStyle}
                  >
                    {t('Invoice')}
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
                </Flex>
              </TabList>

              <TabPanels>
                <TabPanel p="0px">
                  <WorkOrderDetailTab workOrder={workOrder} onClose={onClose} />
                </TabPanel>
                <TabPanel>
                  <LienWaiverTab onProjectTabChange={onProjectTabChange} lienWaiverData={workOrder} onClose={onClose} />
                </TabPanel>
                <TabPanel p={0}>
                  <InvoiceTab
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
              </TabPanels>
            </Tabs>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default WorkOrderDetails
