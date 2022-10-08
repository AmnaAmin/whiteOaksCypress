import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useGetProjectFinancialOverview } from 'api/projects'
import Select from 'components/form/react-select'
import { t } from 'i18next'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { BiCalendar, BiUpload } from 'react-icons/bi'
import { Project } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'
import { useFilteredVendors, usePercentageAndInoviceChange } from 'api/pc-projects'
import { removePercentageFormat } from 'utils/string-formatters'
import { useTrades } from 'api/vendor-details'
import { parseNewWoValuesToPayload, useCreateWorkOrderMutation } from 'api/work-order'
import NumberFormat from 'react-number-format'
import { CustomRequiredInput } from 'components/input/input'
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
} from './details/assignedItems.utils'
import RemainingItemsModal from './details/remaining-items-modal'
import { useParams } from 'react-router-dom'
import { WORK_ORDER } from './workOrder.i18n'
import { MdOutlineCancel } from 'react-icons/md'

const CalenderCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        <BiCalendar size={23} color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <Text whiteSpace="nowrap" fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text minH="20px" whiteSpace="nowrap" color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
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
        <Text whiteSpace="nowrap" fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {t(props.title)}
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
}
const isValidAndNonEmpty = item => {
  return item !== null && item !== undefined && item?.trim() !== ''
}

