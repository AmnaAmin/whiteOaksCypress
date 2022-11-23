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

  const [seeDetails, setSeeDetails] = useState(false)
  const [hoverButton, setHoverButton] = useState(false)

  return (
    <VStack w="100%" zIndex={2} spacing="14px">
      <Box w={{ base: '100%' }}>
        <VendorScore vendorId={vendorId} seeDetails={seeDetails} setSeeDetails={setSeeDetails} />
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
              ml="25px"
              color="gray.600"
              fontStyle="normal"
              fontWeight={500}
              fontSize="18px"
              lineHeight="28px"
            >
              {t('WOpaid')}
            </Text>
            <Spacer />
            <Box mt="20px" mr="30px" w="140px">
              <Dropdown options={monthOptions} onChange={setPaidOption} defaultValue={paidOption} />
            </Box>
          </Flex>

          <PaidChart filterChart={paidOption} />
        </Card>
      </Flex>
      {seeDetails ? (
        <Box width="100%">
          <FormLabel variant="strong-lable" size={'lg'}>
            {t(`${DASHBOARD}.upcomingPayment`)}
          </FormLabel>
          <Box w="100%" onMouseEnter={() => setHoverButton(true)} onMouseLeave={() => setHoverButton(false)} pb={5}>
            <UpcomingPaymentTable
              setSeeDetails={setSeeDetails}
              setHoverButton={setHoverButton}
              seeDetails={seeDetails}
              hoverButton={hoverButton}
            />
          </Box>
        </Box>
      ) : (
        ''
      )}
    </VStack>
  )
}

export default Dashboard
