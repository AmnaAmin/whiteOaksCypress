import { useDisclosure } from '@chakra-ui/react'
import { Tabs, TabList, TabPanel, TabPanels, Tab } from 'components/tabs/tabs'
import { Box, Stack, Button } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

import { TransactionsTable } from 'features/project-details/transactions/transactions-table'
import AddNewTransactionModal from 'features/project-details/transactions/add-transaction-modal'
import { VendorDocumentsTable } from 'features/project-details/documents/documents-table'
import { WorkOrdersTable } from 'features/vendor/vendor-work-order/work-orders-table'
import { UploadDocumentModal } from 'features/project-details/documents/upload-document'
import { useParams } from 'react-router'
import { TransactionInfoCard } from 'features/project-details/transactions/transaction-info-card'
import { useTranslation } from 'react-i18next'
import { useProject } from 'api/projects'
import { Project } from 'types/project.type'
import { BiAddToQueue, BiUpload } from 'react-icons/bi'
// import { TriggeredAlertsTable } from 'features/alerts/view-notifications'
import { Card } from 'features/login-form-centered/Card'
import { STATUS } from 'features/common/status'
import { useRoleBasedPermissions, useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'
import { useVendorEntity } from 'api/vendor-dashboard'
import { useDocumentLicenseMessage } from 'features/vendor-profile/hook'
import { Messages } from 'features/messages/messages'

const tabesStyle = {
  h: { base: '52px', sm: 'unset' },
}

const ProjectDetails: React.FC = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { projectData, isLoading } = useProject(`${projectId}`)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState<number>(1)
  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()
  const vendorWOStatusValue = (projectData?.vendorWOStatusValue || '').toLowerCase()
  const { vendorId } = useUserProfile() as Account
  const { data: vendorEntity } = useVendorEntity(vendorId)
  const { hasExpiredDocumentOrLicense } = useDocumentLicenseMessage({ data: vendorEntity })

  const isNewTransactionAllow = vendorWOStatusValue
    ? ![STATUS.Paid, STATUS.Cancelled, STATUS.Invoiced].includes(vendorWOStatusValue?.toLocaleLowerCase() as STATUS)
    : true
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
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
                <Tab data-testid="project_messages">{t('messages')}</Tab>

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

                {tabIndex === 0 && !hasExpiredDocumentOrLicense && (
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
                  <TransactionsTable
                    isVendorExpired={hasExpiredDocumentOrLicense}
                    ref={tabsContainerRef}
                    projectStatus={projectData?.projectStatus as string}
                  />
                </TabPanel>
                <TabPanel p="0px">
                  <WorkOrdersTable
                    isVendorExpired={hasExpiredDocumentOrLicense}
                    projectData={projectData as Project}
                    onTabChange={n => {
                      setTabIndex(n)
                    }}
                    ref={tabsContainerRef}
                  />
                </TabPanel>
                <TabPanel p="0px">
                  <VendorDocumentsTable ref={tabsContainerRef} isReadOnly={isReadOnly} />
                </TabPanel>
                {/*<TabPanel p="0px">
                  <TriggeredAlertsTable
                    onRowClick={(e, row) => {
                      selectedAlertRow(row.values)
                      onAlertModalOpen()
                    }}
                    ref={tabsContainerRef}
                  />
                </TabPanel>*/}
                {!isLoading && projectData && (
                  <TabPanel h="680px">
                    <Messages projectId={projectId} entity="project" id={projectId} value={projectData} />
                  </TabPanel>
                )}
              </TabPanels>
            </Card>
          </Tabs>
        </Stack>
      </Stack>
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
