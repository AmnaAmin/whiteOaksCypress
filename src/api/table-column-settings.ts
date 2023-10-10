import { useClient } from 'utils/auth-context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Column } from 'react-table'
import { TableColumnSetting, TableNames } from 'types/table-column.types'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { useUserProfile } from 'utils/redux-common-selectors'
import { Account } from 'types/account.types'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
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

export const useTableColumnSettings = (columns: any, tableName: TableNames) => {
  const client = useClient()
  const { email } = useUserProfile() as Account
  const { t } = useTranslation()

  const { data: savedColumns, ...rest } = useQuery<TableColumnSetting[]>(['GetGridColumn', tableName], async () => {
    const response = await client(`column/${tableName}`, {})

    return response?.data
  })

  // let settingColumns: TableColumnSetting[] = []

  const settingColumns = useMemo(() => {
    if ((savedColumns?.length || 0) < columns.length) {
      return columns.map((col, index) => {
        return generateSettingColumn({
          field: col.Header as string,
          contentKey: col.accessor as string,
          order: index,
          userId: email,
          type: tableName,
          hide: false,
        })
      })
    } else {
      return (
        savedColumns?.map((col, index) => {
          return generateSettingColumn({
            field: t(col.field),
            contentKey: col.contentKey as string,
            order: index,
            userId: email,
            type: tableName,
            hide: col.hide,
          })
        }) || []
      )
    }
  }, [columns.length, savedColumns])

  const filteredColumns = columns.filter(col => {
    return !settingColumns?.find(pCol => {
      // console.log('column', pCol)

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
    'PostGridColumn',
    async (payload: TableColumnSetting) => {
      const response = await client(`column/${tableName}`, { data: payload })

      return response?.data
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetGridColumn', tableName])
      },
    },
  )
}

export const useResetSettingsMutation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation(
    (tableName: any) => {
      return client(`column/delete/${tableName}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetGridColumn'])
        toast({
          title: 'Reset Settings',
          description: `Settings have been reset successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },

      onError(error: any) {
        toast({
          title: 'Reset Settings',
          description: (error.title as string) ?? 'Unable to reset Settings.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}
