import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
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
import { LineItems, useAssignLineItems, useCreateLineItem } from './assignedItems.utils'
import { WORK_ORDER } from '../workOrder.i18n'
import { useFieldArray, useForm } from 'react-hook-form'
import { AddIcon } from '@chakra-ui/icons'

const RemainingItemsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  setAssignedItems: (items) => void
  remainingItems: LineItems[]
  isLoading: boolean
  swoProject: any
  isAssignmentAllowed: boolean
}> = props => {
  const { remainingItems, isLoading, setAssignedItems, onClose, swoProject, isAssignmentAllowed } = props
  const [selectedItems, setSelectedItems] = useState<LineItems[]>([])
  const { mutateAsync: updateLineItems } = useAssignLineItems({ swoProjectId: swoProject?.id, showToast: false })
  const { mutateAsync: createLineItems } = useCreateLineItem({ swoProject, showToast: false })

  const formControl = useForm<{
    remainingItems: LineItems[]
  }>()
  const { handleSubmit, control, reset } = formControl
  const remainingFieldArray = useFieldArray({
    control,
    name: 'remainingItems',
  })

  const { prepend } = remainingFieldArray

  useEffect(() => {
    reset({ remainingItems })
  }, [remainingItems])

  const onSubmit = async values => {
    const newLineItems = values.remainingItems.filter(r => r.action === 'new')
    const update = updateLineItems([...values.remainingItems.filter(r => !!r.id)])
    const create = createLineItems([
      ...newLineItems.map(({ action, ...rest }) => {
        return rest
      }),
    ])

    Promise.all([update, create]).then(values => {
      onClose()
      setAssignedItems(selectedItems)
      reset()
    })
    setSelectedItems([])
  }
  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }
  return (
    <Box>
      <Modal variant="custom" isOpen={props.isOpen} onClose={props.onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
            <ModalHeader fontSize="16px" fontWeight={500} color="gray.600">
              <HStack>
                <span>{t(`${WORK_ORDER}.remainingList`)}</span>
                <Box pl="2" pr="1">
                  <Divider size="lg" orientation="vertical" h="25px" />
                </Box>
                {isAssignmentAllowed && (
                  <Button
                    type="button"
                    variant="ghost"
                    colorScheme="brand"
                    leftIcon={<Icon as={AddIcon} boxSize={3} />}
                    onClick={() =>
                      prepend({
                        sku: '',
                        productName: '',
                        description: '',
                        quantity: '',
                        unitPrice: '',
                        totalPrice: '',
                        action: 'new',
                      })
                    }
                  >
                    {t(`${WORK_ORDER}.addNewItem`)}
                  </Button>
                )}
              </HStack>
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
                <Button variant="solid" colorScheme="brand" type="submit">
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
