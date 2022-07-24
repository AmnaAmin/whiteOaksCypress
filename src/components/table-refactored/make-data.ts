// import { format } from 'date-fns';

import { PaginationState, ColumnDef } from '@tanstack/react-table'
import faker from 'faker'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { TableColumnSetting, TableNames } from 'types/table-column.types'

const range = (len: any) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newProject = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  const randomNumber = (range: number) => {
    return Math.round(Math.random() * range)
  }
  return {
    id: randomNumber(100),
    type: faker.company.companyName(),
    status: 'Active',
    address: `${faker.address.countryCode()} ${faker.address.streetName()}`,
    region: faker.address.state(),
    pendingTransactions: randomNumber(20),
    pastDueWO: randomNumber(20),
    expectedPayDate: faker.date.past().toDateString(),
  }
}

export function projectData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => ({
      ...newProject(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }))
  }

  return makeDataLevel()
}

const newTransaction = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  const randomNumber = (range: number) => {
    return Math.round(Math.random() * range)
  }
  return {
    id: randomNumber(100),
    type: faker.company.companyName(),
    status: 'Active',
    trade: `${faker.name.jobTitle()}`,
    totalamount: faker.finance.amount(),
    submit: faker.date.past().toLocaleDateString(),
    approvedby: faker.internet.email(),
  }
}

export function TransactionData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => ({
      ...newTransaction(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }))
  }

  return makeDataLevel()
}

const newProjectDocument = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  // const randomNumber = (range: number) => {
  //   return Math.round(Math.random() * range);
  // };
  return {
    document: '270 Laburnum',
    docType: 'Work Order',
    fileType: 'pdf',
    vendorGL: 'ADT Renovations Inc',
    workOrder: 'General Labor',
    createdBy: faker.date.past().toLocaleDateString(),
    createdDate: faker.date.past().toLocaleDateString(),
  }
}

export function projectDocumentData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => ({
      ...newProjectDocument(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }))
  }

  return makeDataLevel()
}

const newWorkOrder = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  // const randomNumber = (range: number) => {
  //   return Math.round(Math.random() * range);
  // };
  return {
    status: 'Active',
    trade: 'Genral Labor',
    name: 'ADT Renoations',
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber('0165#######'),
    issue: faker.date.past().toLocaleDateString(),
    expectedcompletion: faker.date.past().toLocaleDateString(),
    completed: faker.date.past().toLocaleDateString(),
  }
}

export function workOrderData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => ({
      ...newWorkOrder(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }))
  }

  return makeDataLevel()
}

const newAlerts = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  // const randomNumber = (range: number) => {
  //   return Math.round(Math.random() * range);
  // };
  return {
    name: '11 Joel CT',
    type: 'Project',
    value: 'Project Manager',
    category: 'Info',
    dateTriggered: faker.date.past().toLocaleDateString(),
  }
}

export function alertsData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => ({
      ...newAlerts(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }))
  }

  return makeDataLevel()
}

// Data making for storybook mocking

type Person = {
  id: number
  name: string
  email: string
  phone: string
  username: string
  website: string
}

export const defaultData: Person[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
  },
]

export const columns: ColumnDef<Person>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'User Name',
    accessorKey: 'username',
  },
  {
    header: 'email',
    accessorKey: 'email',
  },
  {
    header: 'phone',
    accessorKey: 'phone',
  },
  {
    header: 'website',
    accessorKey: 'website',
  },
]

export const columnsWithPagination: ColumnDef<{ id: number; title: string; completed: boolean }>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: 'Title',
    accessorKey: 'title',
  },
  {
    header: 'Completed',
    accessorKey: 'completed',
  },
]

const newProjectColumn = () => {
  const randomNumber = (range: number) => {
    return Math.round(Math.random() * range)
  }

  return {
    id: randomNumber(100),
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: faker.name.findName(),
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: faker.name.findName(),
    cellRenderer: 'dateRenderer',
    contentKey: faker.name.findName(),
    order: 1,
    minWidth: 120,
    userId: randomNumber(100),
  }
}

