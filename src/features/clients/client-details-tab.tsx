import {
  Box,
  Text,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Checkbox,
  Grid,
  GridItem,
  HStack,
  FormErrorMessage,
  VStack,
  Center,
  Icon,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMarkets, useStates } from 'api/pc-projects'
import { ClientFormValues } from 'types/client.type'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import Select from 'components/form/react-select'
import { CLIENT_STATUS_OPTIONS, PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { MdOutlineCancel } from 'react-icons/md'
import { useWatch } from 'react-hook-form'
import { BiPlus } from 'react-icons/bi'
// import { paymentsTerms } from 'api/vendor-projects'
import { CLIENTS } from './clients.i18n'
import NumberFormat from 'react-number-format'
import { useNewClientNextButtonDisabled } from 'features/projects/new-project/hooks'
import { validateWhitespace } from 'api/clients'
import { preventSpecialCharacter } from 'utils/string-formatters'

type clientDetailProps = {
  clientDetails?: any
  onClose?: () => void
  setNextTab: () => void
}

export const Details: React.FC<clientDetailProps> = props => {
  const { t } = useTranslation()
  const { stateSelectOptions } = useStates()
  const { marketSelectOptions } = useMarkets()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('CLIENT.READ')

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }

  const disabledTextStyle = {
    color: '#2D3748',
  }

  const {
    register,
    formState: { errors },
    control,
    setValue,
    setError,
    clearErrors,
  } = useFormContext<ClientFormValues>()

  // const companyName = useWatch({ name: 'companyName', control })
  // const streetAddress = useWatch({ name: 'streetAddress', control })
  // const city = useWatch({ name: 'city', control })
  // const contacts = useWatch({ name: 'contacts.0.contact', control })

  const { isNewClientDetails, isContactSection, isAccountPayableSection } = useNewClientNextButtonDisabled({ control })

  const [watchPaymentCreditCard, watchPaymentCheck, watchPaymentAch, watchPaymentWired] = useWatch({
    control,
    name: ['paymentCreditCard', 'paymentCheck', 'paymentAch', 'paymentWired'],
  })
  useEffect(() => {
    if (watchPaymentCreditCard || !watchPaymentCheck || !watchPaymentAch || !watchPaymentWired) {
      clearErrors(['paymentCreditCard', 'paymentCheck', 'paymentAch', 'paymentWired'])
    }
  }, [watchPaymentCreditCard, watchPaymentCheck, watchPaymentAch, watchPaymentWired])

  const {
    fields: contactsFields,
    append: contactsAppend,
    remove: contactsRemove,
  } = useFieldArray({ control, name: 'contacts' })
  const {
    fields: accPayInfoFields,
    append: accPayInfoAppend,
    remove: accPayInfoRemove,
  } = useFieldArray({
    control,
    name: 'accountPayableContactInfos',
  })

  const phoneNumberRef = useRef<any>()
  const phoneNumberRef2 = useRef<any>()
  return (
    <Box>
      <Box overflow={'auto'} height={400} width={1145}>
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
          <GridItem>
            <FormControl isInvalid={!!errors?.title}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.title`)}
              </FormLabel>

              <Input
                id="title"
                {...register('title', {
                  maxLength: { value: 255, message: 'Please use 255 characters only.' },
                })}
                isDisabled={isReadOnly}
                onChange={e => {
                  const title = e?.target.value
                  setValue('title', title)
                  if (title?.length > 255) {
                    setError('title', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('title')
                  }
                }}
              />
              {errors.title && <FormErrorMessage>{errors.title.type === 'Cannot be only whitespace'}</FormErrorMessage>}
              {!!errors?.title && (
                <FormErrorMessage data-testid="clientType_error">{errors?.title?.message}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.companyName}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.name`)}
              </FormLabel>

              <Input
                id="companyName"
                {...register('companyName', {
                  required: 'This is required',
                  maxLength: { value: 255, message: 'Please use 255 characters only.' },
                  validate: {
                    whitespace: validateWhitespace,
                  },
                })}
                isDisabled={isReadOnly}
                variant={'required-field'}
                onKeyPress={e => preventSpecialCharacter(e)}
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
              {errors.companyName && (
                <FormErrorMessage>
                  {errors.companyName.type === 'required'
                    ? 'This field is required'
                    : errors?.companyName?.message || 'Cannot be only whitespace'}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors?.abbreviation}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.abbreviation`)}
              </FormLabel>

              <Input
                id="abbreviation"
                {...register('abbreviation', {
                  maxLength: { value: 255, message: 'Please use 255 characters only.' },
                })}
                onChange={e => {
                  const title = e?.target.value
                  setValue('abbreviation', title)
                  if (title?.length > 255) {
                    setError('abbreviation', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('abbreviation')
                  }
                }}
                isDisabled={isReadOnly}
              />
              {!!errors?.abbreviation && (
                <FormErrorMessage data-testid="abbreviation_error">{errors?.abbreviation?.message}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors?.activated}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.status`)}
              </FormLabel>
              <Controller
                control={control}
                name="activated"
                render={({ field, fieldState }) => (
                  <>
                    <div data-testid="client_activated">
                      <ReactSelect
                      classNamePrefix={'clientStatus'}
                        options={CLIENT_STATUS_OPTIONS}
                        menuPosition="fixed"
                        {...field}
                        isDisabled={isReadOnly}
                      />
                      <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                    </div>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4, 215px)" marginTop="20px" gap={'2rem 3rem'}>
          <GridItem>
            <FormControl isInvalid={!!errors?.paymentTerm}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.paymentTerms`)}
              </FormLabel>
              <Controller
                control={control}
                name="paymentTerm"
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <div data-testid="payment_term">
                      <ReactSelect
                      classNamePrefix={'paymentTermOptions'}
                        options={PAYMENT_TERMS_OPTIONS}
                        menuPosition="fixed"
                        maxMenuHeight={80}
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                        isDisabled={isReadOnly}
                      />
                      <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                    </div>
                  </>
                )}
              />
            </FormControl>
          </GridItem>

          <VStack width={'300px'}>
            <GridItem>
              <FormControl
                isInvalid={
                  !!errors?.paymentCreditCard || !!errors?.paymentCheck || !!errors.paymentAch || !!errors.paymentWired
                }
              >
                <FormLabel variant="strong-label" size="md">
                  {t(`${CLIENTS}.paymentMethod`)}
                </FormLabel>
                <Flex dir="row" mt={3}>
                  <HStack>
                    <Controller
                      control={control}
                      name="paymentCreditCard"
                      rules={{
                        required:
                          !watchPaymentCreditCard && !watchPaymentCheck && !watchPaymentAch && !watchPaymentWired,
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <div data-testid="client_checkbox">
                            <Checkbox
                              whiteSpace={'nowrap'}
                              colorScheme="brand"
                              isChecked={field.value}
                              onChange={event => {
                                const isChecked = event.target.checked
                                field.onChange(isChecked)
                              }}
                              mr="2px"
                              isDisabled={isReadOnly}
                            >
                              {t(`${CLIENTS}.creditCard`)}
                            </Checkbox>
                            <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                          </div>
                        </>
                      )}
                    />
                    <Controller
                      control={control}
                      name="paymentCheck"
                      rules={{
                        required:
                          !watchPaymentCreditCard && !watchPaymentCheck && !watchPaymentAch && !watchPaymentWired,
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <div data-testid="check_checkbox">
                            <Checkbox
                              colorScheme="brand"
                              isChecked={field.value}
                              onChange={event => {
                                const isChecked = event.target.checked
                                field.onChange(isChecked)
                              }}
                              mr="2px"
                              isDisabled={isReadOnly}
                            >
                              {t(`${CLIENTS}.check`)}
                            </Checkbox>
                            <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                          </div>
                        </>
                      )}
                    />
                    <Controller
                      control={control}
                      name="paymentAch"
                      rules={{
                        required:
                          !watchPaymentCreditCard && !watchPaymentCheck && !watchPaymentAch && !watchPaymentWired,
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <div data-testid="ach_checkbox">
                            <Checkbox
                              colorScheme="brand"
                              isChecked={field.value}
                              onChange={event => {
                                const isChecked = event.target.checked
                                field.onChange(isChecked)
                              }}
                              mr="2px"
                              isDisabled={isReadOnly}
                            >
                              {t(`${CLIENTS}.ach`)}
                            </Checkbox>
                            <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                          </div>
                        </>
                      )}
                    />
                    <Controller
                      control={control}
                      name="paymentWired"
                      rules={{
                        required:
                          !watchPaymentCreditCard && !watchPaymentCheck && !watchPaymentAch && !watchPaymentWired,
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <div data-testid="wired_checkbox">
                            <Checkbox
                              colorScheme="brand"
                              isChecked={field.value}
                              onChange={event => {
                                const isChecked = event.target.checked
                                field.onChange(isChecked)
                              }}
                              mr="2px"
                              isDisabled={isReadOnly}
                            >
                              {t(`${CLIENTS}.wired`)}
                            </Checkbox>
                            <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                          </div>
                        </>
                      )}
                    />
                  </HStack>
                </Flex>
                <FormErrorMessage>{errors?.paymentCreditCard?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </VStack>
        </Grid>
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3" marginTop="20px">
          <GridItem>
            <FormControl isInvalid={!!errors?.streetAddress}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.address`)}
              </FormLabel>
              <Input
                id="streetAddress"
                {...register('streetAddress', {
                  required: 'This is required',
                  maxLength: { value: 255, message: 'Please use 255 characters only.' },
                  validate: {
                    whitespace: validateWhitespace,
                  },
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
                style={disabledTextStyle}
                isDisabled={isReadOnly}
                variant={'required-field'}
              />
              <FormErrorMessage>{errors?.streetAddress && errors?.streetAddress?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.city}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.city`)}
              </FormLabel>
              <Input
                id="city"
                {...register('city', {
                  required: 'This is required',
                  maxLength: { value: 255, message: 'Please use 255 characters only.' },
                  validate: {
                    whitespace: validateWhitespace,
                  },
                })}
                isDisabled={isReadOnly}
                variant={'required-field'}
                onChange={e => {
                  const title = e?.target.value
                  setValue('city', title)
                  if (title?.length > 255) {
                    setError('city', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('city')
                  }
                }}
              />
              <FormErrorMessage>{errors?.city?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.state}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.state`)}
              </FormLabel>
              <Controller
                control={control}
                name={`state`}
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <div data-testid="state_id">
                      <Select
                       classNamePrefix={'stateID'}
                        {...field}
                        options={stateSelectOptions}
                        selected={field.value}
                        onChange={option => field.onChange(option)}
                        selectProps={{ isBorderLeft: true }}
                        isDisabled={isReadOnly}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </div>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.zipCode}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.zipCode`)}
              </FormLabel>
              <Input
                id="zipCode"
                {...register('zipCode', {
                  maxLength: { value: 255, message: 'Please use 255 characters only.' },
                })}
                style={disabledTextStyle}
                isDisabled={isReadOnly}
                onChange={e => {
                  const title = e?.target.value
                  setValue('zipCode', title)
                  if (title?.length > 255) {
                    setError('zipCode', {
                      type: 'maxLength',
                      message: 'Please use 255 characters only.',
                    })
                  } else {
                    clearErrors('zipCode')
                  }
                }}
              />
              <FormErrorMessage>{errors?.zipCode?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>
        <Flex alignItems="center" py="3" mt={2}>
          <Text fontSize="16px" color="gray.600" fontWeight={500} whiteSpace="nowrap" pr="10px">
            {t(`${CLIENTS}.contact`)}
          </Text>
          <Divider border="1px solid #E2E8F0" mt={1} />
        </Flex>
        {contactsFields.map((contacts, index) => {
          return (
            <>
              <Grid templateColumns="repeat(2, 215px) 110px repeat(2, 240px)" gap={'1rem 1.5rem'} py="3">
                <GridItem>
                  <FormControl isInvalid={!!errors?.contacts?.[index]?.contact}>
                    <FormLabel variant="strong-label" size="md">
                      {t(`${CLIENTS}.name`)}
                    </FormLabel>
                    <Input
                      id="contact"
                      {...register(`contacts.${index}.contact`, {
                        maxLength: { value: 255, message: 'Please use 255 characters only.' },
                        required: 'This is required',
                        validate: {
                          whitespace: validateWhitespace,
                        },
                      })}
                      style={disabledTextStyle}
                      isDisabled={isReadOnly}
                      variant={'required-field'}
                      type="text"
                      onKeyPress={e => preventSpecialCharacter(e)}
                      onChange={e => {
                        const title = e?.target.value
                        setValue(`contacts.${index}.contact`, title)
                        if (title?.length > 255) {
                          setError(`contacts.${index}.contact`, {
                            type: 'maxLength',
                            message: 'Please use 255 characters only.',
                          })
                        } else {
                          clearErrors(`contacts.${index}.contact`)
                        }
                      }}
                    />
                    <FormErrorMessage>{errors?.contacts?.[index]?.contact?.message}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isInvalid={!!errors?.contacts?.[index]?.phoneNumber}>
                    <FormLabel variant="strong-label" size="md">
                      {t(`${CLIENTS}.phoneNumber`)}
                    </FormLabel>
                    <Controller
                      control={control}
                      {...register(`contacts.${index}.phoneNumber`, {
                        required: 'This is required',
                        validate: (value: any) => {
                          if (value.replace(/\D+/g, '').length === 10) return true

                          return false
                        },
                      })}
                      render={({ field }) => {
                        return (
                          <>
                            <NumberFormat
                              id="phoneNumber"
                              customInput={Input}
                              value={field.value}
                              onChange={e => field.onChange(e)}
                              format="(###)-###-####"
                              mask="_"
                              placeholder="(___)-___-____"
                              isDisabled={isReadOnly}
                              variant={'required-field'}
                              getInputRef={phoneNumberRef}
                            />
                            <FormErrorMessage>
                              {errors?.contacts?.[index]?.phoneNumber &&
                                errors?.contacts?.[index]?.phoneNumber?.message}
                              {errors?.contacts?.[index]?.phoneNumber &&
                                errors?.contacts?.[index]?.phoneNumber!.type === 'validate' && (
                                  <span>Phone number should be a 10-digit number</span>
                                )}
                            </FormErrorMessage>
                          </>
                        )
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel variant="strong-label" size="md">
                      {t(`${CLIENTS}.ext`)}
                    </FormLabel>
                    <Input
                      id="phoneNumberExtension"
                      {...register(`contacts.${index}.phoneNumberExtension`)}
                      style={disabledTextStyle}
                      isDisabled={isReadOnly}
                      type="number"
                    />
                    <FormErrorMessage>{errors?.contacts?.[index]?.phoneNumberExtension?.message}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isInvalid={!!errors?.contacts?.[index]?.emailAddress}>
                    <FormLabel variant="strong-label" size="md">
                      {t(`${CLIENTS}.email`)}
                    </FormLabel>
                    <Input
                      id="emailAddress"
                      {...register(`contacts.${index}.emailAddress`, {
                        maxLength: { value: 255, message: 'Please use 255 characters only.' },
                        required: 'This is required',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Invalid Email Address',
                        },
                      })}
                      onChange={e => {
                        const title = e?.target.value
                        setValue(`contacts.${index}.emailAddress`, title)
                        if (title?.length > 255) {
                          setError(`contacts.${index}.emailAddress`, {
                            type: 'maxLength',
                            message: 'Please use 255 characters only.',
                          })
                        } else {
                          clearErrors(`contacts.${index}.emailAddress`)
                        }
                      }}
                      variant={'required-field'}
                      style={disabledTextStyle}
                      isDisabled={isReadOnly}
                      type="email"
                    />
                    <FormErrorMessage>{errors?.contacts?.[index]?.emailAddress?.message}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isInvalid={!!errors?.contacts?.[index]?.market?.message}>
                    <FormLabel variant="strong-label" size="md">
                      {t(`${CLIENTS}.market`)}
                    </FormLabel>
                    <HStack>
                      <Box width={'215px'}>
                        <Controller
                          control={control}
                          name={`contacts.${index}.market`}
                          render={({ field }) => (
                            <>
                              <div data-testid="market_id">
                                <ReactSelect
                                  {...field}
                                  classNamePrefix={'marketSelectOptions'}
                                  options={marketSelectOptions}
                                  selected={field.value}
                                  onChange={option => field.onChange(option)}
                                  isDisabled={isReadOnly}
                                  selectProps={{ isBorderLeft: false, menuHeight: '180px' }}
                                />
                                <FormErrorMessage>{errors?.contacts?.[index]?.market?.message}</FormErrorMessage>
                              </div>
                            </>
                          )}
                        />
                      </Box>
                      {!isReadOnly && index > 0 && (
                        <Box color="barColor.100" fontSize="15px">
                          <Center>
                            <Icon
                              as={MdOutlineCancel}
                              onClick={() => contactsRemove(index)}
                              cursor="pointer"
                              boxSize={5}
                              mt="6px"
                            />
                          </Center>
                        </Box>
                      )}
                    </HStack>
                  </FormControl>
                </GridItem>
              </Grid>
            </>
          )
        })}
        {!isReadOnly && (
          <Button
            variant="outline"
            colorScheme="brand"
            onClick={() =>
              contactsAppend({
                contact: '',
                phoneNumber: '',
                emailAddress: '',
                market: '',
              })
            }
            mt={2}
            leftIcon={<BiPlus />}
          >
            {t(`${CLIENTS}.addContact`)}
          </Button>
        )}
        <Flex alignItems="center" py="3" mt={2}>
          <Text fontSize="16px" color="gray.600" fontWeight={500} whiteSpace="nowrap" pr="10px">
            {t(`${CLIENTS}.accountPayable`)}
          </Text>
          <Divider border="1px solid #E2E8F0" mt={1} />
        </Flex>
        {accPayInfoFields.map((accountPayableContactInfos, index) => {
          return (
            <Grid templateColumns="repeat(2, 215px) 110px repeat(2, 240px)" gap={'1rem 1.5rem'} py="4">
              <GridItem>
                <FormControl isInvalid={!!errors?.accountPayableContactInfos?.[index]?.contact}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.name`)}
                  </FormLabel>
                  <Input
                    id="contact"
                    {...register(`accountPayableContactInfos.${index}.contact`, {
                      maxLength: { value: 255, message: 'Please use 255 characters only.' },
                      required: 'This is required',
                      validate: {
                        whitespace: validateWhitespace,
                      },
                    })}
                    onChange={e => {
                      const title = e?.target.value
                      setValue(`accountPayableContactInfos.${index}.contact`, title)
                      if (title?.length > 255) {
                        setError(`accountPayableContactInfos.${index}.contact`, {
                          type: 'maxLength',
                          message: 'Please use 255 characters only.',
                        })
                      } else {
                        clearErrors(`accountPayableContactInfos.${index}.contact`)
                      }
                    }}
                    style={disabledTextStyle}
                    isDisabled={isReadOnly}
                    variant={'required-field'}
                    type="text"
                    onKeyPress={e => preventSpecialCharacter(e)}
                  />
                  <FormErrorMessage>{errors?.accountPayableContactInfos?.[index]?.contact?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isInvalid={!!errors?.accountPayableContactInfos?.[index]?.phoneNumber}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.phoneNumber`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    {...register(`accountPayableContactInfos.${index}.phoneNumber`, {
                      required: 'This is required',
                      validate: (value: any) => {
                        if (value.replace(/\D+/g, '').length === 10) return true

                        return false
                      },
                    })}
                    render={({ field }) => {
                      return (
                        <>
                          <NumberFormat
                            id="phoneNumber"
                            customInput={Input}
                            value={field.value}
                            onChange={e => field.onChange(e)}
                            format="(###)-###-####"
                            mask="_"
                            placeholder="(___)-___-____"
                            isDisabled={isReadOnly}
                            variant={'required-field'}
                            getInputRef={phoneNumberRef2}
                          />
                          <FormErrorMessage>
                            {errors?.accountPayableContactInfos?.[index]?.phoneNumber &&
                              errors?.accountPayableContactInfos?.[index]?.phoneNumber?.message}
                            {errors?.accountPayableContactInfos?.[index]?.phoneNumber &&
                              errors?.accountPayableContactInfos?.[index]?.phoneNumber!.type === 'validate' && (
                                <span>Phone number should be a 10-digit number</span>
                              )}
                          </FormErrorMessage>
                        </>
                      )
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.ext`)}
                  </FormLabel>
                  <Input
                    id="phoneNumberExtension"
                    {...register(`accountPayableContactInfos.${index}.phoneNumberExtension`, {
                      maxLength: { value: 255, message: 'Please use 255 characters only.' },
                    })}
                    style={disabledTextStyle}
                    isDisabled={isReadOnly}
                    type="number"
                    onChange={e => {
                      const title = e?.target.value
                      setValue(`accountPayableContactInfos.${index}.phoneNumberExtension`, title)
                      if (title?.length > 255) {
                        setError(`accountPayableContactInfos.${index}.phoneNumberExtension`, {
                          type: 'maxLength',
                          message: 'Please use 255 characters only.',
                        })
                      } else {
                        clearErrors(`accountPayableContactInfos.${index}.phoneNumberExtension`)
                      }
                    }}
                  />
                  <FormErrorMessage>
                    {errors?.accountPayableContactInfos?.[index]?.phoneNumberExtension?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isInvalid={!!errors?.accountPayableContactInfos?.[index]?.emailAddress}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.email`)}
                  </FormLabel>
                  <Input
                    id="emailAddress"
                    {...register(`accountPayableContactInfos.${index}.emailAddress`, {
                      maxLength: { value: 255, message: 'Please use 255 characters only.' },
                      required: 'This is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Invalid Email Address',
                      },
                    })}
                    variant={'required-field'}
                    style={disabledTextStyle}
                    isDisabled={isReadOnly}
                    type="email"
                    onChange={e => {
                      const title = e?.target.value
                      setValue(`accountPayableContactInfos.${index}.emailAddress`, title)
                      if (title?.length > 255) {
                        setError(`accountPayableContactInfos.${index}.emailAddress`, {
                          type: 'maxLength',
                          message: 'Please use 255 characters only.',
                        })
                      } else {
                        clearErrors(`accountPayableContactInfos.${index}.emailAddress`)
                      }
                    }}
                  />
                  <FormErrorMessage>
                    {errors?.accountPayableContactInfos?.[index]?.emailAddress?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isInvalid={!!errors?.accountPayableContactInfos?.[index]?.comments}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.comment`)}
                  </FormLabel>

                  <HStack>
                    <FormControl width={'215px'} isInvalid={!!errors?.accountPayableContactInfos?.[index]?.comments}>
                      <Input
                        id="comments"
                        {...register(`accountPayableContactInfos.${index}.comments`, {
                          maxLength: { value: 255, message: 'Please use 255 characters only.' },
                          required: 'This is required',
                          validate: {
                            whitespace: validateWhitespace,
                          },
                        })}
                        style={disabledTextStyle}
                        isDisabled={isReadOnly}
                        variant={'required-field'}
                        onChange={e => {
                          const title = e?.target.value
                          setValue(`accountPayableContactInfos.${index}.comments`, title)
                          if (title?.length > 255) {
                            setError(`accountPayableContactInfos.${index}.comments`, {
                              type: 'maxLength',
                              message: 'Please use 255 characters only.',
                            })
                          } else {
                            clearErrors(`accountPayableContactInfos.${index}.comments`)
                          }
                        }}
                      />
                      <FormErrorMessage>
                        {errors?.accountPayableContactInfos?.[index]?.comments?.message}
                      </FormErrorMessage>
                    </FormControl>
                    {!isReadOnly && index > 0 && (
                      <Box color="barColor.100" fontSize="15px">
                        <Center>
                          <Icon
                            as={MdOutlineCancel}
                            onClick={() => accPayInfoRemove(index)}
                            cursor="pointer"
                            boxSize={5}
                            mt="6px"
                          />
                        </Center>
                      </Box>
                    )}
                  </HStack>
                </FormControl>
              </GridItem>
            </Grid>
          )
        })}
        {!isReadOnly && (
          <Button
            variant="outline"
            colorScheme="brand"
            onClick={() =>
              accPayInfoAppend({
                contact: '',
                phoneNumber: '',
                emailAddress: '',
                comments: '',
              })
            }
            mt={2}
            leftIcon={<BiPlus />}
            disabled={isReadOnly}
          >
            {t(`${CLIENTS}.addContact`)}
          </Button>
        )}
      </Box>
      <Flex style={btnStyle} py="4" pt={5} mt={4}>
        <Button variant={'outline'} colorScheme="brand" onClick={props?.onClose}>
          {t(`${CLIENTS}.cancel`)}
        </Button>
        {!isReadOnly && (
          <Button
            isDisabled={isNewClientDetails || isContactSection || isAccountPayableSection}
            colorScheme="brand"
            ml={2}
            // onClick={props?.setNextTab}
            type="submit"
            form="clientDetails"
          >
            {t(`${CLIENTS}.save`)}
          </Button>
        )}
      </Flex>
    </Box>
  )
}

export default Details
