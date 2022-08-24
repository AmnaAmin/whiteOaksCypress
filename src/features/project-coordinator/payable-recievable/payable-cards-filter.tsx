import { Grid } from '@chakra-ui/react'
import { useAccountPayable } from 'utils/account-payable'
import { currencyFormatter } from 'utils/stringFormatters'
import { AccountFilterCard } from './account-filter-card'

export const PayableCardsFilter = ({ cardSelected, onSelected }) => {
  const { data: PayableData, isLoading } = useAccountPayable()
  const data = PayableData?.workOrders
  enum PayableCardTypes {
    PastDue = '1',
    SevenDays = '2',
    EightToTenDays = '3',
    TenToTwentyDays = '4',
    TwentyToThirdayDays = '5',
    ThirtyToFourtyDays = '6',
  }

  const pastDue = data?.filter(a => a.durationCategory === PayableCardTypes.PastDue)
  const sevenDays = data?.filter(a => a.durationCategory === PayableCardTypes.SevenDays)
  const eightToTenDays = data?.filter(a => a.durationCategory === PayableCardTypes.EightToTenDays)
  const tenToTwentyDays = data?.filter(a => a.durationCategory === PayableCardTypes.TenToTwentyDays)
  const twentyToThirdayDays = data?.filter(a => a.durationCategory === PayableCardTypes.TwentyToThirdayDays)
  const thirtyToFourtyDays = data?.filter(a => a.durationCategory === PayableCardTypes.ThirtyToFourtyDays)

  const pastDueSum = data
    ?.filter(a => a.durationCategory === PayableCardTypes.PastDue)
    .map(a => a.invoiceAmount)
    .reduce((prev, current) => prev + current, 0)
  const sevenDaysSum = data
    ?.filter(a => a.durationCategory === PayableCardTypes.SevenDays)
    .map(a => a.invoiceAmount)
    .reduce((sum, current) => sum + current, 0)
  const EightToTenDaysSum = data
    ?.filter(a => a.durationCategory === PayableCardTypes.EightToTenDays)
    .map(a => a.invoiceAmount)
    .reduce((sum, current) => sum + current, 0)
  const TenToTwentyDaysSum = data
    ?.filter(a => a.durationCategory === PayableCardTypes.TenToTwentyDays)
    .map(a => a.invoiceAmount)
    .reduce((sum, current) => sum + current, 0)
  const TwentyToThirdayDaysSum = data
    ?.filter(a => a.durationCategory === PayableCardTypes.TwentyToThirdayDays)
    .map(a => a.invoiceAmount)
    .reduce((sum, current) => sum + current, 0)
  const ThirtyToFourtyDaysSum = data
    ?.filter(a => a.durationCategory === PayableCardTypes.ThirtyToFourtyDays)
    .map(a => a.invoiceAmount)
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
      text: 'Overpayment',
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
