import React, { useCallback, useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex, useDisclosure } from '@chakra-ui/react'
import { TableWrapper } from 'components/table/table'
import { RowProps } from 'components/table/react-table'
import AccountReceivableModal from 'features/projects/modals/project-coordinator/receivable/account-receivable-modal'
import { usePCRecievable } from 'utils/account-receivable'
import UpdateTransactionModal from 'features/projects/transactions/update-transaction-modal'
import { Column } from 'react-table'

const ReceivableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
      }}
      onClick={e => {
        if (onRowClick) {
          onRowClick(e, row)
        }
      }}
      {...row.getRowProps({
        style,
      })}
    >
      {row.cells.map(cell => {
        return (
          <Td {...cell.getCellProps()} key={`row_${cell.column.id}`} p="0">
            <Flex alignItems="center" h="60px">
              <Text
                noOfLines={1}
                title={cell.value}
                padding="0 15px"
                color="gray.600"
                mb="20px"
                mt="10px"
                fontSize="14px"
                fontStyle="normal"
                fontWeight="400"
              >
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}

type ReceivableProps = {
  selectedCard: string
  selectedDay: string
  resizeElementRef?: any
  setTableInstance: (tableInstance: any) => void
  receivableColumns: Column[]
  weeklyCount?: { name: string; title: string; count: number; dates: Date }[]
  weekDayFilters: any[]
}

export const ReceivableTable: React.FC<ReceivableProps> = ({
  setTableInstance,
  selectedCard,
  resizeElementRef,
  receivableColumns,
  selectedDay,
  weekDayFilters,
}) => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  const [selectedProjectId, setSelectedProjectId] = useState<string>()
  const {
    isOpen: isAccountReceivableModal,
    onOpen: onAccountReceivableModalOpen,
    onClose: onAccountReceivableModalClose,
  } = useDisclosure()
  const { isOpen: isOpenTransactionModal, onOpen: onEditModalOpen, onClose: onTransactionModalClose } = useDisclosure()

  const onRowClick = useCallback(
    (_, row) => {
      if (row.original.type === 'draw') {
        setSelectedTransactionId(row.original.changeOrderId)
        setSelectedProjectId(row.original.projectId)
        onEditModalOpen()
      } else {
        setSelectedProjectId(row.original.projectId)
        onAccountReceivableModalOpen()
      }
    },
    [onAccountReceivableModalOpen],
  )
  const { receivableData, isLoading } = usePCRecievable()
  const receivable = receivableData?.arList

  const [receivableFilterData, setFilterReceivableData] = useState(receivable)

  useEffect(() => {
    if (!selectedCard && !selectedDay) setFilterReceivableData(receivable)
    setFilterReceivableData(
      receivable?.filter(
        project =>
          !selectedCard || project.durationCategory?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase(),
      ),
    )

    // Due Project Weekly Filter
    const getDates = weekDayFilters?.filter(day => selectedDay === day.id)

    const clientDate = getDates?.map(date => {
      return date?.date
    })

    if (selectedDay) {
      setFilterReceivableData(
        receivable?.filter(receivableValue => {
          return clientDate.includes(receivableValue.expectedPaymentDate?.substr(0, 10))
        }),
      )
    }
  }, [selectedCard, selectedDay, receivable])

  return (
    <Box overflow="auto" width="100%">
      <TableWrapper
        onRowClick={onRowClick}
        columns={receivableColumns}
        setTableInstance={setTableInstance}
        data={receivableFilterData || []}
        isLoading={isLoading}
        TableRow={ReceivableRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
        defaultFlexStyle={false}
      />
      <AccountReceivableModal
        projectId={selectedProjectId}
        isOpen={isAccountReceivableModal}
        onClose={onAccountReceivableModalClose}
      />
      <UpdateTransactionModal
        isOpen={isOpenTransactionModal}
        onClose={onTransactionModalClose}
        selectedTransactionId={selectedTransactionId as number}
        projectId={selectedProjectId as string}
      />
    </Box>
  )
}
