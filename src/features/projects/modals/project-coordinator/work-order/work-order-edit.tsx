import { useCallback, useEffect, useState } from 'react'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Divider,
  HStack,
  Box,
  Checkbox,
  Center,
} from '@chakra-ui/react'
import { ProjectWorkOrderType } from 'types/project.type'
import { LienWaiverTab } from './lien-waiver-tab'
import { useTranslation } from 'react-i18next'
// import WorkOrderDetailTab from './work-order-edit-tab'
import PaymentInfoTab from './payment-tab-pc'
import { InvoiceTabPC } from './invoice-tab'
import Status, { STATUS } from 'features/projects/status'
import WorkOrderNotes from '../../work-order-notes'
import { countInCircle } from 'theme/common-style'
import WorkOrderDetailTab from './work-order-edit-tab'
import { useParams } from 'react-router-dom'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { usePCProject } from 'utils/pc-projects'
import { useDocuments } from 'utils/vendor-projects'
import { useTransactions } from 'utils/transactions'
import { useUpdateWorkOrderMutation } from 'utils/work-order'

const WorkOrderDetails = ({ workOrder, onClose: close }: { workOrder: ProjectWorkOrderType; onClose: () => void }) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [tabIndex, setTabIndex] = useState(0)
  const [notesCount, setNotesCount] = useState(0)
  const [rejectLW, setRejectLW] = useState(false)
  const [rejectInvoice, setRejectInvoice] = useState(false)
  const { projectId } = useParams<{ projectId: string }>()
  const [projId, setProjId] = useState<string | undefined>(projectId)
  const { projectData, isLoading: isProjectLoading } = usePCProject(projId)
  const { documents: documentsData = [], isLoading: isDocumentsLoading } = useDocuments({
    projectId: projId,
  })
  const { transactions = [], isLoading: isTransLoading } = useTransactions(projId)
  const { mutate: updateWorkOrder } = useUpdateWorkOrderMutation()

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (workOrder) {
      onOpen()
      setRejectInvoice(workOrder.status === 111)
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
    updateWorkOrder(payload)
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      {workOrder && (
        <>
          <ModalContent rounded={3} borderTop="2px solid #4E87F8">
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
            <ModalBody p="0">
              <Stack spacing={5}>
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
                      <Box ml="5px" style={countInCircle}>
                        {notesCount}
                      </Box>
                    </Tab>
                    {tabIndex === 1 && (
                      <Center w="100%" justifyContent="end">
                        {workOrder?.claimantTitle && (
                          <Checkbox
                            onChange={() => setRejectLW(!rejectLW)}
                            color="#4A5568"
                            fontSize="14px"
                            fontWeight={500}
                          >
                            {t('rejectLienWaiver')}
                          </Checkbox>
                        )}
                      </Center>
                    )}
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
                      <WorkOrderDetailTab workOrder={workOrder} onClose={onClose} onSave={onSave} />
                    </TabPanel>
                    <TabPanel p={0}>
                      {isDocumentsLoading ? (
                        <BlankSlate />
                      ) : (
                        <LienWaiverTab
                          documentsData={documentsData}
                          lienWaiverData={workOrder}
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
                          projectData={projectData}
                          workOrder={workOrder}
                          onClose={onClose}
                          onSave={onSave}
                        />
                      )}
                    </TabPanel>

                    <TabPanel p={0}>
                      <WorkOrderNotes
                        workOrder={workOrder}
                        onClose={onClose}
                        setNotesCount={setNotesCount}
                        onSave={onSave}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Stack>
            </ModalBody>
          </ModalContent>
        </>
      )}
    </Modal>
  )
}

export default WorkOrderDetails
