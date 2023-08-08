import { Box, Button, Checkbox, Flex, FormLabel, HStack, ModalBody, ModalFooter } from '@chakra-ui/react'
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
import { BlankSlate } from 'components/skeletons/skeleton-unit'

export const ProjectAwardTab: React.FC<any> = props => {
  const awardPlanScopeAmount = props?.awardPlanScopeAmount
  const { isUpdating, projectAwardData, isUpgradeProjectAward, workOrder } = props

  const { isAdmin } = useUserRolesSelector()
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [largeWorkOrder, setLargeWorkOrder] = useState<boolean>(workOrder?.largeWorkOrder)

  const { awardPlansStats } = useWorkOrderAwardStats(props?.workOrder?.projectId)
  interface FormValues {
    id?: number
  }
  //get originalscopeamount value...
  const factoringFee = projectAwardData?.find(a => a.id === props?.workOrder?.awardPlanId)?.factoringFee
  const { t } = useTranslation()

  // get drawremaining value..
  const drawRemaining = awardPlansStats?.find(item => item.workOrderId === props.workOrder.id)?.drawRemaining

  // get materialRemaining value..
  const materialRemaining = awardPlansStats?.find(item => item.workOrderId === props.workOrder.id)?.materialRemaining

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
      props?.onSave(parseProjectAwardValuesToPayload(selectedCard, projectAwardData, largeWorkOrder))
    }
  }
  const calculatePercentage = per => {
    const percentage = (awardPlanScopeAmount / 100) * per
    return awardPlanScopeAmount - percentage
  }

  return (
    <>
      {projectAwardData && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody h="600px" p="25px" overflow={'auto'}>
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
                  {factoringFee !== null && !isNaN(factoringFee)
                    ? currencyFormatter(calculatePercentage(factoringFee)) || '0'
                    : '0'}
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
                <Text
                  fontWeight="600"
                  fontSize="16px"
                  color={materialRemaining !== null && materialRemaining === 0 ? 'red.500' : 'brand.300'}
                >
                  {materialRemaining ? materialRemaining : 0}
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
                <Text
                  fontWeight="600"
                  fontSize="16px"
                  color={drawRemaining !== null && drawRemaining === 0 ? 'red.500' : 'brand.300'}
                >
                  {drawRemaining ? drawRemaining : 0}
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
                <Text
                  fontWeight="600"
                  fontSize="16px"
                  color={totalAmountRemaining !== null && totalAmountRemaining === 0 ? 'red.500' : 'brand.300'}
                >
                  {totalAmountRemaining ? currencyFormatter(totalAmountRemaining) : 0}
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
          <Box mb={'5px'} ml={'9px'}>
            <Checkbox
              data-testid="largeWoCheckbox"
              onChange={e => setLargeWorkOrder(e.target.checked)}
              disabled={awardPlanScopeAmount < 75000}
              borderColor={'black'}
              isChecked={largeWorkOrder}
              size="lg"
            >
              Large WO
            </Checkbox>
          </Box>
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
                <Button type="submit" colorScheme="brand" disabled={isUpdating || !selectedCard}>
                  {t('save')}
                </Button>
              ) : null}
            </HStack>
          </ModalFooter>
        </form>
      )}
      {!projectAwardData && <BlankSlate size={'lg'} />}
    </>
  )
}
