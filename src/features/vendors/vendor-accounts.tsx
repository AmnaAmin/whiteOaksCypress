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
  useDisclosure,
} from '@chakra-ui/react'
import { VendorAccountsFormValues, VendorProfile, preventNumber } from 'types/vendor.types'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next'
import { CustomInput, CustomRequiredInput } from 'components/input/input'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { AccountingType, DOCUMENTS_TYPES, PaymentMethods, createACHForm } from 'api/vendor-details'
import ReactSelect from 'components/form/react-select'
import { useStates } from 'api/pc-projects'
import { validateTelePhoneNumber } from 'utils/form-validation'
import ChooseFileField from 'components/choose-file/choose-file'
import { dateFormatNew, datePickerFormat } from 'utils/date-time-utils'
import { downloadDocument } from 'features/vendor-profile/documents-card'
import { AdminPortalVerifyDocument, VendorPortalVerifyDocument } from 'features/vendor-profile/verify-documents'
import { BiAddToQueue, BiDownload, BiTrash } from 'react-icons/bi'
import { FormInput } from 'components/react-hook-form-fields/input'
import SignatureModal from 'features/vendor/vendor-work-order/lien-waiver/signature-modal'
import { imgUtility } from 'utils/file-utils'
import { VENDORPROFILE } from 'features/vendor-profile/vendor-profile.i18n'
import { SaveChangedFieldAlert } from 'features/vendor-profile/save-change-field'
import jsPDF from 'jspdf'
import { convertImageToDataURL } from 'components/table/util'
import { useDeleteDocument } from 'api/vendor-projects'
import { ConfirmationBox } from 'components/Confirmation'

