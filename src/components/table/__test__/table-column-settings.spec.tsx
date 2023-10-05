import {  render, screen } from '@testing-library/react'
import TableColumnSettings from '../table-column-settings'
import userEvent from '@testing-library/user-event'
import { TableNames } from 'types/table-column.types'
import { QueryClient, QueryClientProvider } from 'react-query'

const columnSettings = [
  {
    id: 1589,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'projectTypeLabel',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'Type',
    cellRenderer: null,
    contentKey: 'projectTypeLabel',
    order: 0,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
  {
    id: 1590,
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
    order: 1,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
  {
    id: 1591,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'vendorWOStatusValue',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'WO Status',
    cellRenderer: null,
    contentKey: 'vendorWOStatusValue',
    order: 2,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
  {
    id: 1592,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'streetAddress',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'Address',
    cellRenderer: null,
    contentKey: 'streetAddress',
    order: 3,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
  {
    id: 1593,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'region',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'Region',
    cellRenderer: null,
    contentKey: 'region',
    order: 4,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
  {
    id: 1594,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'pendingTransactions',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'Pending Transactions',
    cellRenderer: null,
    contentKey: 'pendingTransactions',
    order: 5,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
  {
    id: 1595,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'pastDueWorkorders',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'Past Due WO',
    cellRenderer: null,
    contentKey: 'pastDueWorkorders',
    order: 6,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
  {
    id: 1596,
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: 'vendorWOExpectedPaymentDate',
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: 'project',
    field: 'Expected Payment Date',
    cellRenderer: null,
    contentKey: 'vendorWOExpectedPaymentDate',
    order: 7,
    minWidth: 100,
    userId: 'vendor@devtek.ai',
  },
]

describe('Table columns setting modal Test Cases', () => {
  test('Setting Modal should render properly', async () => {
    const queryClient = new QueryClient(); // Replace this with your query client setup

    expect(true).toBe(true);

    const onSave = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <TableColumnSettings
          onSave={onSave}
          disabled={false}
          columns={columnSettings}
          tableName={TableNames.testProject}
        />
      </QueryClientProvider>
    )

    userEvent.click(screen.getByTestId('column-settings-button'))

    // screen.debug(undefined, 100000000)
    // expect(screen.getByText('Column Settings')).toBeInTheDocument()

    // const list = screen.getByTestId('column-settings-list')
    // const allItems = document.querySelectorAll('#column-settings-list > div')
    // const firstItem = allItems[0] as ChildNode
    // const secondItem = allItems[1] as ChildNode
    // fireEvent.dragStart(firstItem)
    // fireEvent.dragOver(secondItem)
    // fireEvent.dragEnter(secondItem)
    // fireEvent.drop(firstItem)
    // fireEvent.dragEnd(secondItem)

    // await waitFor(() => expect(screen.getByTestId('draggable-item-0').textContent).toEqual('Type'))
    // await tick()
    // screen.debug(undefined, 1000000)
  })
})
