import { Grid, Icon } from '@chakra-ui/react'

import React from 'react'
import { BiClipboard, BiFile, BiHourglass, BiMessageSquareError } from 'react-icons/bi'
import { useFPMVendorCards, useVendorCards } from 'api/pc-projects'
import VendorFilterCard from './vendor-filter-card'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { useTranslation } from 'react-i18next'

import { useUser } from 'api/user-management'
import { useAuth } from 'utils/auth-context'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

const useVendorCardJson = cards => {
  const { t } = useTranslation()

  return [
    {
      id: 'active',
      title: t(`${VENDOR_MANAGER}.active`),
      number: cards?.find(items => items.status === 12)?.count,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiFile} />,
      bgColor: '#F9F1DA',
    },
    {
      id: 'inActive',
      title: t(`${VENDOR_MANAGER}.inActive`),
      number: cards?.find(items => items.status === 13)?.count,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiClipboard} />,
      bgColor: '#E5ECF9',
    },
    {
      id: 'doNotUse',
      title: t(`${VENDOR_MANAGER}.doNotUse`),
      number: cards?.find(items => items.status === 14)?.count,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiMessageSquareError} />,
      bgColor: '#E6FFFA',
    },
    {
      id: 'expired',
      title: t(`${VENDOR_MANAGER}.expired`),
      number: cards?.find(items => items.status === 15)?.count,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiHourglass} />,
      bgColor: '#FCE8D8',
    },
  ]
}

export const VendorFilters = ({ onSelectCard, selectedCard }) => {
  // FPM portal -> Show vendors having same market as the logged in FPM
  const { data: account } = useAuth()
  const { data: userInfo } = useUser(account?.user?.email)
  let marketIDs = userInfo?.markets?.map(m => m.id)
  let ids = userInfo?.markets?.map(m => m.id)
  if (ids === 'undefined') marketIDs = 0
  else if (ids === '') marketIDs = 0
  else if (ids === ' ') marketIDs = 0
  else userInfo?.markets?.map(m => m.id)
  /*const marketIDs = "undefined" ? "0" 
    : "" ? "0" 
    : " " ? "0" 
    : userInfo?.markets?.map(m => m.id);*/

  const { isFPM } = useUserRolesSelector()

  const { data: valuesVendor } = useVendorCards()
  const { data: valuesFPMVendor } = useFPMVendorCards(marketIDs ? marketIDs : 0)

  const values = isFPM ? valuesFPMVendor : valuesVendor

  const cards = useVendorCardJson(values)

  return (
    <Grid justifyContent="space-between" w="100%" templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="6">
      {cards.map(card => {
        return <VendorFilterCard key={card.id} {...card} onSelectCard={onSelectCard} selectedCard={selectedCard} />
      })}
    </Grid>
  )
}
