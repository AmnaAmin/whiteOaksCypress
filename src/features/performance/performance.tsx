import { Center, Text } from '@chakra-ui/react'
import { useRevenuePerformance } from 'api/performance'
import { useFPMProfile } from 'api/vendor-details'
import { Card } from 'components/card/card'
import { InformationCardFPM } from 'features/fpm/info-card-fpm'
import { t } from 'i18next'
import { Account } from 'types/account.types'
import { useUserProfile } from 'utils/redux-common-selectors'
import { PerformanceInfoCards } from './performance-info-cards'
import { PerformanceTable } from './performance-table'
import RevenuePerformanceGraph from './revenue-performance-graph'

export const PerformanceTab = () => {
  return (
    <>
      <Card mt={5} p={0} rounded="13px" flex={1} bg="#FDFDFF">
        <RevenuePerformanceGraph />
      </Card>
      <PerformanceInfoCards isLoading={false}  />
      <PerformanceTable />
    </>
  )
}
