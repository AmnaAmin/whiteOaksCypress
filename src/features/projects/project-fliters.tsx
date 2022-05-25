import { Box, Center } from '@chakra-ui/react'
import SummaryIconFirst, {
  SummaryIconFifth,
  SummaryIconForth,
  SummaryIconSecond,
  SummaryIconThird,
} from 'icons/project-icons'
import numeral from 'numeral'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useVendorCards } from 'utils/vendor-dashboard'
import { ProjectCard } from './project-card'

const IconElement: React.FC<{ Icon: React.ElementType; bg: string }> = ({ Icon, bg }) => {
  return (
    <Center bg={bg} rounded="50%" w={{ base: '40px', md: '48px' }} h={{ base: '40px', md: '48px' }}>
      <Icon />
    </Center>
  )
}

const useVendorCardJson = cards => {
  const { t } = useTranslation()
  return [
    {
      id: 'active',
      title: t('activeWO'),
      number: cards?.find(c => c.label === 'active')?.count,
      IconElement: <IconElement Icon={SummaryIconFirst} bg="#F9F1DA" />,
    },
    {
      id: 'pastDue',
      title: t('pastDue'),
      number: cards?.find(c => c.label === 'pastDue')?.count,
      IconElement: <IconElement Icon={SummaryIconSecond} bg="#E5ECF9" />,
    },
    {
      id: 'invoiced',
      title: t('completedInvoiced'),
      number: cards?.find(c => c.label === 'invoiced')?.count,
      IconElement: <IconElement Icon={SummaryIconThird} bg="#FCE8D8" />,
    },
    {
      id: 'notInvoiced',
      title: t('completednotPaid'),
      number: cards?.find(c => c.label === 'declined')?.count,
      IconElement: <IconElement Icon={SummaryIconForth} bg="#E2EFDF" />,
    },
    {
      id: 'pendingTransactionsProjectsCount',
      title: t('upcomingPayments'),
      number: numeral(cards?.find(c => c.label === 'upcomingInvoiceTotal')?.count).format('($0.00a)'), // HK|WOA-1736
      IconElement: <IconElement Icon={SummaryIconFifth} bg="#FAE6E5" />,
      disabled: true,
    },
  ]
}

export const ProjectFilters = ({ onSelectCard, selectedCard }) => {
  const { data: values } = useVendorCards()
  const cards = useVendorCardJson(values)

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
        gridGap="5px"
      >
        {cards.map(card => {
          return <ProjectCard key={card.id} {...card} onSelectCard={onSelectCard} selectedCard={selectedCard} />
        })}
      </Box>
    </>
  )
}
