import {
  Box,
  HStack,
  Flex,
  SimpleGrid,
  FormLabel,
  ModalFooter,
  ModalBody,
  Alert,
  AlertDescription,
  AlertIcon,
} from '@chakra-ui/react'
import { BiCalendar } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { dateFormat } from 'utils/date-time-utils'
import jsPDF from 'jspdf'
import { useUpdateWorkOrderMutation } from 'api/work-order'
import AssignedItems from 'features/work-order/details/assigned-items'
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'
import { createInvoicePdf, LineItems } from 'features/work-order/details/assignedItems.utils'
import { useEffect } from 'react'
import { STATUS } from '../../../common/status'
import { WORK_ORDER } from 'features/work-order/workOrder.i18n'

const CalenderCard = props => {
  return (
    <Flex justifyContent={'left'}>
      <Box pr={4}>
        <BiCalendar size={23} color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <FormLabel variant="strong-label" size="md">
          {props.title}
        </FormLabel>
        <FormLabel data-testid={props.title} variant="light-label" size="md">
          {props.value ? props.value : 'mm/dd/yy'}
        </FormLabel>
      </Box>
    </Flex>
  )
}

interface FormValues {
  assignedItems?: LineItems[]
  showPrice?: boolean
}

const WorkOrderDetailTab = ({ onClose, workOrder, projectData }) => {
  const { t } = useTranslation()
  const { mutate: updateWorkOrderDetails, isLoading: isWorkOrderUpdating } = useUpdateWorkOrderMutation({})
  const getDefaultValues = () => {
    return {
      assignedItems:
        workOrder?.assignedItems?.length > 0
          ? workOrder?.assignedItems?.map(e => {
              return { ...e, uploadedDoc: null, clientAmount: e.price ?? 0 * e.quantity ?? 0 }
            })
          : [],
      showPrice: workOrder.showPricing,
    }
  }

  const formReturn = useForm<FormValues>({
    defaultValues: getDefaultValues(),
  })

  const { control, getValues, reset } = formReturn
  const values = getValues()
  const assignedItemsArray = useFieldArray({
    control,
    name: 'assignedItems',
  })

  useEffect(() => {
    if (workOrder?.id) {
      reset(getDefaultValues())
    }
  }, [workOrder, reset])

  const downloadPdf = () => {
    let doc = new jsPDF()
    createInvoicePdf({
      doc,
      workOrder,
      projectData,
      assignedItems: values.assignedItems,
      hideAward: true,
    })
  }

  const parseAssignedItems = values => {
    const assignedItems = [
      ...values?.assignedItems?.map(a => {
        if (a.document) {
          delete a?.document?.fileObject
        }
        const assignedItem = {
          ...a,
          document: a.uploadedDoc ? a.uploadedDoc : a.document,
        }
        delete assignedItem.uploadedDoc
        return assignedItem
      }),
    ]
    return {
      assignedItems: [...assignedItems],
    }
  }

  const onSubmit = values => {
    const updatedValues = parseAssignedItems(values)
    updateWorkOrderDetails({ ...workOrder, ...updatedValues })
  }

  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }
  return (
    <Box>
      <form onSubmit={formReturn.handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        <ModalBody h={'calc(100vh - 300px)'} overflow={'auto'}>
          {[STATUS.Declined].includes(workOrder?.statusLabel?.toLocaleLowerCase()) && !workOrder.lienWaiverAccepted && (
            <Alert m="25px" status="info" variant="custom" size="sm">
              <AlertIcon />
              <AlertDescription>{t(`${WORK_ORDER}.rejectedInvoiceInfo`)}</AlertDescription>
            </Alert>
          )}
          <SimpleGrid
            columns={4}
            spacing={8}
            borderBottom="1px solid  #E2E8F0"
            minH="80px"
            m="30px"
            alignItems={'left'}
          >
            <CalenderCard title={t('WOIssued')} value={dateFormat(workOrder.workOrderIssueDate)} />
            <CalenderCard title={t('expectedStart')} value={dateFormat(workOrder.workOrderStartDate)} />
            <CalenderCard
              title={t('expectedCompletion')}
              value={dateFormat(workOrder.workOrderExpectedCompletionDate)}
            />
            <CalenderCard title={t('completedByVendor')} value={dateFormat(workOrder.workOrderDateCompleted)} />
          </SimpleGrid>
          <Box mx="32px">
            {values?.assignedItems && values?.assignedItems?.length > 0 && (
              <AssignedItems
                isLoadingLineItems={isWorkOrderUpdating}
                formControl={formReturn as UseFormReturn<any>}
                assignedItemsArray={assignedItemsArray}
                isAssignmentAllowed={false}
                downloadPdf={downloadPdf}
                workOrder={workOrder}
              />
            )}
          </Box>
        </ModalBody>
        <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
          <HStack spacing="16px" w="100%" justifyContent="end">
            <Button variant="outline" colorScheme="brand" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" colorScheme="brand">
              {t('save')}
            </Button>
          </HStack>
        </ModalFooter>
      </form>
    </Box>
  )
}

export default WorkOrderDetailTab
