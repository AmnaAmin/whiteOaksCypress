import { Text, useDisclosure, FormControl, FormLabel, Switch, Flex } from '@chakra-ui/react'

import { Box, Button, Stack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { TransactionInfoCard } from 'features/project-coordinator/transaction-info-card'
import { useTranslation } from 'react-i18next'
import { TransactionsTable } from 'features/projects/transactions/transactions-table'
// import { TransactionsTable, COLUMNS } from 'features/project-coordinator/transactions-table'
import { usePCProject } from 'utils/pc-projects'
import { ProjectType } from 'types/project.type'
// import { useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'
// import { TableNames } from 'types/table-column.types'
import { AmountDetailsCard } from 'features/project-coordinator/project-amount-detail'
import { BiAddToQueue } from 'react-icons/bi'
import { UploadModal } from '../../features/projects/modals/project-coordinator/upload-modal'
import ProjectDetailsTab from 'features/project-coordinator/project-details/project-details-tab'
import NewWorkOrder from 'features/projects/modals/project-coordinator/new-work-order'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from 'components/tabs/tabs'
import { WorkOrdersTable } from 'features/project-coordinator/work-orders-table'
import { NotesTab } from '../../features/common/notes-tab'
import AddNewTransactionModal from 'features/projects/transactions/add-transaction-modal'

export const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<{ projectId: string }>()
  const { projectData, isLoading } = usePCProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)
  // const [projectTableInstance, setInstance] = useState<any>(null)
  // const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  // const { tableColumns, resizeElementRef, settingColumns } = useTableColumnSettings(COLUMNS, TableNames.transaction)
  // const setProjectTableInstance = tableInstance => {
  //   setInstance(tableInstance)
  // }
  // const onSave = columns => {
  //   postProjectColumn(columns)
  // }
  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isOpen: isOpenUploadModal, onOpen: OnUploadMdal, onClose: onCloseUploadModal } = useDisclosure()
  const projectStatus = (projectData?.projectStatus || '').toLowerCase()

  const preventNewTransaction = !!(projectStatus === 'paid' || projectStatus === 'cancelled')

  return (
    <>
      <Stack w="100%" spacing={8} ref={tabsContainerRef} h="calc(100vh - 160px)">
        <TransactionInfoCard projectData={projectData as ProjectType} isLoading={isLoading} />
        <AmountDetailsCard projectData={projectData as ProjectType} isLoading={isLoading} />

        {tabIndex === 1}

        <Stack w={{ base: '971px', xl: '100%' }} spacing={5}>
          <Tabs variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)} mt="7">
            <TabList>
              <Tab>{t('Transactions')}</Tab>
              <Tab>{t('projectDetails')}</Tab>
              <Tab>{t('vendorWorkOrders')}</Tab>
              <Tab>{t('documents')}</Tab>
              <Tab>{t('alerts')}</Tab>
              <Tab>{'Notes'}</Tab>

              <Box w="100%" display="flex" justifyContent="end" position="relative">
                {tabIndex === 2 && (
                  <Button
                    onClick={onOpen}
                    // bg="#4E87F8"
                    color="white"
                    size="md"
                    bg="#4e87f8"
                    _hover={{ bg: '#2A61CE' }}
                  >
                    <Flex alignItems="center" fontSize="14px" fontWeight={500}>
                      <Text mr={1}>
                        <BiAddToQueue size={14} />
                      </Text>
                      <Text>{t('newWorkOrder')}</Text>
                    </Flex>

                    <NewWorkOrder projectData={projectData as ProjectType} isOpen={isOpen} onClose={onClose} />
                  </Button>
                )}
                {tabIndex === 3 && (
                  <Button
                    _hover={{ bg: 'gray.200' }}
                    color="blue"
                    fontSize={14}
                    fontWeight={500}
                    onClick={OnUploadMdal}
                  >
                    Upload
                  </Button>
                )}
                {tabIndex === 0 && (
                  <>
                    <Button
                      variant="ghost"
                      colorScheme="brand"
                      onClick={onTransactionModalOpen}
                      isDisabled={preventNewTransaction}
                      leftIcon={<BiAddToQueue />}
                    >
                      {t('newTransaction')}
                    </Button>
                  </>
                )}
              </Box>
            </TabList>

            <TabPanels h="100%">
              <TabPanel p="0px" h="100%" mt="31px">
                <Box mb="5">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="view-details" mb="0">
                      View Details
                    </FormLabel>
                    <Switch id="view-details" />
                  </FormControl>
                </Box>
                <Box h="100%">
                  <TransactionsTable ref={tabsContainerRef} />
                </Box>
              </TabPanel>
              <TabPanel p="0px" mt="3">
                <ProjectDetailsTab />
              </TabPanel>

              <TabPanel p="0px" h="0px">
                <Box h="100%" w="100%">
                  <WorkOrdersTable ref={tabsContainerRef} />
                </Box>
              </TabPanel>
              <TabPanel p="0px" h="0px"></TabPanel>
              <TabPanel p="0px" h="0px"></TabPanel>

              <TabPanel px="0">
                <NotesTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
        <AddNewTransactionModal isOpen={isOpenTransactionModal} onClose={onTransactionModalClose} />
        <UploadModal isOpen={isOpenUploadModal} onClose={onCloseUploadModal} />
      </Stack>
    </>
  )
}
