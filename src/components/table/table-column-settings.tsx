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
  Center,
  Text,
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
    const columnsPayload = columnRecords.map((item, index) => ({
      ...item,
      order: index,
    }))

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
        ml="1"
        variant="ghost"
        color="#4E87F8"
        fontSize="12px"
        fontStyle="normal"
        fontWeight={500}
        _focus={{ border: 'none' }}
        onClick={onOpen}
        disabled={disabled}
        data-testid="column-settings-button"
      >
        <Box pos="relative" right="6px">
          <FaAtom />
        </Box>
        {t('setting')}
      </Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent h="737px">
          <ModalHeader
            bg="#F7FAFC"
            borderBottom="1px solid #E2E8F0"
            fontSize="16px"
            fontStyle="normal"
            fontWeight={500}
            color="gray.600"
            mb="6"
          >
            Column Settings
          </ModalHeader>
          <ModalCloseButton _focus={{ border: 'none' }} />
          <ModalBody h="50vh" overflowY="scroll">
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
                            <Center>
                              <ListItem
                                data-testid={`draggable-item-${index}`}
                                border="2px"
                                borderColor="gray.300"
                                borderRadius="8"
                                w="485px"
                                m="1.5"
                                p="4"
                                fontSize="1em"
                                fontWeight={600}
                                backgroundColor={snapshot.isDragging ? '#f0fff4' : 'transparent'}
                                _hover={{ bg: 'gray.100' }}
                              >
                                <HStack spacing="24px">
                                  <BiGridVertical
                                    fontSize="1.6rem"
                                    color={snapshot.isDragging ? '#4b85f8' : '#A0AEC0'}
                                  />
                                  <Checkbox
                                    size="lg"
                                    marginStart="0.625rem"
                                    onChange={() => onCheck(index)}
                                    isChecked={!hide}
                                    colorScheme="CustomPrimaryColor"
                                  >
                                    <Text
                                      ml="12px"
                                      color="gray.600"
                                      fontStyle="normal"
                                      fontWeight={500}
                                      fontSize="14px"
                                    >
                                      {field}
                                    </Text>
                                  </Checkbox>
                                </HStack>
                              </ListItem>
                            </Center>
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
            <Button variant="ghost" size="md" onClick={onClose} color="gray.600" fontWeight={500} mr={3}>
              Close
            </Button>
            <Button
              colorScheme="CustomPrimaryColor"
              fontSize="14px"
              size="md"
              fontWeight={500}
              fontStyle="normal"
              mr={3}
              onClick={saveModal}
              _hover={{ bg: 'blue' }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TableColumnSettings
