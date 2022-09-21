import {
  Box,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Divider,
  Grid,
  GridItem,
  HStack,
  VStack,
  FormErrorMessage,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { currencyFormatter } from 'utils/string-formatters'
import { badges, bonus, IgnorePerformance } from 'api/performance'
import { PerformanceType } from 'types/performance.type'
import { Controller, useFormContext } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { CustomRequiredInput } from 'components/input/input'

type FieldInfoCardProps = {
  title: string
  value: string
  icon?: React.ElementType
  testid?: string
}

const FieldInfoCard: React.FC<FieldInfoCardProps> = ({ value, title, icon, testid }) => {
  return (
    <Box>
      <HStack alignItems="start">
        <VStack spacing={1} alignItems="start">
          <Text color="#4A5568" fontWeight={500} fontSize="14px" lineHeight="20px" fontStyle="normal">
            {title}
          </Text>
          <Text color="#718096" fontSize="14px" fontWeight={400} fontStyle="normal">
            {value}
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}

type PerformanceDetailsProps = {
  PerformanceDetails?: any
}

export const PerformanceModal = React.forwardRef((props: PerformanceDetailsProps) => {
  const { t } = useTranslation()
  const { control, setValue } = useFormContext<PerformanceType>()

  useEffect(() => {
    setValue('newTarget', currencyFormatter(props?.PerformanceDetails?.newTarget))
    setValue('newBonus', props?.PerformanceDetails?.newBonus)
    setValue('ignoreQuota', props?.PerformanceDetails?.ignoreQuota)
    setValue('badge', props?.PerformanceDetails?.badge)
  }, [])

  return (
    <Box>
      <Box>
        <Flex direction="row">
          <Grid templateColumns="repeat(5, 125px)" gap="20px" w="100%" mb={5} mt={5}>
            <GridItem>
              <FieldInfoCard title={t('Bonus')} value={currencyFormatter(props?.PerformanceDetails?.newBonus)} />
            </GridItem>
            <GridItem>
              <FieldInfoCard
                title={t('Previous Bonus')}
                value={currencyFormatter(props?.PerformanceDetails?.previousBonus)}
              />
            </GridItem>
            <GridItem>
              <FieldInfoCard title={t('Profit')} value={currencyFormatter(props?.PerformanceDetails?.profit)} />
            </GridItem>
            <GridItem>
              <FieldInfoCard title={t('Revenue')} value={currencyFormatter(props?.PerformanceDetails?.revenue)} />
            </GridItem>
            <GridItem>
              <FieldInfoCard title={t('Target')} value={currencyFormatter(props?.PerformanceDetails?.target)} />
            </GridItem>
          </Grid>
        </Flex>
        <Divider mt={1} mb={5} />

        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('Bonus %')}
              </FormLabel>
              <Controller
                control={control}
                name={`newBonus`}
                rules={{ required: 'This is required field' }}
                render={({ field: { value, onChange }, fieldState }) => (
                  <>
                    <ReactSelect
                      options={bonus}
                      selected={value}
                      defaultValue={bonus?.map(p => {
                        if (p?.value === props?.PerformanceDetails?.newBonus)
                          return { label: p?.label, value: p?.value }
                        return null
                      })}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => onChange(option)}
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
                {t('New Target')}
              </FormLabel>
              <Controller
                control={control}
                name={`newTarget`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        value={field.value}
                        onValueChange={values => {
                          const { floatValue } = values
                          field.onChange(floatValue)
                        }}
                        customInput={CustomRequiredInput}
                        thousandSeparator={true}
                        prefix={'$'}
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('Badge')}
              </FormLabel>
              <Controller
                control={control}
                name={`badge`}
                rules={{ required: 'This is required field' }}
                render={({ field: { value, onChange }, fieldState }) => (
                  <>
                    <ReactSelect
                      options={badges}
                      selected={value}
                      defaultValue={badges?.map(p => {
                        if (p?.value === props?.PerformanceDetails?.badge) return { label: p?.label, value: p?.value }
                        return null
                      })}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => onChange(option)}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('Ignore Performance')}
              </FormLabel>
              <Controller
                control={control}
                name={`ignoreQuota`}
                rules={{ required: 'This is required field' }}
                render={({ field: { value, onChange }, fieldState }) => (
                  <>
                    <ReactSelect
                      options={IgnorePerformance}
                      selected={value}
                      defaultValue={IgnorePerformance?.map(p => {
                        if (p?.value === props?.PerformanceDetails?.ignoreQuota)
                          return { label: p?.label, value: p?.value }
                        return null
                      })}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => onChange(option)}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
})

export default PerformanceModal
