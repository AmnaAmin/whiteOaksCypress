import { Center, Grid } from '@chakra-ui/react'
import SummaryIconFirst, {
  SummaryIconFifth,
  SummaryIconForth,
  SummaryIconSecond,
  SummaryIconThird,
  SummaryIconSixth,
  SummaryIconSeventh,
  SummaryIconEight,
  SummaryIconNinth,
  SummaryIconTenth,
  SummaryIconEleventh,
} from 'icons/pc-project-icons'
import React from 'react'
import { useProjectCards } from 'api/pc-projects'
import { ProjectCard } from 'features/common/project-card'
import { useTranslation } from 'react-i18next'
import { BiDollar, BiFlag } from 'react-icons/bi'
import { FaHandshake } from 'react-icons/fa'

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
      title: t('projects.projectFilter.new'),
      value: 'new',
      number: cards?.find(c => c.status === 7)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconFirst} bg="#F9F1DA" />,
    },
    {
      id: 'active',
      title: t('projects.projectFilter.active'),
      value: 'active',
      number: cards?.find(c => c.status === 8)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconSecond} bg="#E5ECF9" />,
    },
    {
      id: 'punch',
      title: t('projects.projectFilter.punch'),
      value: 'punch',
      number: cards?.find(c => c.status === 9)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconThird} bg="#E6FFFA" />,
    },
    {
      id: 'reconcile',
      title: t('projects.projectFilter.reconcile'),
      value: 'reconcile',
      number: cards?.find(c => c.status === 120)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconEleventh} bg="#F8F6CD" />,
    },
    {
      id: 'closed',
      title: t('projects.projectFilter.closed'),
      value: 'closed',
      number: cards?.find(c => c.status === 10)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconForth} bg="#FCE8D8" />,
    },
    {
      id: 'invoiced',
      title: t('projects.projectFilter.invoiced'),
      value: 'invoiced',
      number: cards?.find(c => c.status === 11)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconEight} bg="#FAE6E5" />,
    },

    {
      id: 'clientPaid',
      title: t('projects.projectFilter.clientPaid'),
      value: 'client paid',
      number: cards?.find(c => c.status === 72)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconSixth} bg="#FEEBCB" />,
    },
    {
      id: 'overpayment',
      title: t('projects.projectFilter.overpayment'),
      value: 'overpayment',
      number: cards?.find(c => c.status === 109)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconSeventh} bg="#E2EFDF" />,
    },
    {
      id: 'pastDue',
      title: t('projects.projectFilter.pastDue'),
      value: 'past due',
      number: cards?.find(c => c.status === 62)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconFifth} bg="#EBF8FF" />,
    },
    {
      id: 'disputed',
      title: t('projects.projectFilter.disputed'),
      value: 'disputed',
      number: cards?.find(c => c.status === 220)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconNinth} bg="#FFF5F7" />,
    },
    {
      id: 'collection',
      title: t('projects.projectFilter.collection'),
      value: 'collection',
      number: cards?.find(c => c.status === 119)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconTenth} bg="#FAF5FF" />,
    },
    {
      id: 'flagged',
      title: t('projects.projectFilter.flagged'),
      value: 'flagged',
      number: cards?.find(c => c.status === 1)?.count || 0,
      IconElement: <IconElement Icon={BiFlag} bg="#FFE1E1" />,
    },
  ]
}

export type ProjectCardProps = {
  onSelectCard: (string) => void
  selectedCard: string
  selectedFPM?: any
  onSelectFlagged?: (string) => void
  selectedFlagged?: any
  clear?: any
}

export const ProjectFilters: React.FC<ProjectCardProps> = ({
  onSelectCard,
  selectedCard,
  selectedFPM,
  onSelectFlagged,
  selectedFlagged,
  clear,
}) => {
  const { data: values, isLoading } = useProjectCards(selectedFPM?.id)
  const cards = useProjectCardJson(values)

  return (
    <>
      <Grid gap={3} gridTemplateColumns="repeat(auto-fit,minmax(230px,1fr))">
        {cards.map(card => {
          return card.id === 'flagged' ? (
            <ProjectCard
              clear={clear}
              key={card.id}
              {...card}
              onSelectCard={onSelectCard}
              selectedCard={selectedCard}
              isLoading={isLoading}
              selectedFlagged={selectedFlagged}
              onSelectFlagged={onSelectFlagged}
            />
          ) : (
            <ProjectCard
              clear={clear}
              key={card.id}
              {...card}
              onSelectCard={onSelectCard}
              selectedCard={selectedCard}
              isLoading={isLoading}
            />
          )
        })}
      </Grid>
    </>
  )
}
