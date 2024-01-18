import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  Checkbox,
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiCalendar, BiDownload, BiSpreadsheet } from 'react-icons/bi'
import { calendarIcon } from 'theme/common-style'
import { dateFormatNew } from 'utils/date-time-utils'
import Select, { CreatableSelect } from 'components/form/react-select'
import {
  completePercentageValues,
  defaultValuesWODetails,
  newObjectFormatting,
  parseWODetailValuesToPayload,
  useFieldEnableDecisionDetailsTab,
} from 'api/work-order'
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
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { useFilteredVendors } from 'api/pc-projects'
import { useTrades } from 'api/vendor-details'
import { WORK_ORDER_STATUS } from 'components/chart/Overview'
import { useLocation } from 'react-router-dom'

export type SelectVendorOption = {
  label: string
  value: any
  title: any
}

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
          {...props.customStyle}
        >
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

export type completePercentage = {
  value: number
  label: string
}

interface FormValues {
  cancel: any
  workOrderStartDate: string | null
  workOrderDateCompleted: string | null
  workOrderExpectedCompletionDate: string | null
  assignedItems?: LineItems[]
  vendorSkillId: number | string | null
  vendorId: number | string | null
  completePercentage?: completePercentage
  locations?: any
  assignToVendor?: boolean
}

