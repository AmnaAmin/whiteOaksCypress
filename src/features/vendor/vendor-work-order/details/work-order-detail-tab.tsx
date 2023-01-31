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
import { dateFormatNew } from 'utils/date-time-utils'
import jsPDF from 'jspdf'
import { useUpdateWorkOrderMutation } from 'api/work-order'
import AssignedItems from 'features/work-order/details/assigned-items'
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'
import { createInvoicePdf, LineItems } from 'features/work-order/details/assignedItems.utils'
import { useEffect } from 'react'
import { STATUS } from '../../../common/status'
import { WORK_ORDER } from 'features/work-order/workOrder.i18n'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { useUploadDocument } from 'api/vendor-projects'

const SummaryCard = props => {
  return (
    <Flex justifyContent={'left'}>
      <Box pr={4}>
        <Icon as={props.icon} fontSize="23px" color="#4A5568" />
      </Box>
      <Box lineHeight="20px">
        <FormLabel variant="strong-label" size="md" isTruncated>
          {props.title}
        </FormLabel>
        <FormLabel data-testid={props.title} variant="light-label" size="md" isTruncated>
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
  const { mutate: saveDocument } = useUploadDocument()
  const getDefaultValues = () => {
    return {
      assignedItems:
        workOrderAssignedItems?.length > 0
          ? workOrderAssignedItems?.map(e => {
              return { ...e, uploadedDoc: null, clientAmount: e.price ?? 0 * e.quantity ?? 0 }
            })
          : [],
      showPrice: workOrder.showPricing,
      // notifyVendor: workOrder.notifyVendor,
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
  }, [workOrder, reset, workOrderAssignedItems?.length])

  const downloadPdf = () => {
    let doc = new jsPDF()
    createInvoicePdf({
      doc,
      workOrder,
      projectData,
      assignedItems: values.assignedItems,
      hideAward: true,
      onSave: saveWorkOrderDocument,
    })
  }
  const saveWorkOrderDocument = doc => {
    saveDocument(doc)
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
          {[STATUS.Rejected].includes(workOrder?.statusLabel?.toLocaleLowerCase()) && !workOrder.lienWaiverAccepted && (
            <Alert m="25px" status="info" variant="custom" size="sm">
              <AlertIcon />
              <AlertDescription>{t(`${WORK_ORDER}.rejectedInvoiceInfo`)}</AlertDescription>
            </Alert>
          )}
          <SimpleGrid
            templateColumns={{ base: 'unset', sm: 'repeat(auto-fit , minmax(180px , 1fr))' }}
            spacing={'16px'}
            borderBottom="1px solid  #E2E8F0"
            minH="60px"
            my="30px"
            mx={{ base: '0', lg: '30px' }}
            mb="20px"
            alignItems={'left'}
            flexWrap="wrap"
            display={{ base: 'flex', sm: 'grid' }}
          >
            <Box flex={{ base: '1.1', sm: 'unset' }}>
              <SummaryCard
                title={t('WOIssued')}
                icon={BiCalendar}
                value={workOrder.workOrderIssueDate ? dateFormatNew(workOrder.workOrderIssueDate) : 'mm/dd/yy'}
              />
            </Box>
            <Box flex={{ base: '1', sm: 'unset' }}>
              <SummaryCard
                title={t('expectedStart')}
                icon={BiCalendar}
                value={workOrder.workOrderStartDate ? dateFormatNew(workOrder.workOrderStartDate) : 'mm/dd/yy'}
              />
            </Box>
            <Box flex={{ base: '1', sm: 'unset' }}>
              <SummaryCard
                icon={BiCalendar}
                title={t('expectedCompletion')}
                value={
                  workOrder.workOrderExpectedCompletionDate
                    ? dateFormatNew(workOrder.workOrderExpectedCompletionDate)
                    : 'mm/dd/yy'
                }
              />
            </Box>

            <Box flex={{ base: '1', sm: 'unset' }}>
              <SummaryCard
                icon={BiCalendar}
                title={t('completedByVendor')}
                value={workOrder.workOrderDateCompleted ? dateFormatNew(workOrder.workOrderDateCompleted) : 'mm/dd/yy'}
              />
            </Box>
            <Box flex={{ base: '1', sm: 'unset' }}>
              <SummaryCard
                title={t(`${NEW_PROJECT}.lockBoxCode`)}
                icon={BiFile}
                value={!!projectData?.lockBoxCode ? projectData?.lockBoxCode : '--'}
              />
            </Box>
          </SimpleGrid>
          <Box mx={{ base: '0', lg: '30px' }} mt={8}>
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
            <Button variant="outline" colorScheme="darkPrimary" onClick={onClose}>
              {t('cancel')}
            </Button>
            {values?.assignedItems && values?.assignedItems?.length > 0 && (
              <Button type="submit" colorScheme="darkPrimary" disabled={isUpdating || isFetchingLineItems}>
                {t('save')}
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </form>
    </Box>
  )
}

export default WorkOrderDetailTab
