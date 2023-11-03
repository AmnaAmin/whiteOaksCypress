import { Grid } from '@chakra-ui/react'
import { useRecievableCards } from 'api/account-receivable'
import { currencyFormatter } from 'utils/string-formatters'
import { AccountFilterCard } from './account-filter-card'

export const ReceivableFilter = ({ cardSelected, onSelected, userIds }) => {
  const { receivableData, isLoading } = useRecievableCards({ userIds })
  enum PayableCardTypes {
    PastDue = '1',
    SevenDays = '2',
    EightToTenDays = '3',
    TenToTwentyDays = '4',
    TwentyToThirdayDays = '5',
    ThirtyToFourtyDays = '6',
  }
  const pastDue = receivableData?.arList?.filter(a => a.durationCategory === PayableCardTypes.PastDue)
  const sevenDays = receivableData?.arList?.filter(a => a.durationCategory === PayableCardTypes.SevenDays)
  const eightToTenDays = receivableData?.arList?.filter(a => a.durationCategory === PayableCardTypes.EightToTenDays)
  const tenToTwentyDays = receivableData?.arList?.filter(a => a.durationCategory === PayableCardTypes.TenToTwentyDays)
  const twentyToThirdayDays = receivableData?.arList?.filter(
    a => a.durationCategory === PayableCardTypes.TwentyToThirdayDays,
  )
  const thirtyToFourtyDays = receivableData?.arList?.filter(
    a => a.durationCategory === PayableCardTypes.ThirtyToFourtyDays,
  )

  const pastDueSum = receivableData?.arList
    ?.filter(a => a.durationCategory === PayableCardTypes.PastDue)
    .map(a => a.amount)
    .reduce((prev, curr) => prev + curr, 0)
  const sevenDaysSum = receivableData?.arList
    ?.filter(a => a.durationCategory === PayableCardTypes.SevenDays)
    .map(a => a.amount)
    .reduce((sum, current) => sum + current, 0)
  const EightToTenDaysSum = receivableData?.arList
    ?.filter(a => a.durationCategory === PayableCardTypes.EightToTenDays)
    .map(a => a.amount)
    .reduce((sum, current) => sum + current, 0)
  const TenToTwentyDaysSum = receivableData?.arList
    ?.filter(a => a.durationCategory === PayableCardTypes.TenToTwentyDays)
    .map(a => a.amount)
    .reduce((sum, current) => sum + current, 0)
  const TwentyToThirdayDaysSum = receivableData?.arList
    ?.filter(a => a.durationCategory === PayableCardTypes.TwentyToThirdayDays)
    .map(a => a.amount)
    .reduce((sum, current) => sum + current, 0)
  const ThirtyToFourtyDaysSum = receivableData?.arList
    ?.filter(a => a.durationCategory === PayableCardTypes.ThirtyToFourtyDays)
    .map(a => a.amount)
    .reduce((sum, current) => sum + current, 0)

  const payableData = [
    {
      id: '1',
      text: 'Past Due',
      value: currencyFormatter(pastDueSum),
      number: pastDue?.length,
      iconColor: '#FEB2B2',
    },
    {
      id: '2',
      text: '7 days',
      value: currencyFormatter(sevenDaysSum),
      number: sevenDays?.length,
      iconColor: '#FBD38D',
    },
    {
      id: '3',
      text: '14 Days',
      value: currencyFormatter(EightToTenDaysSum),
      number: eightToTenDays?.length,
      iconColor: '#9AE6B4',
    },
    {
      id: '4',
      text: '20 Days',
      value: currencyFormatter(TenToTwentyDaysSum),
      number: tenToTwentyDays?.length,
      iconColor: '#90CDF4',
    },
    {
      id: '5',
      text: '30 Days',
      value: currencyFormatter(TwentyToThirdayDaysSum),
      number: twentyToThirdayDays?.length,
      iconColor: '#D6BCFA',
    },
    {
      id: '6',
      text: '40 Days',
      value: currencyFormatter(ThirtyToFourtyDaysSum),
      number: thirtyToFourtyDays?.length,
      iconColor: '#FBB6CE',
    },
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
