import { Box, Button, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import React, { useEffect, useState } from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { currencyFormatter } from 'utils/string-formatters'

export const TextCard = () => {
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
            Material draws
          </Text>
          <Text fontWeight="400" fontSize="14px" color="gray.600">
            Labor draws
          </Text>
          <Text w={'100%'} bg={'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
            Total draw amount
          </Text>
          <Text fontWeight="400" fontSize="14px" color="gray.600">
            Net final pay terms
          </Text>
          <Text w={'100%'} bg={'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
            NTE max
          </Text>
          <Text fontWeight="400" fontSize="14px" color="gray.600">
            Factoring fee
          </Text>
          <Text w={'100%'} bg={'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
            Net final pay amount
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

export const ProjectAwardCard = ({ workOrder, cardsvalues, selectedCard, onSelectedCard, id, subTotal }) => {
  const [checkIcon, setCheckIcon] = useState(false)

  const drawAmount = () => {
    if (cardsvalues?.drawLimit === 0) return 0
    if (cardsvalues?.drawLimit === 1) return 'NTE 50%'
    if (cardsvalues?.drawLimit === 2) return 'NTE 70%'
    if (cardsvalues?.drawLimit === 4) return 'NTE 90%'
  }
  const idd = workOrder?.awardPlanId

  const calculatePercentage = per => {
    const percentage = (subTotal / 100) * per
    return subTotal - percentage
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
  }
  const idChecker = selectedCard === id

  useEffect(() => {
    if (!selectedCard) {
      if (cardsvalues?.id === idd) {
        onSelectedCard(idd)
      }
    }
  }, [selectedCard])

  return (
    <>
      {!cardsvalues ? (
        <BlankSlate size="sm" width="100%" />
      ) : (
        <Flex
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
          pointerEvents={idd ? 'none' : undefined}
          justifyContent="space-between"
          border="1px solid transparent"
          //   borderTop="4px solid transparent"
          // pointerEvents={disabled ? 'none' : 'auto'}
          onClick={handleSelected}
          bgColor={selectedCard === id ? 'blue.50' : ''}
          borderColor={selectedCard === id ? '#4E87F8' : ''}
          _hover={{ bg: 'gray.100' }}
        >
          <VStack w="100%" px={'10px'} alignItems={'Start'} spacing={3}>
            <HStack w={'100%'} justifyContent={'space-between'}>
              <Text fontWeight="600" fontSize="16px" color="gray.600">
                {cardsvalues?.name}
              </Text>
              {(checkIcon || selectedCard === id) && (
                <Button
                  type="button"
                  variant="link"
                  size="xl"
                  color={selectedCard === id ? 'green.300' : 'gray.300'}
                  bg="white"
                  _hover={{ bg: 'none' }}
                >
                  <BiCheckCircle />
                </Button>
              )}
            </HStack>
            <Divider border="1px solid" borderColor="gray.300" />
            <Text fontWeight="400" fontSize="12px" color="gray.500">
              {'Scope amount'}
            </Text>
            <Text fontWeight="600" fontSize="16px" color="#4E87F8">
              {currencyFormatter(calculatePercentage(cardsvalues?.factoringFee))}
            </Text>
            <Divider border="1px solid" borderColor="gray.300" />
            <Text w={'100%'} bg={idChecker ? '' : 'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
              {cardsvalues?.materialLimit}
            </Text>
            <Text fontWeight="400" fontSize="14px" color="gray.600">
              {cardsvalues?.drawLimit}
            </Text>
            <Text w={'100%'} bg={idChecker ? '' : 'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
              {drawAmount}
            </Text>
            <Text fontWeight="400" fontSize="14px" color="gray.600">
              {cardsvalues?.payTerm}
            </Text>
            <Text w={'100%'} bg={idChecker ? '' : 'gray.50'} fontWeight="400" fontSize="14px" color="gray.600">
              {currencyFormatter(calNteMax(cardsvalues.factoringFee))}
            </Text>
            <HStack>
              <Text fontWeight="400" fontSize="14px" color="gray.600">
                {`$${cardsvalues?.factoringFee}.00`}
              </Text>
              <Text fontWeight="400" fontSize="12px" color="blue.400">
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
