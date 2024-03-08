import {
  Flex,
  Box,
  Button,
  ModalFooter,
  HStack,
  useDisclosure,
  VStack,
  FormControl,
  Switch,
  FormLabel,
} from '@chakra-ui/react'
import AddNewTransactionModal from 'features/project-details/transactions/add-transaction-modal'
import { WOTransactionsTable } from './wo-transactions-table'
import { t } from 'i18next'
import { BiAddToQueue } from 'react-icons/bi'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { useLocation } from 'react-router-dom'
import { parseTransactionsValuesToPayload } from 'api/work-order'

interface Props {
  projectData: any
  tabsContainerRef: any
  projectId: string
  onClose: any
  workOrder: any
  isVendorExpired?: boolean
  onSave?: any
  isWorkOrderUpdating?: boolean
}
export const TransactionsTab = ({
  projectData,
  tabsContainerRef,
  onClose,
  projectId,
  workOrder,
  isVendorExpired,
  onSave,
  isWorkOrderUpdating,
}: Props) => {
  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()
  const { isAdmin, isAccounting } = useUserRolesSelector()
  const isAdminOrAccount = isAdmin || isAccounting
  const workOrderStatus = (workOrder?.statusLabel || '').toLowerCase()
  const projectStatus = (projectData?.projectStatus || '').toLowerCase()
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const isPayableRead = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ') && isPayable
  const isProjRead = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
  const isReadOnly = isPayableRead || isProjRead
  const preventNewTransaction =
    !!(workOrderStatus === 'paid' || workOrderStatus === 'cancelled' || workOrderStatus === 'invoiced') ||
    (isVendorExpired && !isAdmin) ||
    !workOrder?.visibleToVendor ||
    (workOrder?.onHold && !isAdminOrAccount)

  return (
    <>
      {/* <ModalBody h="600px" p="10px" overflow={'auto'}> */}
      <Flex w="100%" alignContent="space-between" pos="relative">
        <Box w="100%" display="flex" justifyContent={{ base: 'center', sm: 'end' }} position="relative" p="11px">
          <>
            <VStack alignItems="end">
              <FormControl mt="7px" mr={'5px'} display="flex">
                <FormLabel
                  mt="-1px"
                  fontWeight="600"
                  htmlFor="hold"
                  mb="0"
                  variant="light-label"
                  color="gray.500"
                  size="md"
                >
                  {t('projects.projectDetails.hold')}
                </FormLabel>
                <Switch
                  size="sm"
                  id="hold-checkbox"
                  outline="4px solid white"
                  color="brand.300"
                  isDisabled={isWorkOrderUpdating || !isAdminOrAccount}
                  rounded="full"
                  isChecked={workOrder?.onHold}
                  onChange={event => {
                    onSave(parseTransactionsValuesToPayload(event.target.checked))
                  }}
                />
              </FormControl>
            </VStack>
            {!isReadOnly && (
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
        onHold={workOrder?.onHold && !isAdminOrAccount}
      />
      {/* </ModalBody> */}

      <ModalFooter borderTop="1px solid #CBD5E0" p={2}>
        {onClose && (
          <HStack spacing="16px" justifyContent="end">
            <Button onClick={onClose} variant="outline" colorScheme="brand">
              {t('cancel')}
            </Button>
          </HStack>
        )}
      </ModalFooter>
      {workOrder && (
        <AddNewTransactionModal
          isOpen={isOpenTransactionModal}
          onClose={onTransactionModalClose}
          projectId={projectId as string}
          projectStatus={projectStatus}
          screen="WORK_ORDER_TRANSACTION_TABLE_MODAL"
          currentWorkOrderId={workOrder.id}
          isVendorExpired={isVendorExpired}
        />
      )}
    </>
  )
}
