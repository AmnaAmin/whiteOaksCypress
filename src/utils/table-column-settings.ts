import { useClient } from 'utils/auth-context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Column } from 'react-table'
import { TableColumnSetting, TableNames } from 'types/table-column.types'
import { useColumnWidthResize } from './hooks/useColumnsWidthResize'
import { useUserProfile } from './redux-common-selectors'
import { Account } from 'types/account.types'

type generateSettingColumnProps = {
  field: string
  contentKey: string
  type: string
  userId: string
  order: number
}
const generateSettingColumn = (options: generateSettingColumnProps): TableColumnSetting => {
  return {
    ...options,
    id: options.order,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: options.contentKey,
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    cellRenderer: null,
    minWidth: 100,
  }
}

const sortTableColumnsBasedOnSettingColumnsOrder = (
  settingColumns: TableColumnSetting[],
  tableColumns: Column[],
): Column[] => {
  const getOrder = (accessor: any) => settingColumns?.find(item => item.colId === accessor)?.order

  return tableColumns?.sort((itemA, itemB) => {
    const itemAOrder = getOrder(itemA.accessor) ?? 0
    const itemBOrder = getOrder(itemB.accessor) ?? 0

    return itemAOrder - itemBOrder
  })
}

export const useTableColumnSettings = (columns: Column[], tableName: TableNames) => {
  const client = useClient()
  const { email } = useUserProfile() as Account

  const { data: savedColumns, ...rest } = useQuery<TableColumnSetting[]>('GetProjectColumn', async () => {
    const response = await client(`column/${tableName}`, {})

    return response?.data
  })

  const settingColumns = savedColumns?.length
    ? savedColumns.sort((a, b) => a.order - b.order)
    : columns.map((col, index) => {
        return generateSettingColumn({
          field: col.Header as string,
          contentKey: col.accessor as string,
          order: index,
          userId: email,
          type: tableName,
        })
      })

  const filteredColumns = columns.filter(col => {
    return !settingColumns?.find(pCol => {
      return pCol.colId === col.accessor
    })?.hide
  })

  const { columns: rezizedColumns, resizeElementRef } = useColumnWidthResize(filteredColumns)
  const tableColumns = sortTableColumnsBasedOnSettingColumnsOrder(settingColumns, rezizedColumns)

  return {
    tableColumns,
    settingColumns,
    resizeElementRef,
    ...rest,
  }
}

export const useTableColumnSettingsUpdateMutation = (tableName: TableNames) => {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation(
    'PostProjectColumn',
    async (payload: TableColumnSetting) => {
      const response = await client(`column/${tableName}`, { data: payload })

      return response?.data
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetProjectColumn'])
      },
    },
  )
}
