import { AccountDetail } from 'features/project-coordinator/payable-recievable/account-details/account-detail'
import { RECEIVABLE_COLUMNS } from 'features/projects/modals/project-coordinator/recevialbe/column-file'
import React from 'react'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'

const Receivable = () => {
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.receivable)
  const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
    RECEIVABLE_COLUMNS,
    TableNames.receivable,
  )
  const onSave = columns => {
    postGridColumn(columns)
  }
  return (
    <AccountDetail
      tableColumns={tableColumns}
      resizeElementRef={resizeElementRef}
      columns={settingColumns}
      isLoading={isLoading}
      topTitle={'Account Receivable'}
      ID={'receivable'}
      onSave={onSave}
    />
  )
}

export default Receivable
