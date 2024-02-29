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
  SummaryIconAwaitingPunch,
} from 'icons/pc-project-icons'
import React from 'react'
import { useProjectCards } from 'api/pc-projects'
import { ProjectCard } from 'features/common/project-card'
import { useTranslation } from 'react-i18next'
import { BiFlag } from 'react-icons/bi'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

const IconElement: React.FC<{ Icon: React.ElementType; bg: string }> = ({ Icon, bg }) => {
  return (
    <Center bg={bg} rounded="50%" w={{ base: '40px', md: '48px' }} h={{ base: '40px', md: '48px' }}>
      <Icon />
    </Center>
  )
}

const useProjectCardJson = cards => {
  const { t } = useTranslation()
  const hidePaidProjects = useRoleBasedPermissions()?.permissions?.includes('PROJECT.PAID.HIDE')
  let cardArray = [
    {
      id: 'new',
      title: t('projects.projectFilter.new'),
      value: 'new',
      number: cards?.find(c => c?.status === 7)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconFirst} bg="#F9F1DA" />,
    },
    {
      id: 'active',
      title: t('projects.projectFilter.active'),
      value: 'active',
      number: cards?.find(c => c?.status === 8)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconSecond} bg="#E5ECF9" />,
    },
    {
      id: 'awaiting_punch',
      title: t('projects.projectFilter.awaitingPunch'),
      value: 'awaiting punch',
      number: cards?.find(c => c?.status === 190)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconAwaitingPunch} bg="#F8F3FD" />,
    },
    {
      id: 'punch',
      title: t('projects.projectFilter.punch'),
      value: 'punch',
      number: cards?.find(c => c?.status === 9)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconThird} bg="#E6FFFA" />,
    },
    {
      id: 'reconcile',
      title: t('projects.projectFilter.reconcile'),
      value: 'reconcile',
      number: cards?.find(c => c?.status === 120)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconEleventh} bg="#F8F6CD" />,
    },
    {
      id: 'closed',
      title: t('projects.projectFilter.closed'),
      value: 'closed',
      number: cards?.find(c => c?.status === 10)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconForth} bg="#FCE8D8" />,
    },
    {
      id: 'invoiced',
      title: t('projects.projectFilter.invoiced'),
      value: 'invoiced',
      number: cards?.find(c => c?.status === 11)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconEight} bg="#FAE6E5" />,
    },

    {
      id: 'clientPaid',
      title: t('projects.projectFilter.clientPaid'),
      value: 'client paid',
      number: cards?.find(c => c?.status === 72)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconSixth} bg="#FEEBCB" />,
    },
    {
      id: 'overpayment',
      title: t('projects.projectFilter.overpayment'),
      value: 'overpayment',
      number: cards?.find(c => c?.status === 109)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconSeventh} bg="#E2EFDF" />,
    },
    {
      id: 'pastDue',
      title: t('projects.projectFilter.pastDue'),
      value: 'past due',
      number: cards?.find(c => c?.status === 62)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconFifth} bg="#EBF8FF" />,
    },
    {
      id: 'disputed',
      title: t('projects.projectFilter.disputed'),
      value: 'disputed',
      number: cards?.find(c => c?.status === 220)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconNinth} bg="#FFF5F7" />,
    },
    {
      id: 'collection',
      title: t('projects.projectFilter.collection'),
      value: 'collection',
      number: cards?.find(c => c?.status === 119)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconTenth} bg="#FAF5FF" />,
    },
    {
      id: 'flagged',
      title: t('projects.projectFilter.flagged'),
      value: 'flagged',
      number: cards?.find(c => c?.status === 1)?.count || 0,
      IconElement: <IconElement Icon={BiFlag} bg="#FFE1E1" />,
    },
    {
      id: 'preinvoiced',
      title: t('projects.projectFilter.preinvoiced'),
      value: 'preinvoiced',
      number: cards?.find(c => c?.status === 2)?.count || 0,
      IconElement: <IconElement Icon={SummaryIconEight} bg="#FAE6E5" />,
    },
  ]

  if (hidePaidProjects) {
    cardArray = cardArray?.filter(c => !['clientPaid', 'overpayment'].includes(c?.id))
  }
  return cardArray
}

export type ProjectCardProps = {
  onSelectCard: (string: string) => void
  selectedCard: string
  selectedUsers?: any
  onSelectFlagged?: (string: string[] | [] | null) => void
  selectedFlagged?: any
  selectedPreInvoiced?: boolean
  onSelectPreInvoiced?: (selection: boolean) => void
  clear?: any
}

export const ProjectFilters: React.FC<ProjectCardProps> = ({
  onSelectCard,
  selectedCard,
  selectedUsers,
  onSelectFlagged,
  selectedFlagged,
  selectedPreInvoiced,
  onSelectPreInvoiced,
  clear
}) => {
  const { data: values, isLoading } = useProjectCards(selectedUsers?.join(','))
  const cards = useProjectCardJson(values)
  return (
    <>
      <Grid gap={3} gridTemplateColumns="repeat(auto-fit,minmax(230px,1fr))">
        {cards.map(card => {
          if (card.id === 'flagged') {
            return (
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
            )
          } else if (card.id === 'preinvoiced') {
            return (<ProjectCard
              clear={clear}
              key={card.id}
              {...card}
              onSelectCard={onSelectCard}
              selectedCard={selectedCard}
              isLoading={isLoading}
              selectedPreInvoiced={selectedPreInvoiced}
              onSelectPreInvoiced={onSelectPreInvoiced}
            />)
          } else {
            return (
              <ProjectCard
                clear={clear}
                key={card.id}
                {...card}
                onSelectCard={onSelectCard}
                selectedCard={selectedCard}
                isLoading={isLoading}
              />
            )
          }
        })}
      </Grid>
    </>
  )
}
