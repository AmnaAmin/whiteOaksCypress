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
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMarkets, useStates } from 'api/pc-projects'
import { ClientFormValues } from 'types/client.type'
import { Controller, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import Select from 'components/form/react-select'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { MdOutlineCancel } from 'react-icons/md'
import { BiAddToQueue } from 'react-icons/bi'
// import { useClientDetailsSaveButtonDisabled, useSaveNewClientDetails, useUpdateClientDetails } from 'api/clients'

type clientDetailProps = {
  clientDetails?: any
  states?: any
  onClose?: () => void
  setNextTab: () => void
}

export const Details: React.FC<clientDetailProps> = props => {
  const { t } = useTranslation()
  const { stateSelectOptions } = useStates()
  const { marketSelectOptions, markets } = useMarkets()
  // const { mutate: editClientDetails } = useUpdateClientDetails()
  // const { mutate: addNewClientDetails } = useSaveNewClientDetails()

  const { isProjectCoordinator } = useUserRolesSelector()

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }
  // To get Contact Market
  // const clientSelectedMarket = parseInt(props?.clientDetails?.contacts?.map(m => m?.market))
  // const selectedClientMarket = markets?.find(market => market?.id === clientSelectedMarket)
  // const clientMarket = { label: selectedClientMarket?.stateName, value: selectedClientMarket?.id }

  const disabledTextStyle = {
    color: '#2D3748',
  }

  const {
    register,
    formState: { errors },
    control,
    watch,
  } = useFormContext<ClientFormValues>()

  const clientDetails = props?.clientDetails

  // // Setting Dropdown values
  // const stateSelect = props?.states?.map(state => ({ value: state?.id, label: state?.name })) || []
  // const stateValue = stateSelect?.find(b => b?.value === clientDetails?.state)

  // const paymentTermsValue = PAYMENT_TERMS_OPTIONS?.find(s => s?.value === props?.clientDetails?.paymentTerm)

  // // Setting Default Values
  // const formReturn = useForm<ClientFormValues>({
  //   defaultValues: {
  //     ...clientDetails,
  //     paymentTerm: paymentTermsValue || { label: '20', value: '20' },
  //     state: stateValue,
  //     contacts: clientDetails?.contacts?.length > 0
  //       ? [...clientDetails?.contacts?.map(c => {
  //           const selectedMarket = marketSelectOptions?.find(m => m.id === c.market.id)
  //           return {
  //             contact: c.contact,
  //             phoneNumber: c.phoneNumber,
  //             emailAddress: c.emailAddress,
  //             market: selectedMarket,
  //           }
  //         })]
  //       : [{ contact: '', phoneNumber: '', emailAddress: '', market: '' }],

  //     accountPayableContactInfos: clientDetails?.accountPayableContactInfos?.length
  //       ? clientDetails?.accountPayableContactInfos
  //       : [{ contact: '', phoneNumber: '', emailAddress: '', comments: '' }],
  //   },
  // })

  // const {
  //   control,
  //   formState: { errors },
  //   register,
  // } = formReturn

  // const isClientDetailsSaveButtonDisabled = useClientDetailsSaveButtonDisabled(control, errors)

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

  // const onSubmit = useCallback(
  //   async values => {
  //     const queryOptions = {
  //       onSuccess(response) {
  //         //setCreatedClientId here
  //       },
  //     }
  //     console.log('...values', values)
  //     const clientPayload = {
  //       ...values,
  //       paymentTerm: values.paymentTerm?.value,
  //       state: values.state?.value,
  //       contacts: values.contacts?.map(c => ({
  //         ...c,
  //         market: c.market?.value,
  //       })),
  //     }
  //     if (values?.id) {
  //       editClientDetails(clientPayload, queryOptions)
  //     } else {
  //       addNewClientDetails(clientPayload, queryOptions)
  //     }
  //   },
  //   [addNewClientDetails],
  // )

  return (
    <Box>
      <Box overflow={'auto'} height={400}>
        {/* <form onSubmit={formReturn.handleSubmit(onSubmit)} id="clientDetails"> */}
          <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('name')}
                </FormLabel>
                <Input
                  id="companyName"
                  {...register('companyName', { required: 'This is required' })}
                  isDisabled={isProjectCoordinator}
                  variant={'required-field'}
                />
                <FormErrorMessage>{errors?.companyName && errors?.companyName?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('paymentTerms')}
                </FormLabel>
                <Controller
                  control={control}
                  name="paymentTerm"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect
                        options={PAYMENT_TERMS_OPTIONS}
                        menuPosition="fixed"
                        maxMenuHeight={80}
                        {...field}
                        selectProps={{ isBorderLeft: true }}
                        isDisabled={isProjectCoordinator}
                      />
                      <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </GridItem>
            <VStack width={'230px'}>
              <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t('paymentMethod')}
                  </FormLabel>
                  <Flex dir="row" mt={3}>
                    <HStack>
                      <Checkbox
                        {...register(`paymentCreditCard`)}
                        colorScheme="brand"
                        isDisabled={isProjectCoordinator}
                      >
                        Credit Card
                      </Checkbox>
                      <Checkbox {...register(`paymentCheck`)} colorScheme="brand" isDisabled={isProjectCoordinator}>
                        Check
                      </Checkbox>
                      <Checkbox {...register(`paymentAch`)} colorScheme="brand" isDisabled={isProjectCoordinator}>
                        ACH
                      </Checkbox>
                    </HStack>
                  </Flex>
                </FormControl>
              </GridItem>
            </VStack>
          </Grid>
          <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
            <GridItem>
              <FormControl height="40px">
                <FormLabel variant="strong-label" size="md">
                  {t('address')}
                </FormLabel>
                <Input
                  id="streetAddress"
                  {...register('streetAddress')}
                  style={disabledTextStyle}
                  isDisabled={isProjectCoordinator}
                  variant={'required-field'}
                />
                <FormErrorMessage>{errors?.streetAddress && errors?.streetAddress?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('city')}
                </FormLabel>
                <Input id="city" {...register('city')} isDisabled={isProjectCoordinator} variant={'required-field'} />
                <FormErrorMessage>{errors?.city && errors?.city?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('State')}
                </FormLabel>
                <Controller
                  control={control}
                  name={`state`}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        options={stateSelectOptions}
                        selected={field.value}
                        onChange={option => field.onChange(option)}
                        isDisabled={isProjectCoordinator}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('zipCode')}
                </FormLabel>
                <Input
                  id="zipCode"
                  {...register('zipCode')}
                  style={disabledTextStyle}
                  isDisabled={isProjectCoordinator}
                />
              </FormControl>
            </GridItem>
          </Grid>
          {contactsFields.map((contacts, index) => {
            return (
              <>
                <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
                  <GridItem>
                    <FormControl height="40px">
                      <FormLabel variant="strong-label" size="md">
                        {t('contact')}
                      </FormLabel>
                      <Input
                        id="contact"
                        {...register(`contacts.${index}.contact`)}
                        style={disabledTextStyle}
                        isDisabled={isProjectCoordinator}
                        variant={'required-field'}
                      />
                      <FormErrorMessage>{errors?.contact && errors?.contact?.message}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel variant="strong-label" size="md">
                        {t('phoneNo')}
                      </FormLabel>
                      <Input
                        id="phoneNumber"
                        {...register(`contacts.${index}.phoneNumber`)}
                        style={disabledTextStyle}
                        isDisabled={isProjectCoordinator}
                      />
                      <FormErrorMessage>{errors?.phoneNumber && errors?.phoneNumber?.message}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel variant="strong-label" size="md">
                        {t('email')}
                      </FormLabel>
                      <Input
                        id="emailAddress"
                        {...register(`contacts.${index}.emailAddress`)}
                        style={disabledTextStyle}
                        isDisabled={isProjectCoordinator}
                      />
                      <FormErrorMessage>{errors?.emailAddress && errors?.emailAddress?.message}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel variant="strong-label" size="md">
                        {t('market')}
                      </FormLabel>
                      <HStack width={'300px'}>
                        <Box width={'215px'}>
                          <Controller
                            control={control}
                            name={`contacts.${index}.market`}
                            render={({ field, fieldState }) => (
                              <>
                                <Select
                                  {...field}
                                  options={marketSelectOptions}
                                  selected={field.value}
                                  onChange={option => field.onChange(option)}
                                  isDisabled={isProjectCoordinator}
                                  // value={markets?.map(market => {
                                  //   if (market?.id === parseInt(contacts?.market))
                                  //     return { label: market?.stateName, value: market?.id }
                                  //   return null
                                  // })}
                                />
                                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                              </>
                            )}
                          />
                        </Box>
                        {!isProjectCoordinator && (
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
          {!isProjectCoordinator && (
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
              leftIcon={<BiAddToQueue />}
            >
              {t('Add Contacts')}
            </Button>
          )}
          <Flex alignItems="center" py="3" mt={2}>
            <Text fontSize="16px" color="gray.600" fontWeight={500} w={'370px'}>
              {t('accPayConInfo')}
            </Text>
            <Divider border="1px solid #E2E8F0" mt={1} />
          </Flex>
          {accPayInfoFields.map((accountPayableContactInfos, index) => {
            return (
              <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="4">
                <GridItem>
                  <FormControl height="40px">
                    <FormLabel variant="strong-label" size="md">
                      {t('contact')}
                    </FormLabel>
                    <Input
                      id="contact"
                      {...register(`accountPayableContactInfos.${index}.contact`)}
                      style={disabledTextStyle}
                      isDisabled={isProjectCoordinator}
                      variant={'required-field'}
                    />
                    <FormErrorMessage>{errors?.contact && errors?.contact?.message}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel variant="strong-label" size="md">
                      {t('phoneNo')}
                    </FormLabel>
                    <Input
                      id="phoneNumber"
                      {...register(`accountPayableContactInfos.${index}.phoneNumber`)}
                      style={disabledTextStyle}
                      isDisabled={isProjectCoordinator}
                      variant={'required-field'}
                    />
                    <FormErrorMessage>{errors?.phoneNumber && errors?.phoneNumber?.message}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel variant="strong-label" size="md">
                      {t('email')}
                    </FormLabel>
                    <Input
                      id="emailAddress"
                      {...register(`accountPayableContactInfos.${index}.emailAddress`)}
                      isDisabled={isProjectCoordinator}
                      variant={'required-field'}
                    />
                    <FormErrorMessage>{errors?.emailAddress && errors?.emailAddress?.message}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel variant="strong-label" size="md">
                      {t('comment')}
                    </FormLabel>

                    <HStack width={'300px'}>
                      <Box width={'215px'}>
                        <Input
                          id="comments"
                          {...register(`accountPayableContactInfos.${index}.comments`)}
                          style={disabledTextStyle}
                          isDisabled={isProjectCoordinator}
                          variant={'required-field'}
                        />
                        <FormErrorMessage>{errors?.comments && errors?.comments?.message}</FormErrorMessage>
                      </Box>
                      {!isProjectCoordinator && (
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
          {!isProjectCoordinator && (
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
              leftIcon={<BiAddToQueue />}
              disabled={isProjectCoordinator}
            >
              {t('Add Contacts')}
            </Button>
          )}
        {/* </form> */}
      </Box>
      <Flex style={btnStyle} py="4" pt={5} mt={4}>
        <Button variant={!isProjectCoordinator ? 'outline' : ''} colorScheme="brand" onClick={props?.onClose}>
          {t('cancel')}
        </Button>
        {!isProjectCoordinator && (
          <Button
            // disabled={isClientDetailsSaveButtonDisabled}
            colorScheme="brand"
            type="submit"
            form="clientDetails"
            ml={2}
            // onClick={props?.setNextTab}
          >
            {t('save')}
          </Button>
        )}
      </Flex>
    </Box>
  )
}

export default Details
