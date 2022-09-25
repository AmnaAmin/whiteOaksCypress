import {
  Box,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'
import { PerformanceType } from 'types/performance.type'
import { PerformanceDetail } from './performance-details'
import { Button } from 'components/button/button'
import { FormProvider, useForm } from 'react-hook-form'
import { badges, bonus, IgnorePerformance, useMutatePerformance, usePerformanceSaveDisabled } from 'api/performance'
import { useFPMProfile } from 'api/vendor-details'
import PerformanceGraph from './performance-modal-graph'

const PerformanceModal = ({
  PerformanceDetails,
  onClose: close,
}: {
  PerformanceDetails: PerformanceType
  onClose: () => void
}) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (PerformanceDetails) {
      onOpen()
    } else {
      onCloseDisclosure()
    }
  }, [onCloseDisclosure, onOpen, PerformanceDetails])

  const { data: fpmInfoData, isLoading } = useFPMProfile(PerformanceDetails?.userId)
  const { mutate: savePerformanceDetails } = useMutatePerformance(PerformanceDetails?.userId)

  const methods = useForm<PerformanceType>({
    defaultValues: {
      newTarget: '',
      newBonus: bonus[0],
      badge: badges[0],
      ignoreQuota: IgnorePerformance[0],
    },
  })

  const { handleSubmit } = methods

  const onSubmit = useCallback(
    async values => {
      const queryOptions = {
        onSuccess() {
          onClose()
          methods?.reset()
        },
      }
      const performancePayload = {
        newBonus: values.newBonus?.value,
        badge: values.badge?.value,
        ignoreQuota: values?.ignoreQuota?.value,
        newTarget: values?.newTarget,
      }
      savePerformanceDetails(performancePayload, queryOptions)
    },
    [savePerformanceDetails],
  )

  const isPerformanceSaveButtonDisabled = usePerformanceSaveDisabled(methods.control, methods?.formState?.errors)

  return (
    <div>
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} id="performanceValues">
            <ModalContent w="1137px" rounded={3} borderTop="2px solid #4E87F8">
              <ModalHeader h="63px" borderBottom="1px solid #E2E8F0" color="gray.600" fontSize={16} fontWeight={500}>
                <HStack spacing={4}>
                  <HStack fontSize="16px" fontWeight={500} h="32px">
                    <Text lineHeight="22px" h="22px" pr={2}>
                      {PerformanceDetails?.name}
                    </Text>
                  </HStack>
                </HStack>
              </ModalHeader>
              <ModalCloseButton _hover={{ bg: 'blue.50' }} />
              <ModalBody justifyContent="center">
                <PerformanceDetail PerformanceDetails={PerformanceDetails} />
                <Box mt={5} overflow={'auto'} height={'300px'} bg='#F7FAFE' rounded={5} border='1px solid #EAE6E6'>
                  <Box m={2} mb={2}>
                    <PerformanceGraph isLoading={isLoading} chartData = {fpmInfoData}/>
                  </Box>
                </Box>
              </ModalBody>
              <Divider mt={3} />
              <ModalFooter>
                <Button variant="outline" colorScheme="brand" onClick={onClose} mr={2}>
                  {t('cancel')}
                </Button>
                <Button
                  colorScheme="brand"
                  type="submit"
                  form="performanceValues"
                  disabled={isPerformanceSaveButtonDisabled}
                >
                  {t('save')}
                </Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </FormProvider>
      </Modal>
    </div>
  )
}

export default PerformanceModal
