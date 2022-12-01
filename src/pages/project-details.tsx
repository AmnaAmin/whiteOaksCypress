import { useDisclosure, FormControl, FormLabel, Switch, Flex, HStack } from '@chakra-ui/react'

import { Box, Button, Stack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { ProjectSummaryCard } from 'features/project-details/project-summary-card'
import { useTranslation } from 'react-i18next'
import { TransactionsTable } from 'features/project-details/transactions/transactions-table'
import { usePCProject } from 'api/pc-projects'
import { Project } from 'types/project.type'
import { AmountDetailsCard } from 'features/project-details/project-amount-detail'
import { BiAddToQueue, BiUpload } from 'react-icons/bi'

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
import ProjectSchedule from 'features/project-details/project-schedule/project-schedule'
import { useGanttChart } from 'api/pc-projects'
// import { countInCircle } from 'theme/common-style'
import ProjectNotes from 'features/project-details/project-notes-tab'
import { STATUS } from 'features/common/status'
import { TransactionDetails } from 'features/project-details/transaction-details/transaction-details'

export const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<{ projectId: string }>()

  const { projectData, isLoading } = usePCProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)
  const { ganttChartData } = useGanttChart(projectId)
  // const [alertRow, selectedAlertRow] = useState(true)
  // const [firstDate, setFirstDate] = useState(undefined);
  const [formattedGanttData, setFormattedGanttData] = useState<any[]>([])
  // const [projectTableInstance, setInstance] = useState<any>(null)
  // const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  // const { tableColumns, resizeElementRef, settingColumns } = useTableColumnSettings(COLUMNS, TableNames.transaction)
  // const setProjectTableInstance = tableInstance => {
  //   setInstance(tableInstance)
  // }
  // const onSave = columns => {
  //   postProjectColumn(columns)
  // }
  // const [notesCount, setNotesCount] = useState(0)

  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isShowProjectFinancialOverview, setIsShowProjectFinancialOverview] = useState(false)

  const projectStatus = (projectData?.projectStatus || '').toLowerCase()

  const preventNewTransaction = !!(projectStatus === 'paid' || projectStatus === 'cancelled')

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

  return (
    <>
      <Stack w={{ base: '971px', xl: '100%' }} spacing={'16px'} ref={tabsContainerRef} h="calc(100vh - 160px)">
        <ProjectSummaryCard projectData={projectData as Project} isLoading={isLoading} />
        <AmountDetailsCard projectId={projectId} />

        <Stack w={{ base: '971px', xl: '100%' }} spacing={5}>
          <Tabs size="sm" variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)}>
            <TabList h={'50px'} alignItems="end">
              <Flex h={'40px'}>
                <Tab>{t('projects.projectDetails.transactions')}</Tab>
                <Tab>{t('projects.projectDetails.projectDetails')}</Tab>
                <Tab>{t('projects.projectDetails.vendorWorkOrders')}</Tab>
                <Tab>{t('projects.projectDetails.schedule')}</Tab>
                <Tab>{t('projects.projectDetails.documents')}</Tab>
                {/* <Tab>{t('alerts')}</Tab> */}
                <Tab>
                  {t('projects.projectDetails.notes')}
                  {/* Figma update */}

                  {/* <Box ml="5px" style={countInCircle}>
                  {notesCount}
                </Box> */}

                  {/* Figma update */}
                </Tab>
              </Flex>

              <HStack h="50px" w="100%" justifyContent="end">
                {tabIndex === 2 &&
                  ![STATUS.Closed, STATUS.Invoiced, STATUS.Cancelled, STATUS.Paid, STATUS.Punch].includes(
                    projectStatus as STATUS,
                  ) && (
                    <Button colorScheme="brand" leftIcon={<BiAddToQueue />} onClick={onOpen}>
                      {t('newWorkOrder')}
                    </Button>
                  )}
                {tabIndex === 4 && (
                  <Button colorScheme="brand" onClick={onDocumentModalOpen} leftIcon={<BiUpload />}>
                    {t('projects.projectDetails.upload')}
                  </Button>
                )}

                {/* {tabIndex === 4 && (
                  <Button colorScheme="brand" onClick={onAlertModalOpen}>
                    Resolve
                  </Button>
                )} */}
                {tabIndex === 0 && (
                  <HStack spacing="16px">
                    <Box mt={'14px'}>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel fontWeight="600" htmlFor="view-details" mb="0" variant="light-label" size="md">
                          {t('projects.projectDetails.viewDetails')}
                        </FormLabel>
                        <Switch
                          size="sm"
                          id="view-details"
                          isChecked={isShowProjectFinancialOverview}
                          onChange={event => setIsShowProjectFinancialOverview(event.target.checked)}
                        />
                      </FormControl>
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
                  </HStack>
                )}
              </HStack>
            </TabList>

            <TabPanels h="100%">
              <TabPanel p="0px" h="100%" mt="7px">
                <Box h="100%">
                  {isShowProjectFinancialOverview ? (
                    <TransactionDetails ref={tabsContainerRef} />
                  ) : (
                    <TransactionsTable ref={tabsContainerRef} projectStatus={projectData?.projectStatus as string} />
                  )}
                </Box>
              </TabPanel>
              <TabPanel p="0px" mt="6px">
                <Card rounded="16px" padding="0">
                  <ProjectDetailsTab projectData={projectData as Project} />
                </Card>
              </TabPanel>

              <TabPanel p="0px" h="100%" mt="7px">
                <WorkOrdersTable ref={tabsContainerRef} />
              </TabPanel>
              <TabPanel p="0px" mt="7px">
                {formattedGanttData?.length > 0 ? (
                  <ProjectSchedule isLoading={isLoading} data={formattedGanttData} />
                ) : (
                  <Flex h="calc(100vh - 450px)" bg="#fff" justifyContent={'center'}>
                    <FormLabel display={'flex'} alignItems="center" variant="light-label">
                      {'No data returned for this view.'}
                    </FormLabel>
                  </Flex>
                )}
              </TabPanel>
              <TabPanel p="0px" mt="7px">
                <VendorDocumentsTable ref={tabsContainerRef} />
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

              <TabPanel p="0" mt="7px">
                <ProjectNotes projectId={projectId} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>

        <AddNewTransactionModal
          isOpen={isOpenTransactionModal}
          onClose={onTransactionModalClose}
          projectId={projectId as string}
          projectStatus={projectStatus}
        />
        {isOpen && <NewWorkOrder projectData={projectData as Project} isOpen={isOpen} onClose={onClose} />}
        {/* <AlertStatusModal isOpen={isOpenAlertModal} onClose={onAlertModalClose} alert={alertRow} /> */}
        <UploadDocumentModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} projectId={projectId} />
      </Stack>
    </>
  )
}
