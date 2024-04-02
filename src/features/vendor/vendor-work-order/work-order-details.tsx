import {
  Box,
  Center,
  Divider,
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Project, ProjectWorkOrderType } from 'types/project.type'
import { TransactionType } from 'types/transaction.type'
import { useDocuments, useVendorAddress } from 'api/vendor-projects'
import { InvoiceTab } from '../../work-order/invoice/invoice-tab'
import InvoicingAndPaymentTab from './payment/invoicing-and-payment-tab'
import { LienWaiverTab } from '../../work-order/lien-waiver/lien-waiver'
import WorkOrderDetailTab from './details/work-order-detail-tab'
import { WorkOrderNotes } from 'features/work-order/notes/work-order-notes'
import Status from '../../common/status'
import { useFetchWorkOrder, useUpdateWorkOrderMutation } from 'api/work-order'
import { ProjectAwardTab } from 'features/work-order/project-award/project.award'
import { useProjectAward } from 'api/project-award'
import { Card } from 'features/login-form-centered/Card'
import { TransactionsTab } from 'features/work-order/transactions/transactions-tab'
import { TabCustom } from 'features/work-order/work-order-edit'
import { useLocation as useLineItemsLocation } from 'api/location'
import { Messages } from 'features/messages/messages'

export const WorkOrderDetails = ({
  workOrder,
  onClose: close,
  onProjectTabChange,
  projectData,
  transactions,
  isVendorExpired,
}: {
  workOrder: ProjectWorkOrderType
  onClose: () => void
  onProjectTabChange?: any
  projectData: Project
  transactions: Array<TransactionType>
  isVendorExpired?: boolean
}) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const { projectId } = useParams<'projectId'>()
  const { documents: documentsData = [], isLoading } = useDocuments({
    projectId,
  })
  const {
    workOrderAssignedItems,
    displayAwardPlan,
    awardPlanScopeAmount,
    workOrderDetails,
    isFetching: isFetchingLineItems,
    isLoading: isLoadingLineItems,
  } = useFetchWorkOrder({ workOrderId: workOrder?.id })
  const [tabIndex, setTabIndex] = useState(0)
  const [isUpdating, setIsUpdating] = useState<boolean>()
  const { data: vendorAddress } = useVendorAddress(workOrder?.vendorId || 0)
  const { projectAwardData } = useProjectAward()
  const { mutate: updateWorkOrder } = useUpdateWorkOrderMutation({})
  const [isError, setIsError] = useState(false)
  const isLoadingWorkOrder = isLoadingLineItems || isFetchingLineItems
  const { data: locations } = useLineItemsLocation()

  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const [modalSize, setModalSize] = useState<string>('flexible')
  // Show tab on preprod only

  useEffect(() => {
    if (isMobile) {
      setModalSize('full')
    } else {
      setModalSize('flexible')
    }
  }, [isMobile])

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (workOrder) {
      onOpen()
      if (!!workOrder?.awardPlanId && isError) {
        setIsError(false)
      }
    } else {
      onCloseDisclosure()
    }
  }, [onCloseDisclosure, onOpen, workOrder])

  const onSave = updatedValues => {
    const payload = { ...workOrder, ...updatedValues }
    setIsUpdating(true)
    updateWorkOrder(payload, {
      onSuccess: () => {
        setIsUpdating(false)
      },
      onError: () => {
        setIsUpdating(false)
      },
    })
  }

  const tabsContainerRef = useRef<HTMLDivElement>(null)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} closeOnOverlayClick={false}>
      <ModalOverlay />
      {workOrder && (
        <ModalContent
          maxW="1100px"
          rounded={[0]}
          borderTop="2px solid #345EA6"
          w={{ base: modalSize, sm: 'calc(100% - 30px)', md: 'calc(100% - 150px)' }}
        >
          <ModalHeader borderBottom={'1px solid gray.300'} minH="64px" py={4} display="flex" alignItems="center">
            <Box>
              <HStack fontSize="16px" fontWeight={500} minH="32px" color="gray.600" flexWrap="wrap-reverse" spacing={0}>
                <HStack h="40px" mr="16px">
                  <Text borderRight="2px solid #E2E8F0" lineHeight="22px" h="22px" pr={2} data-testid="work-order-id">
                    WO {workOrder?.id ? workOrder?.id : ''}
                  </Text>
                  <Text lineHeight="22px" h="22px" data-testid="work-order-company">
                    {workOrder?.companyName}
                  </Text>
                </HStack>
                {workOrder?.statusLabel && (
                  <HStack pr={6}>
                    <Status value={workOrder?.statusLabel} id={workOrder?.statusLabel} />
                  </HStack>
                )}
              </HStack>
            </Box>
          </ModalHeader>

          <ModalCloseButton size={'lg'} color="gray.600" _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />
          {isUpdating && <Progress isIndeterminate colorScheme="blue" aria-label="loading" size="xs" />}
          <Divider borderColor={'gray.300'} />
          <Stack bgColor="#F2F3F4" spacing={5}>
            <Tabs
              mx={'12px'}
              variant="enclosed"
              colorScheme="darkPrimary"
              size="md"
              index={tabIndex}
              onChange={index => setTabIndex(index)}
            >
              <Card
                bg={{ base: 'white', md: 'transparent' }}
                p={{ base: '12px 12px 16px 12px', md: '0px !important' }}
                rounded="6px 6px 0px 0px"
                boxShadow={{ sm: 'none' }}
                mt="12px"
              >
                <TabList border="none" flexDir={{ base: 'column', md: 'row' }}>
                  <Tab data-testid="workOrderDetails">{t('workOrderDetails')}</Tab>
                  <Tab data-testid="transactions">{t('projects.projectDetails.transactions')}</Tab>
                  {displayAwardPlan && <TabCustom isError={isError && tabIndex === 0}>{t('projectAward')}</TabCustom>}
                  <Tab data-testid="lienWaiver">{t('lienWaiver')}</Tab>
                  <Tab data-testid="invoice">{t('invoice')}</Tab>
                  <Tab data-testid="payments">{t('payments')}</Tab>
                  <Tab data-testid="notes">{t('notes')}</Tab>
                  <Tab data-testid="wo_messages">{t('messages')}</Tab>
                </TabList>
              </Card>
              <Card mb={3} p="0px !important" roundedTop={0} roundedRight={{ base: 0, md: 12 }}>
                <TabPanels>
                  <TabPanel p={0}>
                    {isLoadingWorkOrder ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <WorkOrderDetailTab
                        documentsData={documentsData}
                        setIsUpdating={setIsUpdating}
                        isUpdating={isUpdating}
                        projectData={projectData}
                        workOrder={workOrderDetails}
                        onClose={onClose}
                        workOrderAssignedItems={workOrderAssignedItems}
                        isFetchingLineItems={isFetchingLineItems}
                        isLoadingLineItems={isLoadingLineItems}
                        displayAwardPlan={displayAwardPlan}
                        tabIndex={tabIndex}
                        setIsError={setIsError}
                        locations={locations}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isLoading ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <TransactionsTab
                        isVendorExpired={isVendorExpired}
                        projectId={projectId as string}
                        tabsContainerRef={tabsContainerRef}
                        projectData={projectData}
                        onClose={onClose}
                        workOrder={workOrderDetails}
                      />
                    )}
                  </TabPanel>
                  {displayAwardPlan && (
                    <TabPanel p={0}>
                      {isLoadingWorkOrder ? (
                        <Center h={'600px'}>
                          <Spinner size="xl" />
                        </Center>
                      ) : (
                        <ProjectAwardTab
                          workOrder={workOrderDetails}
                          onSave={onSave}
                          onClose={onClose}
                          awardPlanScopeAmount={awardPlanScopeAmount}
                          projectAwardData={projectAwardData}
                          isUpdating={isUpdating}
                        />
                      )}
                    </TabPanel>
                  )}
                  <TabPanel p={0}>
                    {isLoadingWorkOrder ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <LienWaiverTab
                        documentsData={documentsData}
                        onProjectTabChange={onProjectTabChange}
                        workOrder={workOrderDetails}
                        onClose={onClose}
                        isUpdating={isUpdating}
                        setIsUpdating={setIsUpdating}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isLoadingWorkOrder ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <InvoiceTab
                        documentsData={documentsData}
                        projectData={projectData}
                        workOrder={workOrderDetails}
                        vendorAddress={vendorAddress}
                        transactions={transactions}
                        onClose={onClose}
                        setTabIndex={setTabIndex}
                        rejectInvoiceCheck={null}
                        navigateToProjectDetails={null}
                        onSave={null}
                        isWorkOrderUpdating={null}
                        isVendorExpired={isVendorExpired}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isLoadingWorkOrder ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <InvoicingAndPaymentTab
                        onClose={onClose}
                        invoiceAndPaymentData={{
                          dateInvoiceSubmitted: workOrderDetails?.dateInvoiceSubmitted,
                          paymentTermDate: workOrderDetails?.paymentTermDate,
                          datePaymentProcessed: workOrderDetails?.datePaymentProcessed ?? '',
                          expectedPaymentDate: workOrderDetails?.expectedPaymentDate,
                          paymentTerm: workOrderDetails?.paymentTerm,
                          workOrderPayDateVariance: workOrderDetails?.workOrderPayDateVariance ?? '',
                          datePaid: workOrderDetails?.datePaid ?? '',
                          clientOriginalApprovedAmount: workOrderDetails?.clientOriginalApprovedAmount,
                          invoiceAmount: workOrderDetails?.invoiceAmount,
                          finalInvoiceAmount: workOrderDetails?.finalInvoiceAmount,
                          dateLeanWaiverSubmitted: workOrderDetails?.dateLeanWaiverSubmitted ?? '',
                          datePermitsPulled: workOrderDetails?.datePermitsPulled ?? '',
                          status: workOrderDetails?.statusLabel ?? '',
                        }}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isLoadingWorkOrder ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <WorkOrderNotes workOrder={workOrderDetails} onClose={onClose} />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isLoadingWorkOrder ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <Box w="100%" h="680px">
                        <Messages
                          id={workOrder?.id}
                          entity="projectWorkOrder"
                          projectId={projectId}
                          value={workOrder}
                        />
                      </Box>
                    )}
                  </TabPanel>
                </TabPanels>
              </Card>
            </Tabs>
          </Stack>
        </ModalContent>
      )}
    </Modal>
  )
}

export default WorkOrderDetails
