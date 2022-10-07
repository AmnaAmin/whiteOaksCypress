import { Box, Center, Text } from '@chakra-ui/react'
import { useFPMProfile } from 'api/vendor-details'
import { InformationCardFPM } from 'features/fpm/info-card-fpm'
import { t } from 'i18next'
import { Account } from 'types/account.types'
import { useUserProfile } from 'utils/redux-common-selectors'
import PerformanceGraph from './graph-performance'

export const Performance = () => {
  const { id } = useUserProfile() as Account

  const { data: fpmInformationData, isLoading } = useFPMProfile(id)
  const chart = fpmInformationData
  return (
    <>
      <InformationCardFPM chartData={chart} isLoading={isLoading} />
      <Box mt={5} p={0} rounded="13px" flex={1} bg="#F7FAFE" border="1px solid #EAE6E6">
        <Center mb="5px" mt="25px">
          <Text fontSize="16px" fontWeight={'600'} color="#4A5568">
            {t('Performance Per Month')}
          </Text>{' '}
        </Center>
        <PerformanceGraph chartData={chart} isLoading={isLoading} />
      </Box>
    </>
  )
}
