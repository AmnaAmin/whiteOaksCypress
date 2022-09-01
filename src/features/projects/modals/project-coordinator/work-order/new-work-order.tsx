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
} from '@chakra-ui/react'
import Select from 'components/form/react-select'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { BiCalendar } from 'react-icons/bi'
import { Project } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'
import { useFilteredVendors } from 'utils/pc-projects'
import { currencyFormatter } from 'utils/stringFormatters'
import { useTrades } from 'utils/vendor-details'
import { parseNewWoValuesToPayload, useCreateWorkOrderMutation } from 'utils/work-order'
import NumberFormat from 'react-number-format'
import { CustomRequiredInput } from 'components/input/input'
import round from 'lodash/round'
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
  const [approvedAmount, setApprovedAmount] = useState<number | null>()
  const [percentageField, setPercentageField] = useState<number | null>()
  const [, setInvoiceAmount] = useState(0)

  // commenting as requirement yet to be confirmed
  // const [vendorPhone, setVendorPhone] = useState<string | undefined>()
  // const [vendorEmail, setVendorEmail] = useState<string | undefined>()
  const { mutate: createWorkOrder, isSuccess } = useCreateWorkOrderMutation()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm()
  const woStartDate = useWatch({ name: 'workOrderStartDate', control })

  const onSubmit = values => {
    const payload = parseNewWoValuesToPayload(values, projectData.id)
    createWorkOrder(payload as any)
  }

  useEffect(() => {
    if (isSuccess) {
      reset()
      onClose()
    }
  }, [isSuccess, onClose])

  const updatePercentageAndApprovedAmount = (approvedAmount, percentageField) => {
    if (approvedAmount && percentageField) {
      const amount = approvedAmount
      const percentage = percentageField
      const vendorWoAmountResult = amount - amount * (percentage / 100)
      setValue('invoiceAmount', vendorWoAmountResult.toFixed(2))
    } else if (approvedAmount === 0) {
      setValue('invoiceAmount', 0)
    } else if (approvedAmount && percentageField === 0) {
      setValue('invoiceAmount', approvedAmount.toFixed(2))
    } else {
      setValue('invoiceAmount', '')
    }
  }

  const onPercentageChange = percentageField => {
    setPercentageField(percentageField)
    updatePercentageAndApprovedAmount(approvedAmount, percentageField)
  }

  const onApprovedAmountChange = approvedAmount => {
    setApprovedAmount(approvedAmount)
    updatePercentageAndApprovedAmount(approvedAmount, percentageField)
  }

  const onInoviceAmountChange = invoiceAmount => {
    setInvoiceAmount(invoiceAmount)
    const approve = parseInt(`${approvedAmount}`, 10)
    const percentageField = round(((approve - invoiceAmount) * 100) / approve, 2)
    setPercentageField(percentageField)
    setValue('percentage', percentageField)
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

  /* useEffect(() => {
    const subscription = watch(values => {
      setVendorPhone(vendors?.find(v => v?.id === values?.vendorId?.value)?.businessPhoneNumber ?? '')
      setVendorEmail(vendors?.find(v => v?.id === values?.vendorId?.value)?.businessEmailAddress ?? '')
    })
    return () => subscription.unsubscribe()
  }, [watchVendorId, vendors]) */

  return (
    <Modal
      size="none"
      isOpen={isOpen}
      onClose={() => {
        onClose()
        reset()
      }}
    >
      <ModalOverlay />
      <form
        onSubmit={handleSubmit(values => {
          onSubmit(values)
        })}
      >
        <ModalContent w="1137px" rounded={3} borderTop="2px solid #4E87F8">
          <ModalHeader h="63px" borderBottom="1px solid #CBD5E0" color="gray.600" fontSize={16} fontWeight={500}>
            {t('newWorkOrder')}
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />

          <ModalBody justifyContent="center">
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
                <InformationCard title="Profit Percentage" date={`${projectData?.profitPercentage}%`} />

                <InformationCard title=" Final SOW Amount" date={currencyFormatter(projectData?.revenue as number)} />
                {/*<InformationCard title=" Email" date={vendorEmail} />
                <InformationCard title=" Phone No" date={vendorPhone} />*/}
              </SimpleGrid>
              <Box mt={10}>
                <SimpleGrid w="85%" columns={4} spacingX={6} spacingY={12}>
                  <Box>
                    <FormControl height="40px" isInvalid={errors.vendorSkillId}>
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
                    <FormControl isInvalid={errors.vendorSkillId}>
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
                    <FormControl isInvalid={errors?.clientApprovedAmount}>
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
                    <FormControl isInvalid={errors?.percentage}>
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
                                  field.onChange(e.floatValue)
                                  onPercentageChange(e.floatValue)
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
                    <FormControl isInvalid={errors?.invoiceAmount}>
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
                                onValueChange={e => {
                                  field.onChange(e.floatValue)
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
                    <FormControl isInvalid={errors?.workOrderStartDate}>
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
                    <FormControl isInvalid={errors?.workOrderExpectedCompletionDate}>
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
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
            <HStack spacing="16px">
              <Button
                onClick={() => {
                  onClose()
                  reset()
                }}
                colorScheme="brand"
                variant="outline"
              >
                {t('cancel')}
              </Button>
              <Button type="submit" colorScheme="brand">
                {t('save')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  )
}

export default NewWorkOrder
