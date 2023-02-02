import { Box, Button, Flex, FormLabel, HStack, ModalBody, ModalFooter } from '@chakra-ui/react'
import { parseProjectAwardValuesToPayload } from 'api/work-order'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ProjectAwardCard, TextCard } from './project-award-card'
import { PROJECT_AWARD } from './projectAward.i18n'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
// import { ProjectAwardCard, TextCard } from './project-award-card'

export const ProjectAwardTab: React.FC<any> = props => {
  const awardPlanScopeAmount = props?.awardPlanScopeAmount
  const { isUpdating, isUpgradeProjectAward } = props
  const { isAdmin } = useUserRolesSelector()

  const [selectedCard, setSelectedCard] = useState(null)

  interface FormValues {
    id?: number
  }
  const { t } = useTranslation()

  const { handleSubmit } = useForm<FormValues>()

  const onSubmit = () => {
    if (selectedCard) {
      props?.onSave(parseProjectAwardValuesToPayload(selectedCard))
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody h={'calc(100vh - 300px)'} p="25px" overflow={'auto'}>
          <Flex w="100%" alignContent="space-between" pos="relative">
            <Box flex="4" minW="59em">
              <FormLabel color={'gray.700'} fontWeight={500}>
                {t(`${PROJECT_AWARD}.selectPerformance`)}
              </FormLabel>
            </Box>
          </Flex>
          <HStack>
            <TextCard />
            {props?.projectAwardData?.map(card => {
              return (
                <ProjectAwardCard
                  workOrder={props?.workOrder}
                  {...card}
                  awardPlanScopeAmount={awardPlanScopeAmount}
                  selectedCard={selectedCard}
                  onSelectedCard={setSelectedCard}
                  cardsvalues={card}
                  isUpgradeProjectAward={isUpgradeProjectAward}
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
            <Button onClick={props?.onClose} variant="outline" colorScheme="brand">
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
