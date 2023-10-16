import { Grid, Icon } from '@chakra-ui/react'
import { BiClipboard, BiFile, BiHourglass, BiMessageSquareError } from 'react-icons/bi'
import { useFetchUserDetails, useVendorCards } from 'api/pc-projects'
import VendorFilterCard from './vendor-filter-card'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { useTranslation } from 'react-i18next'
import { useAccountData } from 'api/user-account'

export const useVendorCardJson = cards => {
  const { t } = useTranslation()

  return [
    {
      id: 'active',
      title: t(`${VENDOR_MANAGER}.active`),
      number: cards?.find(items => items.status === 12)?.count ?? 0,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiFile} />,
      bgColor: '#F9F1DA',
    },
    {
      id: 'inActive',
      title: t(`${VENDOR_MANAGER}.inActive`),
      number: cards?.find(items => items.status === 13)?.count ?? 0,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiClipboard} />,
      bgColor: '#E5ECF9',
    },
    {
      id: 'doNotUse',
      title: t(`${VENDOR_MANAGER}.doNotUse`),
      number: cards?.find(items => items.status === 14)?.count ?? 0,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiMessageSquareError} />,
      bgColor: '#E6FFFA',
    },
    {
      id: 'expired',
      title: t(`${VENDOR_MANAGER}.expired`),
      number: cards?.find(items => items.status === 15)?.count ?? 0,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiHourglass} />,
      bgColor: '#FCE8D8',
    },
  ]
}

export const VendorFilters = ({ onSelectCard, selectedCard }) => {
  const { data: account } = useAccountData()
  const { user } = useFetchUserDetails(account?.email)

  const { data: valuesVendor } = useVendorCards({ user })
  const cards = useVendorCardJson(valuesVendor)

  return (
    <Grid justifyContent="space-between" w="100%" templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="6">
      {cards.map(card => {
        return <VendorFilterCard key={card.id} {...card} onSelectCard={onSelectCard} selectedCard={selectedCard} />
      })}
    </Grid>
  )
}
