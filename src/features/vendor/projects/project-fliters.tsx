import { Box, Center, useMediaQuery } from '@chakra-ui/react'
import { BiFile, BiDetail, BiMessageSquareX, BiCheckCircle, BiCalendarExclamation } from 'react-icons/bi'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useVendorCards } from 'api/vendor-dashboard'
import { ProjectCard } from '../../common/project-card'

const IconElement: React.FC<{ Icon: React.ElementType; bg: string }> = ({ Icon, bg }) => {
  return (
    <Center bg={bg} rounded="50%" w={{ base: '40px', md: '44px' }} h={{ base: '40px', md: '44px' }}>
      <Icon fill="#4A5568" style={{ width: '20px', height: '20px' }} />
    </Center>
  )
}

const useVendorCardJson = cards => {
  const { t } = useTranslation()
  return [
    {
      id: 'active',
      title: t('activeWO'),
      value: 'active',
      number: cards?.find(c => c.label === 'active')?.count,
      IconElement: <IconElement Icon={BiFile} bg="orange.100" />,
    },
    {
      id: 'pastDue',
      title: t('pastDue'),
      value: 'pastDue',
      number: cards?.find(c => c.label === 'pastDue')?.count,
      IconElement: <IconElement Icon={BiCalendarExclamation} bg="#E8F0FF" />,
    },
    {
      id: 'completed',
      title: t('completed'),
      value: 'completed',
      number: cards?.find(c => c.label === 'completed')?.count, // HK|WOA-1736
      IconElement: <IconElement Icon={BiCheckCircle} bg="#E7F8EC" />,
    },
    {
      id: 'invoiced',
      title: t('completedInvoiced'),
      value: 'invoiced',
      number: cards?.find(c => c.label === 'invoiced')?.count,
      IconElement: <IconElement Icon={BiDetail} bg="#E2EFDF" />,
    },
    {
      id: 'declined',
      title: t('completednotPaid'),
      value: 'declined',
      number: cards?.find(c => c.label === 'rejected')?.count,
      IconElement: <IconElement Icon={BiMessageSquareX} bg="#FAE6E5" />,
    },
  ]
}

export const ProjectFilters = ({ onSelectCard, selectedCard }) => {
  const { data: values, isLoading } = useVendorCards()
  const cards = useVendorCardJson(values)

  const [isMobile] = useMediaQuery('(max-width: 480px)')

  return (
    <>
      <Box
        justifyContent="space-between"
        w="100%"
        display="grid"
        gridTemplateColumns={{
          base: 'repeat(2, minmax(105px,1fr))',
          sm: 'repeat(auto-fit, minmax(125px,1fr))',
          md: 'repeat(auto-fit, minmax(205px,1fr))',
        }}
        gridGap="11px"
      >
        {cards.map((card, idx) => {
          const isLast = idx + 1 === cards.length && isMobile

          let customStyle = isLast
            ? {
                gridColumn: 'span 2',
              }
            : {}

          return (
            <ProjectCard
              key={card.id}
              {...card}
              onSelectCard={onSelectCard}
              selectedCard={selectedCard}
              isLoading={isLoading}
              disabled={card.number === 0}
              title={card.title}
              styles={customStyle}
            />
          )
        })}
      </Box>
    </>
  )
}
