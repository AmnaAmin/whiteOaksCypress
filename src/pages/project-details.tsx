import { Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure, Icon } from '@chakra-ui/react'
import { Box, Button, Stack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

import { TransactionsTable } from '../features/projects/transactions/transactions-table'
import { AddNewTransactionModal } from '../features/projects/transactions/add-update-transaction'
import { VendorDocumentsTable } from '../features/projects/documents/documents-table'
import { WorkOrdersTable } from '../features/projects/work-orders-table'
import { AlertsTable } from '../features/projects/alerts/alerts-table'
import { AlertStatusModal } from '../features/projects/alerts/alert-status'
import { UploadDocumentModal } from '../features/projects/documents/upload-document'
import { AiOutlineUpload } from 'react-icons/ai'
import { useParams } from 'react-router'
import { TransactionInfoCard } from '../features/projects/transactions/transaction-info-card'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import { useProject } from 'utils/projects'
import { ProjectType } from 'types/project.type'
import { Document } from 'types/vendor.types'
import { BiAddToQueue } from 'react-icons/bi'

const projectTabStyle = {
  fontSize: '14px',
  fontWeight: 400,
  fontStyle: 'normal',
  color: 'gray.600',
}

export const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { projectData, isLoading } = useProject(projectId)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)
  const [alertRow, selectedAlertRow] = useState(null)
  const [latestUploadedDoc, setLatestUploadedDoc] = useState<Document | null>(null)
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
                _selected={{ color: 'white', bg: 'button.300' }}
                sx={projectTabStyle}
              >
                {t('transaction')}
              </Tab>

              <Tab
                aria-labelledby="work-order-tab"
                _focus={{ border: 'none' }}
                _selected={{ color: 'white', bg: 'button.300' }}
                whiteSpace="nowrap"
                sx={projectTabStyle}
              >
                {t('vendorWorkOrders')}
              </Tab>

              <Tab
                aria-labelledby="documents-tab"
                _focus={{ border: 'none' }}
                _selected={{ color: 'white', bg: 'button.300' }}
                sx={projectTabStyle}
              >
                {t('documents')}
              </Tab>

              <Tab
                aria-labelledby="alerts-tab"
                _focus={{ border: 'none' }}
                _selected={{ color: 'white', bg: 'button.300' }}
                sx={projectTabStyle}
              >
                {t('alerts')}
              </Tab>

              <Box w="100%" display="flex" justifyContent="end" position="relative" bottom="2">
                {tabIndex === 2 && (
                  <Button
                    aria-labelledby="upload-document-button"
                    onClick={onDocumentModalOpen}
                    bg="#4E87F8"
                    color="#FFFFFF"
                    size="md"
                    _hover={{ bg: 'royalblue' }}
                  >
                    <Box pos="relative" right="6px" fontWeight="bold" pb="3.3px">
                      <AiOutlineUpload aria-label="upload-document-button" />
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
                  <Button
                    pos="relative"
                    top="2"
                    bg="none"
                    color="#4E87F8"
                    fontSize="14px"
                    fontStyle="normal"
                    fontWeight={500}
                    _focus={{ border: 'none' }}
                    _active={{ bg: 'none' }}
                    _hover={{ bg: 'none' }}
                    onClick={onTransactionModalOpen}
                  >
                    <Icon as={BiAddToQueue} mr="1" boxSize={4} />
                    {t('newTransaction')}
                  </Button>
                )}
              </Box>
            </TabList>

            <TabPanels mt="31px" h="100%">
              <TabPanel p="0px" h="100%">
                <Box h="100%">
                  <TransactionsTable ref={tabsContainerRef} />
                </Box>
              </TabPanel>
              <TabPanel p="0px">
                <Box h="100%" w="100%">
                  <WorkOrdersTable ref={tabsContainerRef} />
                </Box>
              </TabPanel>
              <TabPanel p="0px">
                <Box h="100%" w="100%">
                  <VendorDocumentsTable ref={tabsContainerRef} latestUploadedDoc={latestUploadedDoc as Document} />
                </Box>
              </TabPanel>
              <TabPanel p="0px">
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
      <UploadDocumentModal
        isOpen={isOpenDocumentModal}
        onClose={onDocumentModalClose}
        projectId={projectId}
        setLatestUploadedDoc={val => {
          setLatestUploadedDoc(val)
        }}
      />
      <AddNewTransactionModal isOpen={isOpenTransactionModal} onClose={onTransactionModalClose} />
    </>
  )
}
