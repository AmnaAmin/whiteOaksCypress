import { Box, Divider, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiCheckCircle } from 'react-icons/bi'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { currencyFormatter, truncateWithEllipsis } from 'utils/string-formatters'
import { PROJECT_AWARD } from './projectAward.i18n'
import { PERFORM } from 'features/common/status'
import { WORK_ORDER_STATUS } from 'components/chart/Overview'

export const TextCard = ({ isNewPlan
}) => {
  
  const { t } = useTranslation()

  return (
    <Box as="label">
      <Flex
        h="392px"
        w="195px"
        bg="#FFFFFF"
        alignItems="center"
        transition="0.3s all"
        justifyContent="space-between"
        border="1px solid transparent"
      >
        <VStack w="100%" px={'10px'} alignItems={'Start'} spacing={3}>
          <Box h={'120px'} />
          <Text w={'100%'} bg={'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
            {t(`${PROJECT_AWARD}.materialDraws`)}
          </Text>
          <Text fontWeight="400" fontSize="14px" color="gray.600">
            {t(`${PROJECT_AWARD}.laborDraws`)}
          </Text>
          <Text w={'100%'} bg={'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
            {t(`${PROJECT_AWARD}.totalDrawAmount`)}
          </Text>
          <Text fontWeight="400" fontSize="14px" color="gray.600">
            {truncateWithEllipsis(t(`${PROJECT_AWARD}.netFinalPayTerms`), 22)}
          </Text>
          <Text w={'100%'} bg={'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
            {t(`${PROJECT_AWARD}.NTEmax`)}
          </Text>
          {!isNewPlan &&
          <Text fontWeight="400" fontSize="14px" color="gray.600">
            {t(`${PROJECT_AWARD}.factoringFee`)}
          </Text>
} 
          <Text w={'100%'} bg={'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
            {truncateWithEllipsis(t(`${PROJECT_AWARD}.netFinalPayAmount`), 22)}
          </Text>
        </VStack>
      </Flex>
    </Box>
  )
}

// type ProjectCardProps = {
//   id?: number | string
//   title?: string
//   value: string
//   number?: string | number
//   IconElement?: React.ReactNode
//   selectedCard?: any
//   onSelectedCard: (any) => void
//   isLoading?: boolean
//   disabled?: boolean
// }

export const ProjectAwardCard = ({
  workOrder,
  cardsvalues,
  selectedCard,
  onSelectedCard,
  id,
  awardPlanScopeAmount,
  isUpgradeProjectAward,
}) => {
  const [checkIcon, setCheckIcon] = useState(false)
  const { t } = useTranslation()
  const { isAdmin } = useUserRolesSelector()

  const drawAmount = () => {
    if (cardsvalues?.name === PERFORM.SelfPer) return 0
    if (cardsvalues?.name === PERFORM.CoPer20) return 'NTE 50%'
    if (cardsvalues?.name === PERFORM.COPer14) return 'NTE 70%'
    if (cardsvalues?.name === PERFORM.CoPer7) return 'NTE 90%'
    if (cardsvalues?.name === PERFORM.NewPlan1) return 'N/A'
    if (cardsvalues?.name === PERFORM.NewPlan2) return 'NTE 30%'
    if (cardsvalues?.name === PERFORM.NewPlan3) return 'NTE 60%'
    if (cardsvalues?.name === PERFORM.NewPlan4) return 'NTE 90%'  
  }
  const awardPlanId = workOrder?.awardPlanId

  const calculatePercentage = per => {
    const percentage = (awardPlanScopeAmount / 100) * per
    return awardPlanScopeAmount - percentage
  }

  const calFactorFeePercentage = per => {
    return (awardPlanScopeAmount / 100) * per
  }


  const calculateNewPercentage = () => {
    return awardPlanScopeAmount
  }

  const calNteMax = p => {
    const percentage = calculatePercentage(p)
    const nteFiftyPercentage = (percentage / 100) * 50
    const nteSeventyPercentage = (percentage / 100) * 70
    const nteNintyPercentage = (percentage / 100) * 90

    if (cardsvalues?.name === PERFORM.CoPer20) return nteFiftyPercentage
    if (cardsvalues?.name === PERFORM.COPer14) return nteSeventyPercentage
    if (cardsvalues?.name === PERFORM.CoPer7) return nteNintyPercentage
    return 0
  }
  const calNewNteMax = () => {
    const percentage = calculateNewPercentage()
    const nteThirtyPercentage = (percentage / 100) * 30
    const nteSixtyPercentage = (percentage / 100) * 60
    const nteNintyPercentage = (percentage / 100) * 90
    if (cardsvalues?.name === PERFORM.NewPlan2) return nteThirtyPercentage
    if (cardsvalues?.name === PERFORM.NewPlan3) return nteSixtyPercentage
    if (cardsvalues?.name === PERFORM.NewPlan4) return nteNintyPercentage
    return 0
  }

  const netFinalPayAmmount = () => {
    const factoringFee = cardsvalues?.factoringFee
    const percentage = calculatePercentage(factoringFee)
    const nteMax = calNteMax(factoringFee)
    return percentage - nteMax
  }

  const netNewFinalPayAmmount = () => {
    const percentage = calculateNewPercentage()
    const nteMax = calNewNteMax()
    return percentage - nteMax
  }
  const handleSelected = () => {
    if (WORK_ORDER_STATUS.Cancelled === workOrder?.status || cardsvalues?.isNewPlan ) {
      return false
    } else {
      onSelectedCard(cardsvalues?.id)

      if (!selectedCard) {
        onSelectedCard(cardsvalues?.id)
      } else if (selectedCard === id) {
        onSelectedCard(null)
      }
    }
  }
  const idChecker = selectedCard === id

  useEffect(() => {
    if (!selectedCard) {
      if (cardsvalues?.id === awardPlanId) {
        onSelectedCard(awardPlanId)
      }
    }
  }, [selectedCard])

  return (
    <>
      {!cardsvalues ? (
        <BlankSlate size="sm" width="100%" />
      ) : (
        <Flex
          flexWrap="nowrap"
          onMouseOver={() => setCheckIcon(true)}
          onMouseOut={() => setCheckIcon(false)}
          //   boxShadow=" 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
          h="380px"
          w="195px"
          borderRadius="12px"
          bg="#FFFFFF"
          alignItems="center"
          transition="0.3s all"
          cursor={'pointer'}
          pointerEvents={
            !awardPlanId || isAdmin || (isUpgradeProjectAward && cardsvalues?.id > awardPlanId) ? undefined : 'none'
          }
          justifyContent="space-between"
          border="1px solid transparent"
          //   borderTop="4px solid transparent"
          // pointerEvents={disabled ? 'none' : 'auto'}
          onClick={handleSelected}
          bgColor={selectedCard === id ? 'blue.50' : ''}
          borderColor={selectedCard === id ? 'brand.300' : ''}
          _hover={{ bg: 'gray.100' }}
        >
          <VStack w="195px" px={'10px'} alignItems={'Start'} spacing={3}>
            <HStack w={'100%'} justifyContent={'space-between'}>
              <Text fontWeight="500" fontSize="16px" color="gray.700" whiteSpace="nowrap">
                {cardsvalues?.name}
              </Text>
              {(checkIcon || selectedCard === id) && (
                <Icon as={BiCheckCircle} color={selectedCard === id ? '#68D391' : 'gray.300'} fontSize="18px" />
              )}
            </HStack>
            <Divider border="1px solid" borderColor="gray.300" />
            <Text fontWeight="400" fontSize="12px" color="gray.500" whiteSpace="nowrap">
              {t(`${PROJECT_AWARD}.scopeAmount`)}
            </Text>
            <Text fontWeight="600" fontSize="16px" color="brand.300">
            {!cardsvalues.isNewPlan ?
              currencyFormatter(calculatePercentage(cardsvalues?.factoringFee)) :  currencyFormatter(calculateNewPercentage())}
            
            </Text>
            <Divider borderColor="transparent" />
            <Text w={'100%'} bg={idChecker ? '' : 'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
              {cardsvalues?.materialLimit}
            </Text>
            <Text fontWeight="400" fontSize="14px" color="gray.600">
              {cardsvalues?.drawLimit}
            </Text>
            <Text w={'100%'} bg={idChecker ? '' : 'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
              {drawAmount()}
            </Text>
            <Text fontWeight="400" fontSize="14px" color="gray.600">
              {cardsvalues?.payTerm}
            </Text>
            <Text w={'100%'} bg={idChecker ? '' : 'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
            {!cardsvalues.isNewPlan ?
              currencyFormatter(calNteMax(cardsvalues.factoringFee)):  currencyFormatter(calNewNteMax())}
            </Text>
            {!cardsvalues.isNewPlan &&
            <HStack>
              <Text fontWeight="400" fontSize="14px" color="gray.600">
                {currencyFormatter(calFactorFeePercentage(cardsvalues?.factoringFee))}
              </Text>
              <Text fontWeight="400" fontSize="12px" color="brand.300" bg="blue.50" py="1px" px="5px">
                {`${cardsvalues?.factoringFee}%`}
              </Text>
            </HStack>
      }
            <Text w={'100%'} bg={idChecker ? '' : 'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
            {!cardsvalues.isNewPlan ?
              currencyFormatter(netFinalPayAmmount()) :   currencyFormatter(netNewFinalPayAmmount())}
            </Text>
          </VStack>
        </Flex>
      )}
    </>
  )
}
