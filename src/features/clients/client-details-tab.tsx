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
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { MdOutlineCancel } from 'react-icons/md'
import { useWatch } from 'react-hook-form'
import { BiPlus } from 'react-icons/bi'
// import { paymentsTerms } from 'api/vendor-projects'
import { CLIENTS } from './clients.i18n'
import NumberFormat from 'react-number-format'
import { preventSpecialCharacter } from 'utils/string-formatters'
import { useNewClientNextButtonDisabled } from 'features/projects/new-project/hooks'

type clientDetailProps = {
  clientDetails?: any
  onClose?: () => void
  setNextTab: () => void
}

export const Details: React.FC<clientDetailProps> = props => {
  const { t } = useTranslation()
  const { stateSelectOptions } = useStates()
  const { marketSelectOptions } = useMarkets()
  const isReadOnly = useRoleBasedPermissions()?.includes('CLIENTS.READ')

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
      <Box overflow={'auto'} height={400}>
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
          <GridItem>
            <FormControl isInvalid={!!errors?.companyName}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.name`)}
              </FormLabel>
              <Input
                id="companyName"
                {...register('companyName', { required: 'This is required' })}
                isDisabled={isReadOnly}
                variant={'required-field'}
                onKeyPress={e => preventSpecialCharacter(e)}
              />
              <FormErrorMessage>{errors?.companyName?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
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
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
          <GridItem>
            <FormControl isInvalid={!!errors?.streetAddress}>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.address`)}
              </FormLabel>
              <Input
                id="streetAddress"
                {...register('streetAddress', { required: 'This is required' })}
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
                {...register('city', { required: 'This is required' })}
                isDisabled={isReadOnly}
                variant={'required-field'}
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
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.zipCode`)}
              </FormLabel>
              <Input id="zipCode" {...register('zipCode')} style={disabledTextStyle} isDisabled={isReadOnly} />
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
              <Grid templateColumns="repeat(2, 215px) 110px repeat(2, 215px)" gap={'1rem 1.5rem'} py="3">
                <GridItem>
                  <FormControl isInvalid={!!errors?.contacts?.[index]?.contact}>
                    <FormLabel variant="strong-label" size="md">
                      {t(`${CLIENTS}.name`)}
                    </FormLabel>
                    <Input
                      id="contact"
                      {...register(`contacts.${index}.contact`, { required: 'This is required' })}
                      style={disabledTextStyle}
                      isDisabled={isReadOnly}
                      variant={'required-field'}
                      type="text"
                      onKeyPress={e => preventSpecialCharacter(e)}
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
                        required: 'This is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'Invalid Email Address',
                        },
                      })}
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
                      <Box width={'180px'}>
                        <Controller
                          control={control}
                          name={`contacts.${index}.market`}
                          rules={{ required: 'This is required' }}
                          render={({ field }) => (
                            <>
                              <div data-testid="market_id">
                                <Select
                                  {...field}
                                  options={marketSelectOptions}
                                  selected={field.value}
                                  onChange={option => field.onChange(option)}
                                  isDisabled={isReadOnly}
                                  selectProps={{ isBorderLeft: true }}
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
            <Grid templateColumns="repeat(2, 215px) 110px repeat(2, 215px)" gap={'1rem 1.5rem'} py="4">
              <GridItem>
                <FormControl isInvalid={!!errors?.accountPayableContactInfos?.[index]?.contact}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.name`)}
                  </FormLabel>
                  <Input
                    id="contact"
                    {...register(`accountPayableContactInfos.${index}.contact`, { required: 'This is required' })}
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
                    {...register(`accountPayableContactInfos.${index}.phoneNumberExtension`)}
                    style={disabledTextStyle}
                    isDisabled={isReadOnly}
                    type="number"
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
                      required: 'This is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Invalid Email Address',
                      },
                    })}
                    variant={'required-field'}
                    style={disabledTextStyle}
                    isDisabled={isReadOnly}
                    type="email"
                  />
                  <FormErrorMessage>
                    {errors?.accountPayableContactInfos?.[index]?.emailAddress?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.comment`)}
                  </FormLabel>

                  <HStack>
                    <FormControl width={'180px'} isInvalid={!!errors?.accountPayableContactInfos?.[index]?.comments}>
                      <Input
                        id="comments"
                        {...register(`accountPayableContactInfos.${index}.comments`, { required: 'This is required' })}
                        style={disabledTextStyle}
                        isDisabled={isReadOnly}
                        variant={'required-field'}
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
        <Button variant={!isReadOnly ? 'outline' : 'solid'} colorScheme="brand" onClick={props?.onClose}>
          {t(`${CLIENTS}.cancel`)}
        </Button>
        {!isReadOnly && (
          <Button
            isDisabled={isNewClientDetails || isContactSection || isAccountPayableSection}
            colorScheme="brand"
            form="clientDetails"
            ml={2}
            onClick={props?.setNextTab}
          >
            {t(`${CLIENTS}.next`)}
          </Button>
        )}
      </Flex>
    </Box>
  )
}

export default Details
