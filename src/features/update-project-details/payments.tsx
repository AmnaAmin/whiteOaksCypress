import { Box, FormControl, FormLabel, Grid, GridItem, Icon, Input, Link, HStack, VStack, Text } from '@chakra-ui/react'
import { NumberFormatValues } from 'react-number-format'
import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { BiDownload } from 'react-icons/bi'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useFieldsDisabled } from './hooks'
import { datePickerFormat } from 'utils/date-time-utils'
import { NumberInput } from 'components/input/input'
import { useTranslation } from 'react-i18next'
import { Project } from 'types/project.type'
import { PROJECT_STATUS, STATUS } from 'features/common/status'

type invoiceAndPaymentProps = {
  projectData: Project
  isReadOnly?: boolean
}
const Payments: React.FC<invoiceAndPaymentProps> = ({ projectData, isReadOnly }) => {
  const formControl = useFormContext<ProjectDetailsFormValues>()
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = formControl

  const {
    isOriginalSOWAmountDisabled,
    isFinalSOWAmountDisabled,
    isRemainingPaymentDisabled,
    isPaymentDisabled,
    isStatusInvoiced,
    isOverPaymentDisalbed,
  } = useFieldsDisabled(control, projectData)

  const formValues = getValues()

  const isDepreciationDisabled = projectData?.projectStatus === PROJECT_STATUS.invoiced.label

  const onPaymentValueChange = (values: NumberFormatValues) => {
    const payment = Number(values.value)
    const depreciation = Number(getValues()?.depreciation ?? 0)
    const overyPayment = payment + depreciation - (getValues().remainingPayment || 0)

    setValue('overPayment', overyPayment < 0 ? 0 : overyPayment)
  }

  const onDepreciationValueChange = (values: NumberFormatValues) => {
    const depreciation = Number(values.value)
    const payment = Number(getValues()?.payment ?? 0)
    const overyPayment = depreciation + payment - (getValues().remainingPayment || 0)

    setValue('overPayment', overyPayment < 0 ? 0 : overyPayment)
  }

  useEffect(() => {
    if (isStatusInvoiced && !formValues.woaInvoiceDate) {
      setValue('woaInvoiceDate', datePickerFormat(new Date()))
    }
    setValue('remainingPayment', getValues().overPayment ? 0 : getValues().remainingPayment)
  }, [isStatusInvoiced])

  const { t } = useTranslation()

  return (
    <HStack height='624px' gap="10" alignItems={'flex-start'} overflowX="auto" width="100%">
      <Box>
        <Grid templateColumns="repeat(3,1fr)" gap={4} rowGap="32px" columnGap="32px" w="100%">
          {projectData?.projectStatus === STATUS.Invoiced?.toUpperCase() && (
            <GridItem colSpan={4} minH="8px"></GridItem>
          )}
          <GridItem>
            <VStack alignItems="end" spacing="0px" position="relative">
              <FormControl w="215px" isInvalid={!!errors.originalSOWAmount}>
                <FormLabel htmlFor="originSowAmount" variant="strong-label" size="md">
                  {t(`project.projectDetails.originalSowAmount`)}
                </FormLabel>
                <Controller
                  control={control}
                  name="originalSOWAmount"
                  render={({ field, fieldState }) => {
                    return (
                      <NumberInput
                        datatest-id="SowAmount"
                        value={field.value}
                        onChange={event => {
                          field.onChange(event)
                        }}
                        disabled={isOriginalSOWAmountDisabled}
                        customInput={Input}
                        thousandSeparator={true}
                        prefix={'$'}
                      />
                    )
                  }}
                />
              </FormControl>
              {formValues.sowLink && (
                <Link
                  download
                  href={formValues.sowLink || ''}
                  target="_blank"
                  color="#4E87F8"
                  display={'flex'}
                  fontSize="xs"
                  alignItems={'center'}
                  mt="2"
                  position={'absolute'}
                  top="76px"
                >
                  <Icon as={BiDownload} fontSize="14px" />
                  <Text ml="1">{t(`project.projectDetails.originalSOW`)}</Text>
                </Link>
              )}
            </VStack>
          </GridItem>
          <GridItem>
            <FormControl w="215px" isInvalid={!!errors.finalSOWAmount}>
              <FormLabel variant="strong-label" size="md" htmlFor="finalSowAmount">
                {t(`project.projectDetails.finalSowAmount`)}
              </FormLabel>
              <Controller
                control={control}
                name="finalSOWAmount"
                render={({ field }) => {
                  return (
                    <NumberInput
                      datatest-id="final-Sow-Amount"
                      value={field.value}
                      onChange={event => {
                        field.onChange(event)
                      }}
                      disabled={isFinalSOWAmountDisabled}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.overPayment}>
              <FormLabel htmlFor="overPayment" variant="strong-label" size="md">
                {t(`project.projectDetails.overpayment`)}
              </FormLabel>

              <Controller
                control={control}
                name="overPayment"
                render={({ field }) => {
                  return (
                    <NumberInput
                      datatest-id="over-Payment"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      disabled={isOverPaymentDisalbed}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                      decimalScale={2}
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
        </Grid>
        <Grid
          templateColumns="repeat(3,1fr)"
          gap={4}
          rowGap="32px"
          columnGap="32px"
          w="100%"
          mt={'40px'}
          overflowX={'auto'}
        >
          <GridItem>
            <FormControl isInvalid={!!errors.remainingPayment}>
              <FormLabel htmlFor="remainingPayment" variant="strong-label" size="md">
                {t(`project.projectDetails.remainingPayment`)}
              </FormLabel>

              <Controller
                control={control}
                name="remainingPayment"
                render={({ field }) => {
                  return (
                    <NumberInput
                      data-testid="remaining-Payment"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      disabled={isRemainingPaymentDisabled}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.payment}>
              <FormLabel htmlFor="payment" variant="strong-label" size="md">
                {t(`project.projectDetails.payment`)}
              </FormLabel>
              <Controller
                control={control}
                name="payment"
                render={({ field, fieldState }) => {
                  return (
                    <NumberInput
                      value={field.value}
                      onValueChange={(values: NumberFormatValues) => {
                        onPaymentValueChange(values)
                        field.onChange(values.value)
                      }}
                      disabled={isPaymentDisabled}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                      data-testid="payment-field"
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.depreciation}>
              <FormLabel htmlFor="depreciation" variant="strong-label" size="md">
                {t(`project.projectDetails.depreciation`)}
              </FormLabel>
              <Controller
                control={control}
                name="depreciation"
                render={({ field, fieldState }) => {
                  return (
                    <NumberInput
                      value={field.value}
                      onValueChange={(values: NumberFormatValues) => {
                        onDepreciationValueChange(values)
                        field.onChange(values.value)
                      }}
                      disabled={!isDepreciationDisabled}
                      customInput={Input}
                      thousandSeparator={true}
                      prefix={'$'}
                      data-testid="depreciation-field"
                    />
                  )
                }}
              />
            </FormControl>
          </GridItem>
        </Grid>
      </Box>
    </HStack>
  )
}
export default Payments
