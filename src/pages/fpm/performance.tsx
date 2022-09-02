import { useFPMProfile } from 'api/vendor-details'
import { InformationCardFPM } from 'features/fpm/info-card-fpm'
import { Account } from 'types/account.types'
import { useUserProfile } from 'utils/redux-common-selectors'

export const Performance = () => {
  const { id } = useUserProfile() as Account
  const { data: fpmInformationData, isLoading } = useFPMProfile(id)
  const chart = fpmInformationData
  return <InformationCardFPM chartData={chart} isLoading={isLoading} />
}
