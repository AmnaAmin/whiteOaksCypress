import { Box, Divider, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiCheckCircle } from 'react-icons/bi'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { currencyFormatter, truncateWithEllipsis } from 'utils/string-formatters'
import { PROJECT_AWARD } from './projectAward.i18n'

export const TextCard = () => {
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
          <Text fontWeight="400" fontSize="14px" color="gray.600">
            {t(`${PROJECT_AWARD}.factoringFee`)}
          </Text>
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
  onClick,
}) => {
  const [checkIcon, setCheckIcon] = useState(false)
  const { t } = useTranslation()
  const { isAdmin } = useUserRolesSelector()

  const drawAmount = () => {
    if (cardsvalues?.drawLimit === 0) return 0
    if (cardsvalues?.drawLimit === 1) return 'NTE 50%'
    if (cardsvalues?.drawLimit === 2) return 'NTE 70%'
    if (cardsvalues?.drawLimit >= 4) return 'NTE 90%'
  }
  const awardPlanId = workOrder?.awardPlanId

  const calculatePercentage = per => {
    const percentage = (awardPlanScopeAmount / 100) * per
    return awardPlanScopeAmount - percentage
  }

  const calFactorFeePercentage = per => {
    return (awardPlanScopeAmount / 100) * per
  }

  const calNteMax = p => {
    const percentage = calculatePercentage(p)
    const nteFiftyPercentage = (percentage / 100) * 50
    const nteSeventyPercentage = (percentage / 100) * 70
    const nteNintyPercentage = (percentage / 100) * 90

    if (cardsvalues?.drawLimit === 1) return nteFiftyPercentage
    if (cardsvalues?.drawLimit === 2) return nteSeventyPercentage
    if (cardsvalues?.drawLimit === 4) return nteNintyPercentage
    return 0
  }

  const netFinalPayAmmount = () => {
    const factoringFee = cardsvalues?.factoringFee
    const percentage = calculatePercentage(factoringFee)
    const nteMax = calNteMax(factoringFee)
    return percentage - nteMax
  }

  const handleSelected = () => {
    onSelectedCard(cardsvalues?.id)

    if (!selectedCard) {
      onSelectedCard(cardsvalues?.id)
    } else if (selectedCard === id) {
      onSelectedCard(null)
    }
    // onSelectedCard(selectedCard.id !== id && id)
    onClick(cardsvalues)
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
              {currencyFormatter(calculatePercentage(cardsvalues?.factoringFee))}
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
              {currencyFormatter(calNteMax(cardsvalues.factoringFee))}
            </Text>
            <HStack>
              <Text fontWeight="400" fontSize="14px" color="gray.600">
                {currencyFormatter(calFactorFeePercentage(cardsvalues?.factoringFee))}
              </Text>
              <Text fontWeight="400" fontSize="12px" color="brand.300" bg="blue.50" py="1px" px="5px">
                {`${cardsvalues?.factoringFee}%`}
              </Text>
            </HStack>
            <Text w={'100%'} bg={idChecker ? '' : 'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
              {currencyFormatter(netFinalPayAmmount())}
            </Text>
          </VStack>
        </Flex>
      )}
    </>
  )
}
