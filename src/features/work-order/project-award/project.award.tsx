import { Box, Button, Flex, FormLabel, HStack, ModalBody, ModalFooter } from '@chakra-ui/react'
import { parseProjectAwardValuesToPayload } from 'api/work-order'
import { t } from 'i18next'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ProjectAwardCard, TextCard } from './project-award-card'
// import { useTranslation } from 'react-i18next'
// import { ProjectAwardCard, TextCard } from './project-award-card'

export const ProjectAwardTab: React.FC<any> = props => {
  const subTotal = props?.workOrderSubTotal

  const [selectedCard, setSelectedCard] = useState(null)

  interface FormValues {
    id?: number
  }

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
          <Flex mb={10} w="100%" alignContent="space-between" pos="relative">
            <Box flex="4" minW="59em">
              <FormLabel>Select any one performance:</FormLabel>
            </Box>
          </Flex>
          <HStack>
            <TextCard />
            {props?.projectAwardData?.map(card => {
              return (
                <ProjectAwardCard
                  workOrder={props?.workOrder}
                  {...card}
                  subTotal={subTotal}
                  selectedCard={selectedCard}
                  onSelectedCard={setSelectedCard}
                  cardsvalues={card}
                />
              )
            })}
          </HStack>
          <Box mt={3} flex="4" minW="59em">
            <FormLabel>*Factoring fees to be deducted from initial scope total. </FormLabel>
          </Box>
        </ModalBody>
        <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
          <HStack spacing="16px" justifyContent="end">
            <Button onClick={props?.onClose} variant="outline" colorScheme="brand">
              {t('cancel')}
            </Button>

            {props?.workOrder?.awardPlanId === null ? (
              <Button type="submit" colorScheme="brand">
                {t('save')}
              </Button>
            ) : null}
          </HStack>
        </ModalFooter>
      </form>
    </>
  )
}
