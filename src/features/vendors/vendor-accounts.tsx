import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Flex,
  Button,
  VStack,
  FormControl,
  FormLabel,
  HStack,
  Grid,
  GridItem,
  Input,
  FormErrorMessage,
  Checkbox,
  Image,
  IconButton,
} from '@chakra-ui/react'
import { VendorAccountsFormValues, VendorProfile, preventNumber } from 'types/vendor.types'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next'
import { CustomInput, CustomRequiredInput } from 'components/input/input'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { AccountingType, DOCUMENTS_TYPES, PaymentMethods } from 'api/vendor-details'
import ReactSelect from 'components/form/react-select'
import { useStates } from 'api/pc-projects'
import { validateTelePhoneNumber } from 'utils/form-validation'
import ChooseFileField from 'components/choose-file/choose-file'
import { dateFormatNew, datePickerFormat } from 'utils/date-time-utils'
import VendorDetails from './vendor-detail-tab'
import { downloadDocument } from 'features/vendor-profile/documents-card'
import { AdminPortalVerifyDocument } from 'features/vendor-profile/verify-documents'
import { BiAddToQueue, BiTrash } from 'react-icons/bi'
import { FormInput } from 'components/react-hook-form-fields/input'
import SignatureModal from 'features/vendor/vendor-work-order/lien-waiver/signature-modal'
import { imgUtility } from 'utils/file-utils'

