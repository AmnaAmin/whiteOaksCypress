import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { STATUS } from 'features/common/status'
import { useCallback, useEffect, useState } from 'react'
import { useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiCalendar, BiSpreadsheet } from 'react-icons/bi'
import { calendarIcon } from 'theme/common-style'
import { dateFormat } from 'utils/date-time-utils'
import { defaultValuesWODetails, parseWODetailValuesToPayload } from 'api/work-order'
import AssignedItems from './assigned-items'
import {
  getRemovedItems,
  getUnAssignedItems,
  useAssignLineItems,
  useDeleteLineIds,
  LineItems,
  useAllowLineItemsAssignment,
  useRemainingLineItems,
  createInvoicePdf,
} from './assignedItems.utils'
import RemainingItemsModal from './remaining-items-modal'
import jsPDF from 'jspdf'

const CalenderCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        <BiCalendar size={23} color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <Text fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props?.date || 'mm/dd/yyyy'}
        </Text>
      </Box>
    </Flex>
  )
}

const InformationCard = props => {
  return (
    <Flex>
      <Box lineHeight="20px">
        <Text fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text
          color="gray.500"
          fontSize="14px"
          fontStyle="normal"
          fontWeight={400}
          isTruncated={true}
          maxW="150px"
          title={props.date}
        >
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

interface FormValues {
  workOrderStartDate: string | null
  workOrderDateCompleted: string | null
  workOrderExpectedCompletionDate: string | null
  assignedItems?: LineItems[]
}

const WorkOrderDetailTab = props => {
  const {
    workOrder,
    onSave,
    navigateToProjectDetails,
    isWorkOrderUpdating,
    setWorkOrderUpdating,
    swoProject,
    rejectInvoiceCheck,
    projectData,
  } = props

  const formReturn = useForm<FormValues>()
  const { register, control, reset } = formReturn
  const assignedItemsArray = useFieldArray({
    control,
    name: 'assignedItems',
  })
  const { append } = assignedItemsArray

  const woStartDate = useWatch({ name: 'workOrderStartDate', control })
  const assignedItemsWatch = useWatch({ name: 'assignedItems', control })
  const { mutate: assignLineItems } = useAssignLineItems({ swoProjectId: swoProject?.id, refetchLineItems: true })
  const { mutate: deleteLineItems } = useDeleteLineIds()
  const { remainingItems, isLoading: isRemainingItemsLoading } = useRemainingLineItems(swoProject?.id)
  const [unassignedItems, setUnAssignedItems] = useState<LineItems[]>([])
  const { isAssignmentAllowed } = useAllowLineItemsAssignment({ workOrder, swoProject })
  const { t } = useTranslation()

  const {
    skillName,
    companyName,
    businessEmailAddress,
    businessPhoneNumber,
    workOrderIssueDate,
    dateLeanWaiverSubmitted,
    // datePermitsPulled,
    workOrderCompletionDateVariance,
  } = props.workOrder

  const formValues = useWatch({ control })

  // Remaining Items handles
  const {
    onClose: onCloseRemainingItemsModal,
    isOpen: isOpenRemainingItemsModal,
    onOpen: onOpenRemainingItemsModal,
  } = useDisclosure()

  const downloadPdf = useCallback(() => {
    let doc = new jsPDF()
    createInvoicePdf(doc, workOrder, projectData, assignedItemsWatch)
  }, [assignedItemsWatch, projectData, workOrder])

  const setAssignedItems = useCallback(
    items => {
      const selectedIds = items.map(i => i.id)
      const assigned = [
        ...items.map(s => {
          return { ...s, isVerified: false, isCompleted: false, price: s.unitPrice, document: null }
        }),
      ]
      append(assigned)
      setUnAssignedItems([...unassignedItems.filter(i => !selectedIds.includes(i.id))])
    },
    [unassignedItems, setUnAssignedItems],
  )

  useEffect(() => {
    setUnAssignedItems(remainingItems ?? [])
  }, [remainingItems])

  const updateWorkOrderLineItems = (deletedItems, payload) => {
    if (deletedItems?.length > 0) {
      deleteLineItems(
        { deletedIds: [...deletedItems.map(a => a.id)].join(',') },
        {
          onSuccess: () => {
            onSave(payload)
          },
          onError: () => {
            setWorkOrderUpdating(false)
          },
        },
      )
    } else {
      onSave(payload)
    }
  }

  /* -If we have new Smart work Order items added, they will be assigned in SWO.
     -If Smart Work Order items are deleted, they will be unassigned in SWO.
     -Deleted items will be send as a comma separated list to delete api of work order
     -Updated line items will be saved in workorder 
     -If no new swo items are added or delete, assign/unassign call will not be made
     -If no new swo item is deleted, delete api will not be called
     -Save workorder will be called in all cases in the end. It will trigger refreshing workorder items and other necessary calls.
  */
  const processLineItems = lineItems => {
    const { assignments, deleted, savePayload } = lineItems
    const { assignedItems, unAssignedItems } = assignments

    setWorkOrderUpdating(true)
    if (assignedItems?.length > 0 || unAssignedItems?.length > 0) {
      assignLineItems(
        [
          ...assignedItems.map(a => {
            return { id: a.id, isAssigned: true }
          }),
          ...unAssignedItems.map(a => {
            return { id: a.smartLineItemId, isAssigned: false }
          }),
        ],
        {
          onSuccess: () => {
            updateWorkOrderLineItems(deleted, savePayload)
          },
          onError: () => {
            setWorkOrderUpdating(false)
          },
        },
      )
    } else {
      updateWorkOrderLineItems(deleted, savePayload)
    }
  }

  const onSubmit = values => {
    /* Finding out newly added items. New items will not have smartLineItem Id. smartLineItemId is present for line items that have been saved*/
    const assignedItems = [...values.assignedItems.filter(a => !a.smartLineItemId)]
    /* Finding out items that will be unassigned*/
    const unAssignedItems = getUnAssignedItems(formValues, workOrder)
    const removedItems = getRemovedItems(formValues, workOrder)
    const payload = parseWODetailValuesToPayload(values)
    processLineItems({ assignments: { assignedItems, unAssignedItems }, deleted: removedItems, savePayload: payload })
  }

  useEffect(() => {
    if (workOrder?.id) {
      reset(defaultValuesWODetails(workOrder))
    }
  }, [workOrder, reset])

  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }

  return (
    <Box>
      <form onSubmit={formReturn.handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        <ModalBody h="400px" overflow={'auto'}>
          <Stack pt="32px" spacing="32px" mx="32px">
            <SimpleGrid columns={5}>
              <InformationCard title="Company Name" date={companyName} />
              <InformationCard title="Vendor Type" date={skillName} />
              <InformationCard title="Email" date={businessEmailAddress} />
              <InformationCard title=" Phone" date={businessPhoneNumber} />
            </SimpleGrid>
            <Box>
              <Divider borderColor="#CBD5E0" />
            </Box>

            <SimpleGrid columns={5}>
              <CalenderCard title="WO Issued" date={dateFormat(workOrderIssueDate)} />
              <CalenderCard
                title="LW Submitted "
                date={
                  dateLeanWaiverSubmitted && !rejectInvoiceCheck ? dateFormat(dateLeanWaiverSubmitted) : 'mm/dd/yyyy'
                }
              />
              {/*<CalenderCard title="Permit Pulled" date={dateFormat(datePermitsPulled)} />*/}
              <CalenderCard title=" Completion Variance" date={workOrderCompletionDateVariance ?? '0'} />
            </SimpleGrid>
            <Box>
              <Divider borderColor="#CBD5E0" />
            </Box>
          </Stack>
          <Box mt="32px" mx="32px">
            <HStack spacing="16px">
              <Box w="215px">
                <FormControl zIndex="2">
                  <FormLabel variant="strong-label" size="md">
                    {t('expectedStart')}
                  </FormLabel>
                  <Input
                    id="workOrderStartDate"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    isDisabled={![STATUS.Active, STATUS.PastDue].includes(workOrder.statusLabel?.toLowerCase())}
                    variant="required-field"
                    {...register('workOrderStartDate', {
                      required: 'This is required field.',
                    })}
                  />
                </FormControl>
              </Box>
              <Box w="215px">
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t('expectedCompletion')}
                  </FormLabel>
                  <Input
                    id="workOrderExpectedCompletionDate"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    min={woStartDate as string}
                    isDisabled={![STATUS.Active, STATUS.PastDue].includes(workOrder.statusLabel?.toLowerCase())}
                    variant="required-field"
                    {...register('workOrderExpectedCompletionDate', {
                      required: 'This is required field.',
                    })}
                  />
                </FormControl>
              </Box>
              <Box w="215px">
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t('completedByVendor')}
                  </FormLabel>
                  <Input
                    id="workOrderDateCompleted"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    isDisabled={![STATUS.Active, STATUS.PastDue].includes(workOrder.statusLabel?.toLowerCase())}
                    variant="outline"
                    {...register('workOrderDateCompleted')}
                  />
                </FormControl>
              </Box>
            </HStack>
          </Box>
          <Box mx="32px">
            <AssignedItems
              isLoadingLineItems={isWorkOrderUpdating}
              onOpenRemainingItemsModal={onOpenRemainingItemsModal}
              unassignedItems={unassignedItems}
              setUnAssignedItems={setUnAssignedItems}
              formControl={formReturn as UseFormReturn<any>}
              assignedItemsArray={assignedItemsArray}
              isAssignmentAllowed={isAssignmentAllowed}
              swoProject={swoProject}
              downloadPdf={downloadPdf}
            />
          </Box>
        </ModalBody>
        <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
          <HStack justifyContent="start" w="100%">
            {navigateToProjectDetails && (
              <Button
                variant="outline"
                colorScheme="brand"
                size="md"
                onClick={navigateToProjectDetails}
                leftIcon={<BiSpreadsheet />}
              >
                {t('seeProjectDetails')}
              </Button>
            )}
          </HStack>
          <HStack spacing="16px" w="100%" justifyContent="end">
            <Button onClick={props.onClose} colorScheme="brand" variant="outline">
              {t('cancel')}
            </Button>
            <Button colorScheme="brand" type="submit">
              {t('save')}
            </Button>
          </HStack>
        </ModalFooter>
      </form>
      <RemainingItemsModal
        isAssignmentAllowed={isAssignmentAllowed}
        isOpen={isOpenRemainingItemsModal}
        onClose={onCloseRemainingItemsModal}
        setAssignedItems={setAssignedItems}
        remainingItems={unassignedItems}
        isLoading={isRemainingItemsLoading}
        swoProject={swoProject}
      />
    </Box>
  )
}

export default WorkOrderDetailTab
