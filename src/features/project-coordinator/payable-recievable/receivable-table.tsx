import React, { useCallback } from 'react'
import { Box, Td, Tr, Text, Flex, useDisclosure } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import AccountReceivableModal from 'features/projects/modals/project-coordinator/recevialbe/account-receivable-modal'
import data from './moc-data-receivable.json'
import { Column } from 'react-table'

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

type ProjectProps = {
  recievableColumns: Column[]
  resizeElementRef?: any
  setTableInstance: (tableInstance: any) => void
}

export const ReceivableTable: React.FC<ProjectProps> = ({ setTableInstance, recievableColumns, resizeElementRef }) => {
  const { columns } = useColumnWidthResize([
    {
      Header: 'Id',
      accessor: 'id',
    },
    {
      Header: 'Client',
      accessor: 'client',
    },
    {
      Header: 'Address',
      accessor: 'address',
    },
    {
      Header: 'terms',
      accessor: 'terms',
    },
    {
      Header: 'Payment Types',
      accessor: 'paymentTypes',
    },
    {
      Header: 'Expected pay date',
      accessor: 'expectedPayDate',
    },
    {
      Header: 'Balance',
      accessor: 'balance',
    },
    {
      Header: 'final invoice',
      accessor: 'finalInvoice',
    },
    {
      Header: 'Markets',
      accessor: 'markets',
    },
    {
      Header: 'WO Invoice Date',
      accessor: 'woInvoiceDate',
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
      accessor: ' Checkbox',
    },
  ])

  const {
    isOpen: isAccountReceivableModal,
    onOpen: onAccountReceivableModalOpen,
    onClose: onAccountReceivableModalClose,
  } = useDisclosure()

  const onRowClick = useCallback(
    (_, row) => {
      onAccountReceivableModalOpen()
    },
    [onAccountReceivableModalOpen],
  )
  console.log('not-working', recievableColumns, 'working', columns)

  return (
    <Box overflow="auto" width="100%">
      <ReactTable
        onRowClick={onRowClick}
        columns={recievableColumns}
        setTableInstance={setTableInstance}
        data={data}
        TableRow={receivableRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
      />
      <AccountReceivableModal isOpen={isAccountReceivableModal} onClose={onAccountReceivableModalClose} />
    </Box>
  )
}
