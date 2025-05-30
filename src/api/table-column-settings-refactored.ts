import { useClient } from 'utils/auth-context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ColumnDef } from '@tanstack/react-table'
import { TableColumnSetting, TableNames } from 'types/table-column.types'
import { useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'
import { useTranslation } from 'react-i18next'
import orderBy from 'lodash/orderBy'
import { useToast } from '@chakra-ui/react'

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
    const itemAOrder = getOrder(itemA.accessorKey) ?? 0
    // @ts-ignore
    const itemBOrder = getOrder(itemB.accessorKey) ?? 0

    return itemAOrder - itemBOrder
  })
}

export const useTableColumnSettings = (
  columns: TableColumns,
  tableName: TableNames,
  filtersInitialValues = {},
  resetFilters: boolean = false,
) => {
  const client = useClient()
  const { email } = useUserProfile() as Account
  const { t } = useTranslation()

  const { data: savedColumns, ...rest } = useQuery<TableColumnSetting[]>(['GetGridColumn', tableName], async () => {
    const response = await client(`column/${tableName}`, {})

    return response?.data
  })

  // If column configuration is saved for a user, we iterate through default columns and generate settings columns.
  // If a column is deleted/added in default list, it will be added/removed from saved list to display to the user.
  // If no configuration is saved for a user, we iterate through default columns and generate settings columns.

  const settingColumns = savedColumns?.length
    ? columns.map((col, index) => {
        const savedColumn = savedColumns.find(pCol => {
          // @ts-ignore
          return pCol.colId === col.accessorKey
        }) as TableColumnSetting

        return generateSettingColumn({
          field: savedColumn ? t(savedColumn?.field) : t(col.header as string),
          // @ts-ignore
          contentKey: savedColumn ? (savedColumn?.contentKey as string) : (col.accessorKey as string),
          order: savedColumn ? savedColumn.order : index,
          userId: email,
          type: tableName,
          hide: savedColumn ? savedColumn.hide : false,
        })
      })
    : columns.map((col, index) => {
        return generateSettingColumn({
          field: t(col.header as string),
          // @ts-ignore
          contentKey: col.accessorKey as string,
          order: index,
          userId: email,
          type: tableName,
          hide: false,
        })
      })

  const filteredColumns = columns.filter(col => {
    return !settingColumns?.find(pCol => {
      // @ts-ignore
      return pCol.colId === col.accessorKey
    })?.hide
  })

  const tableColumns = sortTableColumnsBasedOnSettingColumnsOrder(settingColumns, filteredColumns)
  const tableColumnsWithFilters = tableColumns.map((col: any) => {
    if (filtersInitialValues && Object.keys(filtersInitialValues).includes(col.accessorKey)) {
      return {
        ...col,
        meta: {
          ...col?.meta,
          filterInitialState: filtersInitialValues[col.accessorKey],
          resetFilters,
        },
      }
    }
    return {
      ...col,
      meta: {
        ...col?.meta,
        resetFilters,
      },
    }
  })
  return {
    tableColumns: tableColumnsWithFilters,
    settingColumns: orderBy(settingColumns || [], ['order'], ['asc']),
    ...rest,
  }
}

export const useTableColumnSettingsUpdateMutation = (tableName: TableNames) => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation(
    'PostGridColumn',
    async (payload: TableColumnSetting) => {
      const response = await client(`column/${tableName}`, { data: payload })

      return response?.data
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetGridColumn', tableName])
        toast({
          title: 'Update Settings',
          description: `Settings have been updated successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        toast({
          title: 'Update Settings',
          description: (error.title as string) ?? 'Unable to update Settings.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}