const WorkOrderDetailTab = props => {
  const {
    workOrder,
    onSave,
    navigateToProjectDetails,
    isWorkOrderUpdating,
    swoProject,
    projectData,
    documentsData,
    isFetchingLineItems,
    isLoadingLineItems,
    locations,
  } = props

  const defaultSkill = {
    value: workOrder?.vendorSkillId as number,
    label: workOrder?.skillName as string,
    title: workOrder?.skillName as string,
  }

  const [vendorOptions, setVendorOptions] = useState<SelectVendorOption[]>([])

  const defaultValues: FormValues = useMemo(() => {
    return defaultValuesWODetails(workOrder, defaultSkill, locations)
  }, [workOrder, locations])

  const formReturn = useForm<FormValues>({
    defaultValues: {
      ...defaultValues,
    },
  })

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = formReturn
  const assignedItemsArray = useFieldArray({
    control,
    name: 'assignedItems',
  })
  const woStartDate = useWatch({ name: 'workOrderStartDate', control })
  const assignVendor = useWatch({ name: 'assignToVendor', control })

  const assignItemsSum = assignedItemsArray.fields.map(a => a.completePercentage).reduce((prev, curr) => prev + curr, 0)
  const totalAssignItems = assignedItemsArray.fields.length

  const assignedItemsWatch = useWatch({ name: 'assignedItems', control })
  const { mutate: assignLineItems } = useAssignLineItems({ swoProjectId: swoProject?.id, refetchLineItems: true })
  const { mutate: deleteLineItems } = useDeleteLineIds()
  const { remainingItems, isLoading: isRemainingItemsLoading } = useRemainingLineItems(swoProject?.id)
  const [unassignedItems, setUnAssignedItems] = useState<LineItems[]>([])
  const { isAssignmentAllowed } = useAllowLineItemsAssignment({ workOrder, swoProject })
  const [uploadedWO, setUploadedWO] = useState<any>(null)

  const { t } = useTranslation()
  const isWOCancelled = WORK_ORDER_STATUS.Cancelled === workOrder?.status
  const disabledSave =
    isWorkOrderUpdating || (!(uploadedWO && uploadedWO?.s3Url) && isFetchingLineItems) || isWOCancelled
  const { isAdmin } = useUserRolesSelector()
  const { permissions } = useRoleBasedPermissions()
  const cancelPermissions = permissions.some(p => ['PROJECTDETAIL.WORKORDER.CANCEL.EDIT', 'ALL'].includes(p))
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
    })
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

  // Enable Vendor Type and Company Name for Admin User
  const [tradeOptions, setTradeOptions] = useState([])

  const [selectedVendorId, setSelectedVendorId] = useState<SelectVendorOption[]>([])

  const { data: trades } = useTrades()
  const [vendorSkillId, setVendorSkillId] = useState(workOrder?.vendorSkillId)

  const { vendors, isLoading: loadingVendors } = useFilteredVendors({
    vendorSkillId,
    projectId: workOrder?.projectId,
    showExpired: true,
    currentVendorId: workOrder?.vendorId,
  })

  const selectedVendor = vendors?.find(v => v.id === (selectedVendorId as any))
  const clientStart = projectData?.clientStartDate
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const isPayableRead = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ') && isPayable
  const isProjRead = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
  const isReadOnly = isPayableRead || isProjRead
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
      const activeVendors = vendors?.filter(option => {
        if (option.companyName === companyName) return option
        else return option?.statusLabel?.toLocaleLowerCase() !== 'expired'
      })

      activeVendors?.forEach(v => {
        option.push({
          label:
            v.statusLabel?.toLocaleLowerCase() === 'expired' ? v.companyName + ' (Expired)' : (v.companyName as string),
          value: v.id as number,
        })
      })
    }
    setVendorOptions(option)
  }, [vendors])

  useEffect(() => {
    let defaultVendor
    if (vendorOptions && vendorOptions?.length > 0) {
      const selectedVendor = vendorOptions?.find(v => v?.value === workOrder?.vendorId)
      defaultVendor = {
        label: selectedVendor?.label as string,
        value: selectedVendor?.value as number,
        title: selectedVendor?.label as string,
      }
      setValue('vendorId', defaultVendor)
    } else {
      setValue('vendorId', defaultVendor)
    }
  }, [vendorOptions?.length, setValue])

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
  const handleDropdownValue = v => [{ value: v, label: `${v?.toString()}%` }]

  const onSubmit = values => {
    /* Finding out newly added items. New items will not have smartLineItem Id. smartLineItemId is present for line items that have been saved*/
    const assignedItems = [...values.assignedItems.filter(a => !a.smartLineItemId)]

    /* Finding out items that will be unassigned*/
    const unAssignedItems = getUnAssignedItems(formValues, workOrder?.assignedItems)
    const removedItems = getRemovedItems(formValues, workOrder?.assignedItems)
    const payload = parseWODetailValuesToPayload(values, workOrder)
    processLineItems({ assignments: { assignedItems, unAssignedItems }, deleted: removedItems, savePayload: payload })
  }

  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }

  const isCancelled = workOrder.statusLabel?.toLowerCase() === STATUS.Cancelled

  const inProgress = [
    STATUS.Draft,
    STATUS.Active,
    STATUS.PastDue,
    STATUS.Completed,
    STATUS.Invoiced,
    STATUS.Rejected,
  ].includes(workOrder.statusLabel?.toLowerCase())

  useEffect(() => {
    if (isReadOnly) {
      Array.from(document.querySelectorAll('input')).forEach(input => {
        if (input.getAttribute('data-testid') !== 'tableFilterInputField') {
          input.setAttribute('disabled', 'true')
        }
      })
    }
  }, [])
  return (
    <Box>
      <form onSubmit={formReturn.handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        <ModalBody h="600px" overflow={'auto'}>
          <Stack spacing="32px" m="25px">
            <Box>
              {[STATUS.Rejected].includes(workOrder?.statusLabel?.toLocaleLowerCase()) && (
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
                    <HStack spacing="16px" gap={'20px'}>
                      {inProgress ? (
                        <Box w="215px" mt={-7}>
                          <FormControl height="40px" isInvalid={!!errors.vendorSkillId} data-testid="vendorSkillId">
                            <FormLabel fontSize="14px" fontWeight={500} color="gray.700">
                              {t('trade')}
                            </FormLabel>
                            <Controller
                              control={control}
                              rules={assignVendor ? { required: 'This is required' } : undefined}
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
                                      selectProps={
                                        assignVendor
                                          ? { isBorderLeft: true, menuHeight: '175px' }
                                          : { menuHeight: '175px' }
                                      }
                                    />
                                  </>
                                )
                              }}
                            />
                          </FormControl>
                        </Box>
                      ) : (
                        <InformationCard testId="vendorType" title={t(`${WORK_ORDER}.vendorType`)} date={skillName} />
                      )}
                      {inProgress ? (
                        <Box w="215px">
                          <FormControl isInvalid={!!errors.vendorId} data-testid="vendorId">
                            <FormLabel fontSize="14px" fontWeight={500} color="gray.700">
                              {t('companyName')}
                            </FormLabel>
                            <Controller
                              control={control}
                              rules={assignVendor ? { required: 'This is required' } : undefined}
                              name="vendorId"
                              render={({ field, fieldState }) => {
                                return (
                                  <>
                                    <Select
                                      {...field}
                                      options={vendorOptions}
                                      size="md"
                                      loadingCheck={loadingVendors}
                                      selectProps={
                                        assignVendor
                                          ? { isBorderLeft: true, menuHeight: '175px' }
                                          : { menuHeight: '175px' }
                                      }
                                      onChange={option => {
                                        setSelectedVendorId(option.value)
                                        field.onChange(option)
                                      }}
                                    />
                                  </>
                                )
                              }}
                            />
                          </FormControl>
                        </Box>
                      ) : (
                        <InformationCard
                          testId="companyName"
                          title={t(`${WORK_ORDER}.companyName`)}
                          date={companyName}
                        />
                      )}
                      {businessPhoneNumber && businessEmailAddress && (
                        <>
                          <InformationCard
                            testId="email"
                            title={t(`${WORK_ORDER}.email`)}
                            date={selectedVendor ? selectedVendor?.businessEmailAddress : businessEmailAddress}
                            customStyle={{ width: '150px', height: '20px' }}
                          />
                          <InformationCard
                            testId="phone"
                            title={t(`${WORK_ORDER}.phone`)}
                            date={selectedVendor ? selectedVendor?.businessPhoneNumber : businessPhoneNumber}
                            customStyle={{ width: '150px', height: '20px' }}
                          />
                        </>
                      )}
                    </HStack>
                  </Box>
                </>
              </>
            )}
            <Box>
              <Divider borderColor="#CBD5E0" />
            </Box>
            <SimpleGrid columns={5} gap={4}>
              <CalenderCard
                testId={'woIssued'}
                title={t(`${WORK_ORDER}.woIssued`)}
                date={dateFormatNew(workOrderIssueDate)}
              />
              <CalenderCard
                testId={'lwSubmitted'}
                title={t(`${WORK_ORDER}.lwSubmitted`)}
                date={dateLeanWaiverSubmitted ? dateFormatNew(dateLeanWaiverSubmitted) : 'mm/dd/yyyy'}
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
              {cancelPermissions && !isCancelled && (
                <Box w="215px" data-testid="note_submit">
                  <FormControl zIndex="2">
                    <FormLabel variant="strong-label" size="md">
                      {t('cancelWorkOrder')}
                    </FormLabel>
                    <Controller
                      control={control}
                      name="cancel"
                      render={({ field }) => (
                        <div data-testid="cancel_Work_Order">
                          <ReactSelect
                            options={CANCEL_WO_OPTIONS}
                            onChange={option => field.onChange(option)}
                            isDisabled={
                              ![STATUS.Active, STATUS.PastDue].includes(workOrder.statusLabel?.toLowerCase()) &&
                              !cancelPermissions
                            }
                          />
                        </div>
                      )}
                    />
                  </FormControl>
                </Box>
              )}
              <Box w="215px">
                <FormControl zIndex="2" isInvalid={!!errors.workOrderStartDate}>
                  <FormLabel variant="strong-label" size="md">
                    {t('expectedStart')}
                  </FormLabel>
                  <Input
                    data-testid="workOrderStartDate"
                    id="workOrderStartDate"
                    type="date"
                    size="md"
                    css={calendarIcon}
                    isDisabled={!workOrderStartDateEnable || isWOCancelled}
                    min={clientStart as any}
                    variant={assignVendor ? 'required-field' : 'outline'}
                    {...register('workOrderStartDate', {
                      required: assignVendor ? 'This is required field.' : undefined,
                    })}
                  />
                </FormControl>
              </Box>
              <Box w="215px">
                <FormControl isInvalid={!!errors.workOrderExpectedCompletionDate}>
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
                    isDisabled={!workOrderExpectedCompletionDateEnable || isWOCancelled}
                    variant={assignVendor ? 'required-field' : 'outline'}
                    {...register('workOrderExpectedCompletionDate', {
                      required: assignVendor ? 'This is required field.' : undefined,
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
              {uploadedWO && uploadedWO?.s3Url && (
                <Box w="215px">
                  <FormControl>
                    <FormLabel variant="strong-label" size="md">
                      {t(`${WORK_ORDER}.completePercentage`)}
                    </FormLabel>
                    <Controller
                      control={control}
                      // rules={{ required: true }}
                      name={'completePercentage'}
                      render={({ field }) => {
                        return (
                          <CreatableSelect
                            {...field}
                            isDisabled={isWOCancelled}
                            id={`completePercentage`}
                            options={completePercentageValues}
                            size="md"
                            value={typeof field.value === 'number' ? handleDropdownValue(field.value) : field.value}
                            // isDisabled={isVendor}
                            onChange={option => {
                              if (option?.__isNew__) {
                                field.onChange(newObjectFormatting(option))
                              } else {
                                field.onChange(option)
                              }
                            }}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Box>
              )}
              {!(uploadedWO && uploadedWO?.s3Url) && (
                <Box w="215px">
                  <FormControl data-testid="completedPercentageField">
                    <FormLabel variant="strong-label" size="md">
                      {t(`${WORK_ORDER}.completePercentage`)}
                    </FormLabel>
                    <Input
                      data-testid="completedPercentage"
                      size="md"
                      isDisabled={!completedByVendor}
                      variant="outline"
                      value={assignItemsSum ? `${assignItemsSum / totalAssignItems}%` : 0}
                      // {...register('workOrderDateCompleted')}
                    />
                  </FormControl>
                </Box>
              )}
            </HStack>
            {uploadedWO && uploadedWO?.s3Url && (
              <Box pt={7}>
                <Checkbox
                  isDisabled={workOrder?.visibleToVendor}
                  variant={'outLinePrimary'}
                  data-testid="assignToVendor"
                  size="md"
                  {...register('assignToVendor')}
                >
                  {t(`${WORK_ORDER}.assignVendor`)}
                </Checkbox>
              </Box>
            )}
          </Box>
          {!(uploadedWO && uploadedWO?.s3Url) && (
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
            <Button data-testid="wo-cancel-btn" onClick={props.onClose} colorScheme="brand" variant="outline">
              {t('cancel')}
            </Button>
            <>
              {!isReadOnly && (
                <Button data-testid="updateBtn" colorScheme="brand" type="submit" disabled={disabledSave}>
                  {t('save')}
                </Button>
              )}
            </>
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
