import React, { useCallback, useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  List,
  ListItem,
  HStack,
  Checkbox,
  useDisclosure,
} from '@chakra-ui/react'
import { FaAtom } from 'react-icons/fa'
import { BiGridVertical } from 'react-icons/bi'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { t } from 'i18next'
// import { useTranslation } from 'react-i18next';
import 'components/translation/i18n'

type ColumnType = {
  id?: number
  field: string
  order: number
  hide: boolean
  contentKey
}

interface TableColumnSettingsProps {
  onSave: (col: ColumnType[]) => void
  columns: ColumnType[]
  isOpen?: boolean
  disabled?: boolean
}

const TableColumnSettings = ({ onSave, columns, disabled = false }: TableColumnSettingsProps) => {
  const [columnRecords, setColumnRecords] = useState(columns)
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const { t } = useTranslation();

  const saveModal = useCallback(() => {
    console.log('columnRecords', columnRecords)
    const columnsPayload = columnRecords.map((item, index) => ({
      ...item,
      order: index,
    }))

    console.log('columnPayload', columnsPayload)

    onClose()
    onSave(columnsPayload)
  }, [columnRecords, onClose, onSave])

  useEffect(() => {
    setColumnRecords(columns)
  }, [columns])

  const handleOnDragEnd = useCallback(
    result => {
      if (!result.destination) return

      const items = Array.from(columnRecords)
      const {
        source: { index: sourceIndex },
        destination: { index: destinationIndex },
      } = result

      const [reorderedItem] = items.splice(sourceIndex, 1)
      items.splice(destinationIndex, 0, reorderedItem)

      console.log('items', items)
      setColumnRecords(items)
    },
    [columnRecords],
  )

  const onCheck = useCallback(index => {
    setColumnRecords(columnRecords => {
      const items = Array.from(columnRecords)
      items[index].hide = !items[index].hide

      return items
    })
  }, [])

  return (
    <>
      <Button
        data-testid="column-settings-button"
        bg="#4E87F8"
        color="white"
        size="md"
        _hover={{ bg: 'royalblue' }}
        onClick={onOpen}
        disabled={disabled}
      >
        <Box pos="relative" right="6px">
          <FaAtom />
        </Box>
        {t('setting')}
      </Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent h="70vh">
          <ModalHeader>Column Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody h="50vh" overflow="scroll">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="items">
                {provided => (
                  <List
                    spacing={1}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    id="column-settings-list"
                    data-testid="column-settings-list"
                  >
                    {columnRecords.map(({ field, id, hide }, index) => (
                      <Draggable key={id} draggableId={`${id}_${index}`} index={index} className="draggable-item">
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <ListItem
                              data-testid={`draggable-item-${index}`}
                              border="1px"
                              borderColor="#A0AEC0"
                              borderRadius="8"
                              m="2"
                              p="5"
                              fontSize="1em"
                              fontWeight={600}
                              backgroundColor={snapshot.isDragging ? '#f0fff4' : 'transparent'}
                            >
                              <HStack spacing="24px">
                                <BiGridVertical fontSize="1.6rem" color={snapshot.isDragging ? '#4b85f8' : '#A0AEC0'} />
                                <Checkbox
                                  size="lg"
                                  marginStart="0.625rem"
                                  onChange={() => onCheck(index)}
                                  isChecked={!hide}
                                >
                                  {field}
                                </Checkbox>
                              </HStack>
                            </ListItem>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" mr={3} onClick={saveModal}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TableColumnSettings
