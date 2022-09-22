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
import { badges, bonus, IgnorePerformance, useFPMDetails } from 'api/performance'
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
          <Text color="#4A5568" fontWeight={500} fontSize="16px" lineHeight="24px" fontStyle="inter" noOfLines={1}>
            {title}
          </Text>
          <Text color="#718096" fontSize="16px" fontWeight={400} fontStyle="inter" lineHeight={'24px'}>
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

export const PerformanceDetail = React.forwardRef((props: PerformanceDetailsProps) => {
  const { t } = useTranslation()
  const { control, setValue } = useFormContext<PerformanceType>()
  const {data : fpmData} = useFPMDetails(props?.PerformanceDetails?.userId)

  useEffect(() => {
    setValue('newTarget', currencyFormatter(fpmData?.newTarget))
    setValue('newBonus', fpmData?.newBonus)
    setValue('ignoreQuota', fpmData?.ignoreQuota)
    setValue('badge', fpmData?.badge)
  }, [])

  return (
    <Box>
      <Box>
        <Flex direction="row" mt={2}>
          <Box width={'34%'} flexWrap={'wrap'}>
            <FieldInfoCard title={t('Bonus')} value={currencyFormatter(fpmData?.newBonus)} />
          </Box>
          <Box width={'34%'} flexWrap={'wrap'}>
            <FieldInfoCard
              title={t('Previous Bonus')}
              value={currencyFormatter(fpmData?.previousBonus)}
            />
          </Box>
          <Box width={'33%'} px={4} flexWrap={'wrap'} ml={8}>
            <FieldInfoCard title={t('Profit')} value={currencyFormatter(fpmData?.profit)} />
          </Box>
          <Box width={'33%'} px={4} flexWrap={'wrap'}>
            <FieldInfoCard title={t('Revenue')} value={currencyFormatter(fpmData?.revenue)} />
          </Box>
          <Box width={'33%'} px={4} flexWrap={'wrap'}>
            <FieldInfoCard title={t('Target')} value={currencyFormatter(fpmData?.target)} />
          </Box>
        </Flex>
        <Divider mt={4} mb={5} />

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
                        if (p?.value === fpmData?.newBonus)
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
                        if (p?.value === fpmData?.badge) return { label: p?.label, value: p?.value }
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
                        if (p?.value === fpmData?.ignoreQuota)
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

export default PerformanceDetail
