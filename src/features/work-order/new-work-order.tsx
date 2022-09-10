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
} from '@chakra-ui/react'
import Select from 'components/form/react-select'
import { t } from 'i18next'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { BiCalendar } from 'react-icons/bi'
import { Project } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'
import { useFilteredVendors, usePercentageCalculation } from 'api/pc-projects'
import { currencyFormatter } from 'utils/string-formatters'
import { useTrades } from 'api/vendor-details'
import { parseNewWoValuesToPayload, useCreateWorkOrderMutation } from 'api/work-order'
import NumberFormat from 'react-number-format'
import { CustomRequiredInput } from 'components/input/input'
import AssignedItems from './details/assigned-items'
import {
  useFetchProjectId,
  useAssignLineItems,
  useRemainingLineItems,
  LineItems,
  useAllowLineItemsAssignment,
  mapToLineItems,
} from './details/assignedItems.utils'
import RemainingItemsModal from './details/remaining-items-modal'

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
          {props.title}
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
      percentage: null,
      assignedItems: [],
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
    formState: { errors },
  } = formReturn

  const assignedItemsArray = useFieldArray({
    control,
    name: 'assignedItems',
  })

  const { append } = assignedItemsArray
  const { isAssignmentAllowed } = useAllowLineItemsAssignment({ workOrder: null, swoProject })
  const woStartDate = useWatch({ name: 'workOrderStartDate', control })
  const watchClientApprovedAmount = useWatch({ name: 'clientApprovedAmount', control })
  const watchInvoiceAmount = useWatch({ name: 'invoiceAmount', control })
  const watchLineItems = useWatch({ name: 'assignedItems', control })

  const { percentage } = usePercentageCalculation({
    clientApprovedAmount: watchClientApprovedAmount,
    vendorWOAmount: watchInvoiceAmount,
  })

  useEffect(() => {
    if (percentage) {
      setValue('percentage', percentage)
    }
  }, [percentage])

  useEffect(() => {
    const vendorWOAmount = getValues().assignedItems?.reduce(
      (partialSum, a) => partialSum + Number(a?.price ?? 0) * Number(a?.quantity ?? 0),
      0,
    )
    setValue('invoiceAmount', vendorWOAmount)
  }, [watchLineItems])
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
          return mapToLineItems(s)
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

  useEffect(() => {
    if (isSuccess) {
      reset(defaultFormValues())
      onClose()
    }
  }, [isSuccess, onClose])

  const onSubmit = values => {
    if (values?.assignedItems?.length > 0) {
      assignLineItems(
        [
          ...values?.assignedItems?.map(a => {
            return { ...a, isAssigned: true }
          }),
        ],
        {
          onSuccess: () => {
            const payload = parseNewWoValuesToPayload(values, projectData.id)
            createWorkOrder(payload as any)
          },
        },
      )
    } else {
      const payload = parseNewWoValuesToPayload(values, projectData.id)
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
      size="6xl"
      variant="custom"
    >
      <ModalOverlay />
      <form
        onSubmit={handleSubmit(values => {
          onSubmit(values)
        })}
      >
        <ModalContent h="600px" overflow={'auto'}>
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
                <InformationCard
                  title="Profit Percentage"
                  date={projectData?.profitPercentage ? `${projectData?.profitPercentage}%` : '0%'}
                />

                <InformationCard title=" Final SOW Amount" date={currencyFormatter(projectData?.revenue as number)} />
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
                                onValueChange={e => {
                                  field.onChange(e.floatValue)
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
                                disabled
                                customInput={CustomRequiredInput}
                                suffix={'%'}
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
                                disabled
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
              <Button type="submit" colorScheme="brand" disabled={getValues()?.assignedItems?.length < 1}>
                {t('save')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </form>

      <RemainingItemsModal
        isAssignmentAllowed={isAssignmentAllowed}
        isOpen={isOpenRemainingItemsModal}
        onClose={onCloseRemainingItemsModal}
        setAssignedItems={setAssignedItems}
        remainingItems={unassignedItems}
        isLoading={isLoading}
        swoProject={swoProject}
      />
    </Modal>
  )
}

export default NewWorkOrder
