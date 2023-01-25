import { useDisclosure, FormControl, FormLabel, Switch, Flex, HStack } from '@chakra-ui/react'

import { Box, Button, Stack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { EstimateSummaryCard } from 'features/estimate-details/estimate-summary-card'
import { useTranslation } from 'react-i18next'
import { TransactionsTable } from 'features/estimate-details/transactions/transactions-table'
import { usePCProject } from 'api/pc-projects'
import { Project } from 'types/project.type'
import { AmountDetailsCard } from 'features/estimate-details/project-amount-detail'
import { BiAddToQueue, BiUpload } from 'react-icons/bi'

import EstimateDetailsTab from 'features/update-estimate-details/estimate-details-form'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from 'components/tabs/tabs'
import AddNewTransactionModal from 'features/estimate-details/transactions/add-transaction-modal'
import { VendorDocumentsTable } from 'features/estimate-details/documents/documents-table'
import { UploadDocumentModal } from 'features/estimate-details/documents/upload-document'
import { Card } from 'components/card/card'
// import { AlertsTable } from 'features/projects/alerts/alerts-table'
// import { AlertStatusModal } from 'features/projects/alerts/alert-status'
// import { countInCircle } from 'theme/common-style'
import ProjectNotes from 'features/estimate-details/project-notes-tab'
import { TransactionDetails } from 'features/estimate-details/transaction-details/transaction-details'
import { AuditLogsTable } from 'features/estimate-details/audit-logs/audit-logs-table'
import { useProjectAuditLogs } from 'api/project-details'
import { boxShadow } from 'theme/common-style'

export const EstimateDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<{ projectId: string }>()

  const { projectData, isLoading } = usePCProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)
  // const [alertRow, selectedAlertRow] = useState(true)
  // const [firstDate, setFirstDate] = useState(undefined);

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
  const { auditLogs, isLoading: isLoadingAudits, refetch: refetchAudits } = useProjectAuditLogs(projectId)

  const [isShowProjectFinancialOverview, setIsShowProjectFinancialOverview] = useState(false)

  const projectStatus = (projectData?.projectStatus || '').toLowerCase()

  const preventNewTransaction = !!(projectStatus === 'paid' || projectStatus === 'cancelled')

  // useEffect(() => {
  //   if (tabIndex === 6) {
  //     refetchAudits()
  //   }
  // }, [tabIndex])

  return (
    <>
      <Stack w={{ base: '971px', xl: '100%' }} spacing={'16px'} ref={tabsContainerRef} h="calc(100vh - 160px)">
        <EstimateSummaryCard projectData={projectData as Project} isLoading={isLoading} />
        <AmountDetailsCard projectId={projectId} />

        <Stack w={{ base: '971px', xl: '100%' }} spacing={5} pb="4">
          <Tabs size="sm" variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)}>
            <TabList h={'50px'} alignItems="end" border="none">
              <Flex h={'40px'} py={'1px'}>
                <Tab>{t('estimates.estimateDetails.transactions')}</Tab>
                <Tab>{t('estimates.estimateDetails.estimateDetails')}</Tab>
                <Tab>{t('estimates.estimateDetails.documents')}</Tab>
                {/* <Tab>{t('alerts')}</Tab> */}
                <Tab>
                  {t('estimates.estimateDetails.notes')}
                  {/* Figma update */}

                  {/* <Box ml="5px" style={countInCircle}>
                  {notesCount}
                </Box> */}

                  {/* Figma update */}
                </Tab>
                {<Tab>{t('estimates.estimateDetails.auditLogs')}</Tab>}
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
                {tabIndex === 2 && (
                  <Button colorScheme="brand" onClick={onDocumentModalOpen} leftIcon={<BiUpload />} mb="15px">
                    {t('estimates.estimateDetails.upload')}
                  </Button>
                )}

                {/* {tabIndex === 4 && (
                  <Button colorScheme="brand" onClick={onAlertModalOpen}>
                    Resolve
                  </Button>
                )} */}
                {tabIndex === 0 && (
                  <HStack spacing="16px" mb="10px">
                    <Box mt={'14px'}>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel fontWeight="600" htmlFor="view-details" mb="0" variant="light-label" size="md">
                          {t('estimates.estimateDetails.viewDetails')}
                        </FormLabel>
                        <Switch
                          size="sm"
                          id="view-details"
                          outline="4px solid white"
                          rounded="full"
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
                      {t('estimates.estimateDetails.newTransaction')}
                    </Button>
                  </HStack>
                )}
              </Box>
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
                <TabPanel p="0px">
                  <Card rounded="16px" padding="0">
                    <EstimateDetailsTab projectData={projectData as Project} />
                  </Card>
                </TabPanel>

                <TabPanel p="0px">
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

                <TabPanel p="0" minH="calc(100vh - 408px)">
                  <ProjectNotes projectId={projectId} />
                </TabPanel>
                {
                  <TabPanel p="0px" minH="calc(100vh - 450px)">
                    <AuditLogsTable auditLogs={auditLogs} isLoading={isLoadingAudits} refetch={refetchAudits} />
                  </TabPanel>
                }
              </TabPanels>
            </Card>
          </Tabs>
        </Stack>

        <AddNewTransactionModal
          isOpen={isOpenTransactionModal}
          onClose={onTransactionModalClose}
          projectId={projectId as string}
          projectStatus={projectStatus}
        />

        {/* <AlertStatusModal isOpen={isOpenAlertModal} onClose={onAlertModalClose} alert={alertRow} /> */}
        <UploadDocumentModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} projectId={projectId} />
      </Stack>
    </>
  )
}
