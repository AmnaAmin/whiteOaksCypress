import { useDisclosure, Text, Flex } from '@chakra-ui/react'
import { Tabs, TabList, TabPanel, TabPanels, Tab } from 'components/tabs/tabs'
import { Box, Stack, Button } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

import { TransactionsTable } from 'features/project-details/transactions/transactions-table'
import AddNewTransactionModal from 'features/project-details/transactions/add-transaction-modal'
import { VendorDocumentsTable } from 'features/project-details/documents/documents-table'
import { WorkOrdersTable } from 'features/vendor/vendor-work-order/work-orders-table'
import { AlertStatusModal } from 'features/project-details/alerts/alert-status'
import { UploadDocumentModal } from 'features/project-details/documents/upload-document'
import { useParams } from 'react-router'
import { TransactionInfoCard } from 'features/project-details/transactions/transaction-info-card'
import { useTranslation } from 'react-i18next'
import { useProject } from 'api/projects'
import { Project } from 'types/project.type'
import { BiAddToQueue, BiUpload } from 'react-icons/bi'
import { TriggeredAlertsTable } from 'features/project-details/alerts/triggered-alerts-table'

const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { projectData, isLoading } = useProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState<number>(1)
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
          <Tabs index={tabIndex} variant="enclosed" colorScheme="brand" onChange={index => setTabIndex(index)}>
            <TabList h={'50px'} alignItems="end">
              <Flex h={'40px'}>
                <Tab aria-labelledby="transaction-tab">{t('transaction')}</Tab>

                <Tab whiteSpace="nowrap">{t('vendorWorkOrders')}</Tab>

                <Tab aria-labelledby="documents-tab">{t('documents')}</Tab>

                <Tab>{t('alerts')}</Tab>
              </Flex>

              <Box w="100%" h="50px" display="flex" justifyContent="end" position="relative">
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
                  <TriggeredAlertsTable
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
      <AddNewTransactionModal
        isOpen={isOpenTransactionModal}
        onClose={onTransactionModalClose}
        projectId={projectId as string}
      />
    </>
  )
}

export default ProjectDetails
