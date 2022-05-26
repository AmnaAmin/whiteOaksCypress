import React, { useState } from 'react'
import { Box, Flex, Spacer, VStack, Text } from '@chakra-ui/react'

import { ProjectSummary } from 'features/dashboard/project-summary'
import { VendorScore } from 'components/VendorScore/vendor-score'
import { Card } from 'components/card/card'
import Overview from 'components/chart/Overview'
import PaidChart from 'components/chart/paid-chart'
// import { usePaidWOAmountByYearAndMonthTotal } from 'utils/vendor-dashboard'
import Dropdown from 'components/dropdown-menu/Dropdown'

import { MonthOption, monthOptions } from 'utils/date-time-utils'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'

const Dashboard: React.FC = () => {
  const { vendorId } = useUserProfile() as Account

  // const { data: woByVendorsPerMonth } = useWoByVendorsPerMonth(vendorId);
  // const { onToggle } = useDisclosure()
  const [paidOption, setPaidOption] = useState<MonthOption>(monthOptions[0])
  // const { data: paidTotal = '' } = usePaidWOAmountByYearAndMonthTotal(paidOption?.year ?? '', paidOption?.month ?? '')
  const { t } = useTranslation()

  return (
    <VStack w="100%" zIndex={2}>
      <Box w={{ base: '100%' }}>
        <VendorScore vendorId={vendorId} />
      </Box>

      <Box w="100%">
        <ProjectSummary />
      </Box>
      <Flex
        direction={{
          base: 'column',
          xl: 'row',
        }}
        justifyContent="stretch"
        w="100%"
        pb="10px"
      >
        <Card p={0} rounded="13px" flex={1} bg="#FDFDFF">
          <Flex mb="5px" mt="25px">
            <Text color="gray.600" fontStyle="normal" fontWeight={500} fontSize="18px" lineHeight="28px" ml="39px">
              {t('WOstatus')}
            </Text>
          </Flex>
          <Overview vendorId={vendorId} />
        </Card>

        <Card
          p={0}
          pl={3}
          rounded="13px"
          flex={1}
          ml={{ base: 0, xl: '15px' }}
          mt={{ base: '30px', xl: 0 }}
          bg="#FDFDFF"
        >
          <Flex mb="20px">
            <Text
              mt="25px"
              ml="9px"
              color="gray.600"
              fontStyle="normal"
              fontWeight={500}
              fontSize="18px"
              lineHeight="28px"
            >
              {/* {t('paid')} */}
              WO Paid
            </Text>
            <Spacer />
            <Box mt="20px" mr="30px" w="140px">
              <Dropdown options={monthOptions} onChange={setPaidOption} defaultValue={paidOption} />
            </Box>
          </Flex>

          <PaidChart filterChart={paidOption} />
        </Card>
      </Flex>
    </VStack>
  )
}

export default Dashboard
