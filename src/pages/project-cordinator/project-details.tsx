import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react'
import { Box, Button, Stack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { AiOutlineUpload } from 'react-icons/ai'
import { useParams } from 'react-router'
import { TransactionInfoCard } from 'features/project-coordinator/transaction-info-card'
import { useTranslation } from 'react-i18next'
import { TransactionsTable, COLUMNS } from 'features/project-coordinator/transactions-table'
import { usePCProject } from 'utils/pc-projects'
import { ProjectType } from 'types/project.type'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'
import { BsBoxArrowUp } from 'react-icons/bs'
import ProjectDetailsTAb from 'features/project-coordinator/project-details/project-details-tab'

export const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<{ projectId: string }>()
  const { projectData, isLoading } = usePCProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)
  const { onOpen: onDocumentModalOpen } = useDisclosure()
  const [projectTableInstance, setInstance] = useState<any>(null)
  const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  const { tableColumns, resizeElementRef, settingColumns } = useTableColumnSettings(COLUMNS, TableNames.transaction)
  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }
  const onSave = columns => {
    postProjectColumn(columns)
  }

  const TabStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'gray.600',
  }

  return (
    <>
      <Stack w="100%" spacing={8} ref={tabsContainerRef} h="calc(100vh - 160px)">
        <TransactionInfoCard projectData={projectData as ProjectType} isLoading={isLoading} />

        <Stack w={{ base: '971px', xl: '100%' }} spacing={5}>
          <Tabs variant="enclosed" onChange={index => setTabIndex(index)} mt="7">
            <TabList color="#4A5568">
              <Tab
                _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '16px' }}
                _focus={{ outline: 'none' }}
                sx={TabStyle}
              >
                {t('Transactions')}
              </Tab>
              <Tab
                whiteSpace="nowrap"
                _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '16px' }}
                _focus={{ outline: 'none' }}
                sx={TabStyle}
              >
                Project Details
              </Tab>
              <Tab
                whiteSpace="nowrap"
                _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '16px' }}
                _focus={{ outline: 'none' }}
                sx={TabStyle}
              >
                {t('vendorWorkOrders')}
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '16px' }}
                _focus={{ outline: 'none' }}
                sx={TabStyle}
              >
                {t('documents')}
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '16px' }}
                _focus={{ outline: 'none' }}
                sx={TabStyle}
              >
                {'Notes'}
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '16px' }}
                _focus={{ outline: 'none' }}
                sx={TabStyle}
              >
                {t('alerts')}
              </Tab>
              <Tab
                minW={120}
                _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '16px' }}
                _focus={{ outline: 'none' }}
                sx={TabStyle}
              >
                {'HFE Mgmt'}
              </Tab>
              <Box w="100%" display="flex" justifyContent="end" position="relative" bottom="2">
                {tabIndex === 2 && (
                  <Button
                    onClick={onDocumentModalOpen}
                    bg="#4E87F8"
                    color="#FFFFFF"
                    size="md"
                    _hover={{ bg: 'royalblue' }}
                  >
                    <Box pos="relative" right="6px" fontWeight="bold" pb="3.3px">
                      <AiOutlineUpload />
                    </Box>
                    {t('upload')}
                  </Button>
                )}
                {tabIndex === 3 && (
                  <Button bg="#4E87F8" color="#FFFFFF" size="md" _hover={{ bg: 'royalblue' }}>
                    <Box pos="relative" right="6px" fontWeight="bold" pb="3.3px"></Box>
                    {t('resolve')}
                  </Button>
                )}
                {tabIndex === 0 && (
                  <>
                    <Button
                      bg="#FFFFFF"
                      color="#4E87F8"
                      border="1px solid #4E87F8"
                      marginRight={1}
                      size="md"
                      fontSize="12px"
                      fontWeight={500}
                      fontStyle="normal"
                      _hover={{ bg: 'none' }}
                      onClick={() => {
                        if (projectTableInstance) {
                          projectTableInstance?.exportData('xlsx', false)
                        }
                      }}
                    >
                      <Box pos="relative" right="6px" fontWeight="bold" pb="3.3px">
                        <BsBoxArrowUp />
                      </Box>
                      {t('export')}
                    </Button>
                    <Button
                      bg="#FFFFFF"
                      color="#4E87F8"
                      border="1px solid #4E87F8"
                      _hover={{ bg: 'none' }}
                      marginRight={1}
                      size="md"
                    >
                      {settingColumns && (
                        <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />
                      )}
                    </Button>
                    <Button
                      bg="#4E87F8"
                      color="#FFFFFF"
                      size="md"
                      fontSize="12px"
                      _hover={{ bg: 'royalblue' }}
                      // onClick={onTransactionModalOpen}
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
                  <TransactionsTable
                    setTableInstance={setProjectTableInstance}
                    projectColumns={tableColumns}
                    resizeElementRef={resizeElementRef}
                  />
                </Box>
              </TabPanel>
              <TabPanel p="0px" mt="3">
                <ProjectDetailsTAb />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>
    </>
  )
}
