import React, { useState } from 'react'
import { Box, Flex, Spacer, VStack, Text, FormLabel, useMediaQuery, Heading } from '@chakra-ui/react'
import { VendorScore } from 'components/VendorScore/vendor-score'
import { Card } from 'components/card/card'
import Overview from 'components/chart/Overview'
import PaidChart from 'components/chart/paid-chart'
// import { usePaidWOAmountByYearAndMonthTotal } from 'api/vendor-dashboard'
import Dropdown from 'components/dropdown-menu/Dropdown'
import { MonthOption, monthOptions, monthOptionsPaidGraph } from 'utils/date-time-utils'
import { useTranslation } from 'react-i18next'

import { useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'
import { ProjectFilters } from 'features/vendor/projects/project-fliters'
import { useNavigate } from 'react-router-dom'
import { UpcomingPaymentTable } from 'features/vendor/dashboard/upcoming-payment-table'
import { DASHBOARD } from 'features/vendor/dashboard/dashboard.i18n'
import { boxShadow } from 'theme/common-style'

const ConstructionDashboard: React.FC = () => {
  const { vendorId } = useUserProfile() as Account

  const [isMobile] = useMediaQuery('(max-width: 480px)')
  const [isLessThanOrEq320] = useMediaQuery('(max-width: 320px)')

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

  if (isLessThanOrEq320) {
    return (
      <Box mt="50%">
        <Heading as="h3" size="sm">
          Sorry !
        </Heading>
        <Text fontSize="sm">
          {t(
            'Your resolution is reached at a limit, please switch to a better resolution or change your device orientation from vertical to horizontal',
          )}
          .
        </Text>
      </Box>
    )
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
        <Card p={0} borderRadius="6px" flex={1} bg="#FDFDFF" style={boxShadow}>
          <Flex mb="5px" mt="25px">
            <Text color="gray.700" fontStyle="Poppins" fontWeight={500} fontSize="18px" lineHeight="28px" ml="39px">
              {t('WOstatus')}
            </Text>
          </Flex>
          {isMobile ? <br /> : null}
          <Overview vendorId={vendorId} />
        </Card>

        <Card
          p={0}
          pl={3}
          borderRadius="6px"
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
            <Box mt="20px" mr="30px" w="145px" border={'1px solid #CBD5E0'} borderRadius={'6px'}>
              <Dropdown options={monthOptionsPaidGraph} onChange={setPaidOption} defaultValue={paidOption} />
            </Box>
          </Flex>

          <PaidChart filterChart={paidOption} />
        </Card>
      </Flex>
      <Card w="100%" style={boxShadow} borderRadius={'6px'}>
        <Box mt={1} ml={1} mb={1}>
          <FormLabel fontSize={'18px'} lineHeight={'28px'} color="gray.700" fontWeight={500}>
            {t(`${DASHBOARD}.upcomingPayment`)}
          </FormLabel>
          <UpcomingPaymentTable />
        </Box>
      </Card>
      <Box></Box>
    </VStack>
  )
}

export default ConstructionDashboard
