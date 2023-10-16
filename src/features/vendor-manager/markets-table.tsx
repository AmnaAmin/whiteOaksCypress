import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'
import { useMarkets } from 'api/vendor-details'
import { Market } from 'types/vendor.types'
import { NewMarketModal } from './new-market-modal'
import { VENDOR_MANAGER } from './vendor-manager.i18n'

export const MARKET_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${VENDOR_MANAGER}.metroServiceArea`,
    accessorKey: 'metropolitanServiceArea',
  },
  {
    header: `${VENDOR_MANAGER}.createdBy`,
    accessorKey: 'createdBy',
  },
  {
    header: `${VENDOR_MANAGER}.createdDate`,
    accessorKey: 'createdDate',
    accessorFn(cellInfo) {
      return cellInfo.createdDate ? datePickerFormat(cellInfo.createdDate) : '- - -'
    },
    cell: (row: any) => {
      const value = row?.row.original?.createdDate
      return value ? dateFormat(value) : '- - -'
    },
    meta: { format: 'date' },
  },
  {
    header: `${VENDOR_MANAGER}.modifiedBy`,
    accessorKey: 'modifiedBy',
  },
  {
    header: `${VENDOR_MANAGER}.modifiedDateSubmit`,
    accessorKey: 'modifiedDate',
    accessorFn(cellInfo) {
      return cellInfo.modifiedDate ? datePickerFormat(cellInfo.modifiedDate) : '- - -'
    },
    cell: (row: any) => {
      const value = row?.row.original?.modifiedDate
      return value ? dateFormat(value) : '- - -'
    },
    meta: { format: 'date' },
  },
  {
    header: `${VENDOR_MANAGER}.stateName`,
    accessorKey: 'stateName',
  },
]

export const MarketsTable: React.FC<{ isReadOnly: boolean }> = ({ isReadOnly }) => {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { markets, isLoading, refetch } = useMarkets()
  const [selectedMarket, setSelectedMarket] = useState<Market>()
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.markets)
  const {
    tableColumns,
    settingColumns,
    refetch: refetchColumns,
  } = useTableColumnSettings(MARKET_COLUMNS, TableNames.markets)

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <Box overflow="auto" borderBottomRadius="6px" borderTopRadius="6px" border="1px solid #CBD5E0">
      {selectedMarket && (
        <NewMarketModal
          isOpen={selectedMarket ? true : false}
          onClose={() => {
            setSelectedMarket(undefined)
          }}
          selectedMarket={selectedMarket}
        />
      )}
      <Box overflow={'auto'} h="calc(100vh - 170px)" borderBottomRadius="6px" borderTopRadius="6px">
        <TableContextProvider data={markets} columns={tableColumns} sorting={sorting} setSorting={setSorting}>
          <Table
            onRowClick={row => setSelectedMarket(row)}
            isLoading={isLoading}
            isEmpty={!isLoading && !markets?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                colorScheme="brand"
                fileName="markets"
                refetch={refetch}
                isLoading={isLoading}
              />
              <CustomDivider />

              {settingColumns && (
                <TableColumnSettings
                  refetch={refetchColumns}
                  disabled={isLoading}
                  onSave={onSave}
                  columns={settingColumns}
                  tableName={TableNames.markets}
                  isReadOnly={isReadOnly}
                />
              )}
            </ButtonsWrapper>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
}
