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
// import { ProjectAwardCard, TextCard } from './project-award-card'

export const ProjectAwardTab: React.FC<any> = props => {
  const awardPlanScopeAmount = props?.awardPlanScopeAmount
  const { isUpdating, projectAwardData, isUpgradeProjectAward } = props
  const { isAdmin } = useUserRolesSelector()
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [selectedCardValues, setSelectedCardValues] = useState<any>(null)

  useEffect(() => {
    setSelectedCardValues(projectAwardData.find((card: any) => card.id === selectedCard) || null)
  }, [selectedCard, projectAwardData])
  interface FormValues {
    id?: number
  }
  const { t } = useTranslation()
 useEffect(() => {
    if (props?.workOrder?.awardPlanId !== null) {
      setSelectedCard(props.workOrder.awardPlanId);
    }
  }, [props?.workOrder?.awardPlanId]);

  const { handleSubmit } = useForm<FormValues>()

  const onSubmit = () => {
    if (selectedCard) {
      props?.onSave(parseProjectAwardValuesToPayload(selectedCard, projectAwardData))
    }
  }

  const calNteMax = p => {
    const percentage = calculatePercentage(p)
    const nteFiftyPercentage = (percentage / 100) * 50
    const nteSeventyPercentage = (percentage / 100) * 70
    const nteNintyPercentage = (percentage / 100) * 90

    if (selectedCardValues?.drawLimit === 1) return nteFiftyPercentage
    if (selectedCardValues?.drawLimit === 2) return nteSeventyPercentage
    if (selectedCardValues?.drawLimit === 4) return nteNintyPercentage
    return 0
  }
  const calculatePercentage = per => {
    const percentage = (awardPlanScopeAmount / 100) * per
    return awardPlanScopeAmount - percentage
  }
  console.log(selectedCardValues)
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody h={'calc(100vh - 300px)'} p="25px" overflow={'auto'}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            borderRadius="6px"
            height="60px"
            width="100%"
            border="1px solid #CBD5E0"
            marginBottom='20px'
            marginTop='-9px'
          >
            <Box
              flex="2"
              h="58px"
              bg="gray.50"
              fontSize="14px"
              fontWeight="400"
              textColor="gray.600"
              borderTopLeftRadius="6px"
              borderBottomLeftRadius="6px"
              borderRight="1px solid #CBD5E0"
              textAlign="center"
              display='flex'
              flexDirection='column'
              justifyContent='center'
              
            >
              {t(`${PROJECT_AWARD}.originalscopeamount`)}
              <Text fontWeight="600" fontSize="16px" color="brand.300">
                {currencyFormatter(calculatePercentage(selectedCardValues?.factoringFee))}
              </Text>
            </Box>
            <Box
              flex="1"
              h="58px"
              bg="gray.50"
              fontSize="14px"
              fontWeight="400"
              textColor="gray.600"
              borderRight="1px solid #CBD5E0"
              textAlign="center"
              display='flex'
              flexDirection='column'
              justifyContent='center'
            >
              {t(`${PROJECT_AWARD}.materialDraws`)}
              <Text fontWeight="600" fontSize="16px" color="brand.300">
                {selectedCardValues?.materialLimit}
              </Text>
            </Box>
            <Box
              flex="1"
              h="58px"
              bg="gray.50"
              fontSize="14px"
              fontWeight="400"
              textColor="gray.600"
              borderRight="1px solid #CBD5E0"
              textAlign="center"
              display='flex'
              flexDirection='column'
              justifyContent='center'
            >
              {t(`${PROJECT_AWARD}.laborDraws`)}
              <Text fontWeight="600" fontSize="16px" color="brand.300">
                {selectedCardValues?.drawLimit}
              </Text>
            </Box>
            <Box
              flex="1"
              h="58px"
              borderTopRightRadius="6px"
              fontSize="14px"
              fontWeight="400"
              textColor="gray.600"
              borderBottomRightRadius="6px"
              bg="gray.50"
              textAlign="center"
              display='flex'
              flexDirection='column'
              justifyContent='center'
            >
              {t(`${PROJECT_AWARD}.NTEmax`)}
              <Text w={'100%'} fontWeight="600" fontSize="16px" color="brand.300">
                {currencyFormatter(calNteMax(selectedCardValues?.factoringFee))}
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
                  onClick={() => setSelectedCardValues(card)}
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
