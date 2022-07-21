import { Grid } from '@chakra-ui/react'
import { AccountFilterCard } from './account-filter-card'

const payableData = [
  {
    id: '1',
    text: 'Past Due',
    value: '$299,354.87',
    number: 154,
    iconColor: '#FEB2B2',
  },
  {
    id: '2',
    text: '7 days',
    value: '$299,354.87',
    number: 13,
    iconColor: '#FBD38D',
  },
  {
    id: '3',
    text: '14 Days',
    value: '$299,354.87',
    number: 5,
    iconColor: '#9AE6B4',
  },
  {
    id: '4',
    text: '20 Days',
    value: '$299,354.87',
    number: 5,
    iconColor: '#90CDF4',
  },
  {
    id: '5',
    text: '30 Days',
    value: '$299,354.87',
    number: 5,
    iconColor: '#D6BCFA',
  },
  {
    id: '6',
    text: 'Overpayment',
    value: '30 Days',
    number: 2,
    iconColor: '#FBB6CE',
  },
]

export const PayableFiltter = ({ cardSelected, onSelected }) => {
  return (
    <Grid gap={3} gridTemplateColumns="repeat(auto-fit,minmax(160px,1fr))">
      {payableData.map(data => {
        return (
          <AccountFilterCard
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
