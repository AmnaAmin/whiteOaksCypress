import React, { useState } from 'react'
import { Box, Flex, Spacer, VStack, Text, FormLabel } from '@chakra-ui/react'
import { VendorScore } from 'components/VendorScore/vendor-score'
import { Card } from 'components/card/card'
import Overview from 'components/chart/Overview'
import PaidChart from 'components/chart/paid-chart'
// import { usePaidWOAmountByYearAndMonthTotal } from 'api/vendor-dashboard'
import Dropdown from 'components/dropdown-menu/Dropdown'
import { MonthOption, monthOptions } from 'utils/date-time-utils'
import { useTranslation } from 'react-i18next'

import { useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'
import { ProjectFilters } from 'features/vendor/projects/project-fliters'
import { useNavigate } from 'react-router-dom'
import { UpcomingPaymentTable } from 'features/vendor/dashboard/upcoming-payment-table'
import { DASHBOARD } from 'features/vendor/dashboard/dashboard.i18n'
import { boxShadow } from 'theme/common-style'

const Dashboard: React.FC = () => {
  const { vendorId } = useUserProfile() as Account

  // const { data: woByVendorsPerMonth } = useWoByVendorsPerMonth(vendorId);
  // const { onToggle } = useDisclosure()
  const [paidOption, setPaidOption] = useState<MonthOption>(monthOptions[0])
  // const { data: paidTotal = '' } = usePaidWOAmountByYearAndMonthTotal(paidOption?.year ?? '', paidOption?.month ?? '')
  const { t } = useTranslation()
  const [selectedCard] = useState<string>('')
  const navigate = useNavigate()
  const onCardClick = params => {
    navigate('/projects', { state: params })
  }

  return (
    <VStack w="100%" zIndex={2} spacing="11px">
      <Box w={{ base: '100%' }}>
        <VendorScore vendorId={vendorId} />
      </Box>

      <Box w="100%">
        <Box w="100%">
          <ProjectFilters onSelectCard={onCardClick} selectedCard={selectedCard} />
        </Box>
      </Box>
      <Flex
        direction={{
          base: 'column',
          xl: 'row',
        }}
        justifyContent="stretch"
        w="100%"
      >
        <Card p={0} rounded="13px" flex={1} bg="#FDFDFF" style={boxShadow}>
          <Flex mb="5px" mt="25px">
            <Text color="gray.700" fontStyle="Poppins" fontWeight={500} fontSize="18px" lineHeight="28px" ml="39px">
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
          ml={{ base: 0, xl: '11px' }}
          mt={{ base: '30px', xl: 0 }}
          bg="#FDFDFF"
          style={boxShadow}
        >
          <Flex mb="20px">
            <Text
              mt="25px"
              ml="25px"
              color="gray.700"
              fontStyle="normal"
              fontWeight={500}
              fontSize="18px"
              lineHeight="28px"
            >
              {t('WOpaid')}
            </Text>
            <Spacer />
            <Box mt="20px" mr="30px" w="140px" border={'1px solid #CBD5E0'} rounded={6}>
              <Dropdown options={monthOptions} onChange={setPaidOption} defaultValue={paidOption} />
            </Box>
          </Flex>

          <PaidChart filterChart={paidOption} />
        </Card>
      </Flex>
      <Card w="100%" style={boxShadow}>
        <Box mt={3} ml={1}>
          <FormLabel variant="strong-lable" fontSize={'18px'} lineHeight={'28px'}>
            {t(`${DASHBOARD}.upcomingPayment`)}
          </FormLabel>
          <UpcomingPaymentTable />
        </Box>
      </Card>
    </VStack>
  )
}

export default Dashboard
