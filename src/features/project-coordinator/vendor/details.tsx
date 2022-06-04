import {
  Box,
  Checkbox,
  Grid,
  GridItem,
  HStack,
  Input,
  Stack,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Button,
  Flex,
  FormErrorMessage,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { t } from 'i18next'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

const PcDetails: React.FC<{ onClose?: () => void; VendorType?: string }> = ({ onClose, VendorType }) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm()

  const onSubmit = values => {
    console.log(values)
  }
  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid templateColumns="repeat(3,215px)" rowGap="6" columnGap="4">
          <GridItem>
            <FormControl isInvalid={errors.businessName}>
              <FormLabel variant="strong-label" size="md">
                Business Name
              </FormLabel>
              <Input
                {...register('businessName', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.businessName && errors.businessName.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.score}>
              <FormLabel variant="strong-label" size="md">
                Score
              </FormLabel>
              <Controller
                control={control}
                name="score"
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.status}>
              <FormLabel variant="strong-label" size="md">
                Status
              </FormLabel>
              <Controller
                control={control}
                name="status"
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.primaryContact}>
              <FormLabel variant="strong-label" size="md">
                Primary Contact
              </FormLabel>
              <Input
                {...register('primaryContact', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.primaryContact && errors.primaryContact.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.primaryEmail}>
              <FormLabel variant="strong-label" size="md">
                Primary Email
              </FormLabel>
              <Input
                {...register('primaryEmail', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.primaryEmail && errors.primaryEmail.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Secondary Contact
              </FormLabel>

              <Input w="215px" variant="outline" size="md" placeholder="Input size medium" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Secondary Email
              </FormLabel>

              <Input w="215px" variant="outline" size="md" placeholder="Input size medium" />
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
        </Grid>

        <HStack spacing="4" pb="2" pt="2">
          <Box w="215px">
            <FormControl isInvalid={errors.businessPhoneNo}>
              <FormLabel variant="strong-label" size="md">
                Business Phone No
              </FormLabel>
              <Input
                {...register('businessPhoneNo', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.businessPhoneNo && errors.businessPhoneNo.message}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Exit
              </FormLabel>

              <Input w="109px" variant="outline" size="md" placeholder="Input size medium" />
            </FormControl>
          </Box>
          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                State
              </FormLabel>

              <Input w="215px" variant="outline" size="md" placeholder="Input size medium" />
            </FormControl>
          </Box>
          <Box w="109px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                Exit
              </FormLabel>

              <Input w="109px" variant="outline" size="md" placeholder="Input size medium" />
            </FormControl>
          </Box>
        </HStack>

        <Grid templateColumns="repeat(4,215px)" rowGap="6" columnGap="4">
          <GridItem>
            <FormControl isInvalid={errors.streetAdress}>
              <FormLabel variant="strong-label" size="md">
                Street Adress
              </FormLabel>
              <Input
                {...register('streetAdress', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.streetAdress && errors.streetAdress.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.city}>
              <FormLabel variant="strong-label" size="md">
                City
              </FormLabel>
              <Input
                {...register('city', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.city && errors.city.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.state}>
              <FormLabel variant="strong-label" size="md">
                State
              </FormLabel>
              <Controller
                control={control}
                name="state"
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.zipCode}>
              <FormLabel variant="strong-label" size="md">
                Zip Code
              </FormLabel>
              <Input
                {...register('zipCode', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.zipCode && errors.zipCode.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.capacity}>
              <FormLabel variant="strong-label" size="md">
                Capacity
              </FormLabel>
              <Input
                {...register('capacity', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.capacity && errors.capacity.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.ein}>
              <FormLabel variant="strong-label" size="md">
                EIN
              </FormLabel>
              <Input
                {...register('ein', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.ein && errors.ein.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={errors.sin}>
              <FormLabel variant="strong-label" size="md">
                SIN
              </FormLabel>
              <Input
                {...register('sin', {
                  required: 'This is required',
                })}
                w="215px"
                variant="required-field"
                size="md"
                placeholder="Input size medium"
              />
              <FormErrorMessage>{errors.sin && errors.sin.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
        </Grid>
        <Box>
          <Stack alignItems="center" direction="row">
            <VStack alignItems="start">
              <Text fontSize="14px" fontWeight={500} color="gray.600">
                Payment Method
              </Text>
              <HStack>
                <Checkbox colorScheme="brand">Credit Card</Checkbox>
                <Checkbox isChecked colorScheme="brand">
                  Check
                </Checkbox>
                <Checkbox colorScheme="brand">ACH</Checkbox>
              </HStack>
            </VStack>
            <Box w="215px">
              <FormControl isInvalid={errors.paymentTerms}>
                <FormLabel variant="strong-label" size="md">
                  Payment Terms
                </FormLabel>
                <Controller
                  control={control}
                  name="paymentTerms"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </Box>
          </Stack>
        </Box>
        <Flex
          mt="30px"
          id="footer"
          w="100%"
          h="100px"
          minH="60px"
          borderTop="2px solid #E2E8F0"
          alignItems="center"
          justifyContent="end"
        >
          {onClose && (
            <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
              Cancel
            </Button>
          )}
          {VendorType === 'detail' ? (
            <Button type="submit" data-testid="saveDocumentCards" variant="solid" colorScheme="brand">
              {t('save')}
            </Button>
          ) : (
            <Button type="submit" data-testid="saveDocumentCards" variant="solid" colorScheme="brand">
              {t('next')}
            </Button>
          )}
        </Flex>
      </form>
    </Stack>
  )
}

export default PcDetails
