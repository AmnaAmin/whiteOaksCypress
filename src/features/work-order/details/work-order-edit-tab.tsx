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
  ModalFooter,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import { STATUS } from 'features/common/status'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiDownload, BiSpreadsheet } from 'react-icons/bi'
import { calendarIcon } from 'theme/common-style'
import { dateFormatNew } from 'utils/date-time-utils'
import Select, { CreatableSelect } from 'components/form/react-select'
import {
  completePercentageValues,
  defaultValuesWODetails,
  isVendorSkillServices,
  newObjectFormatting,
  parseWODetailValuesToPayload,
  useFieldEnableDecisionDetailsTab,
} from 'api/work-order'
import AssignedItems from './assigned-items'
import {
  getRemovedItems,
  getUnAssignedItems,
  useAssignLineItems,
  LineItems,
  useAllowLineItemsAssignment,
  useRemainingLineItems,
  createInvoicePdf,
  mapToUnAssignItem,
  mapToLineItems,
  calculateProfit,
  calculateVendorAmount,
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
import round from 'lodash/round'
import { isValidAndNonEmpty } from 'utils'
import { useUploadDocument } from 'api/vendor-projects'
import { useGetProjectFinancialOverview } from 'api/projects'
import { removeCurrencyFormat, currencyFormatter, truncateWithEllipsis } from 'utils/string-formatters'
import { WORK_ORDER_AMOUNT_ROUND } from 'features/vendor/vendor-work-order/work-order.constants'

export type SelectVendorOption = {
  label: string
  value: any
  title: any
}

const InformationCard = props => {
  return (
    <Flex>
      <Box lineHeight="20px">
        <Tooltip label={props.title} placement="top">
          <Text
            color="gray.700"
            fontWeight={500}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            fontSize="14px"
            fontStyle="normal"
            mb="1"
          >
            {truncateWithEllipsis(props.title.trim(), 30)}
          </Text>
        </Tooltip>
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
  notifyVendor?: boolean
  invoiceAmount: string | number | null | undefined
  clientApprovedAmount: string | number | null
  percentage: string | number | null
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
    paymentGroupValsOptions,
    locations,
  } = props

  const defaultSkill = {
    value: workOrder?.vendorSkillId as number,
    label: workOrder?.skillName as string,
    title: workOrder?.skillName as string,
  }
  const { finalSOWAmount, projectTotalCost } = useGetProjectFinancialOverview(projectData?.id)
  const finalSOWAmountNumber = Number(removeCurrencyFormat(finalSOWAmount))
  const projectTotalCostNumber = Number(removeCurrencyFormat(projectTotalCost))

  const balanceSOWAmount = currencyFormatter(finalSOWAmountNumber - Math.abs(projectTotalCostNumber))
  const [vendorOptions, setVendorOptions] = useState<SelectVendorOption[]>([])

  const defaultValues: FormValues = useMemo(() => {
 
    return defaultValuesWODetails(workOrder, defaultSkill, locations, paymentGroupValsOptions)
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
  // @ts-ignore
  const lineitemErr = errors?.assignedItems?.length > 0

  const { append } = assignedItemsArray

  const woStartDate = useWatch({ name: 'workOrderStartDate', control })
  const assignVendor = useWatch({ name: 'assignToVendor', control })

  const assignItemsSum = assignedItemsArray.fields.map(a => a.completePercentage).reduce((prev, curr) => prev + curr, 0)
  const totalAssignItems = assignedItemsArray.fields.length

  const assignedItemsWatch = useWatch({ name: 'assignedItems', control })
  const { mutate: assignLineItems } = useAssignLineItems({ swoProjectId: swoProject?.id, refetchLineItems: true })
  const { remainingItems, isLoading: isRemainingItemsLoading } = useRemainingLineItems(swoProject?.id)
  const [unassignedItems, setUnAssignedItems] = useState<LineItems[]>([])
  const { isAssignmentAllowed } = useAllowLineItemsAssignment({ workOrder, swoProject })
  const { mutate: saveDocument } = useUploadDocument()
  const [uploadedWO, setUploadedWO] = useState<any>(null)

  const { t } = useTranslation()
  const isWOCancelled = WORK_ORDER_STATUS.Cancelled === workOrder?.status

  const assignItemsLengthCheck = assignedItemsWatch?.length === 0 && assignVendor && !(uploadedWO && uploadedWO?.s3Url)
  const disabledSave =
    isWorkOrderUpdating ||
    (!(uploadedWO && uploadedWO?.s3Url) && isFetchingLineItems) ||
    isWOCancelled ||
    assignItemsLengthCheck ||
    lineitemErr

  const { isAdmin, isVendor } = useUserRolesSelector()
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

  const downloadPdf = useCallback(async () => {
    let doc = new jsPDF()
    doc = await createInvoicePdf({
      doc,
      workOrder,
      projectData,
      assignedItems: assignedItemsWatch ?? [],
      hideAward: false,
    })
    const pdfUri = doc.output('datauristring')
    saveDocument(
      [
        {
          documentType: 1036,
          workOrderId: workOrder?.id,
          fileObject: pdfUri.split(',')[1],
          fileObjectContentType: 'application/pdf',
          fileType: `LineItem_1.pdf`,
          projectId: workOrder?.projectId,
        },
      ],
      {
        onSuccess: () => {
          doc.save(`LineItem_1.pdf`)
        },
      },
    )
  }, [assignedItemsWatch, projectData, workOrder])

  const setAssignedItems = useCallback(
    items => {
      const selectedIds = items.map(i => i.id)
      const assigned = [
        ...items.map(s => {
          return { ...mapToLineItems(s), profit: 45, completePercentage: { value: 0, label: '0%' } }
        }),
      ]
      append(assigned)
      setUnAssignedItems([...unassignedItems.filter(i => !selectedIds.includes(i.id))])
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
  const isSkillService = (isVendorSkillServices(trades, vendorSkillId) && workOrder?.status === 1035 ) || workOrder?.isServiceSkill

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
  const syncDataOfPaymentWithLineItems = workOrder.statusLabel?.toLowerCase() === STATUS.Draft
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
    onSave(payload, deletedItems)
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
    let assignedItems = [...values.assignedItems.filter(a => !a.smartLineItemId)]

    if ( isSkillService && workOrder?.assignedItems ) {
      assignedItems = assignedItems.map( a => {
        a.profit = null;
        return a;
      } )
    }

    /* Finding out items that will be unassigned*/
    const unAssignedItems = getUnAssignedItems(formValues, workOrder?.assignedItems)
    const removedItems = getRemovedItems(formValues, workOrder?.assignedItems)
    const updatedWorkOrderDetails = { ...workOrder, isWorkOrderDetailsEdit: true }
  
    const payload = parseWODetailValuesToPayload(values, updatedWorkOrderDetails, isSkillService)
    
   
    if (syncDataOfPaymentWithLineItems) {
      let clientOriginalApprovedAmount = 0
      assignedItemsWatch?.forEach((e: any) => {
        clientOriginalApprovedAmount += e.clientAmount
      })
      payload['clientOriginalApprovedAmount'] = clientOriginalApprovedAmount
    }
    processLineItems({ assignments: { assignedItems, unAssignedItems }, deleted: removedItems, savePayload: payload })
  }
  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }

  useEffect(() => {
    if (assignedItemsWatch && assignedItemsWatch?.length > 0) {
      const clientAmount = assignedItemsWatch?.reduce(
        (partialSum, a) =>
          partialSum +
          Number(isValidAndNonEmpty(a?.price) ? a?.price : 0) *
            Number(isValidAndNonEmpty(a?.quantity) ? a?.quantity : 0),
        0,
      )
      const vendorAmount = assignedItemsWatch?.reduce(
        (partialSum, a) => partialSum + Number(isValidAndNonEmpty(a?.vendorAmount) ? a?.vendorAmount : 0),
        0,
      )
      if (syncDataOfPaymentWithLineItems) {
        setValue('clientApprovedAmount', round(clientAmount ?? 0, WORK_ORDER_AMOUNT_ROUND))
        setValue('invoiceAmount', round(vendorAmount ?? 0, WORK_ORDER_AMOUNT_ROUND))
      }
      setValue('percentage', round(calculateProfit(clientAmount, vendorAmount), WORK_ORDER_AMOUNT_ROUND))
    }
  }, [assignedItemsWatch])

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
  const [isTruncate] = useMediaQuery('(max-width: 1600px)')
  const watchPercentage = useWatch({ name: 'percentage', control })
  const watchLineItems = useWatch({ name: 'assignedItems', control })


  useEffect(() => {
    if (isSkillService) {
      formValues.assignedItems?.forEach((item, index) => {
        setValue(`assignedItems.${index}.profit`, 0)
        setValue(`isSkillService` as any, true);
      }) 
    }else {
      setValue(`isSkillService` as any, false);
    }
  }, [isSkillService])

  useEffect(() => {
    if ( isSkillService ) return;
    if (watchPercentage === 0) {
      resetLineItemsProfit(0)
    }
  }, [watchPercentage, isSkillService])

  useEffect(() => {
    if ( ! isSkillService ) return;
    if (watchLineItems && watchLineItems?.length > 0) {
      const clientAmount = watchLineItems?.reduce(
        (partialSum, a) =>
          partialSum +
          Number(isValidAndNonEmpty(a?.price) ? a?.price : 0) *
            Number(isValidAndNonEmpty(a?.quantity) ? a?.quantity : 0),
        0,
      )
      const vendorAmount = watchLineItems?.reduce(
        (partialSum, a) => partialSum + Number(isValidAndNonEmpty(a?.vendorAmount) ? a?.vendorAmount : 0),
        0,
      )

    
      setValue('clientApprovedAmount', round(clientAmount, WORK_ORDER_AMOUNT_ROUND))
      setValue('clientOriginalApprovedAmount' as any, round(clientAmount, WORK_ORDER_AMOUNT_ROUND))
      setValue('invoiceAmount', round(vendorAmount, WORK_ORDER_AMOUNT_ROUND))
      setValue('percentage', 0.0)
    
  }
  }, [watchLineItems, isSkillService])

  useEffect(() => {
    if ( isSkillService ) return;
    if (watchLineItems && watchLineItems?.length > 0) {
      const clientAmount = watchLineItems?.reduce(
        (partialSum, a) =>
          partialSum +
          Number(isValidAndNonEmpty(a?.price) ? a?.price : 0) *
            Number(isValidAndNonEmpty(a?.quantity) ? a?.quantity : 0),
        0,
      )
      const vendorAmount = watchLineItems?.reduce(
        (partialSum, a) => partialSum + Number(isValidAndNonEmpty(a?.vendorAmount) ? a?.vendorAmount : 0),
        0,
      )
      if (syncDataOfPaymentWithLineItems) {
        setValue('clientApprovedAmount', round(clientAmount, WORK_ORDER_AMOUNT_ROUND))
        setValue('clientOriginalApprovedAmount' as any, round(clientAmount, WORK_ORDER_AMOUNT_ROUND))
        setValue('invoiceAmount', round(vendorAmount, WORK_ORDER_AMOUNT_ROUND))
      }
      setValue('percentage', round(calculateProfit(clientAmount, vendorAmount), WORK_ORDER_AMOUNT_ROUND))
    } else {
      setValue('clientApprovedAmount', 0.0)
      setValue('clientOriginalApprovedAmount' as any, 0.0)
      setValue('invoiceAmount', 0.0)
      setValue('percentage', 0.0)
    }
  }, [watchLineItems, isSkillService])

  const resetLineItemsProfit = profit => {
    
    formValues.assignedItems?.forEach((item, index) => {
      const clientAmount =
        Number(isValidAndNonEmpty(watchLineItems?.[index]?.price) ? watchLineItems?.[index]?.price : 0) *
        Number(isValidAndNonEmpty(watchLineItems?.[index]?.quantity) ? watchLineItems?.[index]?.quantity : 0)
      setValue(`assignedItems.${index}.profit`, profit)
      setValue(`assignedItems.${index}.vendorAmount`, calculateVendorAmount(clientAmount, profit))
    })
  }
  
  const profitPercentage = workOrder?.profitPercentage && !isSkillService ? workOrder?.profitPercentage + '%' : '---';

  return (
    <Box>
      <form onSubmit={formReturn.handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        {/* <ModalBody h="600px" overflow={'auto'}> */}
        <Stack spacing="32px" m="25px">
          <Box>
            {[STATUS.Rejected].includes(workOrder?.statusLabel?.toLocaleLowerCase()) && (
              <Alert status="info" variant="custom" size="sm">
                <AlertIcon />

                <AlertDescription>{t(`${WORK_ORDER}.rejectedInvoiceInfo`)}</AlertDescription>
              </Alert>
            )}
          </Box>
          {isSkillService && (
            <Box   data-testid="skill-service-message">
<Alert status="info" variant="custom" size="sm">
            <AlertIcon />
            <AlertDescription>Skill of type services is selected, a 0% profit will be allowed for this skill.</AlertDescription>
          </Alert>
            </Box>
          
          )}
          {!isAdmin && workOrder?.visibleToVendor ? (
            <SimpleGrid columns={5}>
              <>
                <InformationCard testId="vendorType" title={t(`${WORK_ORDER}.vendorType`)} date={skillName} />
                <InformationCard testId="companyName" title={t(`${WORK_ORDER}.companyName`)} date={companyName} />
                <InformationCard testId="email" title={t(`${WORK_ORDER}.email`)} date={businessEmailAddress} />
                <InformationCard testId="phone" title={t(`${WORK_ORDER}.phone`)} date={businessPhoneNumber} />
                <InformationCard title="Balance SOW" testId="balanceSOWAmount" date={balanceSOWAmount} />
              </>
            </SimpleGrid>
          ) : (
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
                                classNamePrefix={'tradeOptionsDropdown'}
                                options={tradeOptions}
                                size="md"
                                value={field.value}
                                onChange={option => {
                                  setVendorSkillId(option.value)
                                  setValue('vendorId', null)
                                  field.onChange(option)
                                }}
                                selectProps={
                                  assignVendor ? { isBorderLeft: true, menuHeight: '175px' } : { menuHeight: '175px' }
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
                        rules={{ required: assignVendor ? 'This field is required' : undefined }}
                        name="vendorId"
                        render={({ field, fieldState }) => {
                          return (
                            <>
                              <Select
                                {...field}
                                classNamePrefix={'vendorOptionsDropdown'}
                                options={vendorOptions}
                                size="md"
                                loadingCheck={loadingVendors}
                                selectProps={
                                  assignVendor ? { isBorderLeft: true, menuHeight: '175px' } : { menuHeight: '175px' }
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
                  <InformationCard testId="companyName" title={t(`${WORK_ORDER}.companyName`)} date={companyName} />
                )}
                {businessPhoneNumber && businessEmailAddress && (
                  <>
                    <SimpleGrid columns={3} spacing="55px">
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
                      <InformationCard title="Balance SOW" testId="balanceSOWAmount" date={balanceSOWAmount} />
                    </SimpleGrid>
                  </>
                )}
              </HStack>
            </Box>
          )}
          <Box>
            <Divider borderColor="#CBD5E0" />
          </Box>
          <Box maxWidth="1600px">
            <SimpleGrid columns={6} gap={6}>
              <InformationCard
                title={t(`${WORK_ORDER}.profitPercentage`)}
                testId="profitPercentage"
                date={profitPercentage}
                customStyle={{ width: '100%', height: '20px' }}
              />
              <InformationCard
                testId="vendorAmount"
                title={t(`${WORK_ORDER}.vendorWoAmount`)}
                date={'$' + workOrder?.invoiceAmount}
                customStyle={{ width: '100%', height: '20px' }}
              />

              <InformationCard
                testId="clientFinalAmount"
                title={
                  isTruncate
                    ? truncateWithEllipsis(t(`${WORK_ORDER}.clientFinalAmount`), 20)
                    : t(`${WORK_ORDER}.clientFinalAmount`)
                }
                date={'$' + workOrder?.clientApprovedAmount}
                customStyle={{ width: '100%', height: '20px' }}
              />
              <InformationCard
                testId={'woIssued'}
                title={t(`${WORK_ORDER}.woIssued`)}
                date={dateFormatNew(workOrderIssueDate)}
                customStyle={{ width: '100%', height: '20px' }}
              />
              <InformationCard
                testId={'lwSubmitted'}
                title={t(`${WORK_ORDER}.lwSubmitted`)}
                date={dateLeanWaiverSubmitted ? dateFormatNew(dateLeanWaiverSubmitted) : 'mm/dd/yyyy'}
                customStyle={{ width: '100%', height: '20px' }}
              />
              {/*<CalenderCard title="Permit Pulled" date={dateFormat(datePermitsPulled)} />*/}
              <InformationCard
                testId={'completionVariance'}
                title={t(`${WORK_ORDER}.completionVariance`)}
                date={workOrderCompletionDateVariance ?? '0'}
                customStyle={{ width: '100%', height: '20px' }}
              />
            </SimpleGrid>
          </Box>
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
                         classNamePrefix={'cancelWorkOrder'}
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
                        classNamePrefix={'complete%'}
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
          {uploadedWO && uploadedWO?.s3Url && !isVendor && (
            <Box pt={7}>
              <Checkbox
                isDisabled={workOrder?.visibleToVendor}
                variant={'outLinePrimary'}
                data-testid="assignToVendor"
                size="md"
                {...register('assignToVendor')}
                onChange={e => {
                  setValue('assignToVendor', e.target.checked ?? false)
                  setValue('notifyVendor', e.target.checked ?? false)
                }}
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
                documentsData={documentsData}
                clientName={projectData?.clientName}
                isServiceSkill={isSkillService}
              />
            )}
          </Box>
        )}
        {/* </ModalBody> */}
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
            {props.onClose && (
              <Button data-testid="wo-cancel-btn" onClick={props.onClose} colorScheme="brand" variant="outline">
                {t('cancel')}
              </Button>
            )}
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
