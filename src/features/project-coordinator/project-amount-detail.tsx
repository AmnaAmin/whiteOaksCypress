import React, { useEffect, useState } from 'react'
import { Box, Center, CenterProps, Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import axios from 'axios'

const InfoStructureCard: React.FC<{ amount; isLoading: boolean } & CenterProps> = ({
  amount,
  children,
  isLoading,
  title,
  ...rest
}) => {
  return (
    <Center flexDir="column" borderRight="1px solid #E5E5E5" px={5} flex={rest.flex || 1} {...rest}>
      <Box fontSize="16px" fontWeight={400} color="gray.500">
        <Text color="gray.600">{title}</Text>
        {isLoading ? <BlankSlate size="sm" /> : children}
        <Text color="#4A5568" fontSize="18px" fontStyle="normal" fontWeight="600" top="71px">
          {amount}
        </Text>
      </Box>
    </Center>
  )
}

export const AmountDetailsCard: React.FC<{
  projectData: Project
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  const { t } = useTranslation()
  const [revenueTotal, setRevenueTotal] = useState(0)
  const [profitPercentage, setProfitPercentage] = useState('')
  const [APTotal, setAPTotal] = useState(0)
  const [projectCostTotal, setProjectCostTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const getSOWRevisedCOAmount = data => {
    return data.changeOrder + data.coAdjustment
  }

  const getSOWRevisedAmount = data => {
    return data.originalAmount + data.noCoAdjustment
  }

  const getSOWFinalAmount = data => {
    return getSOWRevisedAmount(data) + getSOWRevisedCOAmount(data)
  }

  const token = localStorage.getItem('jhi-authenticationToken')

  const updateProfitMargin = () => {
    let vendorOriginalSOWTotal = 0
    let vendorCOTotal = 0
    let vendorAdjustmentTotal = 0
    let vendorAPTotal = 0
    let projectCostTotal = 0
    if (projectData?.id !== undefined) {
      setLoading(true)
      axios
        .get('/api/project/' + projectData?.id + '/financialOverview', {
          headers: {
            Authorization: 'Bearer ' + token, //the token is a variable which holds the token
          },
        })
        .then(response => {
          const sowData = response.data.splice(0, 1)

          response.data.forEach(element => {
            vendorOriginalSOWTotal = vendorOriginalSOWTotal + element.workOrderOriginalAmount
            vendorCOTotal = vendorCOTotal + element.changeOrder
            vendorAdjustmentTotal = vendorAdjustmentTotal + element.adjustment
            vendorAPTotal =
              vendorAPTotal +
              element.workOrderOriginalAmount +
              element.changeOrder +
              element.adjustment +
              element.draw +
              element.material
            projectCostTotal =
              projectCostTotal + element.workOrderOriginalAmount + element.changeOrder + element.adjustment // revised 1/31
          })
          const sow = sowData[0].originalAmount + sowData[0].changeOrder + sowData[0].adjustment
          const finalProfitMargin = sow === 0 ? 0 : ((sow - projectCostTotal) / sow) * 100
          const finalProfitMarginFloat = parseFloat(finalProfitMargin + '').toFixed(2)
          setRevenueTotal(getSOWFinalAmount(sowData[0]))
          setProfitPercentage(finalProfitMarginFloat)
          setAPTotal(vendorAPTotal)
          setProjectCostTotal(projectCostTotal)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }

  const formatCurrency =
    (locale = 'en-US', options = { currency: 'USD', minimumFractionDigits: 2 }) =>
    amount => {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        ...options,
      })

      return formatter.format(amount || 0)
    }
  const formatter = formatCurrency()

  useEffect(() => {
    updateProfitMargin()
  }, [projectData])
  return (
    <Flex py={9} w="100%" bg="white" borderRadius="4px" box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)">
      <InfoStructureCard
        amount={loading ? <BlankSlate size="sm" /> : formatter(revenueTotal)}
        title={t('finalSOW')}
        isLoading={isLoading}
      />
      <InfoStructureCard
        amount={loading ? <BlankSlate size="sm" /> : formatter(APTotal)}
        isLoading={isLoading}
        title={t('accountpayable')}
      />
      <InfoStructureCard
        amount={loading ? <BlankSlate size="sm" /> : formatter(projectCostTotal)}
        isLoading={isLoading}
        title={t('projectcost')}
      />
      <InfoStructureCard
        amount={loading ? <BlankSlate size="sm" /> : formatter(revenueTotal)}
        isLoading={isLoading}
        title={t('revenue')}
      />
      <InfoStructureCard
        amount={loading ? <BlankSlate size="sm" /> : formatter(revenueTotal - projectCostTotal)}
        isLoading={isLoading}
        title={t('profits')}
      />
      <InfoStructureCard
        amount={loading ? <BlankSlate size="sm" /> : `${profitPercentage}%`}
        isLoading={isLoading}
        title={t('profitmargins')}
        border="none"
      />
    </Flex>
  )
}
