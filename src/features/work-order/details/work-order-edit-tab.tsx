import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { STATUS } from 'features/common/status'
import { useCallback, useEffect, useState } from 'react'
import { useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiCalendar, BiDownload, BiSpreadsheet } from 'react-icons/bi'
import { calendarIcon } from 'theme/common-style'
import { dateFormat } from 'utils/date-time-utils'
import { defaultValuesWODetails, parseWODetailValuesToPayload, useFieldEnableDecisionDetailsTab } from 'api/work-order'
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
  mapToUnAssignItem,
} from './assignedItems.utils'
import RemainingItemsModal from './remaining-items-modal'
import jsPDF from 'jspdf'
import { WORK_ORDER } from '../workOrder.i18n'
import { downloadFile } from 'utils/file-utils'

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
        <Text data-testid={props.testId} color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
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
          data-testid={props.testId}
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
    swoProject,
    rejectInvoiceCheck,
    projectData,
    documentsData,
    workOrderAssignedItems,
    isFetchingLineItems,
    isLoadingLineItems,
  } = props

  const formReturn = useForm<FormValues>()
  const { register, control, reset, setValue } = formReturn
  const assignedItemsArray = useFieldArray({
    control,
    name: 'assignedItems',
  })

  const woStartDate = useWatch({ name: 'workOrderStartDate', control })
  const assignedItemsWatch = useWatch({ name: 'assignedItems', control })
  const { mutate: assignLineItems } = useAssignLineItems({ swoProjectId: swoProject?.id, refetchLineItems: true })
  const { mutate: deleteLineItems } = useDeleteLineIds()
  const { remainingItems, isLoading: isRemainingItemsLoading } = useRemainingLineItems(swoProject?.id)
  const [unassignedItems, setUnAssignedItems] = useState<LineItems[]>([])
  const { isAssignmentAllowed } = useAllowLineItemsAssignment({ workOrder, swoProject })
  const [uploadedWO, setUploadedWO] = useState<any>(null)
  const { t } = useTranslation()
  const disabledSave = isWorkOrderUpdating || (!(uploadedWO && uploadedWO?.s3Url) && isFetchingLineItems)

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
  const { completedByVendor } = useFieldEnableDecisionDetailsTab({ workOrder, formValues })

  // Remaining Items handles
  const {
    onClose: onCloseRemainingItemsModal,
    isOpen: isOpenRemainingItemsModal,
    onOpen: onOpenRemainingItemsModal,
  } = useDisclosure()

  const downloadPdf = useCallback(() => {
    let doc = new jsPDF()
    createInvoicePdf({ doc, workOrder, projectData, assignedItems: assignedItemsWatch, hideAward: false })
  }, [assignedItemsWatch, projectData, workOrder])

  const setAssignedItems = useCallback(
    items => {
      /*
      not used now, will be used in upcoming stories
      const selectedIds = items.map(i => i.id)
      const assigned = [
        ...items.map(s => {
          return mapToLineItems(s)
        }),
      ]
      append(assigned)
      setUnAssignedItems([...unassignedItems.filter(i => !selectedIds.includes(i.id))])*/
    },
    [unassignedItems, setUnAssignedItems],
  )

  useEffect(() => {
    const isVerified = assignedItemsWatch?.every(item => item.isVerified && item.isCompleted)
    if (!isVerified) {
      setValue('workOrderDateCompleted', null)
    }
  }, [assignedItemsWatch])

  useEffect(() => {
    const tempAssignedItems = formValues?.assignedItems?.filter(a => !a.smartLineItemId)?.map(item => item.id)
    const items = remainingItems?.filter?.(item => !tempAssignedItems?.includes(item.id))
    setUnAssignedItems(items)
  }, [remainingItems])

  useEffect(() => {
    if (!documentsData?.length) return
    const uploadedWO = documentsData.find(
      doc => parseInt(doc.documentType, 10) === 16 && workOrder.id === doc.workOrderId,
    )
    setUploadedWO(uploadedWO)
  }, [documentsData])

  const updateWorkOrderLineItems = (deletedItems, payload) => {
    if (deletedItems?.length > 0) {
      deleteLineItems(
        { deletedIds: [...deletedItems.map(a => a.id)].join(',') },
        {
          onSuccess: () => {
            onSave(payload)
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

    if (assignedItems?.length > 0 || unAssignedItems?.length > 0) {
      assignLineItems(
        [
          ...assignedItems.map(a => {
            return { id: a.id, isAssigned: true }
          }),
          ...unAssignedItems.map(a => {
            return mapToUnAssignItem(a)
          }),
        ],
        {
          onSuccess: () => {
            updateWorkOrderLineItems(deleted, savePayload)
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
    const unAssignedItems = getUnAssignedItems(formValues, workOrderAssignedItems)
    const removedItems = getRemovedItems(formValues, workOrderAssignedItems)
    const payload = parseWODetailValuesToPayload(values)
    processLineItems({ assignments: { assignedItems, unAssignedItems }, deleted: removedItems, savePayload: payload })
  }

  useEffect(() => {
    if (workOrder?.id) {
      reset(defaultValuesWODetails(workOrder, workOrderAssignedItems))
    }
  }, [workOrder, reset, workOrderAssignedItems])

  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }

  return (
    <Box>
      <form onSubmit={formReturn.handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        <ModalBody h={'calc(100vh - 300px)'} overflow={'auto'}>
          <Stack spacing="32px" m="25px">
            <Box>
              {[STATUS.Declined].includes(workOrder?.statusLabel?.toLocaleLowerCase()) && (
                <Alert status="info" variant="custom" size="sm">
                  <AlertIcon />

                  <AlertDescription>{t(`${WORK_ORDER}.rejectedInvoiceInfo`)}</AlertDescription>
                </Alert>
              )}
            </Box>
            <SimpleGrid columns={5}>
              <InformationCard testId="companyName" title={t(`${WORK_ORDER}.companyName`)} date={companyName} />
              <InformationCard testId="vendorType" title={t(`${WORK_ORDER}.vendorType`)} date={skillName} />
              <InformationCard testId="email" title={t(`${WORK_ORDER}.email`)} date={businessEmailAddress} />
              <InformationCard testId="phone" title={t(`${WORK_ORDER}.phone`)} date={businessPhoneNumber} />
            </SimpleGrid>
            <Box>
              <Divider borderColor="#CBD5E0" />
            </Box>

            <SimpleGrid columns={5}>
              <CalenderCard
                testId={'woIssued'}
                title={t(`${WORK_ORDER}.woIssued`)}
                date={dateFormat(workOrderIssueDate)}
              />
              <CalenderCard
                testId={'lwSubmitted'}
                title={t(`${WORK_ORDER}.lwSubmitted`)}
                date={
                  dateLeanWaiverSubmitted && !rejectInvoiceCheck ? dateFormat(dateLeanWaiverSubmitted) : 'mm/dd/yyyy'
                }
              />
              {/*<CalenderCard title="Permit Pulled" date={dateFormat(datePermitsPulled)} />*/}
              <CalenderCard
                testId={'completionVariance'}
                title={t(`${WORK_ORDER}.completionVariance`)}
                date={workOrderCompletionDateVariance ?? '0'}
              />
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
                    data-testid="workOrderStartDate"
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
                    data-testid="workOrderExpectedCompletionDate"
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
                    data-testid="workOrderDateCompleted"
                    id="workOrderDateCompleted"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    isDisabled={!completedByVendor}
                    variant="outline"
                    {...register('workOrderDateCompleted')}
                  />
                </FormControl>
              </Box>
            </HStack>
          </Box>
          {!(uploadedWO && uploadedWO?.s3Url) && (
            <Box mx="32px" mt={10}>
              {isLoadingLineItems ? (
                <Center>
                  <Spinner size={'lg'} />
                </Center>
              ) : (
                <AssignedItems
                  isLoadingLineItems={isFetchingLineItems || isWorkOrderUpdating}
                  onOpenRemainingItemsModal={onOpenRemainingItemsModal}
                  unassignedItems={unassignedItems}
                  setUnAssignedItems={setUnAssignedItems}
                  formControl={formReturn as UseFormReturn<any>}
                  assignedItemsArray={assignedItemsArray}
                  isAssignmentAllowed={isAssignmentAllowed}
                  swoProject={swoProject}
                  downloadPdf={downloadPdf}
                  workOrder={workOrder}
                />
              )}
            </Box>
          )}
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
            {uploadedWO && uploadedWO?.s3Url && (
              <Button
                variant="outline"
                colorScheme="brand"
                size="md"
                onClick={() => downloadFile(uploadedWO?.s3Url)}
                leftIcon={<BiDownload />}
              >
                {t('see')} {t('workOrder')}
              </Button>
            )}
          </HStack>
          <HStack spacing="16px" w="100%" justifyContent="end">
            <Button onClick={props.onClose} colorScheme="brand" variant="outline">
              {t('cancel')}
            </Button>
            <Button data-testId="updateBtn" colorScheme="brand" type="submit" disabled={disabledSave}>
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
