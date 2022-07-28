import React, { useCallback } from 'react'
import { Box, Td, Tr, Text, Flex, useDisclosure, Checkbox } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { TableWrapper } from 'components/table/table'
import { RowProps } from 'components/table/react-table'
import AccountReceivableModal from 'features/projects/modals/project-coordinator/recevialbe/account-receivable-modal'
import { usePCRecievable, useReveviableRowData } from 'utils/account-receivable'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { t } from 'i18next'
import { dateFormat } from 'utils/date-time-utils'
import numeral from 'numeral'

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
              <Text
                noOfLines={2}
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
  ref?: any
  setTableInstance: (tableInstance: any) => void
  register: UseFormRegister<FieldValues>
  loading?: boolean
}

export const ReceivableTable: React.FC<ReceivableProps> = ({ setTableInstance, loading, register, ref }) => {
  const { columns } = useColumnWidthResize(
    [
      {
        Header: t('id') as string,
        accessor: 'projectId',
      },
      {
        Header: t('client') as string,
        accessor: 'clientName',
      },
      {
        Header: t('address') as string,
        accessor: 'propertyAddress',
      },
      {
        Header: t('terms') as string,
        accessor: 'paymentTerm',
      },
      {
        Header: t('paymentTypes') as string,
        accessor: 'type',
      },
      {
        Header: t('vendorWOExpectedPaymentDate') as string,
        accessor: 'expectedPaymentDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
      },
      {
        Header: t('balance') as string,
        accessor: 'amount',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0[.]00')
        },
      },
      {
        Header: t('finalInvoice') as string,
        accessor: 'finalInvoice',
        Cell(cellInfo) {
          return numeral(cellInfo.value).format('$0,0[.]00')
        },
      },
      {
        Header: t('markets') as string,
        accessor: 'marketName',
      },
      {
        Header: t('woInvoiceDate') as string,
        accessor: 'woaInvoiceDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
      },
      {
        Header: t('poNo') as string,
        accessor: 'poNumber',
      },
      {
        Header: t('woNo') as string,
        accessor: 'woNumber',
      },
      {
        Header: t('invoiceNo') as string,
        accessor: 'invoiceNumber',
      },
      {
        Header: t('checkbox') as string,
        Cell: ({ value, row }) => (
          <Box onClick={e => e.stopPropagation()}>
            <Checkbox
              isDisabled={loading}
              value={(row.original as any).projectId}
              {...register('id', { required: true })}
            />
          </Box>
        ),
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
  const { receivableData, isLoading } = usePCRecievable()
  const { mutate: rowData, data: receivableDataa } = useReveviableRowData()
  const rowSelectedData = receivableDataa?.data

  return (
    <Box overflow="auto" width="100%">
      <TableWrapper
        onRowClick={onRowClick}
        columns={columns}
        setTableInstance={setTableInstance}
        data={receivableData?.arList || []}
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
