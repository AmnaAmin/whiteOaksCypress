import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader } from '@chakra-ui/modal'
import { ProjectAwardTab } from 'features/work-order/project-award/project.award'
import { useProjectAward } from 'api/project-award'
import { useFetchWorkOrder, useUpdateWorkOrderMutation } from 'api/work-order'
import { PROJECT_AWARD } from 'features/work-order/project-award/projectAward.i18n'
import { useTranslation } from 'react-i18next'

type projectAwardProps = {
  isOpen: boolean
  onClose: () => void
  selectedWorkOrder: any
  refetchAwardStats: () => void
  refetchWOKey: () => void
}

const UpdateProjectAward: React.FC<projectAwardProps> = props => {
  const { isOpen, onClose, selectedWorkOrder, refetchAwardStats, refetchWOKey } = props
  const { projectAwardData } = useProjectAward()
  const [isUpdating, setIsUpdating] = useState<boolean>()
  const { mutate: updateWorkOrder } = useUpdateWorkOrderMutation({})
  const { t } = useTranslation()

  const { awardPlanScopeAmount, workOrderDetails } = useFetchWorkOrder({
    workOrderId: selectedWorkOrder?.id,
  })

  const onSave = updatedValues => {
    const payload = { ...selectedWorkOrder, ...updatedValues }
    setIsUpdating(true)
    updateWorkOrder(payload, {
      onSuccess: () => {
        setIsUpdating(false)
        refetchAwardStats()
        refetchWOKey()
        onClose()
      },
      onError: () => {
        setIsUpdating(false)
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" variant="custom">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader> {t(`${PROJECT_AWARD}.upgradePlan`)}</ModalHeader>
        <ProjectAwardTab
          workOrder={workOrderDetails}
          onSave={onSave}
          onClose={onClose}
          awardPlanScopeAmount={awardPlanScopeAmount}
          projectAwardData={projectAwardData}
          isUpdating={isUpdating}
          isUpgradeProjectAward={true}
        />
      </ModalContent>
    </Modal>
  )
}

export default UpdateProjectAward
