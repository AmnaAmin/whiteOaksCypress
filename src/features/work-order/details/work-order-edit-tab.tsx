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
  FormErrorMessage,
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
import { Controller, useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiCalendar, BiDownload, BiSpreadsheet } from 'react-icons/bi'
import { calendarIcon } from 'theme/common-style'
import { dateFormatNew } from 'utils/date-time-utils'
import Select from 'components/form/react-select'
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
import ReactSelect from 'components/form/react-select'
import { CANCEL_WO_OPTIONS } from 'constants/index'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useFilteredVendors } from 'api/pc-projects'
import { useTrades } from 'api/vendor-details'
import { useUploadDocument } from 'api/vendor-projects'

const CalenderCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        <BiCalendar size={23} color="#4A5568" />
      </Box>
      <Box lineHeight="20px">
        <Text color="gray.700" fontWeight={500} fontSize="14px" fontStyle="normal" mb="1">
          {props.title}
        </Text>
        <Text color="gray.600" data-testid={props.testId} fontSize="14px" fontStyle="normal" fontWeight={400}>
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
        <Text color="gray.700" fontWeight={500} fontSize="14px" fontStyle="normal" mb="1">
          {props.title}
        </Text>
        <Text
          data-testid={props.testId}
          color="gray.600"
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
  cancel: any
  workOrderStartDate: string | null
  workOrderDateCompleted: string | null
  workOrderExpectedCompletionDate: string | null
  assignedItems?: LineItems[]
  vendorSkillId: number | string | null
  vendorId: number | string | null
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
  const {
    register,
    control,
    reset,
    setValue,
    formState: { errors },
  } = formReturn
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
  const { mutate: saveDocument } = useUploadDocument()

  const { t } = useTranslation()
  const disabledSave = isWorkOrderUpdating || (!(uploadedWO && uploadedWO?.s3Url) && isFetchingLineItems)
  const { isAdmin } = useUserRolesSelector()

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
  const { completedByVendor, workOrderStartDateEnable, workOrderExpectedCompletionDateEnable } =
    useFieldEnableDecisionDetailsTab({ workOrder, formValues })

  // Remaining Items handles
  const {
    onClose: onCloseRemainingItemsModal,
    isOpen: isOpenRemainingItemsModal,
    onOpen: onOpenRemainingItemsModal,
  } = useDisclosure()

  const downloadPdf = useCallback(() => {
    let doc = new jsPDF()
    createInvoicePdf({
      doc,
      workOrder,
      projectData,
      assignedItems: assignedItemsWatch,
      hideAward: false,
      onSave: saveWorkOrderDocument,
    })
  }, [assignedItemsWatch, projectData, workOrder])

  const saveWorkOrderDocument = doc => {
    saveDocument(doc)
  }

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

  // Enable Vendor Type and Company Name for Admin User
  const [tradeOptions, setTradeOptions] = useState([])
  const [vendorOptions, setVendorOptions] = useState([])
  const [selectedVendorId, setSelectedVendorId] = useState<any>([])

  const { data: trades } = useTrades()
  const [vendorSkillId, setVendorSkillId] = useState(null)

  const { vendors } = useFilteredVendors(vendorSkillId)

  const selectedVendor = vendors?.find(v => v.id === (selectedVendorId as any))

  // Set Vendor Type
  const defaultSkill = {
    value: workOrder?.vendorSkillId as number,
    label: workOrder?.skillName as string,
    title: workOrder?.skillName as string,
  }

  // Set Vendor Names
  const defaultVendor = {
    value: workOrder?.vendorId as number,
    label: workOrder?.claimantName as string,
    title: workOrder?.claimantName as string,
  }

  useEffect(() => {
    const option = [] as any
    if (trades && trades?.length > 0) {
      trades?.forEach(t => {
        option.push({ label: t.skill as string, value: t.id as number })
      })
    }
    setTradeOptions(option)
  }, [trades])

  useEffect(() => {
    const option = [] as any
    if (vendors && vendors?.length > 0) {
      vendors?.forEach(v => {
        option.push({ label: v.companyName as string, value: v.id as number })
      })
    }
    setVendorOptions(option)
  }, [vendors])

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
      reset(defaultValuesWODetails(workOrder, workOrderAssignedItems, defaultSkill, defaultVendor))
    }
  }, [workOrder, reset, workOrderAssignedItems?.length])

  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }

  const isCancelled = workOrder.statusLabel?.toLowerCase() === STATUS.Cancelled

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
            {!isAdmin ? (
              <SimpleGrid columns={5}>
                <>
                  <InformationCard testId="vendorType" title={t(`${WORK_ORDER}.vendorType`)} date={skillName} />
                  <InformationCard testId="companyName" title={t(`${WORK_ORDER}.companyName`)} date={companyName} />
                  <InformationCard testId="email" title={t(`${WORK_ORDER}.email`)} date={businessEmailAddress} />
                  <InformationCard testId="phone" title={t(`${WORK_ORDER}.phone`)} date={businessPhoneNumber} />
                </>
              </SimpleGrid>
            ) : (
              <>
                <>
                  <Box mt="32px" mx="32px">
                    <HStack spacing="16px">
                      <Box w="215px" mt={-7}>
                        <FormControl height="40px" isInvalid={!!errors.vendorSkillId} data-testid="vendorSkillId">
                          <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                            {t('type')}
                          </FormLabel>
                          <Controller
                            control={control}
                            rules={{ required: 'This is required' }}
                            name="vendorSkillId"
                            render={({ field, fieldState }) => {
                              return (
                                <>
                                  <Select
                                    {...field}
                                    options={tradeOptions}
                                    size="md"
                                    value={field.value}
                                    onChange={option => {
                                      setVendorSkillId(option.value)
                                      setValue('vendorId', null)
                                      field.onChange(option)
                                    }}
                                    selectProps={{ isBorderLeft: true, menuHeight: '175px' }}
                                  />
                                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                                </>
                              )
                            }}
                          />
                        </FormControl>
                      </Box>
                      <Box w="215px">
                        <FormControl isInvalid={!!errors.vendorSkillId} data-testid="vendorId">
                          <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                            {t('companyName')}
                          </FormLabel>
                          <Controller
                            control={control}
                            rules={{ required: 'This is required' }}
                            name="vendorId"
                            render={({ field, fieldState }) => {
                              return (
                                <>
                                  <Select
                                    {...field}
                                    options={vendorOptions}
                                    size="md"
                                    selectProps={{ isBorderLeft: true, menuHeight: '175px' }}
                                    onChange={option => {
                                      setSelectedVendorId(option.value)
                                      field.onChange(option)
                                    }}
                                  />
                                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                                </>
                              )
                            }}
                          />
                        </FormControl>
                      </Box>
                      <InformationCard
                        testId="email"
                        title={t(`${WORK_ORDER}.email`)}
                        date={selectedVendor ? selectedVendor?.businessEmailAddress : businessEmailAddress}
                      />
                      <InformationCard
                        testId="phone"
                        title={t(`${WORK_ORDER}.phone`)}
                        date={selectedVendor ? selectedVendor?.businessPhoneNumber : businessPhoneNumber}
                      />
                    </HStack>
                  </Box>
                </>
              </>
            )}
            <Box>
              <Divider borderColor="#CBD5E0" />
            </Box>
            <SimpleGrid columns={7} gap={1}>
              <CalenderCard
                testId={'woIssued'}
                title={t(`${WORK_ORDER}.woIssued`)}
                date={dateFormatNew(workOrderIssueDate)}
              />
              <CalenderCard
                testId={'lwSubmitted'}
                title={t(`${WORK_ORDER}.lwSubmitted`)}
                date={
                  dateLeanWaiverSubmitted && !rejectInvoiceCheck ? dateFormatNew(dateLeanWaiverSubmitted) : 'mm/dd/yyyy'
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
              {isAdmin && !isCancelled && (
                <Box w="215px">
                  <FormControl zIndex="2">
                    <FormLabel variant="strong-label" size="md">
                      {t('cancelWorkOrder')}
                    </FormLabel>
                    <Controller
                      control={control}
                      name="cancel"
                      render={({ field }) => (
                        <>
                          <ReactSelect
                            options={CANCEL_WO_OPTIONS}
                            onChange={option => field.onChange(option)}
                            isDisabled={![STATUS.Active, STATUS.PastDue].includes(workOrder.statusLabel?.toLowerCase())}
                          />
                        </>
                      )}
                    />
                  </FormControl>
                </Box>
              )}
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
                    isDisabled={!workOrderStartDateEnable}
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
                    isDisabled={!workOrderExpectedCompletionDateEnable}
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
          {!(uploadedWO && uploadedWO?.s3Url && !assignedItemsWatch) && (
            <Box mx="32px" mt={10}>
              {isLoadingLineItems ? (
                <Center>
                  <Spinner size={'lg'} />
                </Center>
              ) : (
                <AssignedItems
                  isLoadingLineItems={isFetchingLineItems}
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
            {uploadedWO && uploadedWO?.s3Url && !assignedItemsWatch && (
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
            <Button data-testid="updateBtn" colorScheme="brand" type="submit" disabled={disabledSave}>
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
