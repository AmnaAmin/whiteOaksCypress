import { Box, Button, Flex, FormLabel, HStack, ModalBody, ModalFooter } from '@chakra-ui/react'
import { parseProjectAwardValuesToPayload } from 'api/work-order'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ProjectAwardCard, TextCard } from './project-award-card'
import { Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { PROJECT_AWARD } from './projectAward.i18n'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { currencyFormatter } from 'utils/string-formatters'
import { useWorkOrderAwardStats } from 'api/transactions'

export const ProjectAwardTab: React.FC<any> = props => {
  const awardPlanScopeAmount = props?.awardPlanScopeAmount
  const { isUpdating, projectAwardData, isUpgradeProjectAward } = props
  const { isAdmin } = useUserRolesSelector()
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const { awardPlansStats } = useWorkOrderAwardStats(props?.workOrder?.projectId)

  interface FormValues {
    id?: number
  }
  //get originalscopeamount value...
  const factoringFee = projectAwardData?.find(a => a.id === props?.workOrder?.awardPlanId)?.factoringFee
  const { t } = useTranslation()
  // get drawremaining value..
  const drawRemaining = awardPlansStats?.map(item => {
    if (item.workOrderId === props.workOrder.id) {
      return item.drawRemaining
    }
    return null
  })
  // get materialRemaining value..
  const materialRemaining = awardPlansStats?.map(item => {
    if (item.workOrderId === props.workOrder.id) {
      return item.materialRemaining
    }
    return null
  })
  // get totalAmountRemaining value..
  const totalAmountRemaining = awardPlansStats?.find(
    item => item.workOrderId === props.workOrder.id,
  )?.totalAmountRemaining

  useEffect(() => {
    if (props?.workOrder?.awardPlanId !== null) {
      setSelectedCard(props.workOrder.awardPlanId)
    }
  }, [props?.workOrder?.awardPlanId])

  const { handleSubmit } = useForm<FormValues>()

  const onSubmit = () => {
    if (selectedCard) {
      props?.onSave(parseProjectAwardValuesToPayload(selectedCard, projectAwardData))
    }
  }
  const calculatePercentage = per => {
    const percentage = (awardPlanScopeAmount / 100) * per
    return awardPlanScopeAmount - percentage
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody h={'calc(100vh - 300px)'} p="25px" overflow={'auto'}>
          <Box
            display={{ base: 'block', md: 'flex' }}
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="center"
            borderRadius="6px"
            height="auto"
            width="1000px"
            border="1px solid #CBD5E0"
            marginBottom="20px"
            marginTop="-9px"
            padding={{ base: '100px 0', md: '0px 0px' }}
          >
            <Box
              flex={{ base: '1', md: '2' }}
              h="60px"
              bg="gray.50"
              fontSize="14px"
              fontWeight="400"
              textColor="gray.600"
              borderTopLeftRadius="6px"
              borderBottomLeftRadius={{ base: '6px', md: '6px' }}
              borderRight={{ base: 'none', md: '1px solid #CBD5E0' }}
              textAlign="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {t(`${PROJECT_AWARD}.originalscopeamount`)}
              <Text fontWeight="600" fontSize="16px" color="brand.300">
                {currencyFormatter(calculatePercentage(factoringFee))}
              </Text>
            </Box>
            <Box
              flex="1"
              h="59px"
              bg="gray.50"
              fontSize="14px"
              fontWeight="400"
              textColor="gray.600"
              borderRight={{ base: 'none', md: '1px solid #CBD5E0' }}
              textAlign="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {t(`${PROJECT_AWARD}.materialDraws`)}
              <Text fontWeight="600" fontSize="16px" color={materialRemaining && materialRemaining.includes(0) ? 'red.500' : 'brand.300'}>
                {materialRemaining}
              </Text>
            </Box>
            <Box
              flex="1"
              h="59px"
              bg="gray.50"
              fontSize="14px"
              fontWeight="400"
              textColor="gray.600"
              borderRight={{ base: 'none', md: '1px solid #CBD5E0' }}
              textAlign="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {t(`${PROJECT_AWARD}.laborDraws`)}
              <Text fontWeight="600" fontSize="16px" color={drawRemaining && drawRemaining.includes(0) ? 'red.500' : 'brand.300'}>
                {drawRemaining}
              </Text>
            </Box>
            <Box
              flex="1"
              h="59px" 
              borderTopRightRadius={{ base: '6px', md: '6px' }}
              fontSize="14px"
              fontWeight="400"
              textColor="gray.600"
              borderBottomRightRadius="6px"
              bg="gray.50"
              textAlign="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {t(`${PROJECT_AWARD}.NTEmax`)}
              <Text fontWeight="600" fontSize="16px"  color={totalAmountRemaining === 0 ? 'red.500' : 'brand.300'}>
                {totalAmountRemaining ? currencyFormatter(totalAmountRemaining) : ''}
              </Text>
            </Box>
          </Box>
          <Flex w="100%" alignContent="space-between" pos="relative">
            <Box flex="4" minW="59em">
              <FormLabel color={'gray.700'} fontWeight={500}>
                {t(`${PROJECT_AWARD}.selectPerformance`)}
              </FormLabel>
            </Box>
          </Flex>
          <HStack>
            <TextCard />
            {projectAwardData?.map(card => {
              return (
                <ProjectAwardCard
                  workOrder={props?.workOrder}
                  {...card}
                  awardPlanScopeAmount={awardPlanScopeAmount}
                  selectedCard={selectedCard}
                  onSelectedCard={setSelectedCard}
                  cardsvalues={card}
                  isUpgradeProjectAward={isUpgradeProjectAward}
                  key={card.id}
                />
              )
            })}
          </HStack>
        </ModalBody>
        <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
          <Box w={'100%'}>
            <FormLabel color={'#4A5568'} fontSize="12px" fontWeight={400}>
              {t(`${PROJECT_AWARD}.factoringFeeMsg`)}
            </FormLabel>
          </Box>
          <HStack spacing="16px" justifyContent="end">
            <Button data-testid="wo-cancel-btn" onClick={props?.onClose} variant="outline" colorScheme="brand">
              {t('cancel')}
            </Button>

            {props?.workOrder?.awardPlanId === null || isAdmin || isUpgradeProjectAward ? (
              <Button type="submit" colorScheme="brand" disabled={isUpdating}>
                {t('save')}
              </Button>
            ) : null}
          </HStack>
        </ModalFooter>
      </form>
    </>
  )
}
