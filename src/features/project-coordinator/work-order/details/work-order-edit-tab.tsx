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
} from '@chakra-ui/react'
import { STATUS } from 'features/projects/status'
import { useEffect } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiCalendar, BiSpreadsheet } from 'react-icons/bi'
import { calendarIcon } from 'theme/common-style'
import { dateFormat } from 'utils/date-time-utils'
import {
  defaultValuesWODetails,
  LineItems,
  parseWODetailValuesToPayload,
  useAssignLineItems,
  useDeleteLineIds,
} from 'utils/work-order'
import AssignedItems from './assigned-items'

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
  assignedItems: LineItems[]
  manualItems: any[]
}

const WorkOrderDetailTab = props => {
  const { workOrder, onSave, navigateToProjectDetails, isWorkOrderUpdating, setWorkOrderUpdating, swoProject } = props

  const formReturn = useForm<FormValues>()

  const { register, control, reset } = formReturn
  const woStartDate = useWatch({ name: 'workOrderStartDate', control })
  const { mutate: assignLineItems } = useAssignLineItems({ swoProjectId: swoProject?.id })
  const { mutate: deleteLineItems } = useDeleteLineIds()
  const { t } = useTranslation()

  const {
    skillName,
    companyName,
    businessEmailAddress,
    businessPhoneNumber,
    workOrderIssueDate,
    dateLeanWaiverSubmitted,
    datePermitsPulled,
    workOrderCompletionDateVariance,
  } = props.workOrder

  const formValues = useWatch({ control })

  /* -If we have new Smart work Order items added, they will be assigned in SWO.
     -If some smart work order items are deleted, they will be unassigned in SWO.
     -Deleted items will be send as a comma separated list to delete api of work order
     -Updated line items will be saved in workorder 
     -If no new swo items are added or delete, assign/unassign call will not be made
     -If no new swo item is deleted, delete api will not be called
     -Save workorder will be called in all cases in the end. It will trigger refreshing workorder items and other necessary calls.
  */

  const updateLineItems = (assignedItems, unassignedItems, payload) => {
    setWorkOrderUpdating(true)
    if (assignedItems?.length > 0 || unassignedItems?.length > 0) {
      assignLineItems(
        [
          ...assignedItems.map(a => {
            return { id: a.id, isAssigned: true }
          }),
          ...unassignedItems.map(a => {
            return { id: a.smartLineItemId, isAssigned: false }
          }),
        ],
        {
          onSuccess: () => {
            if (unassignedItems?.length > 0) {
              deleteLineItems(
                { deletedIds: [...unassignedItems.map(a => a.id)].join(',') },
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

  const getUnAssignedItems = () => {
    /* checking which  smart work order items existed in workOrder but now are not present in the form. They have to unassigned*/
    const formAssignedItemsIds = formValues?.assignedItems?.map(s => s.smartLineItemId)
    const unAssignedItems = [
      ...workOrder?.assignedItems?.filter(items => !formAssignedItemsIds?.includes(items.smartLineItemId)),
    ]
    return unAssignedItems
  }

  const onSubmit = values => {
    /* Finding out newly added items. New items will not have smartLineItem Id. smartLineItemId is present for line items that have been saved*/
    const assignedItems = [...values.assignedItems.filter(a => !a.smartLineItemId)]
    /* Finding out items that will be unassigned*/
    const unAssignedItems = getUnAssignedItems()
    const payload = parseWODetailValuesToPayload(values)
    updateLineItems(assignedItems, unAssignedItems, payload)
  }
  useEffect(() => {
    if (workOrder?.id) {
      reset(defaultValuesWODetails(workOrder))
    }
  }, [workOrder, reset])

  return (
    <Box>
      <FormProvider {...formReturn}>
        <form onSubmit={formReturn.handleSubmit(onSubmit)}>
          <ModalBody h="400px" overflow={'auto'}>
            <Stack pt="32px" spacing="32px" mx="32px">
              <SimpleGrid columns={5}>
                <InformationCard title="Vendor Name" date={companyName} />
                <InformationCard title="Vendor Type" date={skillName} />
                <InformationCard title="Email" date={businessEmailAddress} />
                <InformationCard title=" Phone" date={businessPhoneNumber} />
              </SimpleGrid>
              <Box>
                <Divider borderColor="#CBD5E0" />
              </Box>

              <SimpleGrid columns={5}>
                <CalenderCard title="WO Issued" date={dateFormat(workOrderIssueDate)} />
                <CalenderCard title="LW Submitted " date={dateFormat(dateLeanWaiverSubmitted)} />
                <CalenderCard title="Permit Pulled" date={dateFormat(datePermitsPulled)} />
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
              <AssignedItems workOrder={workOrder} swoProject={swoProject} isLoadingLineItems={isWorkOrderUpdating} />
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
      </FormProvider>
    </Box>
  )
}

export default WorkOrderDetailTab
