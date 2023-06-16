import {
  Box,
  Flex,
  Button,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Center,
  Icon,
} from '@chakra-ui/react'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { Controller, useFormContext, useFieldArray } from 'react-hook-form'
import { ClientFormValues } from 'types/client.type'
import { CLIENTS } from './clients.i18n'
import { BiPlus } from 'react-icons/bi'
import NumberFormat from 'react-number-format'
import { MdOutlineCancel } from 'react-icons/md'

type clientDetailProps = {
  clientDetails?: any
  onClose: () => void
  setNextTab: () => void
}

export const CarrierTab = React.forwardRef((props: clientDetailProps) => {
  const { clientDetails } = props
  const { t } = useTranslation()
  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<ClientFormValues>()
  const phoneNumberRef = useRef<any>()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('CLIENT.READ')

  const { fields: carrierField, append, remove } = useFieldArray({ control, name: 'carrier' })

  return (
    <Box>
      <Box overflow={'auto'} height={400}>
        <>
          {!isReadOnly && (
            <Button
              variant="outline"
              colorScheme="brand"
              onClick={() => {
                append({
                  name: '',
                  emailAddress: '',
                  phoneNumber: '',
                })
              }}
              mb={'10px'}
              leftIcon={<BiPlus />}
            >
              {t(`${CLIENTS}.addCarrier`)}
            </Button>
          )}
        </>
        {isReadOnly && carrierField.length < 1 && (
          <Box width="100%" p={5}>
            <Center>
              <FormLabel variant={'light-label'}> {t(`${CLIENTS}.noCarriers`)}</FormLabel>
            </Center>
          </Box>
        )}
        {carrierField.map((carrier, index) => {
          return (
            <Grid templateColumns="repeat(4, 215px)" gap="20px">
              <GridItem>
                <FormControl isInvalid={!!errors?.carrier?.[index]?.name}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.carrier`)}
                  </FormLabel>
                  <Input
                    id="carrier"
                    {...register(`carrier.${index}.name`, { required: 'This is required' })}
                    variant={'required-field'}
                    type="text"
                    isDisabled={isReadOnly}
                  />
                  <FormErrorMessage>{errors?.carrier?.[index]?.name?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isInvalid={!!errors?.carrier?.[index]?.phoneNumber}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.phoneNumber`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    {...register(`carrier.${index}.phoneNumber`, {
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
                            variant={'required-field'}
                            getInputRef={phoneNumberRef}
                            isDisabled={isReadOnly}
                          />
                          <FormErrorMessage>
                            {errors?.carrier?.[index]?.phoneNumber?.message}
                            {errors?.carrier?.[index]?.phoneNumber &&
                              errors?.carrier?.[index]?.phoneNumber!.type === 'validate' && (
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
                <FormControl isInvalid={!!errors?.carrier?.[index]?.emailAddress}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${CLIENTS}.email`)}
                  </FormLabel>
                  <Input
                    id="emailAddress"
                    {...register(`carrier.${index}.emailAddress`, {
                      required: 'This is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Invalid Email Address',
                      },
                    })}
                    variant={'required-field'}
                    type="email"
                    isDisabled={isReadOnly}
                  />
                  <FormErrorMessage>{errors?.carrier?.[index]?.emailAddress?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>
              {!isReadOnly && (
                <GridItem display={'flex'} mt="25px" alignItems={'center'}>
                  <Box w="2em" color="#345EA6" fontSize="15px" m={{ base: '4%', md: 0 }}>
                    <Center>
                      <Icon
                        as={MdOutlineCancel}
                        onClick={() => remove(index)}
                        data-testid={`removeCarrier-` + index}
                        cursor="pointer"
                        boxSize={5}
                        mt="6px"
                      />
                    </Center>
                  </Box>
                </GridItem>
              )}
            </Grid>
          )
        })}
      </Box>
      <Flex style={btnStyle} py="4" pt={5} mt={4}>
        <Button variant={!isReadOnly ? 'outline' : 'solid'} colorScheme="brand" onClick={props?.onClose}>
          {t(`${CLIENTS}.cancel`)}
        </Button>
        {!isReadOnly && (
          <>
            {clientDetails?.id ? (
              <Button colorScheme="brand" type="submit" form="clientDetails" ml={2}>
                {t(`${CLIENTS}.save`)}
              </Button>
            ) : (
              <Button colorScheme="brand" onClick={props?.setNextTab} form="clientDetails" ml={2}>
                {t(`${CLIENTS}.next`)}
              </Button>
            )}
          </>
        )}
      </Flex>
    </Box>
  )
})