export function projectColumnData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => ({
      ...newProjectColumn(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }))
  }

  return makeDataLevel()
}

// fetch posts list from jsonplacehoder api
export const getTodos = async (currentPageIndex, pageSize) => {
  const start = currentPageIndex * pageSize
  const endpoint = `https://jsonplaceholder.typicode.com/todos`
  const url = pageSize > 0 ? `${endpoint}?_start=${start}&_limit=${pageSize}` : endpoint

  const response = await fetch(url)
  const data = await response.json()
  return { data, xTotalCount: response.headers.get('x-total-count') }
}

export const useTodos = (fetchOption?: PaginationState) => {
  const { data: users, ...rest } = useQuery<any>(
    ['todos', fetchOption],
    async () => {
      const response = await getTodos(fetchOption?.pageIndex, fetchOption?.pageSize)

      return response
    },
    { keepPreviousData: true },
  )

  return {
    users: users?.data,
    totalPages: users?.xTotalCount && fetchOption?.pageSize ? Math.ceil(users.xTotalCount / fetchOption?.pageSize) : 0,
    ...rest,
  }
}

type GenerateSettingColumnProps = {
  field: string
  contentKey: string
  type: string
  userId: string
  order: number
  hide: boolean
}

export let settingColumns: TableColumnSetting[] = [
  {
    id: 2435,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'id',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'ID',
    cellRenderer: null,
    contentKey: 'id',
    order: 0,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
  {
    id: 2437,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'completed',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'Completed',
    cellRenderer: null,
    contentKey: 'completed',
    order: 1,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
  {
    id: 2436,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'title',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'Title',
    cellRenderer: null,
    contentKey: 'title',
    order: 2,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
]

export const generateSettingColumn = (options: GenerateSettingColumnProps): TableColumnSetting => {
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

const useColumnSettings = (columns: ColumnDef<any>[]) => {
  return useQuery<TableColumnSetting[]>('GetGridColumn', async () => {
    return settingColumns
  })
}

const sortTableColumnsBasedOnSettingColumnsOrder = (
  settingColumns: TableColumnSetting[],
  tableColumns: ColumnDef<any>[],
): ColumnDef<any>[] => {
  const getOrder = (accessorKey: any) => {
    return settingColumns?.find(item => item.colId === accessorKey)?.order
  }

  return tableColumns?.sort((itemA, itemB) => {
    // @ts-ignore
    const itemAOrder = getOrder(itemA.accessorKey) ?? 0
    // @ts-ignore
    const itemBOrder = getOrder(itemB.accessorKey) ?? 0

    return itemAOrder - itemBOrder
  })
}

// Note this hook is only use for fake data
export const useTableColumnSettingsForFakeData = (columns, tableName) => {
  const { data: savedColumns, ...rest } = useColumnSettings(columns)

  const settingColumns = savedColumns?.length
    ? savedColumns.map((col, index) => {
        return generateSettingColumn({
          field: col.colId,
          contentKey: col.contentKey as string,
          order: index,
          userId: col.userId,
          type: tableName,
          hide: col.hide,
        })
      })
    : columns.map((col, index) => {
        return generateSettingColumn({
          field: col.header as string,
          // @ts-ignore
          contentKey: col.accessorKey as string,
          order: index,
          userId: col.userId,
          type: tableName,
          hide: false,
        })
      })

  const filteredColumns = columns.filter(col => {
    return !settingColumns?.find(pCol => {
      // console.log('column', pCol)

      // @ts-ignore
      return pCol.colId === col.accessorKey
    })?.hide
  })

  const tableColumns = sortTableColumnsBasedOnSettingColumnsOrder(settingColumns, filteredColumns)

  return {
    tableColumns,
    settingColumns,
    ...rest,
  }
}

export const useTableColumnSettingsUpdateMutationForFakeData = (tableName: TableNames) => {
  const queryClient = useQueryClient()
  return useMutation(
    'PostGridColumn',
    async (payload: TableColumnSetting[]) => {
      console.log('payload', payload)
      settingColumns = payload
      return payload
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetGridColumn'])
      },
    },
  )
}
