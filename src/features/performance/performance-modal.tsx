import {
  Box,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Grid,
  GridItem,
  HStack,
  VStack,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { currencyFormatter } from 'utils/string-formatters'
import { badges, bonus, IgnorePerformance } from 'api/performance'

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
  onClose?: () => void
}

export const PerformanceModal = React.forwardRef((props: PerformanceDetailsProps) => {
  const { t } = useTranslation()

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
              <ReactSelect
                options={bonus}
                // value={bonus?.values}
                selectProps={{ isBorderLeft: true }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('New Target')}
              </FormLabel>
              <Input
                variant="required-field"
                placeholder="$0.00"
                //  value={props?.clientDetails?.paymentTerm}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('Badge')}
              </FormLabel>
              <ReactSelect
                options={badges}
                // value={bonus?.values}
                selectProps={{ isBorderLeft: true }}
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
              <ReactSelect
                options={IgnorePerformance}
                // value={bonus?.values}
                selectProps={{ isBorderLeft: true }}
              />
            </FormControl>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
})

export default PerformanceModal
