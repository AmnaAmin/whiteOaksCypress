import React, { useState } from 'react'
import { Box, Flex, Spacer, VStack, Text, useDisclosure, Heading } from '@chakra-ui/react'

import { ProjectSummary } from '../features/dashboard/project-summary'
import { VendorScore } from '../components/VendorScore/vendor-score'
import { Card } from '../components/card/card'
import Overview from '../components/chart/Overview'
import PaidChart from '../components/chart/paid-chart'
import { usePaidWOAmountByYearAndMonthTotal } from 'utils/vendor-dashboard'
import Dropdown from '../components/dropdown-menu/Dropdown'

import { MonthOption, monthOptions } from 'utils/date-time-utils'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { numberWithCommas } from 'utils'
import { useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'

export const Dashboard: React.FC = () => {
  const { vendorId } = useUserProfile() as Account

  // const { data: woByVendorsPerMonth } = useWoByVendorsPerMonth(vendorId);
  const { onToggle } = useDisclosure()
  const [paidOption, setPaidOption] = useState<MonthOption>(monthOptions[0])
  const { data: paidTotal = '' } = usePaidWOAmountByYearAndMonthTotal(paidOption?.year ?? '', paidOption?.month ?? '')
  const { t } = useTranslation()

  return (
    <VStack w="100%" zIndex={2}>
      <Box w={{ base: '100%' }}>
        <VendorScore vendorId={vendorId} />
      </Box>

      <Box w="100%">
        <ProjectSummary />
      </Box>

      <Box w="100%">
        <Text
          fontSize="20px"
          fontWeight={700}
          fontStyle="normal"
          color="#4A5568"
          paddingInlineStart="14px"
          m="15px 0 10px"
          lineHeight="28px"
        >
          {t('WOstatusGraph')}
        </Text>
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
        <Card rounded="13px" flex={1}>
          <Flex mb="40px" mt="20px">
            <Text color="#4A5568" fontStyle="normal" fontWeight={600} fontSize="18px" lineHeight="28px" ml="17px">
              {t('overview')}
            </Text>
          </Flex>
          <Overview vendorId={vendorId} />
        </Card>

        <Card p={0} rounded="13px" flex={1} ml={{ base: 0, xl: '12px' }} mt={{ base: '30px', xl: 0 }}>
          <Flex mb="40px">
            <Box
              pos="relative"
              onClick={onToggle}
              lineHeight="28px"
              fontStyle="normal"
              fontSize="18px"
              color="#4A5568"
              fontWeight={600}
              left="24px"
              top="39px"
            >
              {t('paid')}
              <Box
                bg="white"
                padding="20px 40px 20px 40px"
                mt="10px"
                mb="4px"
                boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)"
                rounded="8px"
              >
                <Text fontWeight={500} fontStyle="normal" fontSize="12px" color="#A3AED0">
                  {t('paidSmall')}
                </Text>

                <Heading fontSize="18px" fontWeight={600} fontStyle="normal" color="#4A5568">
                  ${numberWithCommas(paidTotal)}
                </Heading>
              </Box>
            </Box>
            <Spacer />
            <Box pos="relative" top="30px" right={35} w="180px">
              <Dropdown options={monthOptions} onChange={setPaidOption} defaultValue={paidOption} />
            </Box>
          </Flex>

          <PaidChart filterChart={paidOption} />
        </Card>
      </Flex>
    </VStack>
  )
}
