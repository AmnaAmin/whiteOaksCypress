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
import React from 'react'
import { useTranslation } from 'react-i18next'
import { currencyFormatter } from 'utils/string-formatters'
import { badges, bonus, ignorePerformance, useFPMDetails } from 'api/performance'
import { Controller, UseFormReturn } from 'react-hook-form'
import { CustomRequiredInput, NumberInput } from 'components/input/input'
import Select from 'components/form/react-select'
import { PERFORMANCE } from './performance.i18n'

type FieldInfoCardProps = {
  title: string
  value: string
  icon?: React.ElementType
  testid?: string
}

const FieldInfoCard: React.FC<FieldInfoCardProps> = ({ value, title, icon, testid }) => {
  const { t } = useTranslation()
  return (
    <Box>
      <HStack alignItems="start">
        <VStack spacing={1} alignItems="start">
          <Text color="#4A5568" fontWeight={500} fontSize="16px" lineHeight="24px" fontStyle="inter" noOfLines={1}>
            {t(`${PERFORMANCE}.${title}`)}
          </Text>
          <Text color="#718096" fontSize="16px" fontWeight={400} fontStyle="inter" lineHeight={'24px'}>
            {value}
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}

type performanceDetailsProps = {
  performanceDetails?: any
  formControl: UseFormReturn
}

export const PerformanceDetail = React.forwardRef((props: performanceDetailsProps) => {
  const { formControl } = props
  const { data: fpmData } = useFPMDetails(props?.performanceDetails?.userId)
  const { t } = useTranslation()
  const { control } = formControl

  return (
    <Box>
      <Box>
        <Flex direction="row" mt={2}>
          <Box width={'34%'} flexWrap={'wrap'}>
            <FieldInfoCard title={'bonus'} value={currencyFormatter(fpmData?.currentBonus)} />
          </Box>
          <Box width={'34%'} flexWrap={'wrap'}>
            <FieldInfoCard title={'previousBonus'} value={currencyFormatter(fpmData?.previousBonus)} />
          </Box>
          <Box width={'33%'} px={4} flexWrap={'wrap'} ml={8}>
            <FieldInfoCard title={'profit'} value={currencyFormatter(fpmData?.profit)} />
          </Box>
          <Box width={'33%'} px={4} flexWrap={'wrap'}>
            <FieldInfoCard title={'tevenue'} value={currencyFormatter(fpmData?.revenue)} />
          </Box>
          <Box width={'33%'} px={4} flexWrap={'wrap'}>
            <FieldInfoCard title={'target'} value={currencyFormatter(fpmData?.target)} />
          </Box>
        </Flex>
        <Divider mt={4} mb={5} />

        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t(`${PERFORMANCE}.bonusPercentage`)}
              </FormLabel>
              <Controller
                control={control}
                name={`newBonus`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      options={bonus}
                      selected={field.value}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => field.onChange(option)}
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
                {t(`${PERFORMANCE}.newTarget`)}
              </FormLabel>
              <Controller
                control={control}
                name={`newTarget`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberInput
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
                {t(`${PERFORMANCE}.badge`)}
              </FormLabel>
              <Controller
                control={control}
                name={`badge`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      options={badges}
                      selected={field.value}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => field.onChange(option)}
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
                {t(`${PERFORMANCE}.ignorePerformance`)}
              </FormLabel>
              <Controller
                control={control}
                name={`ignoreQuota`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      options={ignorePerformance}
                      selected={field.value}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => field.onChange(option)}
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
