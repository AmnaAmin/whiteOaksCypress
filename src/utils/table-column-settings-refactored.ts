import { useClient } from 'utils/auth-context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ColumnDef } from '@tanstack/react-table'
import { TableColumnSetting, TableNames } from 'types/table-column.types'
import { useUserProfile } from './redux-common-selectors'
import { Account } from 'types/account.types'
import { useTranslation } from 'react-i18next'

type generateSettingColumnProps = {
  field: string
  contentKey: string
  type: string
  userId: string
  order: number
  hide: boolean
}

const generateSettingColumn = (options: generateSettingColumnProps): TableColumnSetting => {
  return {
    ...options,
    id: options.order,
    flex: null,
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

type TableColumns = ColumnDef<any>[]

const sortTableColumnsBasedOnSettingColumnsOrder = (
  settingColumns: TableColumnSetting[],
  tableColumns: TableColumns,
): TableColumns => {
  const getOrder = (accessor: any) => settingColumns?.find(item => item.colId === accessor)?.order

  return tableColumns?.sort((itemA, itemB) => {
    // @ts-ignore
    const itemAOrder = getOrder(itemA.accessKey) ?? 0
    // @ts-ignore
    const itemBOrder = getOrder(itemB.accessor) ?? 0

    return itemAOrder - itemBOrder
  })
}

export const useTableColumnSettings = (columns: TableColumns, tableName: TableNames) => {
  const client = useClient()
  const { email } = useUserProfile() as Account
  const { t } = useTranslation()

  const { data: savedColumns, ...rest } = useQuery<TableColumnSetting[]>('GetGridColumn', async () => {
    const response = await client(`column/${tableName}`, {})

    return response?.data
  })

  const settingColumns = savedColumns?.length
    ? savedColumns.map((col, index) => {
        return generateSettingColumn({
          field: t(col.colId),
          contentKey: col.contentKey as string,
          order: index,
          userId: email,
          type: tableName,
          hide: col.hide,
        })
      })
    : columns.map((col, index) => {
        return generateSettingColumn({
          field: col.header as string,
          // @ts-ignore
          contentKey: col.accessor as string,
          order: index,
          userId: email,
          type: tableName,
          hide: false,
        })
      })

  const filteredColumns = columns.filter(col => {
    return !settingColumns?.find(pCol => {
      // console.log('column', pCol)

      // @ts-ignore
      return pCol.colId === col.accessor
    })?.hide
  })

  const tableColumns = sortTableColumnsBasedOnSettingColumnsOrder(settingColumns, filteredColumns)

  return {
    tableColumns,
    settingColumns,
    ...rest,
  }
}

export const useTableColumnSettingsUpdateMutation = (tableName: TableNames) => {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation(
    'PostGridColumn',
    async (payload: TableColumnSetting) => {
      const response = await client(`column/${tableName}`, { data: payload })

      return response?.data
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetGridColumn'])
      },
    },
  )
}
