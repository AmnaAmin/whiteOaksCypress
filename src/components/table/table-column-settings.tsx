import { useCallback, useEffect, useMemo, useState } from 'react'
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
import '@lourenci/react-kanban/dist/styles.css'
import Board, { moveCard } from '@asseinfo/react-kanban'
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

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation()
  // available.
  const mapRecordsAvailable =  useMemo(() => {
    return {
      columnResults: columnResults
        .filter(c => !c.hide)
        .map((c, i) => ({
          ...c,
          id: c.id,
          title: c.field,
          hide: c.hide,
        })),
    }
  }, [columnResults])
  
  //unavailable..
  const mapRecordsUnavailable = useMemo(() => {
    return {
      columnResults: columnResults
        .filter(c => c.hide)
        .map((c, i) => ({
          ...c,
          id: c.id,
          title: c.field,
          hide: c.hide,
        })),
    }
  }, [columnResults])
  
console.log('columnResults',columnResults)
console.log('mapRecordsUnavailable',mapRecordsUnavailable)
console.log('mapRecordsAvailable',mapRecordsAvailable)
  const board = useMemo(()=>{
    return  {
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
      ] as any,
    }
  },[mapRecordsAvailable,mapRecordsUnavailable])

  const [managedBoard, setManagedBoard] = useState(board)
  useEffect(() => {
    // if(mapRecordsUnavailable.length > 0)
    // return 
    setManagedBoard(board)
  }, [board])

console.log('managedBoard',managedBoard)
  const saveModal = useCallback(() => {
    const columnsToShow = managedBoard?.columns[0]?.cards
    const columnsToHide = managedBoard?.columns[1]?.cards
    const columnsPayload = [
      ...columnsToShow?.map((card, i) => ({ ...card, hide: false, order: i })),
      ...columnsToHide?.map((card, i) => ({ ...card, hide: true, order: i + columnsToShow.length - 1 })),
    ]

    if (paginationRecord) {
      columnsPayload.push(paginationRecord as ColumnType)
    }
    onClose()
    onSave(columnsPayload)
  }, [columnResults, onClose, onSave, managedBoard])

  useEffect(() => {
    setColumnResults(columns?.filter(col => col.field !== 'pagination'))
    setPaginationRecord(columns?.find(c => c.field === 'pagination'))
  }, [columns])

  const onCardDragChange = (_card, source, destination) => {
    const updatedBoard = moveCard(managedBoard, source, destination)
    setManagedBoard(updatedBoard)
  }

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
          {managedBoard}
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
