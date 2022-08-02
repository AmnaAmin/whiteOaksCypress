import { useDisclosure, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanel, TabPanels, Tab } from 'components/tabs/tabs'
import { Box, Stack, Button } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

import { TransactionsTable } from 'features/projects/transactions/transactions-table'
import AddNewTransactionModal from 'features/projects/transactions/add-transaction-modal'
import { VendorDocumentsTable } from 'features/projects/documents/documents-table'
import { WorkOrdersTable } from 'features/projects/work-orders-table'
import { AlertsTable } from 'features/projects/alerts/alerts-table'
import { AlertStatusModal } from 'features/projects/alerts/alert-status'
import { UploadDocumentModal } from 'features/projects/documents/upload-document'
import { useParams } from 'react-router'
import { TransactionInfoCard } from 'features/projects/transactions/transaction-info-card'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import { useProject } from 'utils/projects'
import { Project } from 'types/project.type'
import { BiAddToQueue, BiUpload } from 'react-icons/bi'

const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { projectData, isLoading } = useProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [alertRow, selectedAlertRow] = useState(true)
  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()
  const { isOpen: isOpenAlertModal, onClose: onAlertModalClose, onOpen: onAlertModalOpen } = useDisclosure()
  const vendorWOStatusValue = (projectData?.vendorWOStatusValue || '').toLowerCase()

  const isNewTransactionAllow = vendorWOStatusValue
    ? !!(vendorWOStatusValue === 'paid' || vendorWOStatusValue === 'cancelled')
    : true

  return (
    <>
      <Stack w="100%" spacing={8} ref={tabsContainerRef} h="calc(100vh - 160px)">
        <TransactionInfoCard projectData={projectData as Project} isLoading={isLoading} />

        <Stack spacing={5}>
          <Tabs index={tabIndex} variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)} mt="7">
            <TabList>
              <Tab aria-labelledby="transaction-tab">{t('transaction')}</Tab>

              <Tab whiteSpace="nowrap">{t('vendorWorkOrders')}</Tab>

              <Tab aria-labelledby="documents-tab">{t('documents')}</Tab>

              <Tab>{t('alerts')}</Tab>

              <Box w="100%" h="40px" display="flex" justifyContent="end" position="relative">
                {tabIndex === 2 && (
                  <Button onClick={onDocumentModalOpen} colorScheme="brand" leftIcon={<BiUpload fontSize="16px" />}>
                    {t('upload')}
                  </Button>
                )}
                {tabIndex === 3 && (
                  <Button colorScheme="brand" onClick={onAlertModalOpen}>
                    <Text fontSize="14px" fontStyle="normal" fontWeight={600}>
                      {t('resolveAll')}
                    </Text>
                  </Button>
                )}
                {tabIndex === 0 && (
                  <Button
                    data-testid="new-transaction-button"
                    onClick={onTransactionModalOpen}
                    colorScheme="brand"
                    leftIcon={<BiAddToQueue />}
                    isDisabled={isNewTransactionAllow}
                  >
                    {t('newTransaction')}
                  </Button>
                )}
              </Box>
            </TabList>

            <TabPanels mt="10px" h="100%">
              <TabPanel p="0px" h="0px">
                <Box h="100%">
                  <TransactionsTable ref={tabsContainerRef} />
                </Box>
              </TabPanel>
              <TabPanel p="0px" h="0px">
                <Box h="100%" w="100%">
                  <WorkOrdersTable
                    projectData={projectData as Project}
                    onTabChange={n => {
                      console.log(n)
                      setTabIndex(n)
                    }}
                    ref={tabsContainerRef}
                  />
                </Box>
              </TabPanel>
              <TabPanel p="0px" h="0px">
                <Box h="100%" w="100%">
                  <VendorDocumentsTable ref={tabsContainerRef} />
                </Box>
              </TabPanel>
              <TabPanel p="0px" h="0px">
                <Box h="100%" w="100%">
                  <AlertsTable
                    onRowClick={(e, row) => {
                      selectedAlertRow(row.values)
                      onAlertModalOpen()
                    }}
                    ref={tabsContainerRef}
                  />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>
      <AlertStatusModal isOpen={isOpenAlertModal} onClose={onAlertModalClose} alert={alertRow} />
      {isOpenDocumentModal && (
        <UploadDocumentModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} projectId={projectId} />
      )}
      <AddNewTransactionModal isOpen={isOpenTransactionModal} onClose={onTransactionModalClose} />
    </>
  )
}

export default ProjectDetails
