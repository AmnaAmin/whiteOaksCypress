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
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import Select from 'components/form/react-select'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { MdOutlineCancel } from 'react-icons/md'
import { BiAddToQueue } from 'react-icons/bi'
import { paymentsTerms } from 'api/vendor-projects'
import { CLIENTS } from './clients.i18n'

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

  const companyName = useWatch({ name: 'companyName', control })
  const streetAddress = useWatch({ name: 'streetAddress', control })
  const city = useWatch({ name: 'city', control })

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
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.name`)}
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
              <FormControl>
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
              </FormControl>
            </GridItem>
          </VStack>
        </Grid>
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
          <GridItem>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.address`)}
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
                {t(`${CLIENTS}.city`)}
              </FormLabel>
              <Input id="city" {...register('city')} isDisabled={isProjectCoordinator} variant={'required-field'} />
              <FormErrorMessage>{errors?.city && errors?.city?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t(`${CLIENTS}.state`)}
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
        {contactsFields.map((contacts, index) => {
          return (
            <>
              <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
                <GridItem>
                  <FormControl height="40px">
                    <FormLabel variant="strong-label" size="md">
                      {t(`${CLIENTS}.contact`)}
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
                      {t(`${CLIENTS}.phoneNumber`)}
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
                      {t(`${CLIENTS}.email`)}
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
                      {t(`${CLIENTS}.market`)}
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
                                selectProps={{ isBorderLeft: true }}
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
            {t(`${CLIENTS}.addContact`)}
          </Button>
        )}
        <Flex alignItems="center" py="3" mt={2}>
          <Text fontSize="16px" color="gray.600" fontWeight={500} w={'370px'}>
            {t(`${CLIENTS}.accPayConInfo`)}
          </Text>
          <Divider border="1px solid #E2E8F0" mt={1} />
        </Flex>
        {accPayInfoFields.map((accountPayableContactInfos, index) => {
          return (
            <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="4">
              <GridItem>
                <FormControl height="40px">
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.contact`)}
                  </FormLabel>
                  <Input
                    id="contact"
                    {...register(`accountPayableContactInfos.${index}.contact`, { required: 'This is required' })}
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
                    {t(`${CLIENTS}.phoneNumber`)}
                  </FormLabel>
                  <Input
                    id="phoneNumber"
                    {...register(`accountPayableContactInfos.${index}.phoneNumber`, { required: 'This is required' })}
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
                    {t(`${CLIENTS}.email`)}
                  </FormLabel>
                  <Input
                    id="emailAddress"
                    {...register(`accountPayableContactInfos.${index}.emailAddress`, { required: 'This is required' })}
                    isDisabled={isProjectCoordinator}
                    variant={'required-field'}
                  />
                  <FormErrorMessage>{errors?.emailAddress && errors?.emailAddress?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.comment`)}
                  </FormLabel>

                  <HStack width={'300px'}>
                    <Box width={'215px'}>
                      <Input
                        id="comments"
                        {...register(`accountPayableContactInfos.${index}.comments`, { required: 'This is required' })}
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
            isDisabled={!companyName || !paymentsTerms || !streetAddress || !city}
            colorScheme="brand"
            type="submit"
            form="clientDetails"
            ml={2}
          >
            {t(`${CLIENTS}.save`)}
          </Button>
        )}
      </Flex>
    </Box>
  )
}

export default Details
