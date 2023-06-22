import { ModalBody, Flex, Box, Button, ModalFooter, HStack, useDisclosure } from '@chakra-ui/react'
import AddNewTransactionModal from 'features/project-details/transactions/add-transaction-modal'
import { WOTransactionsTable } from './wo-transactions-table'
import { t } from 'i18next'
import { BiAddToQueue } from 'react-icons/bi'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'

interface Props {
  projectData: any
  tabsContainerRef: any
  projectId: string
  onClose: any
  workOrder: any
  isVendorExpired?: boolean
}
export const TransactionsTab = ({
  projectData,
  tabsContainerRef,
  onClose,
  projectId,
  workOrder,
  isVendorExpired,
}: Props) => {
  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()
  const { isAdmin } = useUserRolesSelector()

  const workOrderStatus = (workOrder?.statusLabel || '').toLowerCase()
  const projectStatus = (projectData?.projectStatus || '').toLowerCase()
  const isReadOnly =  useRoleBasedPermissions()?.permissions?.some(p => ['PROJECT.READ','ADMINDASHBOARD.READ']?.includes(p))
  const preventNewTransaction =
    !!(workOrderStatus === 'paid' || workOrderStatus === 'cancelled' || workOrderStatus === 'invoiced') ||
    (isVendorExpired && !isAdmin)

  return (
    <>
      <ModalBody h={'calc(100vh - 300px)'} p="10px" overflow={'auto'}>
        <Flex w="100%" alignContent="space-between" pos="relative">
          <Box w="100%" display="flex" justifyContent={{ base: 'center', sm: 'end' }} position="relative" p="11px">
            <>
          {!isReadOnly &&  (
            <Button
              variant="solid"
              colorScheme="brand"
              onClick={onTransactionModalOpen}
              isDisabled={preventNewTransaction}
              leftIcon={<BiAddToQueue />}
              mt="-5px"
            >
              {t('projects.projectDetails.newTransaction')}
            </Button>
          )}
            </>
          </Box>
        </Flex>
        <WOTransactionsTable
          ref={tabsContainerRef}
          projectStatus={projectData?.projectStatus as string}
          workOrderId={workOrder.id}
          projectId={projectData?.id}
        />
      </ModalBody>

      <ModalFooter borderTop="1px solid #CBD5E0" p={6}>
        <HStack spacing="16px" justifyContent="end">
          <Button onClick={onClose} variant="outline" colorScheme="brand">
            {t('cancel')}
          </Button>
        </HStack>
      </ModalFooter>

      <AddNewTransactionModal
        isOpen={isOpenTransactionModal}
        onClose={onTransactionModalClose}
        projectId={projectId as string}
        projectStatus={projectStatus}
        screen="WORK_ORDER_TRANSACTION_TABLE_MODAL"
        currentWorkOrderId={workOrder.id}
        isVendorExpired={isVendorExpired}
      />
    </>
  )
}
