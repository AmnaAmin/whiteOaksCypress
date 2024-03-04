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
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import RemainingListTable from 'features/work-order/details/remaining-list-table'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import {
  LineItems,
  SWOProject,
  useAssignLineItems,
  useCreateLineItem,
  useDeleteLineItems,
  useRemainingLineItems,
} from './assignedItems.utils'
import { WORK_ORDER } from '../workOrder.i18n'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { AddIcon } from '@chakra-ui/icons'
import { RiDeleteBinLine } from 'react-icons/ri'
import { ConfirmationBox } from 'components/Confirmation'
import { useLocation, usePaymentGroupVals } from 'api/location'

const RemainingItemsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  setAssignedItems: (items) => void
  remainingItems: LineItems[]
  isLoading: boolean
  swoProject: SWOProject
  isAssignmentAllowed: boolean
}> = props => {
  const { remainingItems, isLoading, setAssignedItems, onClose, swoProject, isAssignmentAllowed } = props
  const [selectedItems, setSelectedItems] = useState<LineItems[]>([])
  const { mutateAsync: updateLineItemsAsync } = useAssignLineItems({ swoProjectId: swoProject?.id })
  const { mutateAsync: createLineItemsAsync } = useCreateLineItem({ swoProject })
  const { mutate: updateLineItems } = useAssignLineItems({
    swoProjectId: swoProject?.id,
    showToast: true,
    refetchLineItems: true,
  })
  const { mutate: createLineItems } = useCreateLineItem({ swoProject, showToast: true, refetchLineItems: true })
  const { mutate: deleteLineItem, isLoading: isDeleteLoading } = useDeleteLineItems(swoProject?.id)
  const { refetch: refetchRemainingItems } = useRemainingLineItems(swoProject?.id)
  const { data: locations } = useLocation()
  const toast = useToast()

  const {
    isOpen: isDeleteConfirmationModalOpen,
    onClose: onDeleteConfirmationModalClose,
    onOpen: onDeleteConfirmationModalOpen,
  } = useDisclosure()

  const formControl = useForm<{
    remainingItems: LineItems[]
  }>()
  const { handleSubmit, control, reset, clearErrors, setValue } = formControl
  const remainingFieldArray = useFieldArray({
    control,
    name: 'remainingItems',
  })
  const remainingItemsWatch = useWatch({ name: 'remainingItems', control })
  const { paymentGroupValsOptions } = usePaymentGroupVals()

  useEffect(() => {
    reset({
      remainingItems: remainingItems?.map(r => {
        const locationFound = locations?.find(l => l.value === r.location)
        const payFound = paymentGroupValsOptions?.find(l => l.label === r?.paymentGroup)

        let paymentGroup
        let location

        if (payFound) {
          paymentGroup = { label: payFound.label, value: payFound.id }
        } else if (!!r.paymentGroup && payFound) {
          paymentGroup = { label: r?.paymentGroup, value: r?.paymentGroup }
        } else {
          paymentGroup = null
        }

        if (locationFound) {
          location = { label: locationFound.value, value: locationFound.id }
        } else if (!!r.location) {
          location = { label: r.location, value: r.location }
        } else {
          location = null
        }
        return {
          ...r,
          location,
          paymentGroup,
        }
      }),
    })
  }, [remainingItems, locations?.length])

  useEffect(() => {
    if (swoProject?.status?.toLocaleUpperCase() === 'COMPLETED') {
      refetchRemainingItems()
    }
  }, [swoProject])

  const onSubmit = async values => {
    const allItems = values.remainingItems?.map((item, index) => {
      return { ...item, sortOrder: index, location: item?.location?.label, paymentGroup: item?.paymentGroup?.label }
    })
    const newLineItems = allItems.filter(r => r?.action === 'new')
    const updatedLineItems = allItems.filter(r => !!r.id)

    if (updatedLineItems?.length > 0 && newLineItems?.length > 0) {
      const update = updateLineItemsAsync(updatedLineItems)
      const create = createLineItemsAsync([
        ...newLineItems.map(({ action, ...rest }) => {
          return rest
        }),
      ])
      Promise.all([update, create]).then(values => {
        refetchRemainingItems()
        assignAndReset()
        if (values[0] && values[1]) {
          toast({
            title: 'Remaining Items',
            description: 'Remaining Items updated successfully.',
            status: 'success',
            isClosable: true,
            position: 'top-left',
          })
        }
      })
    } else if (updatedLineItems?.length > 0) {
      updateLineItems(updatedLineItems, {
        onSuccess: () => {
          assignAndReset()
        },
      })
    } else if (newLineItems?.length > 0) {
      createLineItems(
        [
          ...newLineItems.map(({ action, ...rest }) => {
            return rest
          }),
        ],
        {
          onSuccess: () => {
            assignAndReset()
          },
        },
      )
    } else {
      assignAndReset()
    }
  }

  const assignAndReset = () => {
    setAssignedItems(selectedItems)
    setSelectedItems([])
    onClose()
  }
  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }

  return (
    <Box>
      <Modal
        variant="custom"
        isOpen={props.isOpen}
        onClose={() => {
          setSelectedItems([])
          reset({ remainingItems })
          props.onClose()
        }}
        size="flexible"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
            <ModalHeader fontSize="16px" fontWeight={500} color="gray.600">
              <HStack>
                <span>{t(`${WORK_ORDER}.remainingList`)}</span>
              </HStack>
            </ModalHeader>
            <ModalCloseButton _hover={{ bg: 'blue.50' }} />
            <ModalBody>
              <HStack mb="10px">
                {isAssignmentAllowed && (
                  <>
                    <Button
                      data-testid="add-row-btn"
                      type="button"
                      variant="ghost"
                      colorScheme="brand"
                      leftIcon={<Icon as={AddIcon} boxSize={2} />}
                      onClick={() => {
                        setValue('remainingItems', [
                          {
                            sku: '',
                            location: '',
                            productName: '',
                            description: '',
                            quantity: '',
                            unitPrice: '',
                            totalPrice: '',
                            action: 'new',
                            id: '',
                          },
                          ...remainingItemsWatch,
                        ])
                        clearErrors()
                      }}
                    >
                      {t(`${WORK_ORDER}.addRow`)}
                    </Button>
                    <Box pl="2" pr="1">
                      <Divider size="lg" orientation="vertical" h="25px" />
                    </Box>
                    <Button
                      data-testid="delete-row-button"
                      variant="ghost"
                      disabled={selectedItems?.length < 1}
                      colorScheme="brand"
                      onClick={onDeleteConfirmationModalOpen}
                      leftIcon={<RiDeleteBinLine color="#4E87F8" />}
                    >
                      {t(`${WORK_ORDER}.deleteRows`)}
                    </Button>
                  </>
                )}
              </HStack>
              <RemainingListTable
                formControl={formControl}
                remainingFieldArray={remainingFieldArray}
                isLoading={isLoading}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                swoProject={swoProject}
              />
            </ModalBody>
            <ModalFooter p="0">
              <HStack w="100%" justifyContent="end" my="16px" mr="32px" spacing="16px">
                <Button
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => {
                    setSelectedItems([])
                    reset({ remainingItems })
                    props.onClose()
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button variant="solid" colorScheme="brand" type="submit" data-testid="saveListItems">
                  {t('save')}
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <ConfirmationBox
        title="Are You Sure?"
        content="Do you really want to delete this item? This process cannot be undone."
        isOpen={isDeleteConfirmationModalOpen}
        onClose={onDeleteConfirmationModalClose}
        onConfirm={() => {
          deleteLineItem(
            { itemIds: selectedItems?.map(s => s.id)?.join(',') },
            {
              onSuccess: () => {
                setSelectedItems([])
                onDeleteConfirmationModalClose()
              },
            },
          )
        }}
        isLoading={isDeleteLoading}
      />
    </Box>
  )
}

export default RemainingItemsModal