const NewWorkOrder: React.FC<{
  projectData: Project
  isOpen: boolean
  onClose: () => void
}> = ({ projectData, isOpen, onClose }) => {
  const { data: trades } = useTrades()
  const [vendorSkillId, setVendorSkillId] = useState(null)
  const { vendors } = useFilteredVendors(vendorSkillId)
  const [tradeOptions, setTradeOptions] = useState([])
  const [vendorOptions, setVendorOptions] = useState([])
  const { projectId } = useParams<{ projectId: string }>()
  const { finalSOWAmount } = useGetProjectFinancialOverview(projectId)

  // commenting as requirement yet to be confirmed
  // const [vendorPhone, setVendorPhone] = useState<string | undefined>()
  // const [vendorEmail, setVendorEmail] = useState<string | undefined>()
  const { mutate: createWorkOrder, isSuccess } = useCreateWorkOrderMutation()
  const { swoProject } = useFetchProjectId(projectData?.id)
  const { mutate: assignLineItems } = useAssignLineItems({ swoProjectId: swoProject?.id, refetchLineItems: true })
  const { remainingItems, isLoading } = useRemainingLineItems(swoProject?.id)
  const [unassignedItems, setUnAssignedItems] = useState<LineItems[]>(remainingItems)

  const defaultFormValues = () => {
    return {
      vendorSkillId: null,
      vendorId: null,
      workOrderExpectedCompletionDate: null,
      workOrderStartsDate: undefined,
      invoiceAmount: null,
      clientApprovedAmount: null,
      percentage: 0,
      assignedItems: [],
      uploadWO: null,
    }
  }
  // Hook form initialization
  const formReturn = useForm<NewWorkOrderType>({
    defaultValues: defaultFormValues(),
  })

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
  const { onPercentageChange, onApprovedAmountChange, onInoviceAmountChange } = usePercentageAndInoviceChange({
    setValue,
  })
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { append } = assignedItemsArray
  const { isAssignmentAllowed } = useAllowLineItemsAssignment({ workOrder: null, swoProject })
  const toast = useToast()
  const [woStartDate, watchPercentage, watchUploadWO] = watch(['workOrderStartDate', 'percentage', 'uploadWO'])
  const watchLineItems = useWatch({ name: 'assignedItems', control })

  useEffect(() => {
    if (watchPercentage === 0) {
      resetLineItemsProfit(0)
    }
  }, [watchPercentage])

  useEffect(() => {
    const clientAmount = formValues.assignedItems?.reduce(
      (partialSum, a) => partialSum + Number(a?.price ?? 0) * Number(a?.quantity ?? 0),
      0,
    )
    const vendorAmount = formValues.assignedItems?.reduce(
      (partialSum, a) => partialSum + Number(a?.vendorAmount ?? 0),
      0,
    )
    setValue('clientApprovedAmount', round(clientAmount, 2))
    setValue('invoiceAmount', round(vendorAmount, 2))
  }, [watchLineItems])

  const resetLineItemsProfit = profit => {
    formValues?.assignedItems?.forEach((item, index) => {
      const clientAmount =
        Number(formValues.assignedItems?.[index]?.price ?? 0) * Number(formValues.assignedItems?.[index]?.quantity ?? 0)
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
            return { ...a, isAssigned: true }
          }),
        ],
        {
          onSuccess: async () => {
            const payload = await parseNewWoValuesToPayload(values, projectData.id)
            createWorkOrder(payload as any)
          },
        },
      )
    } else {
      const payload = await parseNewWoValuesToPayload(values, projectData.id)
      createWorkOrder(payload as any)
    }
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

  const resetAmounts = () => {
    setValue('invoiceAmount', 0)
    setValue('clientApprovedAmount', 0)
    setValue('percentage', 0)
  }

  /*  commenting as requirement yet to be confirmed 
  useEffect(() => {
    const subscription = watch(values => {
      setVendorPhone(vendors?.find(v => v?.id === values?.vendorId?.value)?.businessPhoneNumber ?? '')
      setVendorEmail(vendors?.find(v => v?.id === values?.vendorId?.value)?.businessEmailAddress ?? '')
    })
    return () => subscription.unsubscribe()
  }, [watchVendorId, vendors]) */

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset(defaultFormValues())
        onClose()
      }}
      size="flexible"
      variant="custom"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <form
        onSubmit={handleSubmit(values => {
          onSubmit(values)
        })}
      >
        <ModalContent h="calc(100vh - 100px)" overflow={'auto'}>
          <ModalHeader>{t('newWorkOrder')}</ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />

          <ModalBody overflow={'auto'} justifyContent="center">
            <Box>
              <SimpleGrid columns={6} spacing={1} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
                <CalenderCard
                  title="Client Start"
                  date={projectData?.clientStartDate ? dateFormat(projectData?.clientStartDate) : 'mm/dd/yy'}
                />
                <CalenderCard
                  title="Client End "
                  date={projectData?.clientDueDate ? dateFormat(projectData?.clientDueDate) : 'mm/dd/yy'}
                />

                <InformationCard title="profitPercentage" date={profitMargin ? `${profitMargin}` : '0%'} />

                <InformationCard title="finalSowAmount" date={finalSOWAmount} />
                {/*  commenting as requirement yet to be confirmed
                  <InformationCard title=" Email" date={vendorEmail} />
                <InformationCard title=" Phone No" date={vendorPhone} />*/}
              </SimpleGrid>
              <Box mt={10}>
                <SimpleGrid w="85%" columns={4} spacingX={6} spacingY={12}>
                  <Box>
                    <FormControl height="40px" isInvalid={!!errors.vendorSkillId}>
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
                                selectProps={{ isBorderLeft: true }}
                              />
                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </>
                          )
                        }}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl isInvalid={!!errors.vendorSkillId}>
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
                                selectProps={{ isBorderLeft: true }}
                              />
                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </>
                          )
                        }}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl isInvalid={!!errors?.clientApprovedAmount}>
                      <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                        {t('clientApprovedAmount')}
                      </FormLabel>
                      <Controller
                        control={control}
                        rules={{ required: 'This is required' }}
                        name="clientApprovedAmount"
                        render={({ field, fieldState }) => {
                          return (
                            <>
                              <NumberFormat
                                value={field.value}
                                thousandSeparator
                                customInput={CustomRequiredInput}
                                prefix={'$'}
                                disabled={!watchUploadWO}
                                onValueChange={e => {
                                  field.onChange(e.floatValue ?? '')
                                  onApprovedAmountChange(e.floatValue)
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
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        {t('profitPercentage')}
                      </FormLabel>
                      <Controller
                        control={control}
                        rules={{ required: 'This is required' }}
                        name="percentage"
                        render={({ field, fieldState }) => {
                          return (
                            <>
                              <NumberFormat
                                value={field.value}
                                customInput={CustomRequiredInput}
                                suffix={'%'}
                                onValueChange={e => {
                                  field.onChange(e.floatValue ?? '')
                                  onPercentageChange(e.floatValue)
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
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        {t('vendorWorkOrderAmount')}
                      </FormLabel>
                      <Controller
                        control={control}
                        rules={{ required: 'This is required' }}
                        name="invoiceAmount"
                        render={({ field, fieldState }) => {
                          return (
                            <>
                              <NumberFormat
                                value={field.value}
                                customInput={CustomRequiredInput}
                                thousandSeparator
                                prefix={'$'}
                                disabled={!watchUploadWO}
                                onValueChange={e => {
                                  field.onChange(e.floatValue ?? '')
                                  onInoviceAmountChange(e.floatValue)
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
                      <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                        {t('expectedStartDate')}
                      </FormLabel>
                      <Input
                        id="workOrderStartDate"
                        type="date"
                        height="40px"
                        borderLeft="2px solid #4E87F8"
                        focusBorderColor="none"
                        {...register('workOrderStartDate', {
                          required: 'This field is required.',
                        })}
                      />
                      <FormErrorMessage>
                        {errors.workOrderStartDate && errors.workOrderStartDate.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl isInvalid={!!errors?.workOrderExpectedCompletionDate}>
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        {t('expectedCompletionDate')}
                      </FormLabel>
                      <Input
                        id="workOrderExpectedCompletionDate"
                        type="date"
                        height="40px"
                        borderLeft="2px solid #4E87F8"
                        min={woStartDate}
                        focusBorderColor="none"
                        {...register('workOrderExpectedCompletionDate', {
                          required: 'This field is required.',
                        })}
                      />
                      <FormErrorMessage>
                        {errors.workOrderExpectedCompletionDate && errors.workOrderExpectedCompletionDate.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                </SimpleGrid>
                <AssignedItems
                  onOpenRemainingItemsModal={onOpenRemainingItemsModal}
                  unassignedItems={unassignedItems}
                  setUnAssignedItems={setUnAssignedItems}
                  formControl={formReturn as UseFormReturn<any>}
                  assignedItemsArray={assignedItemsArray}
                  isAssignmentAllowed={isAssignmentAllowed}
                  swoProject={swoProject}
                  workOrder={null}
                />
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
            <HStack justifyContent="start" w="100%">
              <Controller
                name="uploadWO"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <VStack alignItems="baseline">
                      <input
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
                            setValue('percentage', 0)
                            field.onChange(file)
                          } else {
                            field.onChange(null)
                          }
                        }}
                        accept="application/pdf, image/png, image/jpg, image/jpeg"
                      />
                      {formValues.uploadWO ? (
                        <Box color="barColor.100" border="1px solid #4E87F8" borderRadius="4px" fontSize="14px">
                          <HStack spacing="5px" h="38px" padding="10px" align="center">
                            <Text
                              as="span"
                              maxW="120px"
                              isTruncated
                              title={formValues.uploadWO?.name || formValues.uploadWO?.fileType}
                            >
                              {formValues.uploadWO?.name || formValues.uploadWO?.fileType}
                            </Text>
                            <MdOutlineCancel
                              cursor="pointer"
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
            </HStack>
            <HStack spacing="16px">
              <Button
                onClick={() => {
                  reset(defaultFormValues())
                  onClose()
                }}
                colorScheme="brand"
                variant="outline"
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                colorScheme="brand"
                disabled={!(getValues()?.assignedItems?.length > 0 || !!watchUploadWO)}
              >
                {t('save')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </form>
      {isOpenRemainingItemsModal && (
        <RemainingItemsModal
          isAssignmentAllowed={isAssignmentAllowed}
          isOpen={isOpenRemainingItemsModal}
          onClose={onCloseRemainingItemsModal}
          setAssignedItems={setAssignedItems}
          remainingItems={unassignedItems}
          isLoading={isLoading}
          swoProject={swoProject}
        />
      )}
    </Modal>
  )
}

export default NewWorkOrder
