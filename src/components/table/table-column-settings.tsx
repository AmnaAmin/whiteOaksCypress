import React, { useCallback, useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  List,
  ListItem,
  HStack,
  Checkbox,
  useDisclosure,
  Center,
  Text,
  Icon,
  Box,
} from '@chakra-ui/react'
import { BiGridVertical } from 'react-icons/bi'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'

import { Button } from 'components/button/button'
import { MdOutlineSettings } from 'react-icons/md'

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
  const { t } = useTranslation()

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
      <Box _hover={{ bg: 'darkPrimary.50', roundedBottomRight: '6px' }}>
        <Button
          colorScheme="darkBlue"
          variant="ghost"
          m={0}
          onClick={onOpen}
          data-testid="column-settings-button"
          disabled={disabled}
        >
          <HStack spacing={1}>
            <Icon as={MdOutlineSettings} fontSize="18px" fontWeight={500} />
            <Text fontWeight={500}>{t('settings')}</Text>
          </HStack>
        </Button>
      </Box>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent h="620px" bg="#F2F3F4" rounded="none">
          <ModalHeader
            bg="#FFFFFF"
            borderBottom="1px solid #E2E8F0"
            fontSize="16px"
            fontStyle="normal"
            fontWeight={400}
            color="gray.600"
            mb="11px"
            borderTop="2px solid #345EA6"
          >
            {t('Settings')}
          </ModalHeader>
          <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} color="#4A5568" />
          <ModalBody
            h="50vh"
            overflowY="auto"
            bg="#FFFFFF"
            mx="11px"
            borderTopLeftRadius="6px"
            borderTopRightRadius="6px"
            boxShadow="1px 0px 2px 0px lightgrey"
            borderBottom="1px solid #CBD5E0"
            pt="30px"
          >
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
                    {columnRecords
                      ?.filter(col => col.contentKey !== 'pagination')
                      .map(({ field, id, hide }, index) => (
                        <Draggable key={id} draggableId={`${id}_${index}`} index={index} className="draggable-item">
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Center>
                                <ListItem
                                  data-testid={`draggable-item-${index}`}
                                  borderWidth="1.5px"
                                  borderColor="gray.300"
                                  borderRadius="8"
                                  w="485px"
                                  m="1.5"
                                  py="8px"
                                  fontSize="1em"
                                  fontWeight={600}
                                  backgroundColor={snapshot.isDragging ? '#f0fff4' : 'transparent'}
                                  _hover={{ bg: 'blue.50' }}
                                >
                                  <HStack spacing="21.83px" ml="21.83px">
                                    <BiGridVertical
                                      fontSize="1.4rem"
                                      color={snapshot.isDragging ? '#4b85f8' : '#A0AEC0'}
                                    />
                                    <Checkbox
                                      size="lg"
                                      marginStart="0.625rem"
                                      onChange={() => onCheck(index)}
                                      isChecked={!hide}
                                      colorScheme="PrimaryCheckBox"
                                    >
                                      <Text
                                        ml="12px"
                                        color="gray.600"
                                        fontStyle="normal"
                                        fontWeight={400}
                                        fontSize="14px"
                                      >
                                        {t(field)}
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

          <ModalFooter
            bg="#FFFFFF"
            roundedBottomLeft="6px"
            roundedBottomRight="6px"
            mx="11px"
            mb="11px"
            boxShadow="0px 1px 2px 0px lightgrey"
            p="0px"
          >
            <HStack spacing="16px" mr="13px" my="16px">
              <Button variant="ghost" colorScheme="darkPrimary" onClick={onClose} border="1px solid" size="md">
                {t('cancel')}
              </Button>
              <Button colorScheme="darkPrimary" onClick={saveModal} size="md">
                {t('save')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TableColumnSettings
