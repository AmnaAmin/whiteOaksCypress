import React, { useCallback, useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex, useDisclosure, Spacer, Checkbox } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import AccountReceivableModal from 'features/projects/modals/project-coordinator/recevialbe/account-receivable-modal'
import { usePCReveviable, useReveviableRowData } from 'utils/account-receivable'
import { useWeekDayProjectsDue } from 'utils/projects'
import moment from 'moment'

const receivableRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
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
          <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0">
            <Flex alignItems="center" h="60px">
              <Text noOfLines={2} title={cell.value} padding="0 15px" color="blackAlpha.600">
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
  ref?: any
  setTableInstance: (tableInstance: any) => void
}

export const ReceivableTable: React.FC<ReceivableProps> = ({ setTableInstance, selectedCard, selectedDay, ref }) => {
  const { columns } = useColumnWidthResize(
    [
      {
        Header: 'Id',
        accessor: 'projectId',
      },
      {
        Header: 'Client',
        accessor: 'clientName',
      },
      {
        Header: 'Address',
        accessor: 'propertyAddress',
      },
      {
        Header: 'Terms',
        accessor: 'paymentTerm',
      },
      {
        Header: 'Payment Types',
        accessor: 'transactionType',
      },
      {
        Header: 'Expected pay date',
        accessor: 'expectedPaymentDate',
      },
      {
        Header: 'Balance',
        accessor: 'amount',
      },
      {
        Header: 'final invoice',
        accessor: 'famount',
      },
      {
        Header: 'Markets',
        accessor: 'marketName',
      },
      {
        Header: 'WO Invoice Date',
        accessor: 'woaInvoiceDate',
      },
      {
        Header: 'PO No',
        accessor: 'poNumber',
      },
      {
        Header: 'WO No',
        accessor: 'woNumber',
      },
      {
        Header: 'Invoice No',
        accessor: 'invoiceNumber',
      },
      {
        Header: ' Checkbox',
        accessor: () => {
          return (
            <Flex justifyContent="end">
              <Spacer w="50px" />
              <Checkbox />
            </Flex>
          )
        },
      },
    ],
    ref,
  )

  const {
    isOpen: isAccountReceivableModal,
    onOpen: onAccountReceivableModalOpen,
    onClose: onAccountReceivableModalClose,
  } = useDisclosure()

  const onRowClick = useCallback(
    (_, row) => {
      rowData(row.values.projectId)
      onAccountReceivableModalOpen()
    },
    [onAccountReceivableModalOpen],
  )
  const { receivableData, isLoading } = usePCReveviable()
  const { mutate: rowData, data: receivableDataa } = useReveviableRowData()
  const rowSelectedData = receivableDataa?.data

  const [filterProjects, setFilterProjects] = useState(receivableData?.arList)

  const { data: days } = useWeekDayProjectsDue()

  useEffect(() => {
    // To get pastDue Ids
    const pastDueIds = receivableData?.arList?.filter(project => project?.pastDue)
    const idPastDue = pastDueIds?.map(project => project?.id)

    if (!selectedCard && !selectedDay) setFilterProjects(receivableData?.arList)
    setFilterProjects(
      receivableData?.arList?.filter(
        project =>
          !selectedCard ||
          project.projectStatus?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase() ||
          (selectedCard === 'pastDue' && idPastDue?.includes(project?.id)),
      ),
    )

    // Due Project Filter
    if (selectedDay) {
      setFilterProjects(
        receivableData?.arList?.filter(
          project =>
            project.clientDueDate ===
            days?.forEach(day => {
              if (selectedDay === day.dayName) {
                return moment.utc(day?.dueDate).format('YYYY-MM-DD')
              } else if (selectedDay === 'All') {
                return moment.utc(day?.dueDate).format('YYYY-MM-DD')
              }
            })?.dueDate,
        ),
      )
    }
  }, [selectedCard, selectedDay, receivableData])

  return (
    <Box overflow="auto" width="100%">
      <ReactTable
        onRowClick={onRowClick}
        columns={columns}
        setTableInstance={setTableInstance}
        data={filterProjects || []}
        isLoading={isLoading}
        TableRow={receivableRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
        defaultFlexStyle={false}
      />
      <AccountReceivableModal
        rowData={rowSelectedData}
        isOpen={isAccountReceivableModal}
        onClose={onAccountReceivableModalClose}
      />
    </Box>
  )
}
