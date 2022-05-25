import { Flex } from '@chakra-ui/layout'
import { ProjectSummaryCard } from './project-summary-card'
import { useVendorCards } from 'utils/vendor-dashboard'
// import { formatCurrencyNumberCompact } from '../../../shared/util/string-utils';

import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import numeral from 'numeral'
import { BsArrowDownShort } from 'react-icons/bs'
import { BiCalendarExclamation, BiDetail, BiDollar, BiFile, BiMessageSquareX } from 'react-icons/bi'

export const ProjectSummary = () => {
  const { data: cards, isLoading } = useVendorCards()
  const { t } = useTranslation()

  return (
    <Flex
      boxShadow="0px 1px 7px 0px rgb(0 0 0 / 10%)"
      border="1px solid white"
      borderRadius="15px"
      bg="whiteAlpha.900"
      direction="column"
      mb="15px"
      boxSizing="border-box"
      px={{ base: '5px', md: '25px', xl: 'unset' }}
      minH={123}
      justifyContent="center"
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        display="grid"
        gridTemplateColumns={{ base: 'repeat(auto-fit, minmax(125px,1fr))', sm: 'repeat(auto-fit, minmax(200px,1fr))' }}
        gridRowGap={{ base: '20px' }}
      >
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BsArrowDownShort}
          BigIcon={BiFile}
          number={cards?.find(c => c.label === 'active')?.count}
          name={t('activeWO')}
          Iconbgcolor={'#FBF3DC'}
          updownIconColor={'#E53E3E'}
          testId="summary-active"
        />
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BsArrowDownShort}
          BigIcon={BiCalendarExclamation}
          number={cards?.find(c => c.label === 'pastDue')?.count}
          name={t('pastDue')}
          Iconbgcolor={'#EAF3E7'}
          updownIconColor={'#E53E3E'}
          testId="summary-pastDue"
        />
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BsArrowDownShort}
          BigIcon={BiDetail}
          number={cards?.find(c => c.label === 'completedAndInvoiced')?.count}
          name={t('completedInvoiced')}
          Iconbgcolor={'#E8F0FF'}
          updownIconColor={'#E53E3E'}
          testId="summary-completedAndInvoiced"
        />
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BsArrowDownShort}
          BigIcon={BiMessageSquareX}
          number={cards?.find(c => c.label === 'notInvoiced')?.count}
          name={t('completednotPaid')}
          Iconbgcolor={'#FAE6E5'}
          updownIconColor={'#E53E3E'}
          testId="summary-notInvoiced"
        />
        <ProjectSummaryCard
          isLoading={isLoading}
          UpdownIcon={BsArrowDownShort}
          BigIcon={BiDollar}
          name={t('upcomingPayments')}
          Iconbgcolor={'#ECF2FE'}
          updownIconColor={'#E53E3E'}
          testId="summary-upcomingInvoiceTotal"
          numbertext={numeral(cards?.find(c => c.label === 'upcomingInvoiceTotal')?.count).format('($0.00a)')} // HK|WOA-1736
        />
      </Flex>
    </Flex>
  )
}
export default ProjectSummary
