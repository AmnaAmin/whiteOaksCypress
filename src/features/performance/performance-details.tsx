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
  Tooltip,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { currencyFormatter } from 'utils/string-formatters'
import { badges, bonus, ignorePerformance, useFPMDetails } from 'api/performance'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'components/form/react-select'
import { PERFORMANCE } from './performance.i18n'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

type FieldInfoCardProps = {
  title: string
  value: string
  icon?: React.ElementType
  testId?: string
}

const FieldInfoCard: React.FC<FieldInfoCardProps> = ({ value, title, icon, testId }) => {
  const { t } = useTranslation()
  return (
    <Box>
      <HStack alignItems="start">
        <VStack spacing={1} alignItems="start">
          <Tooltip label={t(`${PERFORMANCE}.${title}`)} color="black" placement="top" bg="#ffffff">
            <Text color="#4A5568" fontWeight={500} fontSize="16px" lineHeight="24px" fontStyle="inter" noOfLines={1}>
              {t(`${PERFORMANCE}.${title}`)}
            </Text>
          </Tooltip>
          <Text
            data-testid={testId}
            color="#718096"
            fontSize="16px"
            fontWeight={400}
            fontStyle="inter"
            lineHeight={'24px'}
          >
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
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('PERFORMANCE.READ')

  return (
    <Box>
      <Box>
        <Flex direction="row" mt={2}>
          <Box width={'34%'} flexWrap={'wrap'}>
            <FieldInfoCard title={'previousBonus'} value={currencyFormatter(fpmData?.previousBonus)} />
          </Box>
          <Box width={'33%'} px={4} flexWrap={'wrap'} ml={8}>
            <FieldInfoCard title={'profit'} value={currencyFormatter(fpmData?.profit)} testId="fpm_Profit" />
          </Box>
          <Box width={'33%'} px={4} flexWrap={'wrap'}>
            <FieldInfoCard title={'revenue'} value={currencyFormatter(fpmData?.revenue)} testId="fpm_Revenue" />
          </Box>
          <Box width={'33%'} px={4} flexWrap={'wrap'}>
            <FieldInfoCard
              title={'disqualifiedRevenue'}
              value={currencyFormatter(fpmData?.disqualifiedRevenue)}
              testId="fpm_disRevenue"
            />
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
                      classNamePrefix={'newBonusDropdown'}
                      options={bonus}
                      selected={field.value}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => field.onChange(option)}
                      isDisabled={isReadOnly}
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
                      classNamePrefix={'badgeDropdown'}
                      options={badges}
                      selected={field.value}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => field.onChange(option)}
                      isDisabled={isReadOnly}
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
                      classNamePrefix={'ignoreQuotaDropdown'}
                      options={ignorePerformance}
                      selected={field.value}
                      selectProps={{ isBorderLeft: true }}
                      onChange={option => field.onChange(option)}
                      isDisabled={isReadOnly}
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
