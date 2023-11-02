import React, { useCallback, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/toast'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ReadOnlyInput } from 'components/input-view/input-view'
import { BiAddToQueue, BiCalendar, BiDetail, BiDownload, BiFile } from 'react-icons/bi'
import { TRANSACTION } from '../project-details/transactions/transactions.i18n'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { INVOICE_STATUS_OPTIONS, InvoicingType } from 'types/invoice.types'
import { useAccountData } from 'api/user-account'
import ReactSelect from 'components/form/react-select'
import { SelectOption } from 'types/transaction.type'
import { addDays } from 'date-fns'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { FinalSowLineItems } from './final-sow-line-items'
import {
  createInvoicePdf,
  mapFormValuesToPayload,
  useCreateInvoiceMutation,
  useTotalAmount,
  useUpdateInvoiceMutation,
  invoiceDefaultValues,
} from 'api/invoicing'
import { ReceivedLineItems } from './received-line-items'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { ADV_PERMISSIONS } from 'api/access-control'
import jsPDF from 'jspdf'
import { downloadFile } from 'utils/file-utils'
import { Project } from 'types/project.type'
import { currencyFormatter } from 'utils/string-formatters'
import { MdOutlineCancel } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import { ConfirmationBox } from 'components/Confirmation'

const InvoicingReadOnlyInfo: React.FC<any> = ({ invoice, account }) => {
  const { t } = useTranslation()
  const createdBy = invoice?.createdBy ?? account?.email
  const modifiedBy = invoice?.modifiedBy
  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(100px,1fr))"
      gap={{ base: '1rem 20px', sm: '3.5rem' }}
      borderBottom="1px solid #E2E8F0"
      borderColor="gray.200"
      py="5"
    >
      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.dateCreated`)}
          name={'dateCreated'}
          value={dateFormat(invoice?.createdDate ?? new Date()) as string}
          Icon={BiCalendar}
        />
      </GridItem>

      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.dateModified`)}
          name={'dateModified'}
          value={invoice?.modifiedDate ? (dateFormat(invoice?.modifiedDate) as string) : '---'}
          Icon={BiCalendar}
        />
      </GridItem>
      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.createdBy`)}
          name="createdBy"
          value={(createdBy as string) || '---'}
          Icon={BiDetail}
        />
      </GridItem>

      <GridItem>
        <ReadOnlyInput
          label={t(`${TRANSACTION}.modifiedBy`)}
          name={'modifiedBy'}
          value={(modifiedBy as string) || '----'}
          Icon={BiDetail}
        />
      </GridItem>
    </Grid>
  )
}

const InvoicingSummary: React.FC<any> = ({ projectData, received, invoiced, sowAmount }) => {
  const { t } = useTranslation()
  const remainingAR = (sowAmount ?? projectData?.sowNewAmount) - received
  return (
    <Box>
      <Grid
        gridTemplateColumns={'1fr 1fr'}
        fontSize="14px"
        color="gray.600"
        borderWidth="0px 1px 1px  1px"
        borderStyle="solid"
        borderColor="gray.300"
        bg="white"
        roundedBottom={6}
      >
        <GridItem borderWidth="0 1px 0 0" borderStyle="solid" borderColor="gray.300" py="4" height="auto"></GridItem>
        <GridItem py={'3'} data-testid="total-amount" height={'auto'}>
          <Flex direction={'row'} justifyContent={'space-between'} pl="30px" pr="30px">
            <Text fontWeight={600} color="gray.600">
              {t('project.projectDetails.sowAmount')}
              {':'}
            </Text>
            <Text ml={'10px'}>{currencyFormatter(sowAmount ?? (projectData?.sowNewAmount?.toString() as string))}</Text>
          </Flex>
          <Flex direction={'row'} justifyContent={'space-between'} pl="30px" pr="30px" mt="10px">
            <Text fontWeight={600} color="gray.600">
              {t('project.projectDetails.amountReceived')}
              {':'}
            </Text>
            <Text ml={'10px'}>{currencyFormatter(received)}</Text>
          </Flex>
          <Flex direction={'row'} justifyContent={'space-between'} pl="30px" pr="30px" mt="10px">
            <Text fontWeight={600} color="gray.600">
              {t('project.projectDetails.remainingAR')}
              {':'}
            </Text>
            <Text ml={'10px'}>{currencyFormatter(remainingAR)}</Text>
          </Flex>
          <Flex
            direction={'row'}
            justifyContent={'space-between'}
            pl="30px"
            pr="30px"
            mt="10px"
            borderTop="1px solid #CBD5E0"
            pt="10px"
          >
            <Text fontWeight={600} color="gray.600">
              {t('project.projectDetails.invoiceAmount')}
              {':'}
            </Text>
            <Text ml={'10px'}>{currencyFormatter(invoiced)}</Text>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  )
}

export type InvoicingFormProps = {
  invoice?: InvoicingType | undefined
  onClose?: () => void
  clientSelected?: SelectOption | undefined | null
  invoiceCount?: number
  projectData?: Project | undefined
  transactions?: any[]
}

export const InvoiceForm: React.FC<InvoicingFormProps> = ({
  invoice,
  onClose,
  clientSelected,
  projectData,
  invoiceCount,
  transactions,
}) => {
  const { t } = useTranslation()
  const { mutate: createInvoiceMutate, isLoading: isLoadingCreate } = useCreateInvoiceMutation({
    projId: projectData?.id,
  })
  const { mutate: updateInvoiceMutate, isLoading: isLoadingUpdate } = useUpdateInvoiceMutation({
    projId: projectData?.id,
  })

  const { data } = useAccountData()
  const [tabIndex, setTabIndex] = React.useState(0)
  const invoicePdfUrl = invoice?.documents?.find(doc => doc.documentType === 42)?.s3Url
  const attachment = invoice?.documents?.find(doc => doc.documentType === 1029)

  const formReturn = useForm<InvoicingType>()

  useEffect(() => {
    formReturn.reset({
      ...invoiceDefaultValues({ invoice, invoiceCount, projectData, clientSelected, transactions }),
    })
  }, [invoice, transactions?.length])
  const {
    formState: { errors },
    control,
    getValues,
    register,
    setValue,
    watch,
  } = formReturn

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'finalSowLineItems',
  })
  const watchInvoiceArray = watch('finalSowLineItems')
  const watchReceivedArray = watch('receivedLineItems')

  const watchStatus = watch('status')
  const watchAttachments = watch('attachments')

  const toast = useToast()
  const { invoiced, received } = useTotalAmount({
    invoiced: watchInvoiceArray,
    received: watchReceivedArray,
  })
  const remainingAR = projectData?.sowNewAmount! - received
  const isPaid = (invoice?.status as string)?.toUpperCase() === 'PAID'
  const { permissions } = useRoleBasedPermissions()
  const isInvoicedEnabled = permissions.some(p => [ADV_PERMISSIONS.invoiceDateEdit, 'ALL'].includes(p))
  const {
    isOpen: isDeleteConfirmationModalOpen,
    onClose: onDeleteConfirmationModalClose,
    onOpen: onDeleteConfirmationModalOpen,
  } = useDisclosure()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const onFileChange = useCallback(
    e => {
      const files = e.target.files
      if (files[0]) {
        setValue('attachments', files[0])
      }
      e.target.value = null
    },
    [setValue],
  )
  const woAddress = {
    companyName: 'WhiteOaks Aligned, LLC',
    streetAddress: 'Four 14th Street #601',
    city: 'Hoboken',
    state: 'NJ',
    zipCode: '07030',
  }

  const onPaymentTermChange = (option: SelectOption) => {
    const { invoiceDate } = getValues()
    const date = new Date(invoiceDate as string)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const paymentTerm = Number(option.value)

    // Do not calculated WOA expect date if payment term is not selected
    if (!date) return
    const woaExpectedDate = addDays(utcDate, paymentTerm)
    setValue('woaExpectedPayDate', datePickerFormat(woaExpectedDate))
  }

  const onInvoiceDateChange = e => {
    const { paymentTerm } = getValues()
    const date = new Date(e.target.value)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

    // Do not calculated WOA expect date if payment term is not selected
    if (!paymentTerm?.value) return
    const woaExpectedDate = addDays(utcDate, paymentTerm?.value)
    setValue('woaExpectedPayDate', datePickerFormat(woaExpectedDate))
  }

  const onSubmit = async values => {
    if (remainingAR - invoiced < 0) {
      toast({
        title: 'Error',
        description: t(`project.projectDetails.balanceDueError`),
        status: 'error',
        isClosable: true,
        position: 'top-left',
      })
      return
    }
    let payload = await mapFormValuesToPayload({ projectData, invoice, values, account: data, invoiceAmount: invoiced })
    let form = new jsPDF()
    form = await createInvoicePdf({
      doc: form,
      invoiceVals: payload,
      address: woAddress,
      projectData,
    })
    const pdfUri = form.output('datauristring')
    payload['documents']?.push({
      documentType: 42,
      projectId: projectData?.id,
      fileObject: pdfUri.split(',')[1],
      fileObjectContentType: 'application/pdf',
      fileType: 'Invoice.pdf',
    })

    if (!invoice) {
      createInvoiceMutate(payload, {
        onSuccess: () => {
          onClose?.()
        },
        onError: error => {
          console.log(error)
        },
      })
    } else {
      updateInvoiceMutate(payload, {
        onSuccess: () => {
          onClose?.()
        },
        onError: error => {
          console.log(error)
        },
      })
    }
  }

  const deleteRows = useCallback(async () => {
    let indices = [] as any
    await watchInvoiceArray?.forEach((item, index) => {
      if (item.checked) {
        indices.push(index)
      }
    })

    remove(indices)
    onDeleteConfirmationModalClose()
  }, [watchInvoiceArray, onDeleteConfirmationModalClose, setValue])

  const addRow = useCallback(() => {
    append({
      type: 'finalSowLineItems',
      name: '',
      createdDate: datePickerFormat(new Date()),
      description: '',
      amount: '',
      checked: false,
    })
  }, [append])

  return (
    <form id="invoice-form" onSubmit={formReturn.handleSubmit(onSubmit)} onKeyDown={e => {}}>
      <InvoicingReadOnlyInfo invoice={invoice} account={data} />
      <Flex direction="column">
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }} gap={'1.5rem 1rem'} pt="20px" pb="4">
          <GridItem>
            <FormControl isInvalid={!!errors.invoiceNumber} data-testid="invoiceNumber">
              <FormLabel variant="strong-label" size="md" htmlFor="invoiceNumber">
                {t(`project.projectDetails.invoiceNo`)}
              </FormLabel>
              <Controller
                rules={{ required: 'This is required' }}
                control={control}
                name="invoiceNumber"
                render={({ field, fieldState }) => {
                  return (
                    <div data-testid="invoice-number">
                      <Input
                        data-testid="invoiceNumber"
                        id="invoiceNumber"
                        size="md"
                        disabled={isPaid}
                        {...register('invoiceNumber')}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </div>
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.invoiceDate} data-testid="invoiceDate">
              <FormLabel variant="strong-label" size="md" htmlFor="invoiceDate">
                {t(`project.projectDetails.woaInvoiceDate`)}
              </FormLabel>
              <Controller
                rules={{ required: 'This is required' }}
                control={control}
                name="invoiceDate"
                render={({ field, fieldState }) => {
                  return (
                    <div data-testid="invoiceDate">
                      <Input
                        data-testid="invoiceDate"
                        type="date"
                        id="invoiceDate"
                        size="md"
                        disabled={isPaid || !isInvoicedEnabled}
                        {...register('invoiceDate')}
                        onChange={onInvoiceDateChange}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </div>
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl data-testid="payment-term" w="215px" isInvalid={!!errors.paymentTerm}>
              <FormLabel variant="strong-label" size="md">
                {t(`project.projectDetails.paymentTerms`)}
              </FormLabel>
              <Controller
                control={control}
                name="paymentTerm"
                rules={{ required: 'This is required field.' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      {...field}
                      id="paymentTermDD"
                      isDisabled={isPaid}
                      options={PAYMENT_TERMS_OPTIONS}
                      selectProps={{ isBorderLeft: true, menuHeight: '100px' }}
                      onChange={(option: SelectOption) => {
                        onPaymentTermChange(option)
                        field.onChange(option)
                      }}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }} gap={'1.5rem 1rem'} pb="4">
          <GridItem>
            <FormControl isInvalid={!!errors.woaExpectedPayDate} data-testid="woaExpectedPayDate">
              <FormLabel variant="strong-label" size="md" htmlFor="woaExpectedPayDate">
                {t(`project.projectDetails.woaExpectedPay`)}
              </FormLabel>
              <Controller
                rules={{ required: 'This is required' }}
                control={control}
                name="woaExpectedPayDate"
                render={({ field, fieldState }) => {
                  return (
                    <div data-testid="woaExpectedPayDate">
                      <Input
                        data-testid="woaExpectedPayDate"
                        type="date"
                        disabled={true}
                        id="woaExpectedPayDate"
                        size="md"
                        {...register('woaExpectedPayDate')}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </div>
                  )
                }}
              />
            </FormControl>
          </GridItem>
          {invoice && (
            <>
              <GridItem>
                <FormControl data-testid="status" w="215px" isInvalid={!!errors.status}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`project.projectDetails.status`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="status"
                    rules={{ required: 'This is required field.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <ReactSelect
                          {...field}
                          id="status"
                          isDisabled={isPaid}
                          options={INVOICE_STATUS_OPTIONS}
                          selectProps={{ isBorderLeft: true, menuHeight: '100px' }}
                          onChange={statusOption => {
                            field.onChange(statusOption)
                            if (statusOption?.value === 'PAID') {
                              setValue('paymentReceivedDate', datePickerFormat(new Date()))
                            }
                          }}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isInvalid={!!errors.paymentReceivedDate} data-testid="woaExpectedPayDate">
                  <FormLabel variant="strong-label" size="md" htmlFor="woaExpectedPayDate">
                    {t(`project.projectDetails.paymentReceived`)}
                  </FormLabel>
                  <Controller
                    rules={{ required: (watchStatus as SelectOption)?.value === 'PAID' ? 'This is required' : false }}
                    control={control}
                    name="paymentReceivedDate"
                    render={({ field, fieldState }) => {
                      return (
                        <div data-testid="paymentReceivedDate">
                          <Input
                            disabled={(watchStatus as SelectOption)?.value !== 'PAID' || isPaid}
                            data-testid="paymentReceivedDate"
                            type="date"
                            id="paymentReceivedDate"
                            variant={(watchStatus as SelectOption)?.value !== 'PAID' ? 'outline' : 'required-field'}
                            size="md"
                            {...register('paymentReceivedDate')}
                          />
                          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                        </div>
                      )
                    }}
                  />
                </FormControl>
              </GridItem>
            </>
          )}
        </Grid>

        <Tabs variant="enclosed" colorScheme="brand" mt="10px" onChange={setTabIndex}>
          <TabList>
            <Tab> {t(`project.projectDetails.invoiced`)}</Tab>
            <Tab> {t(`project.projectDetails.received`)}</Tab>
            {tabIndex === 0 && (
              <Flex w="100%" ml="20px" mt="5px">
                <Box>
                  <Flex flex="1">
                    <Button
                      data-testid="add-new-row-button"
                      variant="ghost"
                      size="sm"
                      colorScheme="darkPrimary"
                      onClick={addRow}
                      disabled={isPaid}
                      leftIcon={<BiAddToQueue />}
                    >
                      {t(`project.projectDetails.addNewRow`)}
                    </Button>
                    <Button
                      data-testid="delete-row-button"
                      variant="ghost"
                      size="sm"
                      disabled={isPaid}
                      colorScheme="darkPrimary"
                      ml="10px"
                      leftIcon={<RiDeleteBinLine />}
                      onClick={onDeleteConfirmationModalOpen}
                    >
                      {t(`project.projectDetails.deleteRow`)}
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            )}
            <Flex justifyContent={'end'} width="100%">
              {!!attachment?.s3Url && (
                <>
                  <a href={attachment?.s3Url} download style={{ color: 'darkPrimary.300', marginTop: '10px' }}>
                    <Flex>
                      <Box mt="3px" color="darkPrimary.300">
                        <BiDownload fontSize="sm" />
                      </Box>
                      <Text
                        ml="5px"
                        fontSize="14px"
                        fontWeight={500}
                        fontStyle="normal"
                        maxW="110px"
                        isTruncated
                        color="darkPrimary.300"
                        title={attachment?.fileType}
                      >
                        {attachment?.fileType}
                      </Text>
                    </Flex>
                  </a>
                </>
              )}
              <input
                type="file"
                name="smart_reciept"
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={onFileChange}
              ></input>
              {watchAttachments ? (
                <Flex
                  justifyContent={'center'}
                  color="#345EA6"
                  height={'32px'}
                  border="1px solid #345EA6"
                  borderRadius="4px"
                  fontSize="14px"
                >
                  <HStack spacing="5px" padding="10px" align="center">
                    <Text
                      as="span"
                      maxW="120px"
                      isTruncated
                      title={watchAttachments?.name || watchAttachments.fileType}
                    >
                      {watchAttachments?.name || watchAttachments.fileType}
                    </Text>
                    <MdOutlineCancel
                      cursor={'pointer'}
                      onClick={() => {
                        setValue('attachments', undefined)
                      }}
                    />
                  </HStack>
                </Flex>
              ) : (
                <Button
                  onClick={e => {
                    if (inputRef.current) {
                      inputRef.current.click()
                    }
                  }}
                  leftIcon={<BiFile color="darkPrimary.300" />}
                  rightIcon={
                    watchAttachments ? (
                      <MdOutlineCancel
                        onClick={e => {
                          setValue('attachments', undefined)
                        }}
                      />
                    ) : undefined
                  }
                  variant="outline"
                  size="sm"
                  colorScheme="darkPrimary"
                  color="darkPrimary.300"
                  border={'1px solid #345EA6'}
                >
                  {t(`${TRANSACTION}.attachment`)}
                </Button>
              )}
            </Flex>
          </TabList>
          <TabPanels>
            <TabPanel padding="5px 0px 0px 0px">
              <FinalSowLineItems formReturn={formReturn} invoice={invoice} projectData={projectData} fields={fields} />
            </TabPanel>
            <TabPanel h="100%" padding="5px 0px 0px 0px">
              <ReceivedLineItems formReturn={formReturn} projectData={projectData} invoice={invoice} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <InvoicingSummary
          projectData={projectData}
          invoiced={invoiced}
          received={received}
          sowAmount={invoice?.sowAmount}
        />
      </Flex>
      <Divider mt={3}></Divider>
      <Flex alignItems="center" justifyContent="space-between" mt="16px">
        <Box>
          {!!invoicePdfUrl && (
            <Button
              variant="outline"
              colorScheme="brand"
              size="md"
              data-testid="seeInvoice"
              onClick={() => downloadFile(invoicePdfUrl)}
              leftIcon={<BiDownload />}
            >
              {t('see')} {t('invoice')}
            </Button>
          )}
        </Box>
        <HStack>
          <Button onClick={onClose} variant={'outline'} colorScheme="darkPrimary" data-testid="close-transaction-form">
            {t(`project.projectDetails.cancel`)}
          </Button>
          <Button
            onClick={() => {
              formReturn.handleSubmit(onSubmit)()
            }}
            isLoading={isLoadingUpdate || isLoadingCreate}
            disabled={!invoiced || isPaid}
            form="invoice-form"
            data-testid="save-transaction"
            colorScheme="darkPrimary"
            variant="solid"
          >
            {t(`project.projectDetails.save`)}
          </Button>
        </HStack>
      </Flex>
      <ConfirmationBox
        title="Are You Sure?"
        content="Do you want to proceed? This process cannot be undone. "
        isOpen={isDeleteConfirmationModalOpen}
        onClose={onDeleteConfirmationModalClose}
        onConfirm={deleteRows}
      />
    </form>
  )
}
