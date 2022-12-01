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
  Center,
  Spinner,
  Icon,
} from '@chakra-ui/react'
import { BiCalendar, BiFile } from 'react-icons/bi'
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
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'

const SummaryCard = props => {
  return (
    <Flex justifyContent={'left'} pb={'20px'}>
      <Box pr={4}>
        <Icon as={props.icon} fontSize="23px" color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <FormLabel variant="strong-label" size="md">
          {props.title}
        </FormLabel>
        <FormLabel data-testid={props.title} variant="light-label" size="md">
          {props.value}
        </FormLabel>
      </Box>
    </Flex>
  )
}

interface FormValues {
  assignedItems?: LineItems[]
  showPrice?: boolean
}

const WorkOrderDetailTab = ({
  onClose,
  workOrder,
  projectData,
  setIsUpdating,
  isUpdating,
  workOrderAssignedItems,
  isFetchingLineItems,
  isLoadingLineItems,
}) => {
  const { t } = useTranslation()
  const { mutate: updateWorkOrderDetails } = useUpdateWorkOrderMutation({})
  const getDefaultValues = () => {
    return {
      assignedItems:
        workOrderAssignedItems?.length > 0
          ? workOrderAssignedItems?.map(e => {
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
    if (workOrder?.id && workOrderAssignedItems) {
      reset(getDefaultValues())
    }
  }, [workOrder, reset, workOrderAssignedItems])

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
      ...values?.assignedItems?.map((a, index) => {
        if (a.document) {
          delete a?.document?.fileObject
        }
        const assignedItem = {
          ...a,
          orderNo: index,
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
    setIsUpdating(true)
    updateWorkOrderDetails(
      { ...workOrder, ...updatedValues },
      {
        onSuccess: () => {
          setIsUpdating(false)
        },
        onError: () => {
          setIsUpdating(false)
        },
      },
    )
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
            columns={5}
            spacing={8}
            borderBottom="1px solid  #E2E8F0"
            minH="60px"
            m="30px"
            mb="20px"
            alignItems={'left'}
          >
            <SummaryCard
              title={t('WOIssued')}
              icon={BiCalendar}
              value={workOrder.workOrderIssueDate ? dateFormat(workOrder.workOrderIssueDate) : 'mm/dd/yy'}
            />
            <SummaryCard
              title={t('expectedStart')}
              icon={BiCalendar}
              value={workOrder.workOrderStartDate ? dateFormat(workOrder.workOrderStartDate) : 'mm/dd/yy'}
            />
            <SummaryCard
              icon={BiCalendar}
              title={t('expectedCompletion')}
              value={
                workOrder.workOrderExpectedCompletionDate
                  ? dateFormat(workOrder.workOrderExpectedCompletionDate)
                  : 'mm/dd/yy'
              }
            />
            <SummaryCard
              icon={BiCalendar}
              title={t('completedByVendor')}
              value={workOrder.workOrderDateCompleted ? dateFormat(workOrder.workOrderDateCompleted) : 'mm/dd/yy'}
            />
            <SummaryCard
              title={t(`${NEW_PROJECT}.lockBoxCode`)}
              icon={BiFile}
              value={!!projectData?.lockBoxCode ? projectData?.lockBoxCode : '--'}
            />
          </SimpleGrid>
          <Box mx="32px" mt={8}>
            {isLoadingLineItems ? (
              <Center>
                <Spinner size="lg" />
              </Center>
            ) : (
              <>
                {values?.assignedItems && values?.assignedItems?.length > 0 && (
                  <AssignedItems
                    isLoadingLineItems={isFetchingLineItems}
                    formControl={formReturn as UseFormReturn<any>}
                    assignedItemsArray={assignedItemsArray}
                    isAssignmentAllowed={false}
                    downloadPdf={downloadPdf}
                    workOrder={workOrder}
                  />
                )}
              </>
            )}
          </Box>
        </ModalBody>
        <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
          <HStack spacing="16px" w="100%" justifyContent="end">
            <Button variant="outline" colorScheme="brand" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" colorScheme="brand" disabled={isUpdating || isFetchingLineItems}>
              {t('save')}
            </Button>
          </HStack>
        </ModalFooter>
      </form>
    </Box>
  )
}

export default WorkOrderDetailTab
