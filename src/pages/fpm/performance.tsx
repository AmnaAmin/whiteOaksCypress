import { Box, Center, Text } from '@chakra-ui/react'
import { useFPMProfile } from 'api/vendor-details'
import { FPM_CARDS } from 'features/fpm/fpmCards.i18n'
import { InformationCardFPM } from 'features/fpm/info-card-fpm'
import { useTranslation } from 'react-i18next'
import { Account } from 'types/account.types'
import { useUserProfile } from 'utils/redux-common-selectors'
import PerformanceGraph from './graph-performance'

export const Performance = () => {
  const { id } = useUserProfile() as Account
  const { t } = useTranslation()
  const { data: fpmInformationData, isLoading, isFetching } = useFPMProfile(id)
  const chart = fpmInformationData
  return (
    <>
      <InformationCardFPM chartData={chart} isLoading={isLoading} />
      <Box mt={5} p={0} rounded="13px" flex={1} bg="#F7FAFE" border="1px solid #EAE6E6">
        <Center mb="5px" mt="25px">
          <Text fontSize="16px" fontWeight={'600'} color="#4A5568">
            {t(`${FPM_CARDS}.performancePerMonth`)}
          </Text>
        </Center>
        <PerformanceGraph chartData={chart} isLoading={isLoading || isFetching} />
      </Box>
    </>
  )
}
