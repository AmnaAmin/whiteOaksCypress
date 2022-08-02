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
import { Controller, useForm } from 'react-hook-form'
import { BiCalendar } from 'react-icons/bi'
import { ProjectType } from 'types/project.type'
import { dateFormatter } from 'utils/date-time-utils'
import { useFilteredVendors } from 'utils/pc-projects'
import { currencyFormatter, removeCurrencyFormat, removePercentageFormat } from 'utils/stringFormatters'
import { useTrades } from 'utils/vendor-details'
import { useDocuments } from 'utils/vendor-projects'
import { parseNewWoValuesToPayload, useCreateWorkOrderMutation } from 'utils/work-order'

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
  projectData: ProjectType
  isOpen: boolean
  onClose: () => void
}> = ({ projectData, isOpen, onClose }) => {
  const { data: trades } = useTrades()
  const [vendorSkillId, setVendorSkillId] = useState(null)
  const { vendors } = useFilteredVendors(vendorSkillId)
  const { documents = [] } = useDocuments({
    projectId: projectData?.id,
  })

  const [tradeOptions, setTradeOptions] = useState([])
  const [vendorOptions, setVendorOptions] = useState([])
  const [approvedAmount, setApprovedAmount] = useState<number | null>()
  const [percentageField, setPercentageField] = useState<number | null>()
  const [vendorPhone, setVendorPhone] = useState<string | undefined>()
  const [vendorEmail, setVendorEmail] = useState<string | undefined>()
  const { mutate: createWorkOrder, isSuccess } = useCreateWorkOrderMutation()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm()

  const watchVendorId = watch('vendorId')

  const onSubmit = values => {
    const payload = parseNewWoValuesToPayload(values, documents, projectData.id)
    createWorkOrder(payload as any)
  }

  useEffect(() => {
    if (isSuccess) {
      reset()
      onClose()
    }
  }, [isSuccess, onClose])

  useEffect(() => {
    if (approvedAmount === 0 && percentageField === 0) {
      setValue('invoiceAmount', 0)
    }

    if (approvedAmount && approvedAmount !== 0 && percentageField && percentageField !== 0) {
      const approvedAmountWithoutCurrency = removeCurrencyFormat((approvedAmount as number)?.toString())
      const approvedAmountInt = approvedAmountWithoutCurrency
      const percentageWithoutCurrency = removePercentageFormat((percentageField as number)?.toString())
      const percentageInt = percentageWithoutCurrency
      const vendorWoAmountResult = approvedAmountInt - approvedAmountInt * (percentageInt / 100)
      setValue('invoiceAmount', parseFloat(vendorWoAmountResult.toFixed(2)))
    }
  }, [approvedAmount, percentageField])

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

  useEffect(() => {
    const subscription = watch(values => {
      setVendorPhone(vendors?.find(v => v?.id === values?.vendorId?.value)?.businessPhoneNumber ?? '')
      setVendorEmail(vendors?.find(v => v?.id === values?.vendorId?.value)?.businessEmailAddress ?? '')
    })
    return () => subscription.unsubscribe()
  }, [watchVendorId, vendors])

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
                <CalenderCard title="Client Start" date={dateFormatter(projectData?.clientStartDate)} />
                <CalenderCard title="Client End " date={dateFormatter(projectData?.clientDueDate)} />
                <InformationCard title="Profit Percentage" date={`${projectData?.profitPercentage}%`} />
                <InformationCard title=" Final SOW Amount" date={currencyFormatter(projectData?.revenue)} />
                <InformationCard title=" Email" date={vendorEmail} />
                <InformationCard title=" Phone No" date={vendorPhone} />
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
                      <Input
                        id="clientApprovedAmount"
                        placeholder="$0.00"
                        height="40px"
                        borderLeft="2px solid #4E87F8"
                        focusBorderColor="none"
                        {...register('clientApprovedAmount', {
                          required: 'This field is required.',
                        })}
                        onChange={e => {
                          setApprovedAmount(e.target.value ? parseFloat(e.target.value) : 0)
                        }}
                      />
                      <FormErrorMessage>
                        {errors.clientApprovedAmount && errors.clientApprovedAmount.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl isInvalid={errors?.percentage}>
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        {t('profitPercentage')}
                      </FormLabel>
                      <Input
                        id="percentage"
                        placeholder="0%"
                        height="40px"
                        borderLeft="2px solid #4E87F8"
                        focusBorderColor="none"
                        {...register('percentage', {
                          required: 'This field is required.',
                        })}
                        onChange={e => {
                          setPercentageField(e.target.value ? parseFloat(e.target.value) : 0)
                        }}
                      />
                      <FormErrorMessage>{errors.percentage && errors.percentage.message}</FormErrorMessage>
                    </FormControl>
                  </Box>

                  <Box height="80px">
                    <FormControl isInvalid={errors?.invoiceAmount}>
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        {t('vendorWorkOrderAmount')}
                      </FormLabel>
                      <Input
                        id="invoiceAmount"
                        placeholder="$0.00"
                        height="40px"
                        borderLeft="2px solid #4E87F8"
                        focusBorderColor="none"
                        {...register('invoiceAmount', {
                          required: 'This field is required.',
                        })}
                      />
                      <FormErrorMessage>{errors.invoiceAmount && errors.invoiceAmount.message}</FormErrorMessage>
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

          <ModalFooter>
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
