import { Grid } from '@chakra-ui/react'
import { useAccountPayableCard } from 'api/account-payable'
import { currencyFormatter } from 'utils/string-formatters'
import { AccountFilterCard } from 'features/recievable/account-filter-card'

export const PayableCardsFilter = ({ cardSelected, onSelected, userIds }) => {
  const { data, isLoading } = useAccountPayableCard({ userIds })
  const payableCards = data?.payableCards

  enum PayableCardTypes {
    PastDue = '1',
    SevenDays = '2',
    EightToTenDays = '3',
    TenToTwentyDays = '4',
    TwentyToThirdayDays = '5',
    ThirtyToFourtyDays = '6',
    // OverPayment = '0',
  }

  const pastDue = payableCards?.find(a => a.category === PayableCardTypes.PastDue)
  const sevenDays = payableCards?.find(a => a.category === PayableCardTypes.SevenDays)
  const eightToTenDays = payableCards?.find(a => a.category === PayableCardTypes.EightToTenDays)
  const tenToTwentyDays = payableCards?.find(a => a.category === PayableCardTypes.TenToTwentyDays)
  const twentyToThirdayDays = payableCards?.find(a => a.category === PayableCardTypes.TwentyToThirdayDays)
  // const overPayment = payableCards?.find(a => a.category === PayableCardTypes.OverPayment)

  const payableData = [
    {
      id: '1',
      text: 'Past Due',
      value: currencyFormatter(pastDue?.finalAmount || 0),
      number: pastDue?.dueCount || 0,
      iconColor: '#FEB2B2',
    },
    {
      id: '2',
      text: '7 days',
      value: currencyFormatter(sevenDays?.finalAmount || 0),
      number: sevenDays?.dueCount || 0,
      iconColor: '#FBD38D',
    },
    {
      id: '3',
      text: '14 Days',
      value: currencyFormatter(eightToTenDays?.finalAmount || 0),
      number: eightToTenDays?.dueCount || 0,
      iconColor: '#9AE6B4',
    },
    {
      id: '4',
      text: '20 Days',
      value: currencyFormatter(tenToTwentyDays?.finalAmount || 0),
      number: tenToTwentyDays?.dueCount || 0,
      iconColor: '#90CDF4',
    },
    {
      id: '5',
      text: '30 Days',
      value: currencyFormatter(twentyToThirdayDays?.finalAmount || 0),
      number: twentyToThirdayDays?.dueCount || 0,
      iconColor: '#D6BCFA',
    },
    // {
    //   id: '6',
    //   text: 'Overpayment',
    //   value: currencyFormatter(overPayment?.finalAmount || 0),
    //   number: overPayment?.dueCount || 0,
    //   iconColor: '#FBB6CE',
    // },
  ]

  return (
    <Grid gap={3} gridTemplateColumns="repeat(auto-fit,minmax(160px,1fr))">
      {payableData.map(data => {
        return (
          <AccountFilterCard
            isLoading={isLoading}
            key={data.id}
            IconColor={data.iconColor}
            value={data.value}
            number={data.number}
            text={data.text}
            Id={data.id}
            cardSelected={cardSelected}
            onSelected={onSelected}
          />
        )
      })}
    </Grid>
  )
}
