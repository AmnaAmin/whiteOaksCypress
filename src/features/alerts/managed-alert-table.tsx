import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import TableColumnSettings from 'components/table/table-column-settings'

import { ManagedAlertsModal } from './managed-alerts-modal'
import { useManagedAlert } from 'api/alerts'
import { ProjectAlertType } from 'types/project.type'

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
  },
  {
    header: 'dateTriggered' as string,
    accessorKey: 'dateCreated',
    accessorFn(cellInfo) {
      return cellInfo.dateCreated ? dateFormat(cellInfo.dateCreated) : '- - -'
    },
    meta: { format: 'date' },
  },
]

export const ManagedAlertTable: React.FC<{}> = () => {
  const { data: managedAlertsData, refetch, isLoading } = useManagedAlert()

  const [sorting, setSorting] = React.useState<SortingState>([])

  const [selectedAlert, setSelectedAlert] = useState<ProjectAlertType>()
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.alerts)
  const { tableColumns, settingColumns } = useTableColumnSettings(MANAGED_ALERTS_COLUMNS, TableNames.alerts)

  const onSave = columns => {
    postGridColumn(columns)
  }

  console.log('managedAlertsData', managedAlertsData)

  return (
    <Box overflow="auto">
      {selectedAlert && (
        <ManagedAlertsModal
          isOpen={selectedAlert ? true : false}
          onClose={() => {
            setSelectedAlert(undefined)
          }}
          selectedAlert={selectedAlert}
        />
      )}
      <Box overflow={'auto'} h="calc(100vh - 170px)" border="1px solid #CBD5E0" borderBottomRadius="6px">
        <TableContextProvider data={managedAlertsData} columns={tableColumns} sorting={sorting} setSorting={setSorting}>
          <Table
            onRowClick={row => setSelectedAlert(row)}
            isLoading={isLoading}
            isEmpty={!isLoading && !managedAlertsData?.length}
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

              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </ButtonsWrapper>
          </TableFooter>
        </TableContextProvider>
      </Box>
    </Box>
  )
}
