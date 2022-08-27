import { useCallback, useEffect, useState } from 'react'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Divider,
  HStack,
  Checkbox,
  Center,
} from '@chakra-ui/react'
import { ProjectWorkOrderType } from 'types/project.type'
import { LienWaiverTab } from './lien-waiver/lien-waiver-tab'
import { useTranslation } from 'react-i18next'
// import WorkOrderDetailTab from './work-order-edit-tab'
import PaymentInfoTab from './payment/payment-tab'
import { InvoiceTabPC } from './invoice/invoice-tab'
import Status, { STATUS } from 'features/projects/status'
import WorkOrderNotes from './notes/work-order-notes'
import WorkOrderDetailTab from './details/work-order-edit-tab'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { usePCProject } from 'utils/pc-projects'
import { useDocuments } from 'utils/vendor-projects'
import { useTransactions } from 'utils/transactions'
import { useFetchProjectId, useUpdateWorkOrderMutation } from 'utils/work-order'

const WorkOrderDetails = ({ workOrder, onClose: close }: { workOrder: ProjectWorkOrderType; onClose: () => void }) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [tabIndex, setTabIndex] = useState(0)
  // const [notesCount, setNotesCount] = useState(0)
  const [rejectLW, setRejectLW] = useState(false)
  const [rejectInvoice, setRejectInvoice] = useState(false)
  const { projectId } = useParams<{ projectId: string }>()
  const [projId, setProjId] = useState<string | undefined>(projectId)
  const { projectData, isLoading: isProjectLoading } = usePCProject(projId)
  const { documents: documentsData = [], isLoading: isDocumentsLoading } = useDocuments({
    projectId: projId,
  })
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const { transactions = [], isLoading: isTransLoading } = useTransactions(projId)
  const [isWorkOrderUpdating, setWorkOrderUpdating] = useState(false)
  const { swoProject } = useFetchProjectId(workOrder?.projectId)
  const { mutate: updateWorkOrder } = useUpdateWorkOrderMutation({ swoProjectId: swoProject?.id })
  const navigate = useNavigate()

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (workOrder) {
      onOpen()
      setRejectInvoice(workOrder.status === 111)
      if (workOrder.leanWaiverSubmitted) {
        setRejectLW(!workOrder.lienWaiverAccepted)
      }
      if (!projId) {
        setProjId(workOrder?.projectId?.toString())
      }
    } else {
      onCloseDisclosure()
      setTabIndex(0)
      setRejectLW(false)
    }
  }, [onCloseDisclosure, onOpen, workOrder])

  const onSave = values => {
    const payload = { ...workOrder, ...values }
    updateWorkOrder(payload, {
      onSuccess: () => {
        setWorkOrderUpdating(false)
      },
      onError: () => {
        setWorkOrderUpdating(false)
      },
    })
  }

  const navigateToProjectDetails = () => {
    navigate(`/project-details/${workOrder.projectId}`)
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" variant={'custom'}>
      <ModalOverlay />
      {workOrder && (
        <>
          <ModalContent>
            <ModalHeader>
              <HStack spacing={4}>
                <HStack fontSize="16px" fontWeight={500}>
                  <Text borderRight="1px solid #E2E8F0" lineHeight="22px" h="22px" pr={2}>
                    WO {workOrder?.id}
                  </Text>
                  <Text lineHeight="22px" h="22px">
                    {workOrder?.companyName}
                  </Text>
                </HStack>

                <Status value={workOrder?.statusLabel} id={workOrder?.statusLabel} />
              </HStack>
            </ModalHeader>

            <ModalCloseButton _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />

            <Divider mb={3} />
            <Stack>
              <Tabs
                variant="enclosed"
                colorScheme="brand"
                size="md"
                onChange={index => setTabIndex(index)}
                whiteSpace="nowrap"
              >
                <TabList color="gray.600" mx="32px">
                  <Tab>{t('workOrderDetails')}</Tab>
                  <Tab>{t('lienWaiver')}</Tab>
                  <Tab>{t('invoice')}</Tab>
                  <Tab>{t('payments')}</Tab>
                  <Tab>
                    {t('notes')}
                    {/* Update on figma */}

                    {/* <Box ml="5px" style={countInCircle}>
                      {notesCount}
                    </Box> */}

                    {/* Update on figma */}
                  </Tab>
                  {/* commenting till requirements are clear
                  tabIndex === 1 && (
                    <Center w="100%" justifyContent="end">
                      {workOrder?.leanWaiverSubmitted && workOrder.dateLeanWaiverSubmitted && (
                        <Checkbox
                          onChange={() => setRejectLW(!rejectLW)}
                          isChecked={rejectLW}
                          disabled={!workOrder.lienWaiverAccepted}
                          color="#4A5568"
                          fontSize="14px"
                          fontWeight={500}
                        >
                          {t('rejectLienWaiver')}
                        </Checkbox>
                      )}
                    </Center>
                      )*/}
                  {tabIndex === 2 &&
                    [STATUS.Invoiced, STATUS.Declined].includes(
                      workOrder?.statusLabel?.toLocaleLowerCase() as STATUS,
                    ) && (
                      <Center w="100%" justifyContent="end">
                        <Checkbox
                          onChange={() => setRejectInvoice(!rejectInvoice)}
                          isChecked={rejectInvoice}
                          disabled={workOrder.status === 111}
                          color="#4A5568"
                          fontSize="14px"
                          fontWeight={500}
                        >
                          {t('rejectInvoice')}
                        </Checkbox>
                      </Center>
                    )}
                </TabList>

                <TabPanels>
                  <TabPanel p={0}>
                    <WorkOrderDetailTab
                      navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                      workOrder={workOrder}
                      onClose={onClose}
                      onSave={onSave}
                      isWorkOrderUpdating={isWorkOrderUpdating}
                      setWorkOrderUpdating={setWorkOrderUpdating}
                      swoProject={swoProject}
                    />
                  </TabPanel>
                  <TabPanel p={0}>
                    {isDocumentsLoading ? (
                      <BlankSlate />
                    ) : (
                      <LienWaiverTab
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        documentsData={documentsData}
                        workOrder={workOrder}
                        onClose={onClose}
                        rejectChecked={!rejectLW}
                        onSave={onSave}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isDocumentsLoading || isTransLoading ? (
                      <BlankSlate />
                    ) : (
                      <InvoiceTabPC
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        rejectInvoiceCheck={rejectInvoice}
                        transactions={transactions}
                        documentsData={documentsData}
                        workOrder={workOrder}
                        onClose={onClose}
                        onSave={onSave}
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {isProjectLoading ? (
                      <BlankSlate />
                    ) : (
                      <PaymentInfoTab
                        navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                        projectData={projectData}
                        workOrder={workOrder}
                        onClose={onClose}
                        onSave={onSave}
                      />
                    )}
                  </TabPanel>

                  <TabPanel p={0}>
                    <WorkOrderNotes
                      navigateToProjectDetails={isPayable ? navigateToProjectDetails : null}
                      workOrder={workOrder}
                      onClose={onClose}
                      // setNotesCount={setNotesCount}
                      onSave={onSave}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </ModalContent>
        </>
      )}
    </Modal>
  )
}

export default WorkOrderDetails
