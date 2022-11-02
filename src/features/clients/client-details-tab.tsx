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
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import Select from 'components/form/react-select'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { MdOutlineCancel } from 'react-icons/md'
import { BiPlus } from 'react-icons/bi'
// import { paymentsTerms } from 'api/vendor-projects'
import { CLIENTS } from './clients.i18n'
import NumberFormat from 'react-number-format'

type clientDetailProps = {
  clientDetails?: any
  onClose?: () => void
  setNextTab: () => void
}

export const Details: React.FC<clientDetailProps> = props => {
  const { t } = useTranslation()
  const { stateSelectOptions } = useStates()
  const { marketSelectOptions } = useMarkets()

  const { isProjectCoordinator } = useUserRolesSelector()

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
  } = useFormContext<ClientFormValues>()

  // const companyName = useWatch({ name: 'companyName', control })
  // const streetAddress = useWatch({ name: 'streetAddress', control })
  // const city = useWatch({ name: 'city', control })
  // const contacts = useWatch({ name: 'contacts.0.contact', control })

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
                isDisabled={isProjectCoordinator}
                variant={'required-field'}
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
              <FormControl isInvalid={!!errors?.paymentCreditCard || !!errors?.paymentCheck || !!errors.paymentAch}>
                <FormLabel variant="strong-label" size="md">
                  {t(`${CLIENTS}.paymentMethod`)}
                </FormLabel>
                <Flex dir="row" mt={3}>
                  <HStack>
                    <Checkbox {...register(`paymentCreditCard`)} colorScheme="brand" isDisabled={isProjectCoordinator}>
                      {t(`${CLIENTS}.creditCard`)}
                    </Checkbox>
                    <Checkbox {...register(`paymentCheck`)} colorScheme="brand" isDisabled={isProjectCoordinator}>
                      {t(`${CLIENTS}.check`)}
                    </Checkbox>
                    <Checkbox {...register(`paymentAch`)} colorScheme="brand" isDisabled={isProjectCoordinator}>
                      {t(`${CLIENTS}.ach`)}
                    </Checkbox>
                  </HStack>
                </Flex>
                <FormErrorMessage>{errors?.paymentCreditCard}</FormErrorMessage>
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
                isDisabled={isProjectCoordinator}
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
                isDisabled={isProjectCoordinator}
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
                    <Select
                      {...field}
                      options={stateSelectOptions}
                      selected={field.value}
                      onChange={option => field.onChange(option)}
                      selectProps={{ isBorderLeft: true }}
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
                {t(`${CLIENTS}.zipCode`)}
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
                      isDisabled={isProjectCoordinator}
                      variant={'required-field'}
                      type="text"
                    />
                    <FormErrorMessage>{errors?.contacts?.[index]?.contact?.message}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel variant="strong-label" size="md">
                      {t(`${CLIENTS}.phoneNumber`)}
                    </FormLabel>
                    <Controller
                      control={control}
                      name={`contacts.${index}.phoneNumber`}
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
                              isDisabled={isProjectCoordinator}
                            />
                            <FormErrorMessage>
                              {errors?.contacts?.[index]?.phoneNumber &&
                                errors?.contacts?.[index]?.phoneNumber?.message}
                            </FormErrorMessage>
                          </>
                        )
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isInvalid={!!errors?.contacts?.[index]?.phoneNumber}>
                    <FormLabel variant="strong-label" size="md">
                      {t(`${CLIENTS}.ext`)}
                    </FormLabel>
                    <Input
                      id="phoneNumberExtension"
                      {...register(`contacts.${index}.phoneNumberExtension`)}
                      style={disabledTextStyle}
                      isDisabled={isProjectCoordinator}
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
                        required: true,
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      })}
                      style={disabledTextStyle}
                      isDisabled={isProjectCoordinator}
                      type="email"
                    />
                    <FormErrorMessage>
                      {errors?.contacts?.[index]?.emailAddress && (
                        <Text color="red.400" fontSize={'14px'} >
                          Invalid email
                        </Text>
                      )}
                    </FormErrorMessage>
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
                              <Select
                                {...field}
                                options={marketSelectOptions}
                                selected={field.value}
                                onChange={option => field.onChange(option)}
                                isDisabled={isProjectCoordinator}
                                selectProps={{ isBorderLeft: true }}
                              />
                              <FormErrorMessage>{errors?.contacts?.[index]?.market?.message}</FormErrorMessage>
                            </>
                          )}
                        />
                      </Box>
                      {!isProjectCoordinator && index > 0 && (
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
                    isDisabled={isProjectCoordinator}
                    variant={'required-field'}
                    type="text"
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
                    name={`accountPayableContactInfos.${index}.phoneNumber`}
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
                            isDisabled={isProjectCoordinator}
                          />
                          <FormErrorMessage>
                            {errors?.accountPayableContactInfos?.[index]?.phoneNumber?.message}
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
                    isDisabled={isProjectCoordinator}
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
                    {...register(`accountPayableContactInfos.${index}.emailAddress`, { required: 'This is required' })}
                    isDisabled={isProjectCoordinator}
                    variant={'required-field'}
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
                        isDisabled={isProjectCoordinator}
                        variant={'required-field'}
                      />
                      <FormErrorMessage>
                        {errors?.accountPayableContactInfos?.[index]?.comments?.message}
                      </FormErrorMessage>
                    </FormControl>
                    {!isProjectCoordinator && index > 0 && (
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
            leftIcon={<BiPlus />}
            disabled={isProjectCoordinator}
          >
            {t(`${CLIENTS}.addContact`)}
          </Button>
        )}
      </Box>
      <Flex style={btnStyle} py="4" pt={5} mt={4}>
        <Button variant={!isProjectCoordinator ? 'outline' : 'solid'} colorScheme="brand" onClick={props?.onClose}>
          {t(`${CLIENTS}.cancel`)}
        </Button>
        {!isProjectCoordinator && (
          <Button
            // isDisabled={!companyName || !paymentsTerms || !streetAddress || !city || !contacts}
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
