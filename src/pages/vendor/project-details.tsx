import { useDisclosure } from '@chakra-ui/react'
import { Tabs, TabList, TabPanel, TabPanels, Tab } from 'components/tabs/tabs'
import { Box, Stack, Button } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

import { TransactionsTable } from 'features/project-details/transactions/transactions-table'
import AddNewTransactionModal from 'features/project-details/transactions/add-transaction-modal'
import { VendorDocumentsTable } from 'features/project-details/documents/documents-table'
import { WorkOrdersTable } from 'features/vendor/vendor-work-order/work-orders-table'
import { AlertStatusModal } from 'features/alerts/alert-status'
import { UploadDocumentModal } from 'features/project-details/documents/upload-document'
import { useParams } from 'react-router'
import { TransactionInfoCard } from 'features/project-details/transactions/transaction-info-card'
import { useTranslation } from 'react-i18next'
import { useProject } from 'api/projects'
import { Project } from 'types/project.type'
import { BiAddToQueue, BiUpload } from 'react-icons/bi'
import { TriggeredAlertsTable } from 'features/alerts/triggered-alerts-table'
import { Card } from 'features/login-form-centered/Card'
import { STATUS } from 'features/common/status'

const tabesStyle = {
  h: { base: '52px', sm: 'unset' },
}

const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { projectData, isLoading } = useProject(`${projectId}`)
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
    ? ![STATUS.Paid, STATUS.Cancelled, STATUS.Invoiced].includes(vendorWOStatusValue?.toLocaleLowerCase() as STATUS)
    : true

  return (
    <>
      <Stack w="100%" spacing="15px" ref={tabsContainerRef} h="calc(100vh - 160px)">
        <TransactionInfoCard projectData={projectData as Project} isLoading={isLoading} />
        <Stack
        //  spacing={5} minH={tabIndex === 0 ? '78%' : '97%'} bg="white" rounded="6px"
        >
          <Tabs
            index={tabIndex}
            variant="enclosed"
            colorScheme="darkPrimary"
            onChange={index => setTabIndex(index)}
            w="100%"
          >
            <Card
              bg={{ base: 'white', sm: 'transparent' }}
              p={{ base: '12px 12px 16px 12px', sm: '0px !important' }}
              rounded="6px 6px 0px 0px"
              boxShadow={{ sm: 'none' }}
            >
              <TabList border="none" w="100%" flexDir={{ base: 'column', sm: 'row' }}>
                <Tab aria-labelledby="transaction-tab" {...tabesStyle}>
                  {t('transaction')}
                </Tab>

                <Tab whiteSpace="nowrap" {...tabesStyle}>
                  {t('vendorWorkOrders')}
                </Tab>

                <Tab aria-labelledby="documents-tab" {...tabesStyle}>
                  {t('documents')}
                </Tab>

                {/* <Tab {...tabesStyle}>{t('alerts')}</Tab> */}
              </TabList>
            </Card>
            <Card
              rounded="0px"
              roundedRight={{ base: '0px', sm: '6px' }}
              roundedBottom="6px"
              px="12px"
              pr={{ base: 0, sm: '12px' }}
              py={{ base: '0px', sm: '12px' }}
              mt={'2px'}
            >
              <Box w="100%" display="flex" justifyContent={{ base: 'center', sm: 'end' }} position="relative">
                {tabIndex === 2 && (
                  <Button
                    onClick={onDocumentModalOpen}
                    colorScheme="darkPrimary"
                    leftIcon={<BiUpload fontSize="16px" />}
                    w={{ base: '100%', sm: 'unset' }}
                    mr={{ base: '15px', sm: 'unset' }}
                    mb="15px"
                  >
                    {t('upload')}
                  </Button>
                )}
                {/* {tabIndex === 3 && (
                  <Button
                    colorScheme="darkPrimary"
                    onClick={onAlertModalOpen}
                    w={{ base: '100%', sm: 'unset' }}
                    mr={{ base: '15px', sm: 'unset' }}
                  >
                    <Text fontSize="14px" fontStyle="normal" fontWeight={600}>
                      {t('resolveAll')}
                    </Text>
                  </Button>
                )}
              )} */}

                {tabIndex === 0 && (
                  <Button
                    data-testid="new-transaction-button"
                    onClick={onTransactionModalOpen}
                    colorScheme="darkPrimary"
                    leftIcon={<BiAddToQueue />}
                    isDisabled={!isNewTransactionAllow}
                    w={{ base: '100%', sm: 'unset' }}
                    mr={{ base: '15px', sm: 'unset' }}
                    mb="15px"
                  >
                    {t('newTransaction')}
                  </Button>
                )}
              </Box>

              <TabPanels h="100%">
                <TabPanel p="0px">
                  <TransactionsTable ref={tabsContainerRef} projectStatus={projectData?.projectStatus as string} />
                </TabPanel>
                <TabPanel p="0px">
                  <WorkOrdersTable
                    projectData={projectData as Project}
                    onTabChange={n => {
                      setTabIndex(n)
                    }}
                    ref={tabsContainerRef}
                  />
                </TabPanel>
                <TabPanel p="0px">
                  <VendorDocumentsTable ref={tabsContainerRef} />
                </TabPanel>
                <TabPanel p="0px">
                  <TriggeredAlertsTable
                    onRowClick={(e, row) => {
                      selectedAlertRow(row.values)
                      onAlertModalOpen()
                    }}
                    ref={tabsContainerRef}
                  />
                </TabPanel>
              </TabPanels>
            </Card>
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
        projectStatus={projectData?.vendorWOStatusValue as string}
      />
    </>
  )
}

export default ProjectDetails
