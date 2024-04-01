import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  ModalFooter,
  Progress,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useGetProjectFinancialOverview } from 'api/projects'
import Select from 'components/form/react-select'
import { t } from 'i18next'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { BiCalendar } from 'react-icons/bi'
import { Project } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'
import { useFilteredVendors, usePercentageAndInoviceChange } from 'api/pc-projects'
import { currencyFormatter, removeCurrencyFormat, removePercentageFormat } from 'utils/string-formatters'
import { useTrades } from 'api/vendor-details'
import { isVendorSkillServices, parseNewWoValuesToPayload, useCreateWorkOrderMutation } from 'api/work-order'
import { CustomRequiredInput, NumberInput } from 'components/input/input'
import AssignedItems from './details/assigned-items'
import round from 'lodash/round'
import {
  useFetchProjectId,
  useAssignLineItems,
  useRemainingLineItems,
  LineItems,
  useAllowLineItemsAssignment,
  mapToLineItems,
  calculateVendorAmount,
  SWOProject,
  createInvoicePdf,
} from './details/assignedItems.utils'
import RemainingItemsModal from './details/remaining-items-modal'
import { useParams } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import { WORK_ORDER } from './workOrder.i18n'
import { isValidAndNonEmpty } from 'utils'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import jsPDF from 'jspdf'
import { useUploadDocument } from 'api/vendor-projects'
import { GoArrowLeft } from 'react-icons/go'

const CalenderCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        <BiCalendar size={23} color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <Text
          whiteSpace="nowrap"
          fontWeight={500}
          fontSize="14px"
          fontStyle="normal"
          color="gray.600"
          mb="1"
          title={t(`${WORK_ORDER}.${props.title}`)}
        >
          {t(`${WORK_ORDER}.${props.title}`)}
        </Text>
        <Text
          data-testid={props?.testId}
          minH="20px"
          whiteSpace="nowrap"
          color="gray.500"
          fontSize="14px"
          fontStyle="normal"
          fontWeight={400}
          title={props.date}
        >
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

