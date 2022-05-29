import { AccountDetail } from 'components/account-details/account-detail'
import { PAYABLE_COLUMNS } from 'features/projects/modals/project-coordinator/recevialbe/column-file'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'

export const Payable: React.FC = () => {
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.payable)
  const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
    PAYABLE_COLUMNS,
    TableNames.payable,
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
      topTitle={'Account Payable'}
      ID={'payable'}
      onSave={onSave}
    />
  )
}
