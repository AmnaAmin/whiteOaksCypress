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
import { BlankSlate } from 'components/skeletons/skeleton-unit'
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

  const { projectAwardData } = useProjectAward()

  const { swoProject } = useFetchProjectId(projId)
  const { documents: documentsData = [], isLoading: isDocumentsLoading } = useDocuments({
    projectId: projId,
  })
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const { transactions = [], isLoading: isTransLoading } = useTransactionsV1(projId)

  const [isUpdating, setIsUpdating] = useState(false)
  const [isError, setIsError] = useState(false)

  const { mutate: updateWorkOrder, isLoading: isWorkOrderUpdating } = useUpdateWorkOrderMutation({
    swoProjectId: swoProject?.id,
  })
  const {
    workOrderAssignedItems,
    awardPlanScopeAmount,
    workOrderDetails,
    displayAwardPlan,
    isFetching: isFetchingLineItems,
    isLoading: isLoadingLineItems,
  } = useFetchWorkOrder({ workOrderId: workOrder?.id })

  const navigate = useNavigate()
  const { data: vendorAddress } = useVendorAddress(workOrder?.vendorId || 0)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (workOrder) {
      setRejectInvoice(workOrder.status === 111)
      if (workOrder.leanWaiverSubmitted) {
        setRejectLW(!workOrder.lienWaiverAccepted)
      } else {
        setRejectLW(false)
      }
      if (!projId) {
        setProjId(workOrder?.projectId?.toString())
      }
    } else {
      onClose()
      setTabIndex(0)
    }
  }, [workOrder, onClose])
  const queryClient = useQueryClient()
  const onSave = values => {
    const payload = { ...workOrder, ...values }
    const { assignedItems } = values
    const hasMarkedSomeComplete = assignedItems?.some(item => item.isCompleted)

    if (
      displayAwardPlan &&
      !workOrder?.awardPlanId &&
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
    navigate(`/project-details/${workOrder.projectId}`)
  }
  const showRejectInvoice = (displayAwardPlan && tabIndex === 4) || (!displayAwardPlan && tabIndex === 3)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="flexible" variant={'custom'} closeOnOverlayClick={false}>
      <ModalOverlay />
      {workOrder && (
        <>
          <ModalContent bg="#F2F3F4">
            <ModalHeader bg="white">
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
                  <Tab data-testid='wo_transaction_tab'>{t('projects.projectDetails.transactions')}</Tab>
                  {displayAwardPlan && <TabCustom isError={isError && tabIndex === 0}>{t('projectAward')}</TabCustom>}
                  <Tab>{t('lienWaiver')}</Tab>
                  <Tab>{t('invoice')}</Tab>
                  <Tab>{t('payments')}</Tab>
                  <Tab>
                    {t('notes')}
                    {/* Update on figma */}

                    {/* <Box ml="5px" style={countInCircle}>
                      {notesCount}
                    </Box> */}

                    {/* Update on figma */}
                  </Tab>
                  {/* commenting till requirements are clear
                  tabIndex === 1 && (
                    <Center w="100%" justifyContent="end">
                      {workOrder?.leanWaiverSubmitted && workOrder.dateLeanWaiverSubmitted && (
                        <Checkbox
                          onChange={() => setRejectLW(!rejectLW)}
                          isChecked={rejectLW}
                          disabled={!workOrder.lienWaiverAccepted}
                          color="#4A5568"
                          fontSize="14px"
                          fontWeight={500}
                        >
                          {t('rejectLienWaiver')}
                        </Checkbox>
                      )}
                    </Center>
                      )*/}

                  {showRejectInvoice &&
                    [STATUS.Invoiced, STATUS.Rejected].includes(
                      workOrder?.statusLabel?.toLocaleLowerCase() as STATUS,
                    ) && (
                      <Center w="100%" justifyContent="end">
                        <Checkbox
                          onChange={() => setRejectInvoice(!rejectInvoice)}
                          isChecked={rejectInvoice}
                          disabled={workOrder.status === 111}
                          color="#4A5568"
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
                      <WorkOrderDetailTab
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        workOrder={workOrder}
                        onClose={onClose}
                        onSave={onSave}
                        isWorkOrderUpdating={isWorkOrderUpdating}
                        swoProject={swoProject}
                        projectData={projectData}
                        documentsData={documentsData}
                        workOrderAssignedItems={workOrderAssignedItems}
                        isFetchingLineItems={isFetchingLineItems}
                        isLoadingLineItems={isLoadingLineItems}
                      />
                    </TabPanel>
                    <TabPanel p={0}>
                      {isProjectLoading ? (
                        <BlankSlate />
                      ) : (
                        <TransactionsTab
                          projectId={projectId as string}
                          tabsContainerRef={tabsContainerRef}
                          projectData={projectData}
                          onClose={onClose}
                          workOrder={workOrder}
                        />
                      )}
                    </TabPanel>
                    {displayAwardPlan && (
                      <TabPanel p={0}>
                        <ProjectAwardTab
                          workOrder={workOrderDetails}
                          isUpdating={isWorkOrderUpdating}
                          onSave={onSave}
                          onClose={onClose}
                          awardPlanScopeAmount={awardPlanScopeAmount}
                          projectAwardData={projectAwardData}
                        />
                      </TabPanel>
                    )}
                    <TabPanel p={0}>
                      {isDocumentsLoading ? (
                        <BlankSlate />
                      ) : (
                        <LienWaiverTab
                          isUpdating={isUpdating}
                          setIsUpdating={setIsUpdating}
                          navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                          documentsData={documentsData}
                          workOrder={workOrder}
                          onClose={onClose}
                          rejectChecked={!rejectLW}
                        />
                      )}
                    </TabPanel>
                    <TabPanel p={0}>
                      {isDocumentsLoading || isTransLoading ? (
                        <BlankSlate />
                      ) : (
                        <InvoiceTab
                          navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                          rejectInvoiceCheck={rejectInvoice}
                          transactions={transactions}
                          documentsData={documentsData}
                          workOrder={workOrder}
                          vendorAddress={vendorAddress || []}
                          isWorkOrderUpdating={isWorkOrderUpdating}
                          onClose={onClose}
                          onSave={onSave}
                          setTabIndex={setTabIndex}
                          projectData={projectData}
                        />
                      )}
                    </TabPanel>
                    <TabPanel p={0}>
                      {isProjectLoading ? (
                        <BlankSlate />
                      ) : (
                        <PaymentInfoTab
                          navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                          projectData={projectData}
                          workOrder={workOrder}
                          isWorkOrderUpdating={isWorkOrderUpdating}
                          onClose={onClose}
                          onSave={onSave}
                          rejectInvoiceCheck={rejectInvoice}
                        />
                      )}
                    </TabPanel>

                    <TabPanel p={0}>
                      <WorkOrderNotes
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        workOrder={workOrder}
                        onClose={onClose}
                        // setNotesCount={setNotesCount}
                        onSave={onSave}
                      />
                    </TabPanel>
                  </TabPanels>
                </Card>
              </Tabs>
            </Stack>
          </ModalContent>
        </>
      )}
    </Modal>
  )
}

const TabCustom: React.FC<{ isError?: boolean }> = ({ isError, children }) => {
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
