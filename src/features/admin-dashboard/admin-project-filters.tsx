import { Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ADMIN_DASHBOARD } from './admin-dashboard.i18n'
import { useAdminCards } from 'api/admin-dashboard'
import { currencyFormatter } from 'utils/string-formatters'
import { AmountsSummaryCard } from 'features/common/amounts-summary-card'

const useMapAdminCards = cards => {
  const { t } = useTranslation()
  return [
    {
      id: 'workInProgress',
      title: t(`${ADMIN_DASHBOARD}.wip`),
      value: 'workInProgress',
      number: currencyFormatter(cards?.workInProgress),
      iconColor: '#FEB2B2',
      enabled: true,
    },
    {
      id: 'receivable',
      title: t(`${ADMIN_DASHBOARD}.receivable`),
      value: 'accountReceivable',
      number: currencyFormatter(cards?.accountReceivable),
      iconColor: '#FBD38D',
      enabled: true,
    },
    {
      id: 'payable',
      title: t(`${ADMIN_DASHBOARD}.payable`),
      value: 'accountPayable',
      number: currencyFormatter(cards?.accountPayable),
      iconColor: '#9AE6B4',
      enabled: true,
    },
    {
      id: 'material',
      title: t(`${ADMIN_DASHBOARD}.material`),
      value: 'material',
      number: currencyFormatter(cards?.material),
      iconColor: '#90CDF4',
      enabled: true,
    },
    {
      id: 'draw',
      title: t(`${ADMIN_DASHBOARD}.draw`),
      value: 'draw',
      number: currencyFormatter(cards?.draw),
      iconColor: '#D6BCFA',
      enabled: true,
    },
  
  ]
}

export const AdminProjectFilters = ({ onSelectCard, selectedCard }) => {
  const { adminCards, isLoading } = useAdminCards()
  const cards = useMapAdminCards(adminCards)

  return (
    <>
      <Box
        justifyContent="space-between"
        w="100%"
        display="grid"
        gridTemplateColumns={{
          base: 'repeat(auto-fit, minmax(105px,1fr))',
          sm: 'repeat(auto-fit, minmax(125px,1fr))',
          md: 'repeat(auto-fit, minmax(205px,1fr))',
        }}
        gridGap="14px"
      >
        {cards.map(card => {
          return (
            <AmountsSummaryCard
              key={card.id}
              {...card}
              onSelected={onSelectCard}
              cardSelected={selectedCard}
              isLoading={isLoading}
              IconColor={card.iconColor}
              value={card.number}
              text={card.title}
              Id={card.id}
            ></AmountsSummaryCard>
          )
        })}
      </Box>
    </>
  )
}
