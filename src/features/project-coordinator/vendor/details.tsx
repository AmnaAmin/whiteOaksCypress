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
  Spacer,
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
        <HStack spacing="16px">
          <FormControl w="215px" isInvalid={errors.businessName}>
            <FormLabel variant="strong-label" size="md">
              {t('businessName')}
            </FormLabel>
            <Input
              {...register('businessName', {
                required: 'This is required',
              })}
              variant="required-field"
              size="md"
              placeholder="Input size medium"
            />
            <FormErrorMessage>{errors.businessName && errors.businessName.message}</FormErrorMessage>
          </FormControl>
          <FormControl w="215px" isInvalid={errors.score}>
            <FormLabel variant="strong-label" size="md">
              {t('score')}
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
          <FormControl w="215px" isInvalid={errors.status}>
            <FormLabel variant="strong-label" size="md">
              {t('status')}
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
        </HStack>
        <HStack spacing="16px" mt="30px">
          <FormControl w="215px" isInvalid={errors.primaryContact}>
            <FormLabel variant="strong-label" size="md">
              {t('primaryEmail')}
            </FormLabel>
            <Input
              {...register('primaryContact', {
                required: 'This is required',
              })}
              variant="required-field"
              size="md"
              placeholder="Input size medium"
            />
            <FormErrorMessage>{errors.primaryContact && errors.primaryContact.message}</FormErrorMessage>
          </FormControl>
          <FormControl w="215px" isInvalid={errors.primaryEmail}>
            <FormLabel variant="strong-label" size="md">
              {t('primaryEmail')}
            </FormLabel>
            <Input
              {...register('primaryEmail', {
                required: 'This is required',
              })}
              variant="required-field"
              size="md"
              placeholder="Input size medium"
            />
            <FormErrorMessage>{errors.primaryEmail && errors.primaryEmail.message}</FormErrorMessage>
          </FormControl>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t('secondaryContact')}
            </FormLabel>

            <Input variant="outline" size="md" placeholder="Input size medium" />
          </FormControl>
          <FormControl w="215px">
            <FormLabel variant="strong-label" size="md">
              {t('secondaryEmail')}
            </FormLabel>

            <Input variant="outline" size="md" placeholder="Input size medium" />
          </FormControl>
          <GridItem></GridItem>
        </HStack>

        <HStack spacing="4" my="30px">
          <Box w="215px">
            <FormControl isInvalid={errors.businessPhoneNo}>
              <FormLabel variant="strong-label" size="md">
                {t('businessPhoneNo')}
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
          <Flex>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input w="109px" variant="outline" size="md" placeholder="Input size medium" />
            </FormControl>
            <Spacer w="108px" />
          </Flex>
          <Box w="215px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('state')}
              </FormLabel>

              <Input w="215px" variant="outline" size="md" placeholder="Input size medium" />
            </FormControl>
          </Box>
          <Box w="109px">
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('ext')}
              </FormLabel>

              <Input w="109px" variant="outline" size="md" placeholder="Input size medium" />
            </FormControl>
          </Box>
        </HStack>

        <Grid templateColumns="repeat(4,215px)" rowGap="30px" columnGap="16px">
          <GridItem>
            <FormControl isInvalid={errors.streetAdress}>
              <FormLabel variant="strong-label" size="md">
                {t('streetAddress')}
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
                {t('city')}
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
                {t('state')}
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
                {t('zip')}
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
                {t('capacity')}
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
          <Stack alignItems="center" direction="row" spacing="16px">
            <Box w="215px">
              <FormControl isInvalid={errors.paymentTerms}>
                <FormLabel variant="strong-label" size="md">
                  {t('paymentTerms')}
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
            <VStack alignItems="start">
              <Text fontSize="14px" fontWeight={500} color="gray.600">
                {t('paymentMethods')}
              </Text>
              <HStack spacing="16px">
                <Checkbox colorScheme="brand">Credit Card</Checkbox>
                <Checkbox isChecked colorScheme="brand">
                  {t('check')}
                </Checkbox>
                <Checkbox colorScheme="brand">ACH</Checkbox>
              </HStack>
            </VStack>
          </Stack>
        </Box>
        <HStack height="80px" mt="30px" id="footer" borderTop="2px solid #E2E8F0" justifyContent="end" spacing="16px">
          {onClose && (
            <Button variant="outline" colorScheme="brand" onClick={onClose}>
              {t('cancel')}
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
        </HStack>
      </form>
    </Stack>
  )
}

export default PcDetails
