import { Grid } from '@chakra-ui/react'
import { AccountFilterCard } from './account-filter-card'

const payableData = [
  {
    id: '1',
    text: 'Past Due',
    value: '$299,354.87',
    number: 154,
    iconColor: 'red.200',
  },
  {
    id: '2',
    text: '7 days',
    value: '$299,354.87',
    number: 13,
    iconColor: 'orange.200',
  },
  {
    id: '3',
    text: '14 Days',
    value: '$299,354.87',
    number: 5,
    iconColor: 'green.200',
  },
  {
    id: '4',
    text: '20 Days',
    value: '$299,354.87',
    number: 5,
    iconColor: 'blue.200',
  },
  {
    id: '5',
    text: '30 Days',
    value: '$299,354.87',
    number: 5,
    iconColor: 'purple.200',
  },
  {
    id: '6',
    text: 'Overpayment',
    value: '30 Days',
    number: 2,
    iconColor: 'pink.200',
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
