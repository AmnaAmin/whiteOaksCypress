import React, { useState } from 'react'
import { Box, Flex, VStack, FormLabel, HStack, Icon } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { useTranslation } from 'react-i18next'
import { ADMIN_DASHBOARD } from '../../features/admin-dashboard/admin-dashboard.i18n'
import { AdminProjectFilters } from 'features/admin-dashboard/admin-project-filters'
import SalesPerMonthGraph from 'features/admin-dashboard/sales-per-month-graph'
import { useRevenuePerClient, useRevenueVsProfit, useSalesPerMonth } from 'api/admin-dashboard'
import { barColors, lineColor } from 'features/admin-dashboard/admin-dashboard.utils'
import { IoMdClose } from 'react-icons/io'
import { FilteredProjectsData } from 'features/admin-dashboard/filtered-projects-table'
import RevenuePerClient from 'features/admin-dashboard/revenue-per-client-graph'
import RevenueVsProfit from 'features/admin-dashboard/revenue-vs-profit'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const [selectedCard, setSelectedCard] = useState<string | null>()
  const { salesPerMonth } = useSalesPerMonth()
  const { revenueProfitGraph } = useRevenueVsProfit()
  const { revenuePerClient } = useRevenuePerClient()

  const onCardClick = params => {
    setSelectedCard(params)
  }
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('ADMINDASHBOARD.READ')
  return (
    <VStack w="100%" zIndex={2} spacing="14px">
      <Box w="100%">
        <AdminProjectFilters onSelectCard={onCardClick} selectedCard={selectedCard} />
      </Box>

      {selectedCard && (
        <Card w="100%">
          <HStack>
            <Flex w="100%" justifyContent={'center'} position="relative">
              <FormLabel pt="5px" variant="strong-label" size="xlg">
                {t(`${ADMIN_DASHBOARD}.projects`)}
              </FormLabel>
              <Box position={'absolute'} top={'0px'} right={'0px'}>
                <Icon
                  as={IoMdClose}
                  fontSize="20px"
                  cursor={'pointer'}
                  onClick={() => {
                    setSelectedCard(null)
                  }}
                />
              </Box>
            </Flex>
          </HStack>
          <Box mt="20px">
            <FilteredProjectsData selectedCard={selectedCard} isReadOnly={isReadOnly} />
          </Box>
        </Card>
      )}

      <Card w="100%">
        <Flex w="100%" justifyContent={'center'} mt={5} mb={5}>
          <FormLabel variant="strong-label" size="xlg">
            {t(`${ADMIN_DASHBOARD}.salesPerMonth`)}
          </FormLabel>
        </Flex>
        {salesPerMonth && <SalesPerMonthGraph data={salesPerMonth} bar={barColors} line={lineColor} />}
      </Card>

      <Card w="100%">
        <Flex w="100%" justifyContent={'center'} mt={5} mb={5}>
          <FormLabel variant="strong-label" size="xlg">
            {t(`${ADMIN_DASHBOARD}.profitAndRevenue`)}
          </FormLabel>
        </Flex>
        {revenueProfitGraph && <RevenueVsProfit />}
      </Card>

      <Card w="100%">
        <Flex w="100%" justifyContent={'center'} mt={5} mb={5}>
          <FormLabel variant="strong-label" size="xlg">
            {t(`${ADMIN_DASHBOARD}.revenuePerClient`)}
          </FormLabel>
        </Flex>
        {revenuePerClient && <RevenuePerClient />}
      </Card>
    </VStack>
  )
}

export default Dashboard
