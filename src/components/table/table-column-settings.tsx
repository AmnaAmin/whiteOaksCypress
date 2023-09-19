import { useCallback, useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack,
  useDisclosure,
  Text,
  Icon,
  Box,
} from '@chakra-ui/react'

import { useTranslation } from 'react-i18next'
import './kanban.css'
import { Button } from 'components/button/button'
import { MdOutlineSettings } from 'react-icons/md'
import Board, { moveCard } from '@lourenci/react-kanban'
import '@lourenci/react-kanban/dist/styles.css'
import { BiGridVertical } from 'react-icons/bi'
import { result } from 'lodash'

export type ColumnType = {
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
  refetch?: any
}

const TableColumnSettings = ({ onSave, columns, disabled = false, refetch }: TableColumnSettingsProps) => {
  const [paginationRecord, setPaginationRecord] = useState<ColumnType | undefined>(
    columns?.find(c => c.field === 'pagination'),
  )
  const [columnRecords, setColumnRecords] = useState(
    columns?.filter(col => col.field !== 'pagination' && col.field == null),
  )
  const [columnResults, setColumnResults] = useState(columns?.filter(col => col.contentKey !== 'pagination'))
  // console.log("colum state: ", columnResults)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation()
  // available.
  const mapRecordsAvailable = columnResults
    .filter(c => !c.hide)
    .map((c, i) => {
      return {
        id: c.id,
        title: c.field,
        hide: c.hide,
        description: c.field,
      }
    })
  //unavailable..
  const mapRecordsUnavailable = columnResults
    .filter(c => c.hide)
    .map((c, i) => {
      return {
        id: c.id,
        title: c.field,
        hide: c.hide,
        description: c.field,
      }
    })

  const board = {
    columns: [
      {
        id: 1,
        title: 'Show These Records in this Order',
        cards: mapRecordsAvailable,
      },
      {
        id: 2,
        title: 'Available Records',
        cards: mapRecordsUnavailable,
      },
    ],
  }
  const [controlledBoard, setBoard] = useState<any>(board ?? [])
  console.log(controlledBoard)
  // console.log('board', board)
  // console.log('board_', board_)
  //result is card
  const onCardDragChange = (results, source, destination) => {
    const updatedBoard = moveCard(controlledBoard, source, destination)
    //  console.log('source',source)
    //  console.log('destination', destination)
    setBoard(updatedBoard)
    //  console.log('result',results)
    // if (results.columns.length > 0) {
    //   updateRecords(results)
    // }
  }

  const saveModal = useCallback(() => {
    console.log("controlledboard:", controlledBoard)
    console.log("grid data", columnResults)
    const control = controlledBoard.columns.map(x => {
      if (x.id === 1) {
        x.cards = x.cards.map(card => ({ ...card,  hide: false }))
      } else x.cards = x.cards.map(card => ({ ...card,  hide: true }))
      return x
    })
    const cardsInControlledBoard = [...control[0]?.cards, ...control[1]?.cards];
    // console.log('controlledBoard', cardsInControlledBoard)

    const hiddenCardsId = control[1].cards.map(card => (card.id));
    // console.log("Here ae the ids of hidden cards:", hiddenCardsId)
    // const test = control.map(element => {
    //   return element.cards.filter(card => { 
    //     // updateRecords(card)
    //     if (card?.)
    //   });
    // });
    const result = columnResults?.map((x)=>{
      if (hiddenCardsId?.some((cardId) => cardId === x?.id)) return {...x, hide: true};
      else return {...x, hide: false}
    });
    // const result = cardsInControlledBoard

    console.log(result);
    setColumnResults(result)
    // console.log('control', control)
    onClose()
    let columnsPayload = result.map((item, index) => ({
      ...item,
      order: index,
    }))
    if (paginationRecord) {
      columnsPayload.push(paginationRecord as ColumnType)
    }
    console.log("payload: ", columnsPayload);
    // updateRecords(controlledBoard)
    onSave(columnsPayload)
    // console.log('Results', result)
  }, [columnResults, onClose, onSave, controlledBoard])

  useEffect(() => {
    setColumnResults(columns?.filter(col => col.field !== 'pagination'))
    setPaginationRecord(columns?.find(c => c.field === 'pagination'))
  }, [columns])

  // const updateRecords = results => {
  //   const Cards = results.columns?.filter(x => x.cards)
  //   const UnavailableData = Cards != null ? Cards.filter(x => x.title === 'Available Records') : null
  //   const AvailableData = Cards != null ? Cards.filter(x => x.title === 'Show These Records in this Order') : null

  //   let AvailableItems: ColumnType[]
  //   let UnAvailableItems: ColumnType[]
  //   if (UnavailableData != null && Cards.length > 0) {
  //     for (let i = 0; i < UnavailableData.length; i++) {
  //       const content = UnavailableData[i].cards
  //       for (let j = 0; j < content.length; j++) {
  //         const UnAvailableContentKeys = content[j].title
  //         if (
  //           UnAvailableContentKeys !== '' &&
  //           UnAvailableContentKeys !== null &&
  //           UnAvailableContentKeys !== undefined
  //         ) {
  //           for (let n = 0; n < columnResults.length; n++) {
  //             if (columnResults[n].field === UnAvailableContentKeys) {
  //               UnAvailableItems = columnResults
  //               UnAvailableItems[n].hide = true
  //               setColumnResults([...UnAvailableItems])
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if (AvailableData?.length > 0) {
  //     for (let i = 0; i < AvailableData.length; i++) {
  //       var content = AvailableData[i].cards
  //       for (let j = 0; j < content.length; j++) {
  //         var AvailableContentKeys = content[j].title
  //         if (AvailableContentKeys !== '' && AvailableContentKeys !== null && AvailableContentKeys !== undefined) {
  //           for (let n = 0; n < columnResults.length; n++) {
  //             if (columnResults[n].field === AvailableContentKeys) {
  //               AvailableItems = columnResults
  //               AvailableItems[n].hide = false
  //               setColumnResults([...AvailableItems])
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   console.log('ColumnResults', columnResults)
  // }

  const closeSetting = () => {
    onClose()
    refetch()
  }

  function ControlledBoard() {
    const divStyle = {
      color: '#4A5568',
      fontWeight: 500,
    }

    const columnStyle = {
      width: '400px',
      fontWeight: 600,
      color: '#345EA6',
    }

    const cardStyle = {
      width: '400px',
      marginTop: '16px',
      height: '50px',
      backgroundColor: '#FFFFFF',
      borderRadius: '6px',
      border: '1px solid #D3D3D3',
    }

    return (
      <div style={divStyle}>
        <Board
          onCardDragEnd={onCardDragChange}
          disableColumnDrag
          // initialBoard={board}
          renderColumnHeader={({ title }) => <div style={columnStyle}>{title}</div>}
          renderCard={({ title, id }, { dragging }) => (
            <>
              <div
                style={{
                  opacity: dragging ? 0.5 : 1,
                }}
              >
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
                    <BiGridVertical style={{ marginRight: '5px', color: '#989898', marginTop: '10px' }} />
                    <span style={{ marginTop: '10px' }}>{title}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        >
          {controlledBoard}
        </Board>
      </div>
    )
  }

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
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent h="620px" bg="#F2F3F4" rounded="none">
          <ModalHeader
            bg="#FFFFFF"
            borderBottom="1px solid #E2E8F0"
            fontSize="16px"
            fontStyle="normal"
            fontWeight={600}
            color="#345EA6"
            mb="11px"
            borderTop="2px solid #345EA6"
          >
            {t('settingsHeader')}
          </ModalHeader>
          <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} color="#4A5568" />
          <ModalBody
            data-testid="Settings"
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
            <ControlledBoard />
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
              <Button variant="ghost" colorScheme="darkPrimary" onClick={closeSetting} border="1px solid" size="md">
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
