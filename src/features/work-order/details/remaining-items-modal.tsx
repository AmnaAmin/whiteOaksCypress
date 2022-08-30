import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import RemainingListTable from 'features/work-order/details/remaining-list-table'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { LineItems, useAssignLineItems } from './assignedItems.utils'
import { WORK_ORDER } from '../workOrder.i18n'
import { useFieldArray, useForm } from 'react-hook-form'

const RemainingItemsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  setAssignedItems: (items) => void
  remainingItems: LineItems[]
  isLoading: boolean
  swoProject: any
}> = props => {
  const { remainingItems, isLoading, setAssignedItems, onClose, swoProject } = props
  const [selectedItems, setSelectedItems] = useState<LineItems[]>([])
  const { mutate: updateLineItems } = useAssignLineItems({ swoProjectId: swoProject?.id, showToast: true })

  const formControl = useForm<{
    remainingItems: LineItems[]
  }>()
  const { handleSubmit, control, reset, getValues } = formControl
  const remainingFieldArray = useFieldArray({
    control,
    name: 'remainingItems',
  })
  const { fields: remainingList } = remainingFieldArray
  useEffect(() => {
    reset({ remainingItems })
  }, [remainingItems])

  const onSubmit = () => {}
  return (
    <Box>
      <Modal variant="custom" isOpen={props.isOpen} onClose={props.onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader fontSize="16px" fontWeight={500} color="gray.600">
              {t(`${WORK_ORDER}.remainingList`)}
            </ModalHeader>
            <ModalCloseButton _hover={{ bg: 'blue.50' }} />
            <ModalBody h="400px" overflow={'auto'}>
              <RemainingListTable
                formControl={formControl}
                remainingFieldArray={remainingFieldArray}
                isLoading={isLoading}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </ModalBody>
            <ModalFooter p="0">
              <HStack w="100%" justifyContent="end" my="16px" mr="32px" spacing="16px">
                <Button
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => {
                    setSelectedItems([])
                    props.onClose()
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button
                  variant="solid"
                  colorScheme="brand"
                  onClick={() => {
                    setAssignedItems(selectedItems)
                    setSelectedItems([])
                    updateLineItems([...getValues().remainingItems])
                    onClose()
                  }}
                >
                  {t('save')}
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default RemainingItemsModal
