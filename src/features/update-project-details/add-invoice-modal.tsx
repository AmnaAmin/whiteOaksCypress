import { Box, Center, Divider, Flex, ModalProps, Spinner, useMediaQuery } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'
import { boxShadow } from 'theme/common-style'
import { useState, useEffect } from 'react'
import { InvoiceForm } from './invoice-form'
import { TransactionTypeValues } from 'types/transaction.type'
import { useFetchInvoiceDetail, useFetchInvoiceDetails } from 'api/invoicing'
import { useTransactionsV1 } from 'api/transactions'
import { useGetClientSelectOptions } from 'api/project-details'
import { usePCProject } from 'api/pc-projects'

type Props = Pick<ModalProps, 'isOpen'> & {
  selectedInvoice?: string | number | null
  projectId?: number | string | null | undefined
  isReceivable?: boolean
  onClose: (invoiceNumber: string | null | undefined, created: boolean) => void
}

const InvoiceModal: React.FC<Props> = ({ isOpen, onClose, selectedInvoice, projectId, isReceivable }) => {
  const { t } = useTranslation()
  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const [modalSize, setModalSize] = useState<string>('5xl')

  const { invoiceDetails: invoice, isLoading: isLoadingInvoice } = useFetchInvoiceDetails({
    invoiceId: selectedInvoice,
  })
  const { projectData, isLoading: isLoadingProject } = usePCProject(`${invoice?.projectId ?? projectId}`)
  const { transactions, isLoading: isLoadingTransactions } = useTransactionsV1(`${projectData?.id}`)

  const invoices = useFetchInvoiceDetail(`${projectData?.id}`, selectedInvoice)
  const invoiceObj = invoices?.invoiceDetail?.data

  // const invoiceNumber = getInvoiceInitials(
  //   projectData,
  //   transactions?.filter(t => t.transactionType === TransactionTypeValues.invoice)?.length,
  // )

  const { clientSelectOptions } = useGetClientSelectOptions()
  const clientSelected = clientSelectOptions?.find(c => c.label === projectData?.clientName)
  const isLoading = isLoadingTransactions || isLoadingProject || isLoadingInvoice

  useEffect(() => {
    if (isMobile) {
      setModalSize('sm')
    } else {
      setModalSize('3xl')
    }
  }, [isMobile])

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(invoiceObj?.invoiceNumber,false)} size={modalSize} variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader data-testid="new_transaction">
          <Flex>
            <Box color="gray.500" fontWeight={'500'}>
              {t(`project.projectDetails.invoice`)}
            </Box>
            <Divider orientation="vertical" border="1px" h={6} marginLeft={5} />
            <Box color="gray.500" fontWeight={'400'} ml={5}>
              {!selectedInvoice ? invoiceObj?.invoiceNumber : invoice?.invoiceNumber}
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton _hover={{ bg: 'blue.50' }} _focus={{ outline: 'none' }} />
        <ModalBody bg="bgGlobal.50" p={2}>
          <Card style={boxShadow}>
            {isLoading ? (
              <Center minH="680px">
                <Spinner size="lg" />
              </Center>
            ) : (
              <InvoiceForm
                transactions={transactions}
                onClose={(created: boolean) => onClose(invoiceObj?.invoiceNumber, created)}
                invoice={invoice}
                clientSelected={clientSelected}
                projectData={projectData}
                isLoading={isLoading}
                invoiceCount={transactions?.filter(t => t.transactionType === TransactionTypeValues.invoice)?.length}
                isReceivable={isReceivable}
                invoiceNumber={invoiceObj?.invoiceNumber}
              />
            )}
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default InvoiceModal