const InformationCard = props => {
  return (
    <Flex>
      <Box lineHeight="20px">
        <Text
          whiteSpace="nowrap"
          fontWeight={500}
          fontSize="14px"
          fontStyle="normal"
          color="gray.600"
          mb="1"
          title={t(`${WORK_ORDER}.${props.title}`)}
        >
          {t(`${WORK_ORDER}.${props.title}`)}
        </Text>
        <Text
          minH="20px"
          overflow={'hidden'}
          textOverflow="ellipsis"
          maxW="170px"
          whiteSpace="nowrap"
          color="gray.500"
          fontSize="14px"
          fontStyle="normal"
          fontWeight={400}
          data-testid={props?.testId}
          title={props.date}
        >
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

type NewWorkOrderType = {
  vendorSkillId: number | string | null
  vendorId: number | string | null
  workOrderExpectedCompletionDate: string | Date | null
  workOrderStartDate: string | number | undefined
  invoiceAmount: string | number | null | undefined
  clientApprovedAmount: string | number | null
  percentage: string | number | null
  assignedItems: LineItems[]
  uploadWO: any
  assignToVendor?: boolean
}

export const NewWorkOrder: React.FC<{
  projectData: Project
  isOpen: boolean
  onClose: () => void
  setState?: (v) => void
}> = ({ projectData, isOpen, onClose, setState }) => {
  const { mutate: createWorkOrder, isSuccess, isLoading: isWorkOrderCreating } = useCreateWorkOrderMutation()
  const { swoProject } = useFetchProjectId(projectData?.id)
  const { data: trades } = useTrades()
  const [vendorSkillId, setVendorSkillId] = useState(null)
  const { mutate: saveDocument } = useUploadDocument()
  const { vendors, isLoading: vendorsLoading } = useFilteredVendors({
    vendorSkillId,
    projectId: projectData?.id,
    showExpired: false,
    currentVendorId: 0,
  })
  const toast = useToast()
  const { mutate: assignLineItems } = useAssignLineItems({ swoProjectId: swoProject?.id, refetchLineItems: true })

  const onSubmit = async values => {
    if (values?.assignedItems?.length > 0) {
      const isValid = values?.assignedItems?.every(
        l => isValidAndNonEmpty(l.description) && isValidAndNonEmpty(l.quantity) && isValidAndNonEmpty(l.price),
      )
      if (!isValid) {
        toast({
          title: 'Assigned Items',
          description: t(`${WORK_ORDER}.requiredLineItemsToast`),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        return
      }
      assignLineItems(
        [
          ...values?.assignedItems?.map(a => {
            return { ...a, isAssigned: true, location: a?.location?.value, paymentGroup: a?.paymentGroup?.label }
          }),
        ],
        {
          onSuccess: async () => {
            let clientOriginalApprovedAmount = 0
            values?.assignedItems?.forEach((e: any) => {
              clientOriginalApprovedAmount += e.clientAmount
            })

            const payload = await parseNewWoValuesToPayload(values, projectData.id)
            payload['clientOriginalApprovedAmount'] = clientOriginalApprovedAmount

            createWorkOrder(payload as any, {
              onSuccess: async data => {
                const workOrder = data?.data
                let doc = new jsPDF()

                doc = await createInvoicePdf({
                  doc,
                  workOrder,
                  projectData,
                  assignedItems: values?.assignedItems ?? [],
                  hideAward: false,
                })
                const pdfUri = doc.output('datauristring')
                saveDocument([
                  {
                    documentType: 1036,
                    projectId: projectData.id as number,
                    workOrderId: workOrder.id,
                    fileObject: pdfUri.split(',')[1],
                    fileObjectContentType: 'application/pdf',
                    fileType: 'LineItem.pdf',
                  },
                ])
                setState?.(false)
              },
              onError: async err => {
                console.error('An exception has occurred. Performing rollback on line items, exception:', err)
                assignLineItems([
                  ...values?.assignedItems?.map(a => {
                    return {
                      ...a,
                      isAssigned: false,
                      location: a?.location?.label,
                      paymentGroup: a?.paymentGroup?.label,
                    }
                  }),
                ])
              },
            })
          },
        },
      )
    } else {
      const payload = await parseNewWoValuesToPayload(values, projectData.id)
      createWorkOrder(payload as any)
    }
  }

  return (
    <NewWorkOrderForm
      isWorkOrderCreating={isWorkOrderCreating}
      projectData={projectData}
      isOpen={isOpen}
      onClose={onClose}
      isSuccess={isSuccess}
      onSubmit={onSubmit}
      swoProject={swoProject}
      trades={trades}
      vendors={vendors}
      vendorsLoading={vendorsLoading}
      setVendorSkillId={setVendorSkillId}
      setState={setState}
      vendorSkillId={vendorSkillId as unknown as number}
    />
  )
}

export const NewWorkOrderForm: React.FC<{
  projectData: Project
  isOpen: boolean
  onClose: () => void
  isSuccess: boolean
  onSubmit: (values) => void
  swoProject: SWOProject
  trades: any
  vendors: any
  vendorsLoading?: boolean
  setVendorSkillId: (val) => void
  isWorkOrderCreating
  setState?: (v) => void
  vendorSkillId?: number
}> = props => {
  const {
    projectData,
    onClose,
    isSuccess,
    onSubmit,
    swoProject,
    trades,
    vendors,
    vendorsLoading,
    setVendorSkillId,
    isWorkOrderCreating,
    setState,
    vendorSkillId
  } = props
  const [tradeOptions, setTradeOptions] = useState([])
  const [vendorOptions, setVendorOptions] = useState([])
  const { projectId } = useParams<{ projectId: string }>()
  const { finalSOWAmount, projectTotalCost } = useGetProjectFinancialOverview(projectId)
  const finalSOWAmountNumber = Number(removeCurrencyFormat(finalSOWAmount))
  const projectTotalCostNumber = Number(removeCurrencyFormat(projectTotalCost))

  const balanceSOWAmount = currencyFormatter(finalSOWAmountNumber - Math.abs(projectTotalCostNumber))

  // commenting as requirement yet to be confirmed
  // const [vendorPhone, setVendorPhone] = useState<string | undefined>()
  // const [vendorEmail, setVendorEmail] = useState<string | undefined>()

  const { remainingItems, isLoading, isFetching } = useRemainingLineItems(swoProject?.id)
  const [unassignedItems, setUnAssignedItems] = useState<LineItems[]>(remainingItems)

  const defaultFormValues = () => {
    return {
      vendorSkillId: null,
      vendorId: null,
      workOrderExpectedCompletionDate: null,
      workOrderStartDate: undefined,
      invoiceAmount: 0,
      clientApprovedAmount: 0,
      percentage: 45,
      assignedItems: [],
      uploadWO: null,
      assignToVendor: false,
    }
  }
  // Hook form initialization
  const formReturn = useForm<NewWorkOrderType>({
    defaultValues: defaultFormValues(),
  })
  const { isAdmin } = useUserRolesSelector()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = formReturn
  const formValues = getValues()
  const assignedItemsArray = useFieldArray({
    control,
    name: 'assignedItems',
  })
  const { onPercentageChange, onApprovedAmountChange, onInvoiceAmountChange } = usePercentageAndInoviceChange({
    setValue,
  })
  // const inputRef = useRef<HTMLInputElement | null>(null)
  const { append } = assignedItemsArray
  const { isAssignmentAllowed } = useAllowLineItemsAssignment({ workOrder: null, swoProject })
  const [woStartDate, watchPercentage, watchUploadWO, woExpectedCompletionDate, watchAssignToVendor] = watch([
    'workOrderStartDate',
    'percentage',
    'uploadWO',
    'workOrderExpectedCompletionDate',
    'assignToVendor',
  ])

  const watchLineItems = useWatch({ name: 'assignedItems', control })

  // New WO -> Disable dates between client start date and client end date
  const clientStart = projectData?.clientStartDate
  const clientEnd = projectData?.clientDueDate

  useEffect(() => {
    if (woStartDate! > woExpectedCompletionDate!) {
      setValue('workOrderExpectedCompletionDate', null)
    }
  })

  const isSkillService = isVendorSkillServices(trades, vendorSkillId || 0)

  useEffect(() => {
    if ( isSkillService ) return;
    if (watchPercentage === 0) {
      resetLineItemsProfit(0)
    }
  }, [watchPercentage, isSkillService])

  useEffect(() => {

    if ( isSkillService && watchLineItems?.length > 0 ) {
   
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
     
      setValue('clientApprovedAmount', round(clientAmount, 2))
      setValue('invoiceAmount', round(vendorAmount, 2))
      setValue('percentage', 0)
    } else if (watchLineItems?.length > 0) {
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
      setValue('clientApprovedAmount', round(clientAmount, 2))
      setValue('invoiceAmount', round(vendorAmount, 2))
      setValue('percentage', watchPercentage)
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
  // Remaining Items handles
  const {
    onClose: onCloseRemainingItemsModal,
    isOpen: isOpenRemainingItemsModal,
    onOpen: onOpenRemainingItemsModal,
  } = useDisclosure()

  const setAssignedItems = useCallback(
    items => {
      const selectedIds = items.map(i => i.id)
      const assigned = [
        ...items.map(s => {
          return mapToLineItems(s, watchPercentage)
        }),
      ]
      append(assigned)
      setUnAssignedItems([...unassignedItems.filter(i => !selectedIds.includes(i.id))])
    },
    [unassignedItems, setUnAssignedItems, watchPercentage],
  )

  const { profitMargin } = useGetProjectFinancialOverview(projectId)

  useEffect(() => {
    const tempAssignedItems = formValues?.assignedItems?.filter(a => !a.smartLineItemId)?.map(item => item.id)
    const items = remainingItems?.filter?.(item => !tempAssignedItems?.includes(item.id))
    setUnAssignedItems(items)
  }, [remainingItems])

  useEffect(() => {
    if (isSuccess) {
      reset(defaultFormValues())
      onClose()
    }
  }, [isSuccess, onClose])

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

  /*  commenting as requirement yet to be confirmed 
    
    //   const resetAmounts = () => {
    //     setValue('invoiceAmount', 0)
    //     setValue('clientApprovedAmount', 0)
    //     // asper new implementation, we didnt need  to set percentage 0 on this function anymore now
    //     // setValue('percentage', 0)
    //   }
    /*  commenting as requirement yet to be confirmed 
      useEffect(() => {
        const subscription = watch(values => {
          setVendorPhone(vendors?.find(v => v?.id === values?.vendorId?.value)?.businessPhoneNumber ?? '')
          setVendorEmail(vendors?.find(v => v?.id === values?.vendorId?.value)?.businessEmailAddress ?? '')
        })
        return () => subscription.unsubscribe()
      }, [watchVendorId, vendors]) */

  return (
    <>
      <form
        onSubmit={handleSubmit(values => {
          onSubmit(values)
        })}
      >
        {isWorkOrderCreating && <Progress isIndeterminate colorScheme="blue" aria-label="loading" size="xs" />}
        {swoProject?.status && ['FAILED'].includes(swoProject?.status.toUpperCase()) && (
          <Alert status="info" variant="custom" size="sm">
            <AlertIcon />
            <AlertDescription>{t(`${WORK_ORDER}.swoParsingFailure`)}</AlertDescription>
          </Alert>
        )}
        <HStack>
          <Button
            color={'#345EA6'}
            colorScheme=""
            leftIcon={<GoArrowLeft size={20} />}
            onClick={() => {
              setState?.(false)
              reset(defaultFormValues())
            }}
          >
            {t('back')}
          </Button>

          <Box pl="2" pr="1" display={{ base: 'none', sm: 'unset' }}>
            <Divider borderColor={'gray'} orientation="vertical" h="25px" />
          </Box>
          <Button color={'#718096'} variant="ghost" colorScheme="">
            {t('newWorkOrder')}
          </Button>
        </HStack>
        <Box>
          <SimpleGrid columns={6} spacing={1} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
            <CalenderCard
              title="clientStart"
              testId="clientStart"
              date={projectData?.clientStartDate ? dateFormat(projectData?.clientStartDate) : 'mm/dd/yy'}
            />
            <CalenderCard
              title="clientEnd"
              testId="clientEnd"
              date={projectData?.clientDueDate ? dateFormat(projectData?.clientDueDate) : 'mm/dd/yy'}
            />

            <InformationCard
              title="profitPercentage"
              testId="profitPercentage"
              date={profitMargin ? `${profitMargin}` : '0%'}
            />

            <InformationCard title="finalSowAmount" testId="finalSowAmount" date={finalSOWAmount} />
            <InformationCard title="balanceSOW" testId="balanceSOWAmount" date={balanceSOWAmount} />
            {/*  commenting as requirement yet to be confirmed
                      <InformationCard title=" Email" date={vendorEmail} />
                    <InformationCard title=" Phone No" date={vendorPhone} />*/}
          </SimpleGrid>
          <Box mt={10}>
            <SimpleGrid w="85%" columns={4} spacingX={6} spacingY={12}>
              <Box>
                <FormControl height="40px" isInvalid={!!errors.vendorSkillId} data-testid="vendorSkillId">
                  <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                    {t(`${WORK_ORDER}.type`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    rules={{ required: watchAssignToVendor ? 'This field is required' : undefined }}
                    name="vendorSkillId"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <Select
                            {...field}
                            classNamePrefix={'tradeOptionsVendor'}
                            options={tradeOptions}
                            size="md"
                            value={field.value}
                            onChange={option => {
                              setVendorSkillId(option.value)
                              setValue('vendorId', null)
                              field.onChange(option)
                            }}
                            selectProps={watchAssignToVendor ? { isBorderLeft: true } : null}
                          />
                          {watchAssignToVendor && <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>}
                        </>
                      )
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={!!errors.vendorId} data-testid="vendorId">
                  <FormLabel
                    fontSize="14px"
                    noOfLines={1}
                    fontWeight={500}
                    color="gray.600"
                    title={t(`${WORK_ORDER}.companyName`)}
                  >
                    {t(`${WORK_ORDER}.companyName`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    rules={{ required: watchAssignToVendor ? 'This field is required' : undefined }}
                    name="vendorId"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <Select
                            {...field}
                            classNamePrefix={'vendorOptions'}
                            loadingCheck={vendorsLoading}
                            options={vendorOptions}
                            size="md"
                            selectProps={watchAssignToVendor ? { isBorderLeft: true } : null}
                          />
                          {watchAssignToVendor && <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>}
                        </>
                      )
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={!!errors?.clientApprovedAmount}>
                  <FormLabel
                    noOfLines={1}
                    fontSize="14px"
                    fontWeight={500}
                    color="gray.600"
                    title={t(`${WORK_ORDER}.clientApprovedAmount`)}
                  >
                    {t(`${WORK_ORDER}.clientApprovedAmount`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    rules={{
                      required: 'This field is required',
                      min: { value: 0, message: 'Enter a valid amount' },
                    }}
                    name="clientApprovedAmount"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberInput
                            value={field.value}
                            thousandSeparator
                            data-testid="clientApprovedAmount"
                            customInput={CustomRequiredInput}
                            prefix={'$'}
                            disabled={!watchUploadWO}
                            onValueChange={e => {
                              field.onChange(e.floatValue ?? '')
                              if (!!watchUploadWO) {
                                onApprovedAmountChange(e.floatValue)
                              }
                            }}
                          />
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </>
                      )
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={!!errors?.percentage}>
                  <FormLabel
                    fontSize="14px"
                    noOfLines={1}
                    fontWeight={500}
                    color="gray.600"
                    title={t(`${WORK_ORDER}.profitPercentage`)}
                  >
                    {t(`${WORK_ORDER}.profitPercentage`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    rules={{ required: isSkillService ? false : 'This field is required' }}
                    name="percentage"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberFormat
                            value={field.value}
                            data-testid="percentage"
                            customInput={CustomRequiredInput}
                            suffix={'%'}
                            onValueChange={e => {
                              field.onChange(e.floatValue ?? '')
                              if (!!watchUploadWO) {
                                onPercentageChange(e.floatValue)
                              }
                            }}
                            onFocus={e => {
                              if (removePercentageFormat(e.target.value) === '0') {
                                field.onChange('')
                              }
                            }}
                            onBlur={e => {
                              resetLineItemsProfit(removePercentageFormat(e.target.value))
                            }}
                          />
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </>
                      )
                    }}
                  />
                </FormControl>
              </Box>

              <Box height="80px">
                <FormControl isInvalid={!!errors?.invoiceAmount}>
                  <FormLabel
                    fontSize="14px"
                    fontWeight={500}
                    color="gray.600"
                    noOfLines={1}
                    title={t(`${WORK_ORDER}.vendorWorkOrderAmount`)}
                  >
                    {t(`${WORK_ORDER}.vendorWorkOrderAmount`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    rules={{ required: 'This field is required' }}
                    name="invoiceAmount"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberInput
                            value={field.value}
                            data-testid="vendorWorkOrderAmount"
                            customInput={CustomRequiredInput}
                            thousandSeparator
                            prefix={'$'}
                            disabled={!watchUploadWO}
                            onValueChange={e => {
                              field.onChange(e.floatValue ?? '')
                              if (!!watchUploadWO) {
                                onInvoiceAmountChange(e.floatValue)
                              }
                            }}
                          />
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </>
                      )
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={!!errors?.workOrderStartDate}>
                  <FormLabel
                    noOfLines={1}
                    fontSize="14px"
                    fontWeight={500}
                    color="gray.600"
                    title={t(`${WORK_ORDER}.expectedStartDate`)}
                  >
                    {t(`${WORK_ORDER}.expectedStartDate`)}
                  </FormLabel>
                  <Input
                    id="workOrderStartDate"
                    data-testid="workOrderStartDate"
                    type="date"
                    height="40px"
                    variant={watchAssignToVendor ? 'required-field' : 'outline'}
                    focusBorderColor="none"
                    min={clientStart as any}
                    max={isAdmin ? '' : (clientEnd as any)}
                    {...register('workOrderStartDate', {
                      required: watchAssignToVendor ? 'This field is required.' : undefined,
                      validate: (date: any) => {
                        if (!projectData?.clientStartDate) return false

                        const clientStartDate = new Date(dateFormat(projectData.clientStartDate))

                        const orderStartDate = new Date(dateFormat(date))

                        if (orderStartDate.getTime() === clientStartDate.getTime()) return true

                        if (orderStartDate < clientStartDate) return false

                        return true
                      },
                    })}
                  />
                  {watchAssignToVendor && (
                    <FormErrorMessage>
                      {errors.workOrderStartDate && errors.workOrderStartDate.message}
                      {errors.workOrderStartDate && errors.workOrderStartDate.type === 'validate' && (
                        <span>Earlier then client start date</span>
                      )}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={!!errors?.workOrderExpectedCompletionDate}>
                  <FormLabel
                    fontSize="14px"
                    fontWeight={500}
                    color="gray.600"
                    title={t(`${WORK_ORDER}.expectedCompletionDate`)}
                    noOfLines={1}
                  >
                    {t(`${WORK_ORDER}.expectedCompletionDate`)}
                  </FormLabel>
                  <Input
                    id="workOrderExpectedCompletionDate"
                    type="date"
                    height="40px"
                    data-testid="workOrderExpectedCompletionDate"
                    variant={watchAssignToVendor ? 'required-field' : 'outline'}
                    min={woStartDate || (clientStart as any)}
                    focusBorderColor="none"
                    {...register('workOrderExpectedCompletionDate', {
                      required: watchAssignToVendor ? 'This field is required.' : undefined,
                    })}
                  />
                  {watchAssignToVendor && (
                    <FormErrorMessage>
                      {errors.workOrderExpectedCompletionDate && errors.workOrderExpectedCompletionDate.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
            </SimpleGrid>
            <Box mt={6}>
              <AssignedItems
                onOpenRemainingItemsModal={onOpenRemainingItemsModal}
                unassignedItems={unassignedItems}
                setUnAssignedItems={setUnAssignedItems}
                formControl={formReturn as UseFormReturn<any>}
                assignedItemsArray={assignedItemsArray}
                isAssignmentAllowed={isAssignmentAllowed}
                swoProject={swoProject}
                workOrder={null}
                documentsData={null}
                clientName={projectData?.clientName}
                isServiceSkill={isSkillService}
              />
            </Box>
          </Box>
        </Box>

        <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
          {/* commenting it for now as requrment is to hide upload WO */}

          {/* <HStack justifyContent="start" w="100%">
              <Controller
                name="uploadWO"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <VStack alignItems="baseline">
                      <input
                        data-testid="uploadWO"
                        type="file"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target?.files?.[0]
                          if (file) {
                            if (formValues.assignedItems?.length > 0) {
                              setUnAssignedItems([...formValues.assignedItems, ...unassignedItems])
                            }
                            setValue('assignedItems', [])
                            // setValue('percentage', 0)
                            field.onChange(file)
                          } else {
                            field.onChange(null)
                          }
                        }}
                        accept="application/pdf, image/png, image/jpg, image/jpeg"
                      />
                      {formValues.uploadWO ? (
                        <Box color="barColor.100" border="1px solid #345EA6" borderRadius="4px" fontSize="14px">
                          <HStack spacing="5px" h="38px" padding="10px" align="center">
                            <Text
                              color="#345EA6"
                              as="span"
                              maxW="120px"
                              data-testid="uploadedSOW"
                              isTruncated
                              title={formValues.uploadWO?.name || formValues.uploadWO?.fileType}
                            >
                              {formValues.uploadWO?.name || formValues.uploadWO?.fileType}
                            </Text>
                            <MdOutlineCancel
                              color="#345EA6"
                              cursor="pointer"
                              data-testid="removeSOW"
                              onClick={() => {
                                setValue('uploadWO', null)
                                resetAmounts()
                                if (inputRef.current) inputRef.current.value = ''
                              }}
                            />
                          </HStack>
                        </Box>
                      ) : (
                        <Button
                          onClick={e => {
                            if (inputRef.current) {
                              inputRef.current.click()
                            }
                          }}
                          leftIcon={<BiUpload />}
                          variant="outline"
                          size="md"
                          colorScheme="brand"
                        >
                          {t(`${WORK_ORDER}.uploadWO`)}
                        </Button>
                      )}
                    </VStack>
                  )
                }}
              />
            </HStack> */}
          <HStack spacing="16px">
            <Button
              type="submit"
              data-testid="saveWorkOrder"
              colorScheme="brand"
              disabled={!(getValues()?.assignedItems?.length > 0 || !!watchUploadWO) || isWorkOrderCreating}
            >
              {t(`${WORK_ORDER}.save`)}
            </Button>
          </HStack>
        </ModalFooter>
      </form>
      {isOpenRemainingItemsModal && (
        <RemainingItemsModal
          isAssignmentAllowed={isAssignmentAllowed}
          isOpen={isOpenRemainingItemsModal}
          onClose={onCloseRemainingItemsModal}
          setAssignedItems={setAssignedItems}
          remainingItems={unassignedItems}
          isLoading={isLoading || isFetching}
          swoProject={swoProject}
        />
      )}
    </>
  )
}

export default NewWorkOrder