type UserProps = {
  onClose?: () => void
  vendorProfileData: VendorProfile
  isActive
}
export const VendorAccounts: React.FC<UserProps> = ({ vendorProfileData, onClose, isActive }) => {
  const formReturn = useFormContext<VendorAccountsFormValues>()
  const {
    control,
    setValue,
    register,
    formState: { errors },
    setError,
    watch,
    clearErrors,
    trigger,
  } = formReturn
  const { t } = useTranslation()
  const einNumber = useWatch({ name: 'einNumber', control })
  const ssnNumber = useWatch({ name: 'ssnNumber', control })
  const formValues = useWatch({ control })
  const validatePayment = PaymentMethods?.filter(payment => formValues[payment.value])
  const validateAccountType = AccountingType?.filter(acct => formValues[acct.key])
  const { isAdmin, isVendor, isVendorManager } = useUserRolesSelector()
  const isReadOnly = !useRoleBasedPermissions().permissions.some(e =>
    ['VENDOR.EDIT', 'VENDORPROFILE.EDIT', 'ALL'].includes(e),
  )
  const adminRole = isAdmin || isVendorManager
  const isVendorRequired = isActive && isVendor
  const watchVoidCheckDate = watch('bankVoidedCheckDate')
  const watchVoidCheckFile = watch('voidedCheckFile')
  const watchOwnersSignature = watch('ownersSignature')
  const hasOwnerSignature = !!watchOwnersSignature && !watchOwnersSignature?.fileObject // signature has saved s3url and not fileobject

  const isVoidedCheckChange =
    watchVoidCheckDate !== datePickerFormat(vendorProfileData?.bankVoidedCheckDate) || watchVoidCheckFile
  const resetFields = () => {
    setValue('bankVoidedCheckDate', datePickerFormat(vendorProfileData?.bankVoidedCheckDate!))
    setValue('bankVoidedCheckStatus', vendorProfileData?.bankVoidedCheckStatus)
    setValue('voidedCheckFile', undefined)
  }
  const showDiscardChangeBtn = isVoidedCheckChange && adminRole && vendorProfileData?.id
  const { stateSelectOptions } = useStates()
  const sigRef = useRef<HTMLImageElement>(null)

  const downloadACFForm = () => {
    let form = new jsPDF()
    const dimention = {
      width: sigRef?.current?.width,
      height: sigRef?.current?.height,
    }

    convertImageToDataURL(watchOwnersSignature, (dataUrl: string) => {
      createACHForm(form, { ...vendorProfileData }, dimention, dataUrl)
    })
  }

  return (
    <>
      <Box maxH={'632px'} overflowY={'scroll'}>
        <Grid templateColumns="repeat(4,215px)" rowGap="30px" columnGap="16px">
          <GridItem>
            <FormControl isInvalid={!!errors.einNumber} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('ein')}
              </FormLabel>
              <Controller
                control={control}
                name="einNumber"
                rules={{
                  required: ssnNumber ? '' : isActive && 'This is required',
                  validate: value => {
                    if (!value) {
                      return true
                    }

                    // Regular expression pattern to match EIN format: ##-#######
                    const einPattern = /^\d{2}-?\d{7}$/

                    if (!einPattern.test(value)) {
                      return 'Invalid EIN format. Please use the format ##-#######'
                    }

                    return true // Validation passed
                  },
                }}
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
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.ssnNumber} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('sin')}
              </FormLabel>
              <Controller
                control={control}
                name="ssnNumber"
                rules={{
                  required: einNumber ? '' : isActive && 'This is required',
                  pattern: {
                    value: /^$|^\d{9}$/,
                    message: 'Invalid SSN number format',
                  },
                }}
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
              <FormControl isInvalid={!!errors.check?.message && !validatePayment?.length} isDisabled={isReadOnly}>
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
            <FormControl w="215px" isInvalid={!!errors.companyName} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('businessName')}
              </FormLabel>
              <Input
                type="text"
                data-testId="companyName"
                variant="required-field"
                {...register('companyName', {
                  required: isActive && 'This is required',
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                })}
                size="md"
                onChange={e => {
                  const title = e?.target.value
                  setValue('companyName', title)
                  if (title?.length > 255) {
                    setError('companyName', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('companyName')
                  }
                }}
              />
              {!!errors?.companyName && (
                <FormErrorMessage data-testid="businessEmailAddress">{errors?.companyName?.message}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.ownerName} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('ownersName')}
              </FormLabel>
              <Input
                type="text"
                variant="required-field"
                {...register('ownerName', {
                  required: isActive && 'This is required',
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                })}
                onChange={e => {
                  const title = e?.target.value
                  setValue('ownerName', title)
                  if (title?.length > 255) {
                    setError('ownerName', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('ownerName')
                  }
                }}
                size="md"
              />
              {!!errors?.ownerName && (
                <FormErrorMessage data-testid="businessEmailAddress">{errors?.ownerName?.message}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.businessEmailAddress} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                Business Email
              </FormLabel>
              <Input
                type="email"
                {...register('businessEmailAddress', {
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                })}
                onChange={e => {
                  const title = e?.target.value
                  setValue('businessEmailAddress', title)
                  if (title?.length > 255) {
                    setError('businessEmailAddress', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('businessEmailAddress')
                  }
                }}
                variant="required-field"
                size="md"
              />
              {!!errors?.businessEmailAddress && (
                <FormErrorMessage data-testid="businessEmailAddress">
                  {errors?.businessEmailAddress?.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.businessPhoneNumber} h="70px" isDisabled={isReadOnly}>
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
                        value={field.value}
                        customInput={CustomRequiredInput}
                        format="(###)-###-####"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                      />
                      <FormErrorMessage>{fieldState.error && 'Valid Phone Number Is Required'}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl h="70px" isInvalid={!!errors.businessPhoneNumberExtension} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input
                {...register('businessPhoneNumberExtension', {
                  maxLength: { value: 20, message: 'Character limit reached (maximum 20 characters)' },
                  onChange: e => {
                    setValue('businessPhoneNumberExtension', e.target.value)
                    if (e?.target?.value?.length > 20) trigger('businessPhoneNumberExtension')
                    else clearErrors('businessPhoneNumberExtension')
                  },
                })}
                w="121px"
                variant="outline"
                size="md"
                type="number"
              />
              {!!errors.businessPhoneNumberExtension && (
                <FormErrorMessage> {errors?.businessPhoneNumberExtension?.message} </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.streetAddress} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('streetAddress')}
              </FormLabel>
              <Input
                type="text"
                {...register('streetAddress', {
                  required: isActive && 'This is required',
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                })}
                onChange={e => {
                  const title = e?.target.value
                  setValue('streetAddress', title)
                  if (title?.length > 255) {
                    setError('streetAddress', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('streetAddress')
                  }
                }}
                w="215px"
                variant="required-field"
                size="md"
              />
              {!!errors.streetAddress && <FormErrorMessage> {errors?.streetAddress?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.city} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('city')}
              </FormLabel>
              <Input
                type="text"
                {...register('city', {
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  required: isActive && 'This is required',
                  onChange: e => {
                    setValue('city', e.target.value)
                    if (e.target.value?.length > 255) {
                      setError('city', {
                        type: 'maxLength',
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('city')
                    }
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
                onKeyPress={preventNumber}
              />
              {!!errors.city && <FormErrorMessage> {errors?.city?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.state} isDisabled={isReadOnly}>
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
                      classNamePrefix={'stateSelectOptions'}
                      menuPosition="fixed"
                      options={stateSelectOptions}
                      {...field}
                      selectProps={{ isBorderLeft: true, menuHeight: '180px' }}
                    />
                    <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.zipCode} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('zip')}
              </FormLabel>
              <Input
                type="number"
                {...register('zipCode', {
                  required: isActive && 'This is required',
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  onChange: e => {
                    setValue('zipCode', e.target.value)
                    if (e.target.value?.length > 255) {
                      setError('zipCode', {
                        type: 'maxLength',
                        message: 'Please use 255 characters only.',
                      })
                    } else {
                      clearErrors('zipCode')
                    }
                  },
                })}
                w="215px"
                variant="required-field"
                size="md"
              />
              {!!errors.zipCode && <FormErrorMessage> {errors?.zipCode?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <FormLabel variant="strong-label" color={'gray.500'}>
              Bank Details
            </FormLabel>
          </GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.bankName} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('bankName')}
              </FormLabel>
              <Input
                type="text"
                id="bankName"
                variant={isVendorRequired ? 'required-field' : 'outline'}
                {...register('bankName', {
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  required: isVendorRequired && 'This is required',
                })}
                size="md"
                onChange={e => {
                  const title = e?.target.value
                  setValue('bankName', title)
                  if (title?.length > 255) {
                    setError('bankName', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('bankName')
                  }
                }}
              />
              {!!errors.bankName && <FormErrorMessage> {errors?.bankName?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.bankPrimaryContact} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('bankPrimaryContact')}
              </FormLabel>
              <Input
                type="text"
                id="bankPrimaryContact"
                variant={isVendorRequired ? 'required-field' : 'outline'}
                {...register('bankPrimaryContact', {
                  maxLength: { value: 46, message: 'Character limit reached (maximum 45 characters)' },
                  required: isVendorRequired && 'This is required',
                })}
                size="md"
                onChange={e => {
                  const title = e?.target.value
                  setValue('bankPrimaryContact', title)
                  if (title?.length > 255) {
                    setError('bankPrimaryContact', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('bankPrimaryContact')
                  }
                }}
              />
              {!!errors.bankPrimaryContact && (
                <FormErrorMessage> {errors?.bankPrimaryContact?.message} </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.bankEmail} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('bankEmail')}
              </FormLabel>
              <Input
                type="email"
                {...register('bankEmail', {
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  required: isVendorRequired && 'This is required',
                })}
                variant={isVendorRequired ? 'required-field' : 'outline'}
                size="md"
                onChange={e => {
                  const title = e?.target.value
                  setValue('bankEmail', title)
                  if (title?.length > 255) {
                    setError('bankEmail', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('bankEmail')
                  }
                }}
              />
              {!!errors.bankEmail && <FormErrorMessage> {errors?.bankEmail?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankPhoneNumber} h="70px" isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md" noOfLines={1}>
                {t('bankPhoneNumber')}
              </FormLabel>
              <Controller
                control={control}
                rules={{
                  required: isVendorRequired && 'This is required',
                  validate: (number: string) => !isVendorRequired || validateTelePhoneNumber(number),
                }}
                name="bankPhoneNumber"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        data-testid="bankPhoneNumber"
                        value={field.value}
                        customInput={isVendorRequired ? CustomRequiredInput : CustomInput}
                        format="(###)-###-####"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
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
            <FormControl isInvalid={!!errors.bankAddress} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('bankAddress')}
              </FormLabel>
              <Input
                type="text"
                {...register('bankAddress', {
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  required: isVendorRequired && 'This is required',
                })}
                w="215px"
                variant={isVendorRequired ? 'required-field' : 'outline'}
                size="md"
                onChange={e => {
                  const title = e?.target.value
                  setValue('bankAddress', title)
                  if (title?.length > 255) {
                    setError('bankAddress', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('bankAddress')
                  }
                }}
              />
              {!!errors.bankAddress && <FormErrorMessage> {errors?.bankAddress?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankCity} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('city')}
              </FormLabel>
              <Input
                type="text"
                {...register('bankCity', {
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  required: isVendorRequired && 'This is required',
                })}
                w="215px"
                variant={isVendorRequired ? 'required-field' : 'outline'}
                size="md"
                onKeyPress={preventNumber}
                onChange={e => {
                  const title = e?.target.value
                  setValue('bankCity', title)
                  if (title?.length > 255) {
                    setError('bankCity', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('bankCity')
                  }
                }}
              />
              {!!errors.bankCity && <FormErrorMessage> {errors?.bankCity?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankState} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('state')}
              </FormLabel>
              <Controller
                control={control}
                name="bankState"
                rules={{ required: isVendorRequired && 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect
                      classNamePrefix={'bankState'}
                      menuPosition="fixed"
                      options={stateSelectOptions}
                      {...field}
                      selectProps={{ isBorderLeft: isVendorRequired, menuHeight: '180px' }}
                    />
                    <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankZipCode} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('zip')}
              </FormLabel>
              <Input
                type="number"
                {...register('bankZipCode', {
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  required: isVendorRequired && 'This is required',
                })}
                w="215px"
                variant={isVendorRequired ? 'required-field' : 'outline'}
                size="md"
                onChange={e => {
                  const title = e?.target.value
                  setValue('bankZipCode', title)
                  if (title?.length > 255) {
                    setError('bankZipCode', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('bankZipCode')
                  }
                }}
              />
              {!!errors.bankZipCode && <FormErrorMessage> {errors?.bankZipCode?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankRoutingNo} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('bankRoutingNo')}
              </FormLabel>
              <Input
                type="number"
                {...register('bankRoutingNo', {
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  required: isVendorRequired && 'This is required',
                })}
                w="215px"
                variant={isVendorRequired ? 'required-field' : 'outline'}
                size="md"
                onChange={e => {
                  const title = e?.target.value
                  setValue('bankRoutingNo', title)
                  if (title?.length > 255) {
                    setError('bankRoutingNo', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('bankRoutingNo')
                  }
                }}
              />
              {!!errors.bankRoutingNo && <FormErrorMessage> {errors?.bankRoutingNo?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bankAccountingNo} isDisabled={isReadOnly}>
              <FormLabel variant="strong-label" size="md">
                {t('bankAccountingNo')}
              </FormLabel>
              <Input
                type="number"
                {...register('bankAccountingNo', {
                  maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                  required: isVendorRequired && 'This is required',
                })}
                w="215px"
                variant={isVendorRequired ? 'required-field' : 'outline'}
                size="md"
                onChange={e => {
                  const title = e?.target.value
                  setValue('bankAccountingNo', title)
                  if (title?.length > 255) {
                    setError('bankAccountingNo', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('bankAccountingNo')
                  }
                }}
              />
              {!!errors.bankAccountingNo && <FormErrorMessage> {errors?.bankAccountingNo?.message} </FormErrorMessage>}
            </FormControl>
          </GridItem>
          <GridItem />
          <GridItem />
          <GridItem colSpan={4}>
            <HStack alignItems="start" fontSize="14px" fontWeight={500} color="gray.600">
              <FormLabel variant="strong-label" size="md" w="150px">
                {t('accountingType')}
              </FormLabel>
              <FormControl
                isInvalid={!!errors.bankChecking?.message && !validateAccountType?.length}
                isDisabled={isReadOnly}
              >
                <HStack h="25px" spacing="16px">
                  {AccountingType.map(account => {
                    return (
                      <Controller
                        control={control}
                        // @ts-ignore
                        name={account.key as string}
                        rules={{
                          required: !validateAccountType?.length && isVendorRequired && 'This is required',
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
              isReadOnly={isReadOnly}
              formReturn={formReturn}
              vendorProfileData={vendorProfileData}
              isVendor={isVendor}
              adminRole={adminRole}
              isVoidedCheckChange={isVoidedCheckChange}
            />
          </GridItem>
          <GridItem colSpan={2}>
            <SignatureFields
              isReadOnly={isReadOnly}
              vendorProfileData={vendorProfileData}
              sigRef={sigRef}
              formReturn={formReturn}
              adminRole={adminRole}
            />
          </GridItem>
        </Grid>
      </Box>
      <Flex
        height="72px"
        pt="8px"
        id="footer"
        borderTop="1px solid #E2E8F0"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          {hasOwnerSignature && (
            <Button
              disabled={isReadOnly}
              onClick={downloadACFForm}
              leftIcon={<BiDownload />}
              data-testid="downloadACHForm"
              variant="outline"
              size="md"
              colorScheme="brand"
            >
              {t(`${VENDORPROFILE}.downloadACFForm`)}
            </Button>
          )}
        </Box>
        <HStack>
          {showDiscardChangeBtn && (
            <Button variant="outline" colorScheme="darkPrimary" onClick={() => resetFields()}>
              {t(`${VENDORPROFILE}.discardChanges`)}
            </Button>
          )}

          {onClose && (
            <Button colorScheme="brand" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
          )}

          <Button type="submit" data-testid="saveVendorAccounts" variant="solid" colorScheme="brand">
            {t('save')}
          </Button>
        </HStack>
      </Flex>
    </>
  )
}

const VoidedCheckFields = ({ formReturn, vendorProfileData, isVendor, adminRole, isVoidedCheckChange, isReadOnly }) => {
  const {
    formState: { errors },
    setValue,
    register,
    control,
    getValues,
  } = formReturn
  const { t } = useTranslation()
  const documents = getValues()
  const showSaveChangeAlert = isVoidedCheckChange && adminRole && vendorProfileData?.id

  return (
    <HStack
      flexDir={{ base: 'column', sm: 'row' }}
      spacing="16px"
      alignItems="flex-start"
      marginTop={{ base: '20px', md: '0' }}
    >
      <Flex w="215px">
        <Box>
          <FormControl isInvalid={!!errors.bankVoidedCheckDate} isDisabled={isReadOnly}>
            <FormLabel variant="strong-label" size="md" color="#2D3748">
              {t('voidedCheckFile')}
            </FormLabel>
            <Input
              w="215px"
              {...register('bankVoidedCheckDate', {
                onChange: e => {
                  setValue('bankVoidedCheckDate', e.target.value)
                  setValue('bankVoidedCheckStatus', null)
                },
              })}
              type="date"
              data-testid="bankVoidedCheckDate"
            />
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
        <FormControl w="215px" isInvalid={!!errors.voidedCheckFile?.message} isDisabled={isReadOnly}>
          <FormLabel variant="strong-label" size="md" color="#2D3748">
            {t('fileUpload')}
          </FormLabel>
          <Controller
            name="voidedCheckFile"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <VStack alignItems="baseline">
                  <Box>
                    <ChooseFileField
                      disabled={isReadOnly}
                      testId="voidedCheckFile"
                      name={field.name}
                      value={field.value?.name ? field.value?.name : t('chooseFile')}
                      isError={!!fieldState.error?.message}
                      onChange={(file: any) => {
                        if (file) {
                          setValue('bankVoidedCheckStatus', null)
                        }

                        field.onChange(file)
                      }}
                      onClear={() => {
                        setValue(field.name, undefined)
                      }}
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
        {showSaveChangeAlert ? (
          <SaveChangedFieldAlert />
        ) : (
          <>
            {adminRole && (
              <AdminPortalVerifyDocument
                vendor={vendorProfileData as any}
                fieldName="bankVoidedCheckStatus"
                registerToFormField={register}
              />
            )}
            {isVendor && (
              <VendorPortalVerifyDocument vendor={vendorProfileData as any} fieldName="bankVoidedCheckStatus" />
            )}
          </>
        )}
      </HStack>
    </HStack>
  )
}

const SignatureFields = ({ vendorProfileData, formReturn, adminRole, sigRef, isReadOnly }) => {
  const {
    formState: { errors },
    setValue,
    register,
    control,
    watch,
  } = formReturn
  const { mutate: deleteSignature } = useDeleteDocument()
  const watchOwnersSignature = watch('ownersSignature')
  const signatureDocument = vendorProfileData?.documents?.find(
    (d: any) => d.documentTypelabel === DOCUMENTS_TYPES.OWNERS_SIGNATURE.value,
  )
  const {
    isOpen: isDeleteConfirmationModalOpen,
    onClose: onDeleteConfirmationModalClose,
    onOpen: onDeleteConfirmationModalOpen,
  } = useDisclosure()

  useEffect(() => {
    if (watchOwnersSignature) {
      setOwnersSignature(watchOwnersSignature)
    }
  }, [watchOwnersSignature])

  const [ownersSignature, setOwnersSignature] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
    setValue('bankDateSignature', dateFormatNew(new Date().toISOString().split('T')[0]), { shouldValidate: true })
  }
  const onRemoveSignature = () => {
    onDeleteConfirmationModalClose()
    setOwnersSignature('')
    setValue('ownersSignature', null)
    setValue('bankDateSignature', null)
    if (signatureDocument?.id) {
      deleteSignature(signatureDocument?.id)
    }
  }

  return (
    <HStack gap="20px" alignItems={'start'}>
      <FormControl isInvalid={!ownersSignature} isDisabled={isReadOnly}>
        <FormLabel fontWeight={500} fontSize="14px" color="gray.700">
          {t('ownersSignature')}
        </FormLabel>
        <Button
          disabled={isReadOnly}
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
          {!adminRole && (
            <HStack pos={'absolute'} right="10px" top="11px" spacing={3}>
              <IconButton
                aria-label="open-signature"
                variant="ghost"
                minW="auto"
                height="auto"
                _hover={{ bg: 'inherit' }}
                disabled={adminRole}
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
                  disabled={adminRole}
                  data-testid="removeSignature"
                  onClick={e => {
                    onDeleteConfirmationModalOpen()
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
      <FormControl isDisabled={isReadOnly}>
        <FormInput
          disabled={isReadOnly}
          errorMessage={errors?.bankDateSignature?.message}
          label={t('bankDateSignature')}
          testId="signature-date"
          placeholder="mm/dd/yy"
          register={register}
          name={`bankDateSignature`}
          value={formValues?.bankDateSignature}
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
      <ConfirmationBox
        title="Remove Signature?"
        content="Are you sure you want to remove Signature? This action cannot be undone."
        isOpen={isDeleteConfirmationModalOpen}
        onClose={onDeleteConfirmationModalClose}
        onConfirm={onRemoveSignature}
      />
    </HStack>
  )
}
