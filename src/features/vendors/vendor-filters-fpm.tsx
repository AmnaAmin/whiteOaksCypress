import { Grid } from '@chakra-ui/react'
import { useFPMVendorCards } from 'api/pc-projects'
import VendorFilterCard from './vendor-filter-card'

import { FPMManagerTypes, useUser } from 'api/user-management'
import { useAuth } from 'utils/auth-context'
import { useVendorCardJson } from './vendor-filter'
import { useEffect, useState } from 'react'

export const FPMVendorFilters = ({ onSelectCard, selectedCard }) => {
  // FPM portal -> Show vendors having same market as the logged in FPM
  const { data: account } = useAuth()
  const { data: userInfo } = useUser(account?.user?.email)
  const [fpmBasedQueryParams, setFpmBasedQueryParams] = useState<null | string>(null)

  useEffect(() => {
    if (userInfo?.id) {
      switch (userInfo?.fieldProjectManagerRoleId) {
        case FPMManagerTypes.District: {
          const states = userInfo?.fpmStates?.map(m => m.code)?.join(',')
          setFpmBasedQueryParams('states=' + states)
          break
        }
        case FPMManagerTypes.Regional: {
          const regions = userInfo?.regions?.join(',')
          setFpmBasedQueryParams('regions=' + regions)
          break
        }
        case FPMManagerTypes.Regular: {
          const marketIds = userInfo?.markets?.map(m => m.id)?.join(',')
          setFpmBasedQueryParams('marketIds=' + marketIds)
          break
        }
        case FPMManagerTypes.SrFPM: {
          const marketIds = userInfo?.markets?.map(m => m.id)?.join(',')
          setFpmBasedQueryParams('marketIds=' + marketIds)
          break
        }
      }
    }
  }, [userInfo])

  const { data: valuesFPMVendor } = useFPMVendorCards(fpmBasedQueryParams)
  const cards = useVendorCardJson(valuesFPMVendor)

  return (
    <Grid justifyContent="space-between" w="100%" templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="6">
      {cards.map(card => {
        return <VendorFilterCard key={card.id} {...card} onSelectCard={onSelectCard} selectedCard={selectedCard} />
      })}
    </Grid>
  )
}
