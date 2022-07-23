import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WorkOrderDetails } from '../work-order-details'
import { Providers } from 'providers'
import { WORK_ORDERS, PROJECTS, TRANSACTIONS } from 'mocks/api/projects/data'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { convertDateTimeFromServer } from 'utils/date-time-utils'

export const renderWorkOrderDetails = async ({ onClose, workOrder, projectData, transactions }: any) => {
  await render(
    <WorkOrderDetails onClose={onClose} workOrder={workOrder} projectData={projectData} transactions={transactions} />,
    {
      wrapper: Providers,
    },
  )

  await waitForLoadingToFinish()
}

describe('Work Order modal showing work order specific details', () => {
  test('Verify work order details in active state', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel?.toLocaleLowerCase() === 'past due')
    const projectData = PROJECTS.find(p => p.id === workOrder?.projectId)
    const transactions = TRANSACTIONS
    await renderWorkOrderDetails({ onClose, workOrder, projectData, transactions })

    const openTab = screen.getByRole('tab', { selected: true })
    expect(openTab.innerHTML).toEqual('Work Order Details')
    expect(screen.getByTestId('work-order-id').textContent).toEqual('WO ' + workOrder?.id)
    expect(screen.getByTestId('work-order-company').textContent).toEqual(workOrder?.companyName)
    expect(screen.getByTestId('status').textContent?.toLocaleLowerCase()).toEqual(
      workOrder?.statusLabel?.toLocaleLowerCase(),
    )
    expect(screen.getByTestId('WO Issued').textContent).toEqual(
      workOrder?.workOrderIssueDate ? convertDateTimeFromServer(workOrder?.workOrderIssueDate) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('Expected Start').textContent).toEqual(
      workOrder?.workOrderStartDate ? convertDateTimeFromServer(workOrder?.workOrderStartDate) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('Expected Completion').textContent).toEqual(
      workOrder?.workOrderExpectedCompletionDate
        ? convertDateTimeFromServer(workOrder?.workOrderExpectedCompletionDate)
        : 'mm/dd/yy',
    )
    expect(screen.getByTestId('Completed by Vendor').textContent).toEqual('mm/dd/yy')
  })

  test('Verify work order details in completed state', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel?.toLocaleLowerCase() === 'completed')
    const projectData = PROJECTS.find(p => p.id === workOrder?.projectId)
    const transactions = TRANSACTIONS
    await renderWorkOrderDetails({ onClose, workOrder, projectData, transactions })

    expect(screen.getByTestId('Completed by Vendor').textContent).toEqual(
      workOrder?.workOrderDateCompleted ? convertDateTimeFromServer(workOrder?.workOrderDateCompleted) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('Completed by Vendor').textContent).not.toEqual('mm/dd/yy')
  })
})
