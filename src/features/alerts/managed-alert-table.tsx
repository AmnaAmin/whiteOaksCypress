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

import { ManagedAlertsModal } from './managed-alerts-modal'
import { ProjectAlertType } from 'types/alert.type'

export const MANAGED_ALERTS_COLUMNS: ColumnDef<any>[] = [
  {
    header: 'name' as string,
    accessorKey: 'title',
  },

  {
    header: 'type' as string,
    accessorKey: 'typeSelection',
  },
  {
    header: 'value' as string,
    accessorKey: 'attributeSelection',
  },
  {
    header: 'behaviour' as string,
    accessorKey: 'behaviourSelection',
  },
  {
    header: 'category' as string,
    accessorKey: 'category',
  },
  {
    header: 'status' as string,
    accessorKey: 'notify',
    accessorFn(cellInfo) {
      return cellInfo.notify ? 'Enable' : 'Disable'
    },
  },
  {
    header: 'message' as string,
    accessorKey: 'message',
    accessorFn(cellInfo) {
      return cellInfo.message ? cellInfo.message : '- - -'
    },
  },
  {
    header: 'dateCreated' as string,
    accessorKey: 'dateCreated',
    accessorFn: row => datePickerFormat(row.dateCreated),
    cell: (row: any) => {
      const value = row?.row.original?.dateCreated
      return dateFormat(value)
    },
    meta: { format: 'date' },
  },
]

type ManagedAlertsTablesTypes = {
  isLoading: boolean
  refetch: any
  managedAlerts: any
  isReadOnly?:boolean
}

export const ManagedAlertTable: React.FC<ManagedAlertsTablesTypes> = ({ managedAlerts, isLoading, refetch, isReadOnly }) => {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [selectedAlert, setSelectedAlert] = useState<ProjectAlertType>()
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.alerts)
  const {
    tableColumns,
    settingColumns,
    refetch: refetchColumns,
  } = useTableColumnSettings(MANAGED_ALERTS_COLUMNS, TableNames.alerts)

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <Box overflow="auto">
      {selectedAlert && (
        <ManagedAlertsModal
          isOpen={!!selectedAlert}
          onClose={() => {
            setSelectedAlert(undefined)
          }}
          selectedAlert={selectedAlert}
        />
      )}
      <Box overflow={'auto'} h="calc(100vh - 170px)" border="1px solid #CBD5E0" borderBottomRadius="6px">
        <TableContextProvider data={managedAlerts} columns={tableColumns} sorting={sorting} setSorting={setSorting}>
          <Table
            onRowClick={row => setSelectedAlert(row)}
            isLoading={isLoading}
            isEmpty={!isLoading && !managedAlerts?.length}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton
                columns={tableColumns}
                colorScheme="brand"
                fileName="managed-alerts"
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
                  tableName={TableNames.alerts}
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
