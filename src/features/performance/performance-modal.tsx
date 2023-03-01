import {
  Box,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { PerformanceType } from 'types/performance.type'
import {
  badges,
  bonus,
  ignorePerformance,
  useFPMDetails,
  useMutatePerformance,
  usePerformanceSaveDisabled,
} from 'api/performance'
import { PerformanceDetail } from './performance-details'
import { Button } from 'components/button/button'
import { useForm, UseFormReturn } from 'react-hook-form'
import PerformanceGraph from './performance-modal-graph'
import { PERFORMANCE } from './performance.i18n'

const PerformanceModal = ({
  performanceDetails,
  onClose,
  isOpen,
}: {
  performanceDetails: PerformanceType
  onClose: () => void
  isOpen: boolean
}) => {
  const { t } = useTranslation()
  const [yearFilter, setYearFilter] = useState(null)
  const { data: fpmData, isLoading, refetch, isFetching } = useFPMDetails(performanceDetails?.userId, yearFilter)
  const { mutate: savePerformanceDetails } = useMutatePerformance(performanceDetails?.userId)
  const formReturn = useForm<PerformanceType>()
  const { control, formState, reset } = formReturn
  // Setting Dropdown values
  const bonusValue = bonus?.find(b => b?.value === fpmData?.newBonus)
  const badgeValue = badges?.find(b => b?.value === fpmData?.badge)
  const quotaValue = ignorePerformance?.find(b => b?.value === fpmData?.ignoreQuota)

  useEffect(() => {
    if (yearFilter) {
      refetch()
    }
  }, [yearFilter])

  useEffect(() => {
    reset({
      newTarget: fpmData?.newTarget || '0.00',
      newBonus: bonusValue,
      badge: badgeValue,
      ignoreQuota: quotaValue,
    })
  }, [reset, fpmData])

  const onSubmit = useCallback(
    async values => {
      const queryOptions = {
        onSuccess() {
          onClose()
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

  const isPerformanceSaveButtonDisabled = usePerformanceSaveDisabled(control, formState?.errors)

  return (
    <div>
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={formReturn.handleSubmit(onSubmit)} id="performanceValues">
          <ModalContent w="1137px" rounded={3} borderTop="2px solid #4E87F8">
            <ModalHeader h="63px" borderBottom="1px solid #E2E8F0">
              <Text variant="strong-label" color="gray.600" fontSize={'16px'}>
                {performanceDetails?.name}
              </Text>
            </ModalHeader>
            <ModalCloseButton _hover={{ bg: 'blue.50' }} />
            <ModalBody justifyContent="center">
              <PerformanceDetail
                performanceDetails={performanceDetails}
                formControl={formReturn as UseFormReturn<any>}
              />
              <Box mt={5} height={'450px'}>
                <PerformanceGraph
                  chartData={fpmData}
                  isLoading={isLoading || isFetching}
                  yearFilter={yearFilter}
                  setYearFilter={setYearFilter}
                />
              </Box>
            </ModalBody>
            <Divider mt={3} />
            <ModalFooter>
              <Button variant="outline" colorScheme="brand" onClick={onClose} mr={2}>
                {t(`${PERFORMANCE}.cancel`)}
              </Button>
              <Button
                colorScheme="brand"
                type="submit"
                form="performanceValues"
                disabled={isPerformanceSaveButtonDisabled}
              >
                {t(`${PERFORMANCE}.save`)}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </div>
  )
}

export default PerformanceModal
