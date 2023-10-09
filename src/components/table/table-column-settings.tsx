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
import React from 'react'
import { useResetSettingsMutation } from 'api/table-column-settings'
import { TableNames } from 'types/table-column.types'
import { ConfirmationBox } from 'components/Confirmation'

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
  tableName: TableNames
}

const TableColumnSettings = ({ onSave, columns, disabled = false, refetch, tableName }: TableColumnSettingsProps) => {
  const [paginationRecord, setPaginationRecord] = useState<ColumnType | undefined>(
    columns?.find(c => c.field === 'pagination'),
  )
  const [columnResults, setColumnResults] = useState(columns?.filter(col => col.contentKey !== 'pagination'))

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation()
  // available.
  const mapRecordsAvailable = useMemo(
    () =>
      columnResults
        .filter(c => !c.hide)
        .map((c, i) => ({
          ...c,
          id: Math.floor(Math.random() * 100000),
          title: c.field,
          hide: c.hide,
        })),

    [columnResults],
  )

  //unavailable..
  const mapRecordsUnavailable = useMemo(
    () =>
      columnResults
        .filter(c => c.hide)
        .map((c, i) => ({
          ...c,
          id: Math.floor(Math.random() * 100000),
          title: c.field,
          hide: c.hide,
        })),

    [columnResults],
  )
  const board = useMemo(() => {
    return {
      columns: [
        {
          id: 1,
          title: 'Available Records', // Change the order of the columns
          cards: mapRecordsUnavailable,
        },
        {
          id: 2,
          title: 'Show These Records in this Order',
          cards: mapRecordsAvailable,
        },
      ] as any,
    }
  }, [mapRecordsAvailable, mapRecordsUnavailable])
  const [initialBoard, setInitialBoard] = useState(board)
  const [managedBoard, setManagedBoard] = useState(board)
  useEffect(() => {
    setManagedBoard(board)
  }, [board])

  const saveModal = useCallback(() => {
    const columnsToShow = managedBoard?.columns[1]?.cards
    const columnsToHide = managedBoard?.columns[0]?.cards
    const columnsPayload = [
      ...columnsToShow?.map((card, i) => ({ ...card, hide: false, order: i })),
      ...columnsToHide?.map((card, i) => ({ ...card, hide: true, order: i + columnsToShow.length - 1 })),
    ]

    if (paginationRecord) {
      columnsPayload.push(paginationRecord as ColumnType)
    }
    onClose()
    setManagedBoard(initialBoard)
    onSave(columnsPayload)
  }, [columnResults, onClose, onSave, managedBoard, initialBoard])

  useEffect(() => {
    setColumnResults(columns?.filter(col => col.field !== 'pagination'))
    setPaginationRecord(columns?.find(c => c.field === 'pagination'))
    setInitialBoard(board)
  }, [columns])

  const [isUpdated, setisUpdated] = useState(false)

  const onCardDragChange = (_card, source, destination) => {
    if (!isUpdated) {
      setisUpdated(true)
    }
    const updatedBoard = moveCard(managedBoard, source, destination)
    setManagedBoard(updatedBoard)
  }
  const [modalKey, setModalKey] = useState(0)
  const _onClose = () => {
    // Reset the managedBoard to the initialBoard
    setManagedBoard(initialBoard)
    onClose()
    refetch()
    setModalKey(prevKey => prevKey + 1)
  }

  const closeSetting = () => {
    onClose()
    refetch()
  }
  const { mutate: clearSettingType } = useResetSettingsMutation()
  const {
    isOpen: isResetConfirmationModalOpen,
    onClose: onResetConfirmationModalClose,
    onOpen: onResetConfirmationModalOpen,
  } = useDisclosure()
  const openResetConfirmationBox = () => {
    onResetConfirmationModalOpen()
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
      <Modal isOpen={isOpen} onClose={_onClose} size="6xl" key={modalKey}>
        <ModalOverlay />
        <ModalContent minH="700px" bg="#F2F3F4" rounded="none">
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
            bg="#FFFFFF"
            mx="11px"
            overflowY={'hidden'}
            borderTopLeftRadius="6px"
            borderTopRightRadius="6px"
            boxShadow="1px 0px 2px 0px lightgrey"
            borderBottom="1px solid #CBD5E0"
            pt="20px"
            pb="20px"
          >
            <Button variant="ghost" colorScheme="brand" fontWeight={500} onClick={openResetConfirmationBox} size="md">
              <Icon as={MdOutlineSettings} fontSize="14px" fontWeight={500} style={{ marginRight: '8px' }} />
              {t('resetSettings')}
            </Button>
            <ConfirmationBox
              title="Reset Settings?"
              content="Are you sure you want to reset Settings? This action cannot be undone."
              isOpen={isResetConfirmationModalOpen}
              onClose={onResetConfirmationModalClose}
              onConfirm={() => {
                onResetConfirmationModalClose()
                clearSettingType(tableName)
              }}
            />
            <ControlledBoard
              onCardDragChange={onCardDragChange}
              board={board}
              isUpdated={isUpdated}
              updatedBoard={managedBoard}
            />
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
              <Button data-testid="save-settings" colorScheme="darkPrimary" onClick={saveModal} size="md">
                {t('save')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
function ControlledBoard({ onCardDragChange, board, updatedBoard, isUpdated }) {
  const divStyle = {
    color: '#4A5568',
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

  if (!board || !board.columns) return null
  return (
    <div style={divStyle}>
      <Board
        onCardDragEnd={onCardDragChange}
        disableColumnDrag
        renderColumnHeader={({ title }) => <div style={columnStyle}>{title}</div>}
        renderCard={({ title, id }, { dragging }) => (
          <React.Fragment key={id}>
            <div
              data-testid={`card-${title}`}
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
          </React.Fragment>
        )}
      >
        {isUpdated ? updatedBoard : board}
      </Board>
    </div>
  )
}
export default TableColumnSettings
