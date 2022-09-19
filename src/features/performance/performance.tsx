import { Center, Text } from '@chakra-ui/react'
import { useRevenuePerformance } from 'api/performance'
import { useFPMProfile } from 'api/vendor-details'
import { Card } from 'components/card/card'
import { InformationCardFPM } from 'features/fpm/info-card-fpm'
import { t } from 'i18next'
import { Account } from 'types/account.types'
import { useUserProfile } from 'utils/redux-common-selectors'
import RevenuePerformanceGraph from './revenue-performance-graph'

export const PerformanceTab = () => {
  
  return (
    <>
      {/* <InformationCardFPM chartData={chart} isLoading={isLoading} /> */}
      <Card mt={5} p={0} rounded="13px" flex={1} bg="#FDFDFF">
        <Center mb="5px" mt="25px"> 
          {/* <Text fontSize="16px" fontWeight={'600'} color="#4A5568">
            {t('Performance Per Month')}
          </Text>{' '} */}
        </Center> 
        <RevenuePerformanceGraph />
      </Card>
    </>
  )
}
