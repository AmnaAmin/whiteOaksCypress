import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody } from '@chakra-ui/modal'
import { ProjectAwardTab } from 'features/work-order/project-award/project.award'
import { useProjectAward } from 'api/project-award'
import { useFetchWorkOrder, useUpdateWorkOrderMutation } from 'api/work-order'

type projectAwardProps = {
  isOpen: boolean
  onClose: () => void
  selectedWorkOrder: any
  // closeTransactionModal: () => void
  updateNow: (update: boolean) => void
}

const UpdateProjectAward: React.FC<projectAwardProps> = props => {
  const {
    isOpen,
    onClose,
    selectedWorkOrder,
    // closeTransactionModal,
    updateNow,
  } = props
  const { projectAwardData } = useProjectAward()
  const [isUpdating, setIsUpdating] = useState<boolean>()
  const { mutate: updateWorkOrder } = useUpdateWorkOrderMutation({})
  // const [updateTrans,setUpdateTrans] = useState(false)

  const { awardPlanScopeAmount, workOrderDetails } = useFetchWorkOrder({
    workOrderId: selectedWorkOrder?.id,
  })

  const onSave = updatedValues => {
    const payload = { ...selectedWorkOrder, ...updatedValues }
    setIsUpdating(true)
    updateWorkOrder(payload, {
      onSuccess: () => {
        setIsUpdating(false)
        // closeTransactionModal()
        updateNow(true)
        onClose()
      },
      onError: () => {
        setIsUpdating(false)
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <ProjectAwardTab
            workOrder={workOrderDetails}
            onSave={onSave}
            onClose={onClose}
            awardPlanScopeAmount={awardPlanScopeAmount}
            projectAwardData={projectAwardData}
            isUpdating={isUpdating}
            isUpgradeProjectAward={true}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UpdateProjectAward