type UserProps = {
  onClose?: () => void
  vendorProfileData: VendorProfile
  isActive
}
export const VendorAccounts: React.FC<UserProps> = ({ vendorProfileData, onClose, isActive }) => {
  const formReturn = useFormContext<VendorAccountsFormValues>()
  const {
    formState: { errors },
    control,
    setValue,
    getValues,
    register,
  } = formReturn

  const { t } = useTranslation()
  console.log(getValues())
  const einNumber = useWatch({ name: 'einNumber', control })
  const ssnNumber = useWatch({ name: 'ssnNumber', control })
  const formValues = useWatch({ control })
  const validatePayment = PaymentMethods?.filter(payment => formValues[payment.value])
  const validateAccountType = AccountingType?.filter(acct => formValues[acct.key])
  const { isFPM, isAdmin } = useUserRolesSelector()

  const { stateSelectOptions } = useStates()
  return (
    <>
      <Box maxH={'450px'} overflowY={'scroll'}>
        <Grid templateColumns="repeat(4,215px)" rowGap="30px" columnGap="16px">
          <GridItem>
            <FormControl isInvalid={!!errors.einNumber}>
              <FormLabel variant="strong-label" size="md">
                {t('ein')}
              </FormLabel>
              <Controller
                control={control}
                name="einNumber"
                rules={{ required: ssnNumber ? '' : isActive && 'This is required' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        data-testid="einnum"
                        value={field.value}
                        customInput={ssnNumber ? CustomInput : CustomRequiredInput}
                        format="##-#######"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                        isDisabled={isFPM}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.ssnNumber}>
              <FormLabel variant="strong-label" size="md">
                {t('sin')}
              </FormLabel>
              <Controller
                control={control}
                name="ssnNumber"
                rules={{ required: einNumber ? '' : isActive && 'This is required' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        data-testid="ssnnum"
                        value={field.value}
                        customInput={einNumber ? CustomInput : CustomRequiredInput}
                        format="###-##-####"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                        isDisabled={isFPM}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <VStack alignItems="start" fontSize="14px" fontWeight={500} color="gray.600">
              <FormLabel variant="strong-label" size="md">
                {t('paymentMethods')}
              </FormLabel>
              <FormControl isInvalid={!!errors.check?.message && !validatePayment?.length}>
                <HStack spacing="16px">
                  {PaymentMethods.map(payment => {
                    return (
                      <Controller
                        control={control}
                        // @ts-ignore
                        name={payment.value as string}
                        rules={{
                          required: !validatePayment?.length && isActive && 'This is required',
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <div data-testid="payment_checkbox_check">
                              <Checkbox
                                colorScheme="brand"
                                isChecked={field.value as boolean}
                                onChange={event => {
                                  const isChecked = event.target.checked
                                  field.onChange(isChecked)
                                }}
                                mr="2px"
                                isDisabled={isFPM}
                              >
                                {t(payment.value)}
                              </Checkbox>
                            </div>
                          </>
                        )}
                      />
                    )
                  })}
                </HStack>
                <FormErrorMessage pos="absolute">{errors.check?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </GridItem>
          <GridItem colSpan={4}>
            <FormLabel variant="strong-label" color={'gray.500'}>
              Vendor Automated Request Form
            </FormLabel>
          </GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.companyName}>
              <FormLabel variant="strong-label" size="md">
                {t('businessName')}
              </FormLabel>
              <Input
                type="text"
                id="companyName"
                variant="required-field"
                {...register('companyName', {
                  required: isActive && 'This is required',
                  onChange: e => {
                    setValue('companyName', e.target.value)
                  },
                })}
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.companyName && errors.companyName?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.ownerName}>
              <FormLabel variant="strong-label" size="md">
                {t('ownersName')}
              </FormLabel>
              <Input
                type="text"
                id="companyName"
                variant="required-field"
                {...register('ownerName', {
                  required: isActive && 'This is required',
                  onChange: e => {
                    setValue('ownerName', e.target.value)
                  },
                })}
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.ownerName && errors.ownerName?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.businessEmailAddress}>
              <FormLabel variant="strong-label" size="md">
                Business Email
              </FormLabel>
              <Input
                type="email"
                {...register('businessEmailAddress', {
                  required: isActive && 'This is required',
                  onChange: e => {
                    setValue('businessEmailAddress', e.target.value)
                  },
                })}
                variant="required-field"
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos={'absolute'}>{errors.businessEmailAddress?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.businessPhoneNumber} h="70px">
              <FormLabel variant="strong-label" size="md" noOfLines={1}>
                {t('businessPhoneNo')}
              </FormLabel>
              <Controller
                control={control}
                rules={{
                  required: isActive && 'This is required',
                  validate: (number: string) => validateTelePhoneNumber(number),
                }}
                name="businessPhoneNumber"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        data-testid="businessphoneno"
                        value={field.value}
                        customInput={CustomRequiredInput}
                        format="(###)-###-####"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                        isDisabled={isFPM}
                      />
                      <FormErrorMessage>{fieldState.error && 'Valid Phone Number Is Required'}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl h="70px">
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input
                {...register('businessPhoneNumberExtension', {
                  onChange: e => {
                    setValue('businessPhoneNumberExtension', e.target.value)
                  },
                })}
                w="121px"
                variant="outline"
                size="md"
                isDisabled={isFPM}
                type="number"
              />
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.streetAddress}>
              <FormLabel variant="strong-label" size="md">
                {t('streetAddress')}
              </FormLabel>
              <Input
                type="text"
                {...register('streetAddress', {
                  required: isActive && 'This is required',
                  onChange: e => {
                    setValue('streetAddress', e.target.value)
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.streetAddress?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.city}>
              <FormLabel variant="strong-label" size="md">
                {t('city')}
              </FormLabel>
              <Input
                type="text"
                {...register('city', {
                  required: isActive && 'This is required',
                  onChange: e => {
                    setValue('city', e.target.value)
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isFPM}
                onKeyPress={preventNumber}
              />
              <FormErrorMessage pos="absolute">{errors.city?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.state}>
              <FormLabel variant="strong-label" size="md">
                {t('state')}
              </FormLabel>
              <Controller
                control={control}
                name="state"
                rules={{ required: isActive && 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      menuPosition="fixed"
                      options={stateSelectOptions}
                      {...field}
                      selectProps={{ isBorderLeft: true, menuHeight: '180px' }}
                      isDisabled={isFPM}
                    />
                    <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.zipCode}>
              <FormLabel variant="strong-label" size="md">
                {t('zip')}
              </FormLabel>
              <Input
                type="number"
                {...register('zipCode', {
                  required: isActive && 'This is required',
                  onChange: e => {
                    setValue('zipCode', e.target.value)
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.zipCode?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <FormLabel variant="strong-label" color={'gray.500'}>
              Bank Details
            </FormLabel>
          </GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.bankName}>
              <FormLabel variant="strong-label" size="md">
                {t('bankName')}
              </FormLabel>
              <Input
                type="text"
                id="bankName"
                variant="required-field"
                {...register('bankName', {
                  required: isActive && 'This is required',
                })}
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.bankName && errors.bankName?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.bankPrimaryContact}>
              <FormLabel variant="strong-label" size="md">
                {t('bankPrimaryContact')}
              </FormLabel>
              <Input
                type="text"
                id="banksrimaryContact"
                variant="required-field"
                {...register('bankPrimaryContact', {
                  required: isActive && 'This is required',
                })}
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">
                {errors.bankPrimaryContact && errors.bankPrimaryContact?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.bankEmail}>
              <FormLabel variant="strong-label" size="md">
                {t('bankEmail')}
              </FormLabel>
              <Input
                type="email"
                {...register('bankEmail', {
                  required: isActive && 'This is required',
                })}
                variant="required-field"
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos={'absolute'}>{errors.bankEmail?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankPhoneNumber} h="70px">
              <FormLabel variant="strong-label" size="md" noOfLines={1}>
                {t('bankPhoneNumber')}
              </FormLabel>
              <Controller
                control={control}
                rules={{
                  required: isActive && 'This is required',
                  validate: (number: string) => !isActive || validateTelePhoneNumber(number),
                }}
                name="bankPhoneNumber"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        data-testid="bankPhoneNumber"
                        value={field.value}
                        customInput={CustomRequiredInput}
                        format="(###)-###-####"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                        isDisabled={isFPM}
                      />
                      <FormErrorMessage>{fieldState.error && 'Valid Phone Number Is Required'}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankAddress}>
              <FormLabel variant="strong-label" size="md">
                {t('bankAddress')}
              </FormLabel>
              <Input
                type="text"
                {...register('bankAddress', {
                  required: isActive && 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.bankAddress?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankCity}>
              <FormLabel variant="strong-label" size="md">
                {t('city')}
              </FormLabel>
              <Input
                type="text"
                {...register('bankCity', {
                  required: isActive && 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isFPM}
                onKeyPress={preventNumber}
              />
              <FormErrorMessage pos="absolute">{errors.bankCity?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankState}>
              <FormLabel variant="strong-label" size="md">
                {t('state')}
              </FormLabel>
              <Controller
                control={control}
                name="bankState"
                rules={{ required: isActive && 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      menuPosition="fixed"
                      options={stateSelectOptions}
                      {...field}
                      selectProps={{ isBorderLeft: true, menuHeight: '180px' }}
                      isDisabled={isFPM}
                    />
                    <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankZipCode}>
              <FormLabel variant="strong-label" size="md">
                {t('zip')}
              </FormLabel>
              <Input
                type="number"
                {...register('bankZipCode', {
                  required: isActive && 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.bankZipCode?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankRoutingNo}>
              <FormLabel variant="strong-label" size="md">
                {t('bankRoutingNo')}
              </FormLabel>
              <Input
                type="number"
                {...register('bankRoutingNo', {
                  required: isActive && 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.bankRoutingNo?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankAccountingNo}>
              <FormLabel variant="strong-label" size="md">
                {t('bankAccountingNo')}
              </FormLabel>
              <Input
                type="number"
                {...register('bankAccountingNo', {
                  required: isActive && 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                isDisabled={isFPM}
              />
              <FormErrorMessage pos="absolute">{errors.bankAccountingNo?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem />
          <GridItem />
          <GridItem colSpan={4}>
            <HStack alignItems="start" fontSize="14px" fontWeight={500} color="gray.600">
              <FormLabel variant="strong-label" size="md" w="150px">
                {t('accountingType')}
              </FormLabel>
              <FormControl isInvalid={!!errors.bankChecking?.message && !validateAccountType?.length}>
                <HStack h="25px" spacing="16px">
                  {AccountingType.map(account => {
                    return (
                      <Controller
                        control={control}
                        // @ts-ignore
                        name={account.key as string}
                        rules={{
                          required: !validateAccountType?.length && isActive && 'This is required',
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <div data-testid="payment_checkbox_check">
                              <Checkbox
                                colorScheme="brand"
                                isChecked={field.value as boolean}
                                onChange={event => {
                                  const isChecked = event.target.checked
                                  field.onChange(isChecked)
                                }}
                                mr="2px"
                                isDisabled={isFPM}
                              >
                                {t(account?.value)}
                              </Checkbox>
                            </div>
                          </>
                        )}
                      />
                    )
                  })}
                </HStack>
                <FormErrorMessage pos="absolute">{errors.bankChecking?.message}</FormErrorMessage>
              </FormControl>
            </HStack>
          </GridItem>
          <GridItem colSpan={4}>
            <VoidedCheckFields
              formReturn={formReturn}
              vendorProfileData={vendorProfileData}
              isFPM={isFPM}
              isAdmin={isAdmin}
            />
          </GridItem>
          <GridItem colSpan={2}>
            <SignatureFields isActive={isActive} formReturn={formReturn} isAdmin={isAdmin} />
          </GridItem>
        </Grid>
      </Box>
      <Flex
        height="72px"
        pt="8px"
        mt="30px"
        id="footer"
        borderTop="1px solid #E2E8F0"
        alignItems="center"
        justifyContent="end"
      >
        {onClose && (
          <Button variant={isFPM ? 'solid' : 'outline'} colorScheme="brand" onClick={onClose} mr="3">
            {t('cancel')}
          </Button>
        )}
        {!isFPM && (
          <Button type="submit" data-testid="saveDocumentCards" variant="solid" colorScheme="brand">
            {t('save')}
          </Button>
        )}
      </Flex>
    </>
  )
}

const VoidedCheckFields = ({ formReturn, vendorProfileData, isFPM, isAdmin }) => {
  const {
    formState: { errors },
    setValue,
    register,
    control,
    getValues,
  } = formReturn
  const { t } = useTranslation()
  const documents = getValues()
  return (
    <HStack
      flexDir={{ base: 'column', sm: 'row' }}
      spacing="16px"
      alignItems="flex-start"
      marginTop={{ base: '20px', md: '0' }}
    >
      <Flex w="215px">
        <Box>
          <FormControl isInvalid={!!errors.bankVoidedCheckDate}>
            <FormLabel variant="strong-label" size="md" color="#2D3748">
              {t('voidedCheckFile')}
            </FormLabel>
            <Input w="215px" {...register('bankVoidedCheckDate')} type="date" data-testid="bankVoidedCheckDate" />
            <FormErrorMessage>{errors.bankVoidedCheckDate && errors.bankVoidedCheckDate.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </Flex>
      <HStack
        sx={{
          '@media screen and (max-width: 480px)': {
            ms: '0 !important',
            mt: '20px !important',
          },
        }}
      >
        <FormControl w="215px" isInvalid={!!errors.voidedCheckFile?.message}>
          <FormLabel variant="strong-label" size="md" color="#2D3748">
            {t('fileUpload')}
          </FormLabel>
          <Controller
            name="voidedCheckFile"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <VStack alignItems="baseline" pointerEvents={isFPM ? 'none' : 'auto'}>
                  <Box>
                    <ChooseFileField
                      name={field.name}
                      value={field.value?.name ? field.value?.name : t('chooseFile')}
                      isError={!!fieldState.error?.message}
                      onChange={(file: any) => {
                        if (file) {
                          setValue('bankVoidedCheckDate', datePickerFormat(new Date()))
                        }
                        field.onChange(file)
                      }}
                      onClear={() => {
                        setValue(field.name, undefined)
                        setValue(
                          'bankVoidedCheckDate',
                          vendorProfileData?.bankVoidedCheckDate
                            ? datePickerFormat(vendorProfileData?.bankVoidedCheckDate)
                            : null,
                        )
                      }}
                      disabled={isFPM}
                    ></ChooseFileField>
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </Box>
                  <Box overflow="hidden" top={16} h="18px">
                    {documents?.voidedCheckUrl &&
                      downloadDocument(documents?.voidedCheckUrl, t('voidedCheck'), 'voidedCheckLink')}
                  </Box>
                </VStack>
              )
            }}
          />
        </FormControl>
        {isAdmin && (
          <AdminPortalVerifyDocument
            vendor={VendorDetails as any}
            fieldName="bankVoidedCheckStatus"
            registerToFormField={register}
          />
        )}
      </HStack>
    </HStack>
  )
}

const SignatureFields = ({ formReturn, isActive, isAdmin }) => {
  const {
    formState: { errors },
    setValue,
    register,
    control,
    watch,
  } = formReturn

  const watchOwnersSignature = watch('ownersSignature')
  useEffect(() => {
    if (ownersSignature) {
      setOwnersSignature(ownersSignature)
    }
  }, [watchOwnersSignature])

  const [ownersSignature, setOwnersSignature] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sigRef = useRef<HTMLImageElement>(null)
  const [openSignature, setOpenSignature] = useState(false)
  const formValues = useWatch({ control })
  const { t } = useTranslation()

  const convertSignatureTextToImage = value => {
    const uri = imgUtility.generateTextToImage(canvasRef, value)
    setValue('ownersSignature', {
      documentType: DOCUMENTS_TYPES?.OWNERS_SIGNATURE?.id,
      fileObject: uri?.split(',')[1],
      fileObjectContentType: 'image/png',
      fileType: 'Owners-Signature.png',
    })
    setOwnersSignature(uri)
  }

  const onSignatureChange = value => {
    convertSignatureTextToImage(value)
    setValue('bankDateSignature', new Date(), { shouldValidate: true })
  }
  const onRemoveSignature = () => {
    setOwnersSignature('')
    setValue('ownersSignature', null)
    setValue('bankDateSignature', null)
  }

  return (
    <HStack gap="20px" alignItems={'start'}>
      <FormControl isInvalid={!ownersSignature}>
        <FormLabel fontWeight={500} fontSize="14px" color="gray.700">
          {t('ownersSignature')}
        </FormLabel>
        <Button
          pos="relative"
          border={'1px solid'}
          borderColor="gray.200"
          borderRadius="6px"
          bg="white"
          height={'40px'}
          //borderLeftWidth={'2.5px'}
          //borderLeftColor="#345EA6"
          alignItems="center"
          px={4}
          ml={0}
          justifyContent="left"
          variant="ghost"
          w="100%"
          _hover={{ bg: 'white' }}
          _active={{ bg: 'white' }}
          _disabled={{
            bg: 'gray.100',
            _hover: { bg: 'gray.100' },
            _active: { bg: 'gray.100' },
          }}
          disabled={isAdmin}
          onClick={() => {
            setOpenSignature(true)
          }}
        >
          <canvas hidden ref={canvasRef} height={'64px'} width={'1000px'}></canvas>
          <Image
            data-testid="ownersSignature"
            hidden={!ownersSignature}
            maxW={'100%'}
            src={ownersSignature}
            {...register('ownersSignature')}
            ref={sigRef}
          />
          {!isAdmin && (
            <HStack pos={'absolute'} right="10px" top="11px" spacing={3}>
              <IconButton
                aria-label="open-signature"
                variant="ghost"
                minW="auto"
                height="auto"
                _hover={{ bg: 'inherit' }}
                disabled={false}
                data-testid="openSignature"
              >
                <BiAddToQueue color="#A0AEC0" />
              </IconButton>
              {ownersSignature && (
                <IconButton
                  aria-label="open-signature"
                  variant="ghost"
                  minW="auto"
                  height="auto"
                  _hover={{ bg: 'inherit' }}
                  disabled={isAdmin}
                  data-testid="removeSignature"
                  onClick={e => {
                    onRemoveSignature()
                    e.stopPropagation()
                  }}
                >
                  <BiTrash className="mr-1" color="#A0AEC0" />
                </IconButton>
              )}
            </HStack>
          )}
        </Button>
        {errors?.ownersSignature?.message && <FormErrorMessage>This is required field</FormErrorMessage>}
      </FormControl>
      <FormControl>
        <FormInput
          errorMessage={errors?.bankDateSignature?.message}
          label={t('bankDateSignature')}
          testId="signature-date"
          placeholder="mm/dd/yy"
          register={register}
          name={`bankDateSignature`}
          value={dateFormatNew(formValues?.bankDateSignature as string)}
          elementStyle={{
            bg: 'white',
            borderWidth: '0 0 1px 0',
            borderColor: 'gray.200',
            rounded: '0',
            paddingLeft: 0,
          }}
          readOnly
        />
      </FormControl>
      <SignatureModal setSignature={onSignatureChange} open={openSignature} onClose={() => setOpenSignature(false)} />
    </HStack>
  )
}
