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
import { TransactionsTable } from 'features/project-coordinator/transactions-table'
import { AddNewTransactionModal } from 'features/projects/transactions/add-update-transaction'
import { usePCProject } from 'utils/pc-projects'
import { ProjectType } from 'types/project.type'

export const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<{ projectId: string }>()
  const { projectData, isLoading } = usePCProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)
  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()
  const { onOpen: onDocumentModalOpen } = useDisclosure()
  const [projectTableInstance, setInstance] = useState<any>(null)
  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }

  return (
    <>
      <Stack w="100%" spacing={8} ref={tabsContainerRef} h="calc(100vh - 160px)">
        <TransactionInfoCard projectData={projectData as ProjectType} isLoading={isLoading} />

        <Stack w={{ base: '971px', xl: '100%' }} spacing={5}>
          <Tabs variant="enclosed" onChange={index => setTabIndex(index)} mt="7">
            <TabList color="#4A5568">
              <Tab _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}>
                {t('Transactions')}
              </Tab>
              <Tab minW={180} _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}>
                {t('vendorWorkOrders')}
              </Tab>
              <Tab _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}>
                {t('documents')}
              </Tab>
              <Tab _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}>{'Notes'}</Tab>
              <Tab _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}>
                {t('alerts')}
              </Tab>
              <Tab minW={120} _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}>
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
                      _hover={{ bg: '#4E87F8', color: '#FFFFFF' }}
                      onClick={() => {
                        if (projectTableInstance) {
                          projectTableInstance?.exportData('xlsx', false)
                        }
                      }}
                    >
                      {t('export')}
                    </Button>
                    <Button
                      bg="#FFFFFF"
                      color="#4E87F8"
                      border="1px solid #4E87F8"
                      marginRight={1}
                      size="md"
                      _hover={{ bg: '#4E87F8', color: '#FFFFFF' }}
                      // onClick={}
                    >
                      {'Settings'}
                    </Button>
                    <Button
                      bg="#4E87F8"
                      color="#FFFFFF"
                      size="md"
                      _hover={{ bg: 'royalblue' }}
                      onClick={onTransactionModalOpen}
                    >
                      {t('newTransaction')}
                    </Button>
                  </>
                )}
              </Box>
            </TabList>

            <TabPanels mt="31px" h="100%">
              <TabPanel p="0px" h="100%">
                <Box mb={5}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="view-details" mb="0">
                      View Details
                    </FormLabel>
                    <Switch id="view-details" />
                  </FormControl>
                </Box>
                <Box h="100%">
                  <TransactionsTable ref={tabsContainerRef} setTableInstance={setProjectTableInstance} />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>
      <AddNewTransactionModal isOpen={isOpenTransactionModal} onClose={onTransactionModalClose} />
    </>
  )
}
