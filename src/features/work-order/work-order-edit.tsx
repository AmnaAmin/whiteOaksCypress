import { useEffect, useRef, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Divider,
  HStack,
  Checkbox,
  Center,
  Progress,
  Box,
  Flex,
  Icon,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { ProjectWorkOrderType } from 'types/project.type'
import { LienWaiverTab } from './lien-waiver/lien-waiver'
import { useTranslation } from 'react-i18next'
// import WorkOrderDetailTab from './work-order-edit-tab'
import PaymentInfoTab from './payment/payment-tab'
import { InvoiceTab } from './invoice/invoice-tab'
import Status, { STATUS, STATUS_CODE } from 'features/common/status'
import WorkOrderNotes from './notes/work-order-notes'
import WorkOrderDetailTab from './details/work-order-edit-tab'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { usePCProject } from 'api/pc-projects'
import { useDocuments, useVendorAddress } from 'api/vendor-projects'
import { useTransactionsV1 } from 'api/transactions'
import { useFetchWorkOrder, useUpdateWorkOrderMutation } from 'api/work-order'
import { useFetchProjectId } from './details/assignedItems.utils'
import { ProjectAwardTab } from './project-award/project.award'
import { useProjectAward } from 'api/project-award'
import { Card } from 'components/card/card'
import { BiErrorCircle } from 'react-icons/bi'
import { TransactionsTab } from './transactions/transactions-tab'
import { useQueryClient } from 'react-query'
import { useVendorEntity } from 'api/vendor-dashboard'
import { useDocumentLicenseMessage } from 'features/vendor-profile/hook'
import { useLocation as useLineItemsLocation } from 'api/location'
import { Messages } from '../messages/messages'

const WorkOrderDetails = ({
  workOrder,
  onClose,
  isOpen,
}: {
  workOrder: ProjectWorkOrderType
  onClose: () => void
  isOpen: boolean
}) => {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)
  const toast = useToast()
  const [rejectLW, setRejectLW] = useState(false)
  const [rejectInvoice, setRejectInvoice] = useState(false)
  const { projectId } = useParams<{ projectId: string }>()
  const [projId, setProjId] = useState<string | undefined>(projectId)
  const { projectData, isLoading: isProjectLoading } = usePCProject(projId)
  const { swoProject } = useFetchProjectId(projId)
  const { documents: documentsData = [], isLoading: isDocumentsLoading } = useDocuments({
    projectId: projId,
  })
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const { transactions = [], isLoading: isTransLoading } = useTransactionsV1(projId)

  const [isUpdating, setIsUpdating] = useState(false)
  const [isError, setIsError] = useState(false)

  const {
    awardPlanScopeAmount,
    workOrderDetails,
    displayAwardPlan,
    isFetching: isFetchingLineItems,
    isLoading: isLoadingLineItems,
  } = useFetchWorkOrder({ workOrderId: workOrder?.id })

  const { mutate: updateWorkOrder, isLoading: isWorkOrderUpdating } = useUpdateWorkOrderMutation({
    swoProjectId: swoProject?.id,
  })

  const { projectAwardData } = useProjectAward(workOrderDetails?.largeWorkOrder)

  const navigate = useNavigate()
  const { data: vendorAddress } = useVendorAddress(workOrder?.vendorId || 0)
  const { data: vendorEntity } = useVendorEntity(workOrder?.vendorId)
  const { hasExpiredDocumentOrLicense } = useDocumentLicenseMessage({ data: vendorEntity })
  const { data: locations } = useLineItemsLocation()
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const isLoadingWorkOrder = isLoadingLineItems || isFetchingLineItems
  const showForPreProd = window.location.href.includes('preprod')
  const showForPreProdAndLocal =
    showForPreProd || window.location.href.includes('localhost:') || window.location.href.includes('dev')

  useEffect(() => {
    if (workOrderDetails) {
      setRejectInvoice(workOrderDetails.status === 111)
      if (workOrderDetails.leanWaiverSubmitted) {
        setRejectLW(!workOrderDetails.lienWaiverAccepted)
      } else {
        setRejectLW(false)
      }
      if (!projId) {
        setProjId(workOrder?.projectId?.toString())
      }
      if (!!workOrderDetails?.awardPlanId && isError) {
        setIsError(false)
      }
    } else {
      onClose()
      setTabIndex(0)
    }
  }, [workOrderDetails?.length, onClose])

  const queryClient = useQueryClient()
  const onSave = values => {
    const payload = { ...workOrderDetails, ...values }
    const { assignedItems } = values
    const hasMarkedSomeComplete = assignedItems?.some(item => item.isCompleted)

    if (
      displayAwardPlan &&
      !workOrderDetails?.awardPlanId &&
      (values?.workOrderDateCompleted || hasMarkedSomeComplete) &&
      tabIndex === 0
    ) {
      setIsError(true)
      toast({
        title: 'Work Order',
        description: 'Award Plan is missing.',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-left',
      })
      return
    } else {
      setIsError(false)
    }

    updateWorkOrder(payload, {
      onSuccess: res => {
        queryClient.invalidateQueries('transactions_work_order')
        if (res?.data) {
          const workOrder = res?.data
          if (isPayable && ![STATUS_CODE.INVOICED].includes(workOrder.status)) {
            onClose()
            setTabIndex(0)
          }
        }
      },
    })
  }

  const navigateToProjectDetails = () => {
    navigate(`/project-details/${workOrderDetails.projectId}`)
  }
  const showRejectInvoice = (displayAwardPlan && tabIndex === 4) || (!displayAwardPlan && tabIndex === 3)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="flexible" variant={'custom'} closeOnOverlayClick={false}>
      <>
        <ModalOverlay />
        <ModalContent bg="#F2F3F4" maxW="1100px" maxH="900px">
          <ModalHeader bg="white">
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500}>
                <Text
                  color={'gray.600'}
                  fontWeight="400"
                  fontSize={'16px'}
                  borderRight="1px solid #E2E8F0"
                  lineHeight="22px"
                  h="22px"
                  pr={2}
                >
                  WO {workOrder?.id}
                </Text>
                <Text fontSize="16px" color={'gray.600'} fontWeight="400" lineHeight="22px" h="22px">
                  {workOrder?.companyName}
                </Text>
              </HStack>

              <Status value={workOrder?.statusLabel} id={workOrder?.statusLabel} />
            </HStack>
          </ModalHeader>

          <ModalCloseButton _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />
          {(isWorkOrderUpdating || isUpdating) && (
            <Progress isIndeterminate colorScheme="blue" aria-label="loading" size="xs" />
          )}
          <Divider mb={3} />
          <Stack>
            <Tabs
              variant="enclosed"
              colorScheme="brand"
              size="md"
              onChange={index => setTabIndex(index)}
              whiteSpace="nowrap"
            >
              <TabList color="gray.600" ml="10px" mr="20px">
                <Tab>{t('workOrderDetails')}</Tab>
                <Tab data-testid="wo_transaction_tab">{t('projects.projectDetails.transactions')}</Tab>
                {displayAwardPlan && <TabCustom isError={isError && tabIndex === 0}>{t('projectAward')}</TabCustom>}
                <Tab data-testid="wo_lienWaiver">{t('lienWaiver')}</Tab>
                <Tab data-testid="wo_invoice">{t('invoice')}</Tab>
                <Tab data-testid="wo_payments">{t('payments')}</Tab>
                <Tab data-testid="wo_notes">{t('notes')}</Tab>
                {showForPreProdAndLocal && <Tab data-testid="wo_messages">{t('messages')}</Tab>}

                {showRejectInvoice &&
                  [STATUS.Invoiced, STATUS.Rejected].includes(
                    workOrderDetails?.statusLabel?.toLocaleLowerCase() as STATUS,
                  ) && (
                    <Center w="100%" justifyContent="end">
                      <Checkbox
                        variant={'outLinePrimary'}
                        onChange={() => {
                          console.log('InChange', rejectInvoice)
                          setRejectInvoice(!rejectInvoice)
                        }}
                        isChecked={rejectInvoice}
                        disabled={workOrderDetails.status === 111}
                        fontSize="14px"
                        fontWeight={500}
                      >
                        {t('rejectInvoice')}
                      </Checkbox>
                    </Center>
                  )}
              </TabList>
              <Card mx="10px" mb="10px" roundedTopLeft={0} p={0}>
                <TabPanels>
                  <TabPanel p={0}>
                    {isLoadingWorkOrder || isProjectLoading ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <WorkOrderDetailTab
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        workOrder={workOrderDetails}
                        onClose={onClose}
                        onSave={onSave}
                        isWorkOrderUpdating={isWorkOrderUpdating}
                        swoProject={swoProject}
                        projectData={projectData}
                        documentsData={documentsData}
                        isFetchingLineItems={isFetchingLineItems}
                        isLoadingLineItems={isLoadingLineItems}
                        locations={locations}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isProjectLoading ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <TransactionsTab
                        projectId={projectId as string}
                        tabsContainerRef={tabsContainerRef}
                        projectData={projectData}
                        onClose={onClose}
                        workOrder={workOrderDetails}
                        isVendorExpired={hasExpiredDocumentOrLicense}
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
                          isUpdating={isWorkOrderUpdating}
                          onSave={onSave}
                          onClose={onClose}
                          awardPlanScopeAmount={awardPlanScopeAmount}
                          projectAwardData={projectAwardData}
                        />
                      )}
                    </TabPanel>
                  )}
                  <TabPanel p={0}>
                    {isLoadingWorkOrder || isDocumentsLoading ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <LienWaiverTab
                        isUpdating={isUpdating}
                        setIsUpdating={setIsUpdating}
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        documentsData={documentsData}
                        workOrder={workOrderDetails}
                        onClose={onClose}
                        rejectChecked={!rejectLW}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isLoadingWorkOrder || isDocumentsLoading || isTransLoading ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <InvoiceTab
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        rejectInvoiceCheck={rejectInvoice}
                        transactions={transactions}
                        documentsData={documentsData}
                        workOrder={workOrderDetails}
                        vendorAddress={vendorAddress || []}
                        isWorkOrderUpdating={isWorkOrderUpdating}
                        onClose={onClose}
                        onSave={onSave}
                        setTabIndex={setTabIndex}
                        projectData={projectData}
                        isVendorExpired={hasExpiredDocumentOrLicense}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isLoadingWorkOrder || isProjectLoading ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <PaymentInfoTab
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        projectData={projectData}
                        workOrder={workOrderDetails}
                        isWorkOrderUpdating={isWorkOrderUpdating}
                        onClose={onClose}
                        onSave={onSave}
                        rejectInvoiceCheck={rejectInvoice}
                        isLoading={isLoadingWorkOrder}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isLoadingWorkOrder ? (
                      <Center h={'600px'}>
                        <Spinner size="xl" />
                      </Center>
                    ) : (
                      <WorkOrderNotes
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        workOrder={workOrderDetails}
                        onClose={onClose}
                        // setNotesCount={setNotesCount}
                        onSave={onSave}
                      />
                    )}
                  </TabPanel>
                  {showForPreProdAndLocal && (
                    <TabPanel p={0}>
                      {isLoadingWorkOrder ? (
                        <Center h={'600px'}>
                          <Spinner size="xl" />
                        </Center>
                      ) : (
                        <Box w="100%" h="680px">
                          <Messages id={workOrder.id} entity="workOrder" projectId={projectId} value={projectData} />
                        </Box>
                      )}
                    </TabPanel>
                  )}
                </TabPanels>
              </Card>
            </Tabs>
          </Stack>
        </ModalContent>
      </>
    </Modal>
  )
}

export const TabCustom: React.FC<{ isError?: boolean }> = ({ isError, children }) => {
  return (
    <Tab _focus={{ outline: 'none' }}>
      {isError ? (
        <Flex alignItems="center">
          <Icon as={BiErrorCircle} size="18px" color="red.400" mr="1" />
          <Box color="red.400">{children}</Box>
        </Flex>
      ) : (
        children
      )}
    </Tab>
  )
}

export default WorkOrderDetails
