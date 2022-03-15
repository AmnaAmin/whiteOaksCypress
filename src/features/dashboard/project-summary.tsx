import React from 'react'
import { HStack, Text, Flex } from '@chakra-ui/layout'
import { ProjectSummaryCard } from './project-summary-card'
import { BiTrendingDown, BiTrendingUp } from 'react-icons/bi'
import { useVendorCards } from 'utils/vendor-dashboard'
// import { formatCurrencyNumberCompact } from '../../../shared/util/string-utils';
import SummaryIconFirst, {
  SummaryIconFifth,
  SummaryIconForth,
  SummaryIconSecond,
  SummaryIconThird,
} from '../../icons/project-icons'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import numeral from 'numeral'

export const ProjectSummary = () => {
  const { data: cards, isLoading } = useVendorCards()
  const { t } = useTranslation()

  return (
    <Flex
      boxShadow="1px 0px 70px rgb(0 0 0 / 10%)"
      border="1px solid white"
      borderRadius="10px"
      bg="whiteAlpha.900"
      direction="column"
      boxSizing="border-box"
      py="7"
      px={{ base: '3', lg: '7' }}
    >
      <Text fontSize="22px" fontWeight="600">
        {t('projectSummary')}
      </Text>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        display="grid"
        gridTemplateColumns={{
          base: 'repeat(2,1fr)',
          md: 'repeat(3,1fr)',
          lg: 'repeat(3,1fr)',
          xl: 'repeat(5,1fr)',
        }}
        gridRowGap={{ base: '20px' }}
      >
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BiTrendingUp}
          BigIcon={SummaryIconFirst}
          number={cards?.find(c => c.label === 'active')?.count}
          name={t('activeWO')}
          Iconbgcolor={'gray.100'}
          TopnumberbgColor={'red.100'}
          numberColor={'rose.500'}
        />
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BiTrendingDown}
          BigIcon={SummaryIconSecond}
          number={cards?.find(c => c.label === 'pastDue')?.count}
          name={t('pastDue')}
          Iconbgcolor={'blue.50'}
          TopnumberbgColor={'green.100'}
          numberColor={'green.500'}
        />
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BiTrendingUp}
          BigIcon={SummaryIconThird}
          number={cards?.find(c => c.label === 'completedAndInvoiced')?.count}
          name={t('completedInvoiced')}
          Iconbgcolor={'purple.50'}
          TopnumberbgColor={'red.100'}
          numberColor={'rose.500'}
        />
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BiTrendingDown}
          BigIcon={SummaryIconForth}
          number={cards?.find(c => c.label === 'notInvoiced')?.count}
          name={t('completednotPaid')}
          Iconbgcolor={'red.50'}
          TopnumberbgColor={'green.100'}
          numberColor={'green.500'}
        />
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BiTrendingDown}
          BigIcon={SummaryIconFifth}
          name={t('upcomingPayments')}
          Iconbgcolor={'green.50'}
          TopnumberbgColor={'green.100'}
          numberColor={'green.500'}
          numbertext={numeral(cards?.find(c => c.label === 'upcomingInvoiceTotal')?.count).format('($0.00a)')} // HK|WOA-1736
        />
      </HStack>
    </Flex>
  )
}
export default ProjectSummary
