import { Box, Center } from '@chakra-ui/react'
import SummaryIconFirst, {
  SummaryIconFifth,
  SummaryIconForth,
  SummaryIconSecond,
  SummaryIconThird,
  SummaryIconSixth,
  SummaryIconSeventh,
  SummaryIconEight,
} from 'icons/pc-project-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useProjectCards } from 'utils/pc-projects'
import { ProjectCard } from '../projects/project-card'

const IconElement: React.FC<{ Icon: React.ElementType; bg: string }> = ({ Icon, bg }) => {
  return (
    <Center bg={bg} rounded="50%" w={{ base: '40px', md: '48px' }} h={{ base: '40px', md: '48px' }}>
      <Icon />
    </Center>
  )
}

const useProjectCardJson = cards => {
  const { t } = useTranslation()
  return [
    {
      id: 'new',
      title: 'New',
      number: cards?.find(c => c.status === 7)?.count,
      IconElement: <IconElement Icon={SummaryIconFirst} bg="#F9F1DA" />,
    },
    {
      id: 'active',
      title: t('activeWO'),
      number: cards?.find(c => c.status === 8)?.count,
      IconElement: <IconElement Icon={SummaryIconSecond} bg="#E5ECF9" />,
    },
    {
      id: 'punch',
      title: 'Punch',
      number: cards?.find(c => c.status === 9)?.count,
      IconElement: <IconElement Icon={SummaryIconThird} bg="#E6FFFA" />,
    },
    {
      id: 'closed',
      title: 'Closed',
      number: cards?.find(c => c.status === 10)?.count,
      IconElement: <IconElement Icon={SummaryIconForth} bg="#FCE8D8" />,
    },
    {
      id: 'pastDue',
      title: t('pastDue'),
      number: cards?.find(c => c.status === 62)?.count,
      IconElement: <IconElement Icon={SummaryIconFifth} bg="#EBF8FF" />,
    },
    {
      id: 'clientPaid',
      title: 'Client Paid',
      number: cards?.find(c => c.status === 72)?.count,
      IconElement: <IconElement Icon={SummaryIconSixth} bg="#FEEBCB" />,
    },
    {
      id: 'overpayment',
      title: 'Overpayment',
      number: cards?.find(c => c.status === 63)?.count, //verify
      IconElement: <IconElement Icon={SummaryIconSeventh} bg="#E2EFDF" />,
    },
    {
      id: 'invoiced',
      title: 'Invoiced',
      number: cards?.find(c => c.status === 11)?.count,
      IconElement: <IconElement Icon={SummaryIconEight} bg="#FAE6E5" />,
    },
  ]
}

export const ProjectFilters = ({ onSelectCard, selectedCard }) => {
  const { data: values } = useProjectCards()
  const cards = useProjectCardJson(values)
  console.log(cards)

  return (
    <>
      <Box
        justifyContent="space-between"
        w="100%"
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        // gridTemplateColumns={{
        //   base: 'repeat(auto-fit, minmax(105px,1fr))',
        //   sm: 'repeat(auto-fit, minmax(125px,1fr))',
        //   md: 'repeat(auto-fit, minmax(205px,1fr))',
        // }}
        gridGap="15px"
      >
        {cards.map(card => {
          return <ProjectCard key={card.id} {...card} onSelectCard={onSelectCard} selectedCard={selectedCard} />
        })}
      </Box>
    </>
  )
}
