import { Box, Icon } from '@chakra-ui/react'

import React from 'react'
// import { useTranslation } from 'react-i18next'
import { BiClipboard, BiFile, BiHourglass, BiMessageSquareError } from 'react-icons/bi'
import { useVendorCards } from 'utils/pc-projects'
import VendorFilterCard from './vendor-filter-card'

const useVendorCardJson = cards => {
  // const { t } = useTranslation()
  return [
    {
      id: 'active',
      title: 'Active',
      number: cards?.find(items => items.status === 12)?.count,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiFile} />,
      bgColor: '#F9F1DA',
    },
    {
      id: 'inActive',
      title: 'In Active',
      number: cards?.find(items => items.status === 13)?.count,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiClipboard} />,
      bgColor: '#E5ECF9',
    },
    {
      id: 'doNotUse',
      title: 'Do Not Use',
      number: cards?.find(items => items.status === 14)?.count,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiMessageSquareError} />,
      bgColor: '#E6FFFA',
    },
    {
      id: 'expired',
      title: 'Expired',
      number: cards?.find(items => items.status === 15)?.count,
      IconElement: <Icon color="#4A5568" boxSize={7} as={BiHourglass} />,
      bgColor: '#FCE8D8',
    },
  ]
}

export const VendorFilters = ({ onSelectCard, selectedCard }) => {
  const { data: values } = useVendorCards()
  const cards = useVendorCardJson(values)

  return (
    <>
      <Box
        justifyContent="space-between"
        w="100%"
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="6"
      >
        {cards.map(card => {
          return <VendorFilterCard key={card.id} {...card} onSelectCard={onSelectCard} selectedCard={selectedCard} />
        })}
      </Box>
    </>
  )
}
