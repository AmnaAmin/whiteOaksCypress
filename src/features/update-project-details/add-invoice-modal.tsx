import { Box, Divider, Flex, ModalProps, useMediaQuery } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'
import { boxShadow } from 'theme/common-style'
import { useState, useEffect } from 'react'
import { InvoiceForm } from './invoice-form'
import { Project } from 'types/project.type'
import { SelectOption } from 'types/transaction.type'
import { useFetchInvoiceDetails } from 'api/invoicing'

type Props = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  selectedInvoice?: string | number | null
  clientSelected?: SelectOption | undefined | null
  projectData?: Project | undefined
  invoiceCount?: number
}

export const getInvoiceInitials = (projectData?: Project, revisedIndex?: number) => {
  return (
    projectData?.clientName?.split(' ')?.[0] +
    '-' +
    projectData?.market?.slice(0, 3) +
    '-' +
    projectData?.streetAddress?.split(' ').join('')?.slice(0, 7) +
    (revisedIndex && revisedIndex > 0 ? `-R${String(revisedIndex).padStart(2, '0')}` : '')
  )
}

const InvoiceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedInvoice,
  clientSelected,
  projectData,
  invoiceCount,
}) => {
  const { t } = useTranslation()
  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const [modalSize, setModalSize] = useState<string>('5xl')

  const invoiceNumber = getInvoiceInitials(projectData, invoiceCount)
  const { invoiceDetails: invoice } = useFetchInvoiceDetails({ invoiceId: selectedInvoice })

  useEffect(() => {
    if (isMobile) {
      setModalSize('sm')
    } else {
      setModalSize('3xl')
    }
  }, [isMobile])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} variant="custom">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader data-testid="new_transaction">
          <Flex>
            <Box color="gray.500" fontWeight={'500'}>
              {t(`project.projectDetails.invoice`)}
            </Box>
            <Divider orientation="vertical" border="1px" h={6} marginLeft={5} />
            <Box color="gray.500" fontWeight={'400'} ml={5}>
              {!selectedInvoice ? invoiceNumber : invoice?.invoiceNumber}
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton _hover={{ bg: 'blue.50' }} _focus={{ outline: 'none' }} />
        <ModalBody bg="bgGlobal.50" p={2}>
          <Card style={boxShadow}>
            <InvoiceForm
              onClose={onClose}
              invoice={invoice}
              clientSelected={clientSelected}
              projectData={projectData}
              invoiceCount={invoiceCount}
            />
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default InvoiceModal
