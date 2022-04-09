import { Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure, Icon, Text } from '@chakra-ui/react'
import { Box, Button, Stack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

import { TransactionsTable } from 'features/projects/transactions/transactions-table'
import { AddNewTransactionModal } from 'features/projects/transactions/add-update-transaction'
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
import { ProjectType } from 'types/project.type'
import { BiAddToQueue } from 'react-icons/bi'

const projectTabStyle = {
  fontSize: '14px',
  fontWeight: 500,
  fontStyle: 'normal',
  color: 'gray.600',
}

export const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { projectData, isLoading } = useProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)
  const [alertRow, selectedAlertRow] = useState(true)
  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()
  const { isOpen: isOpenAlertModal, onClose: onAlertModalClose, onOpen: onAlertModalOpen } = useDisclosure()
  return (
    <>
      <Stack w="100%" spacing={8} ref={tabsContainerRef} h="calc(100vh - 160px)">
        <TransactionInfoCard projectData={projectData as ProjectType} isLoading={isLoading} />

        <Stack w={{ base: '971px', xl: '100%' }} spacing={5}>
          <Tabs variant="enclosed" onChange={index => setTabIndex(index)} mt="7">
            <TabList>
              <Tab
                aria-labelledby="transaction-tab"
                _focus={{ border: 'none' }}
                _selected={{ color: 'white', bg: '#4E87F8', fontWeight: 600 }}
                sx={projectTabStyle}
              >
                {t('transaction')}
              </Tab>

              <Tab
                _focus={{ border: 'none' }}
                _selected={{ color: 'white', bg: '#4E87F8', fontWeight: 600 }}
                whiteSpace="nowrap"
                sx={projectTabStyle}
              >
                {t('vendorWorkOrders')}
              </Tab>

              <Tab
                aria-labelledby="documents-tab"
                _focus={{ border: 'none' }}
                _selected={{ color: 'white', bg: '#4E87F8', fontWeight: 600 }}
                sx={projectTabStyle}
              >
                {t('documents')}
              </Tab>

              <Tab
                _focus={{ border: 'none' }}
                _selected={{ color: 'white', bg: '#4E87F8', fontWeight: 600 }}
                sx={projectTabStyle}
              >
                {t('alerts')}
              </Tab>

              <Box w="100%" h="40px" display="flex" justifyContent="end" position="relative" bottom="2">
                {tabIndex === 2 && (
                  <Button onClick={onDocumentModalOpen} fontSize={14} fontWeight={600} color="#4E87F8" size="md">
                    <Box pos="relative" right="6px" pb="3.3px"></Box>
                    {t('upload')}
                  </Button>
                )}
                {tabIndex === 3 && (
                  <Button color="#4E87F8" size="md" onClick={onAlertModalOpen}>
                    <Text fontSize="14px" fontStyle="normal" fontWeight={600}>
                      {t('resolve')}
                    </Text>
                  </Button>
                )}
                {tabIndex === 0 && (
                  <Button color="#4E87F8" size="md" onClick={onTransactionModalOpen} fontSize="14px" m="1px">
                    <Icon as={BiAddToQueue} mr="1" />
                    <Text fontStyle="normal" data-testid="new-transaction-button" fontWeight={600}>
                      {t('newTransaction')}
                    </Text>
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
                  <WorkOrdersTable ref={tabsContainerRef} />
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
                  />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>
      <AlertStatusModal isOpen={isOpenAlertModal} onClose={onAlertModalClose} alert={alertRow} />
      <UploadDocumentModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} projectId={projectId} />
      <AddNewTransactionModal isOpen={isOpenTransactionModal} onClose={onTransactionModalClose} />
    </>
  )
}
