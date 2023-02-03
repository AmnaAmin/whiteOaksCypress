import { ModalBody, Flex, Box, Button, ModalFooter, HStack, useDisclosure } from "@chakra-ui/react"
import AddNewTransactionModal from "features/project-details/transactions/add-transaction-modal"
import { WOTransactionsTable } from "./wo-transactions-table"
import { t } from "i18next"
import { BiAddToQueue } from "react-icons/bi"

interface Props {
    projectData: any,
    tabsContainerRef: any,
    projectId: string,
    onClose: any,
    workOrder: any
}
export const TransactionsTab = ({ projectData, tabsContainerRef, onClose, projectId, workOrder }: Props) => {

    const {
        isOpen: isOpenTransactionModal,
        onClose: onTransactionModalClose,
        onOpen: onTransactionModalOpen,
    } = useDisclosure()
    
    const projectStatus = (projectData?.projectStatus || '').toLowerCase()
    
    const preventNewTransaction = !!(projectStatus === 'paid' || projectStatus === 'cancelled')
      
    return (
    <>
      <ModalBody h={'calc(100vh - 300px)'} p="10px" overflow={'auto'}>
        <Flex w="100%" alignContent="space-between" pos="relative">
          <Box w="100%" display="flex" justifyContent={{ base: 'center', sm: 'end' }} position="relative" p="11px">
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
          </Box>
        </Flex>
        <WOTransactionsTable 
            ref={tabsContainerRef} 
            projectStatus={projectData?.projectStatus as string} 
            workOrderId={workOrder.id}
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
        />
    </>
  )
}
