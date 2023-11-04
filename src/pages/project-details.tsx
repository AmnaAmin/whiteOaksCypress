import { useDisclosure, FormControl, FormLabel, Switch, Flex } from '@chakra-ui/react'

import { Box, Button, Stack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { ProjectSummaryCard } from 'features/project-details/project-summary-card'
import { useTranslation } from 'react-i18next'
import { TransactionsTable } from 'features/project-details/transactions/transactions-table'
import { usePCProject } from 'api/pc-projects'
import { Project } from 'types/project.type'
import { AmountDetailsCard } from 'features/project-details/project-amount-detail'
import { BiAddToQueue, BiBookAdd, BiUpload } from 'react-icons/bi'

import ProjectDetailsTab from 'features/update-project-details/project-details-form'
import NewWorkOrder from 'features/work-order/new-work-order'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from 'components/tabs/tabs'
import { WorkOrdersTable } from 'features/work-order/work-orders-table'
import AddNewTransactionModal from 'features/project-details/transactions/add-transaction-modal'
import { VendorDocumentsTable } from 'features/project-details/documents/documents-table'
import { UploadDocumentModal } from 'features/project-details/documents/upload-document'
import { Card } from 'components/card/card'
// import { AlertsTable } from 'features/projects/alerts/alerts-table'
// import { AlertStatusModal } from 'features/projects/alerts/alert-status'
import { useGanttChart } from 'api/pc-projects'
// import { countInCircle } from 'theme/common-style'
import ProjectNotes from 'features/project-details/project-notes-tab'
import { STATUS } from 'features/common/status'
import { TransactionDetails } from 'features/project-details/transaction-details/transaction-details'
import ScheduleTab from 'features/project-details/project-schedule/schedule-tab'
import { AuditLogsTable } from 'features/project-details/audit-logs/audit-logs-table'
import { useProjectAuditLogs } from 'api/project-details'
import { boxShadow } from 'theme/common-style'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import InvoiceModal from 'features/update-project-details/add-invoice-modal'
import { ADV_PERMISSIONS } from 'api/access-control'

export const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<{ projectId: string }>()

  const { projectData, isLoading } = usePCProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const { ganttChartData, isLoading: isGanttChartLoading } = useGanttChart(projectId)
  const [formattedGanttData, setFormattedGanttData] = useState<any[]>([])

  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { auditLogs, isLoading: isLoadingAudits, refetch: refetchAudits } = useProjectAuditLogs(projectId)
  const [createdTransID, setCreatedTransID] = useState()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
  const setCreatedTransaction = e => {
    setCreatedTransID(e?.data)
  }

  const [isShowProjectFinancialOverview, setIsShowProjectFinancialOverview] = useState(false)
  const { isOpen: isOpenInvoiceModal, onClose: onInvoiceModalClose, onOpen: onInvoiceModalOpen } = useDisclosure()

  const projectStatus = (projectData?.projectStatus || '').toLowerCase()

  const preventNewTransaction = !!(projectStatus === 'paid' || projectStatus === 'cancelled')
  const location = useLocation()
  const navigate = useNavigate()
  const workOrder = (location?.state as any)?.workOrder || {}
  const transaction = (location?.state as any)?.transaction || {}
  const { permissions } = useRoleBasedPermissions()
  const isAllowedInvoicing = permissions.some(p => [ADV_PERMISSIONS.invoiceEdit, 'ALL'].includes(p))

  useEffect(() => {
    if (workOrder?.id) {
      setTabIndex(2)
      navigate(location.pathname, {})
    }
  }, [workOrder])

  useEffect(() => {
    if (transaction?.id) {
      setTabIndex(0)
      navigate(location.pathname, {})
    }
  }, [transaction])

  useEffect(() => {
    if (ganttChartData?.length > 0 && projectData) {
      const firstRecord = {
        id: +new Date(),
        type: 'task',
        trade: 'Project',
        name: 'Client Start/End',
        start: new Date(projectData.clientStartDate as string),
        end: new Date(projectData.clientDueDate as string),
        progress: 100,
      }

      setFormattedGanttData([
        firstRecord,
        ...ganttChartData.map(row => ({
          id: row.id,
          type: 'task',
          name: row.workDescription,
          trade: row.companyName,
          progress: Number(row.status),
          start: new Date(row.startDate as string),
          end: new Date(row.endDate as string),
        })),
      ])
    }
  }, [ganttChartData, projectData])

  // useEffect(() => {
  //   if (tabIndex === 6) {
  //     refetchAudits()
  //   }
  // }, [tabIndex])

  return (
    <>
      <Stack w={{ base: '971px', xl: '100%' }} spacing={'16px'} ref={tabsContainerRef} h="calc(100vh - 160px)">
        <ProjectSummaryCard projectData={projectData as Project} isLoading={isLoading} />
        <AmountDetailsCard projectId={projectId} />

        <Stack marginTop="-1px !important" w={{ base: '971px', xl: '100%' }} spacing={5} pb="4">
          <Tabs
            index={tabIndex}
            size="sm"
            variant="enclosed"
            colorScheme="brand"
            onChange={index => setTabIndex(index)}
          >
            <TabList h={'50px'} alignItems="end" border="none">
              <Flex h={'40px'} py={'1px'}>
                <Tab>{t('projects.projectDetails.transactions')}</Tab>
                <Tab>{t('projects.projectDetails.projectDetails')}</Tab>
                <Tab>{t('projects.projectDetails.vendorWorkOrders')}</Tab>
                <Tab>{t('projects.projectDetails.schedule')}</Tab>
                <Tab>{t('projects.projectDetails.documents')}</Tab>
                <Tab>{t('projects.projectDetails.notes')}</Tab>
                {<Tab>{t('projects.projectDetails.auditLogs')}</Tab>}
              </Flex>
            </TabList>

            <Card
              rounded="0px"
              roundedRight={{ base: '0px', md: '6px' }}
              roundedBottom="6px"
              style={boxShadow}
              pr={{ base: 0, sm: '15px' }}
            >
              <Box w="100%" display="flex" justifyContent={{ base: 'center', sm: 'end' }} position="relative">
                {!isReadOnly &&
                  tabIndex === 2 &&
                  ![
                    STATUS.Closed,
                    STATUS.Invoiced,
                    STATUS.Cancelled,
                    STATUS.Paid,
                    STATUS.Punch,
                    STATUS.ClientPaid,
                    STATUS.Overpayment,
                    STATUS.Reconcile,
                  ].includes(projectStatus as STATUS) && (
                    <Button colorScheme="brand" leftIcon={<BiAddToQueue />} onClick={onOpen} mb="15px">
                      {t('newWorkOrder')}
                    </Button>
                  )}
                {!isReadOnly && tabIndex === 4 && (
                  <Button colorScheme="brand" onClick={onDocumentModalOpen} leftIcon={<BiUpload />} mb="15px">
                    {t('projects.projectDetails.upload')}
                  </Button>
                )}
                {tabIndex === 0 && (
                  <Flex justifyContent={'end'} w="100%" gap={'10px'}>
                    <Box mt={'14px'}>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel
                          fontWeight="600"
                          htmlFor="view-details"
                          mb="0"
                          variant="light-label"
                          color="gray.500"
                          size="md"
                        >
                          {t('projects.projectDetails.viewDetails')}
                        </FormLabel>
                        <Switch
                          size="sm"
                          id="view-details"
                          outline="4px solid white"
                          color="brand.300"
                          rounded="full"
                          isChecked={isShowProjectFinancialOverview}
                          onChange={event => setIsShowProjectFinancialOverview(event.target.checked)}
                        />
                      </FormControl>
                    </Box>
                    {!isReadOnly && (
                      <>
                        <Box>
                          {isAllowedInvoicing && (
                            <Button colorScheme="brand" onClick={onInvoiceModalOpen} leftIcon={<BiBookAdd />} mb="15px">
                              {t('project.projectDetails.newInvoice')}
                            </Button>
                          )}
                        </Box>
                        <Button
                          variant="solid"
                          colorScheme="brand"
                          onClick={onTransactionModalOpen}
                          isDisabled={preventNewTransaction}
                          leftIcon={<BiAddToQueue />}
                        >
                          {t('projects.projectDetails.newTransaction')}
                        </Button>
                      </>
                    )}
                  </Flex>
                )}
              </Box>
              <TabPanels h="100%">
                <TabPanel p="0px" h="100%" mt="7px">
                  <Box h="100%">
                    {isShowProjectFinancialOverview ? (
                      <TransactionDetails ref={tabsContainerRef} />
                    ) : (
                      <TransactionsTable
                        ref={tabsContainerRef}
                        projectStatus={projectData?.projectStatus as string}
                        defaultSelected={transaction}
                        transId={createdTransID}
                        isReadOnly={isReadOnly}
                        projectData={projectData as Project}
                      />
                    )}
                  </Box>
                </TabPanel>
                <TabPanel p="0px">
                  <Card rounded="6px" padding="0" h="100%">
                    <ProjectDetailsTab projectData={projectData as Project} />
                  </Card>
                </TabPanel>

                <TabPanel p="0px">
                  <WorkOrdersTable ref={tabsContainerRef} defaultSelected={workOrder} />
                </TabPanel>
                <TabPanel p="0px" minH="calc(100vh - 409px)">
                  <ScheduleTab data={formattedGanttData} isLoading={isGanttChartLoading} />
                </TabPanel>
                <TabPanel p="0px">
                  <VendorDocumentsTable ref={tabsContainerRef} isReadOnly={isReadOnly} />
                </TabPanel>

                {/* <TabPanel px="0">
                <TriggeredAlertsTable
                  onRowClick={(e, row) => {
                    selectedAlertRow(row.values)
                    onAlertModalOpen()
                  }}
                  ref={tabsContainerRef}
                />
              </TabPanel> */}

                <TabPanel p="0" minH="calc(100vh - 408px)">
                  <ProjectNotes projectData={projectData} projectId={projectId} />
                </TabPanel>
                {
                  <TabPanel p="0px" minH="calc(100vh - 450px)">
                    <AuditLogsTable
                      auditLogs={auditLogs}
                      isLoading={isLoadingAudits}
                      refetch={refetchAudits}
                      isReadOnly={isReadOnly}
                    />
                  </TabPanel>
                }
              </TabPanels>
            </Card>
          </Tabs>
        </Stack>

        <AddNewTransactionModal
          isOpen={isOpenTransactionModal}
          onClose={onTransactionModalClose}
          setCreatedTransaction={setCreatedTransaction}
          projectId={projectId as string}
          projectStatus={projectStatus}
        />
        {isOpen && <NewWorkOrder projectData={projectData as Project} isOpen={isOpen} onClose={onClose} />}
        {/* <AlertStatusModal isOpen={isOpenAlertModal} onClose={onAlertModalClose} alert={alertRow} /> */}
        <UploadDocumentModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} projectId={projectId} />

        <InvoiceModal
          isOpen={isOpenInvoiceModal}
          onClose={() => {
            setSelectedInvoice(null)
            onInvoiceModalClose()
          }}
          projectId={projectData?.id}
          selectedInvoice={selectedInvoice}
        />
      </Stack>
    </>
  )
}
