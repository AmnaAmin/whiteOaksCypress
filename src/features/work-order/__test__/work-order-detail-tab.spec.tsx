import { render } from '@testing-library/react'
import WorkOrderDetailsTab from '../../vendor/vendor-work-order/details/work-order-detail-tab'
import { WorkOrderDetails } from '../../vendor/vendor-work-order/work-order-details'
import { Providers } from 'providers'
import { WORK_ORDERS, PROJECTS, assignedItems } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { Modal } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'

export const renderWorkOrderDetails = async ({ onClose, workOrder, projectData }: any) => {
  await render(
    <Modal isOpen={true} onClose={onClose} size="none">
      <WorkOrderDetailsTab
        documentsData={projectData}
        onClose={onClose}
        workOrder={workOrder}
        projectData={projectData}
        setIsUpdating={null}
        isUpdating={false}
        workOrderAssignedItems={assignedItems}
        isFetchingLineItems={false}
        isLoadingLineItems={false}
      />
    </Modal>,
    {
      wrapper: Providers,
    },
  )

  await waitForLoadingToFinish()
}
export const rendeWorkOrderModal = async ({ onClose, workOrder, projectData, transactions }: any) => {
  await render(
    <Modal isOpen={true} onClose={onClose} size="none">
      <WorkOrderDetails onClose={onClose} workOrder={workOrder} projectData={projectData} transactions={transactions} />
    </Modal>,
    {
      wrapper: Providers,
    },
  )

  await waitForLoadingToFinish()
}

jest.setTimeout(150000)
describe('Work Order modal showing work order specific details', () => {
  test('Verify work order modal content', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel?.toLocaleLowerCase() === 'past due')
    const projectData = PROJECTS.find(p => p.id === workOrder?.projectId)
    const transactions = []
    await rendeWorkOrderModal({ onClose, workOrder, projectData, transactions })

    const openTab = screen.getByRole('tab', { selected: true })
    expect(openTab.innerHTML).toEqual('Work Order Details')
    expect(screen.getByTestId('work-order-id').textContent).toEqual('WO ' + workOrder?.id)
    expect(screen.getByTestId('work-order-company').textContent).toEqual(workOrder?.companyName)
    expect(screen.getByTestId('status').textContent?.toLocaleLowerCase()).toEqual(
      workOrder?.statusLabel?.toLocaleLowerCase(),
    )
  })

  test('Verify work order details in active state', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel?.toLocaleLowerCase() === 'past due')
    const projectData = PROJECTS.find(p => p.id === workOrder?.projectId)
    const transactions = []
    await renderWorkOrderDetails({ onClose, workOrder, projectData, transactions })

    expect(screen.getByTestId('WO Issued').textContent).toEqual(
      workOrder?.workOrderIssueDate ? dateFormat(workOrder?.workOrderIssueDate) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('Expected Start').textContent).toEqual(
      workOrder?.workOrderStartDate ? dateFormat(workOrder?.workOrderStartDate) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('Expected Completion').textContent).toEqual(
      workOrder?.workOrderExpectedCompletionDate ? dateFormat(workOrder?.workOrderExpectedCompletionDate) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('Completed by Vendor').textContent).toEqual('mm/dd/yy')
    expect(screen.getByTestId('cell-0-sku').textContent).toEqual('sku1')
    expect(screen.getByTestId('cell-1-sku').textContent).toEqual('sku2')

    await act(async () => {
      await userEvent.click(screen.getByTestId('showMarkAllIsComplete'))
    })

    expect(screen.getByTestId('showMarkAllIsComplete')).toHaveAttribute('data-checked')
    expect(screen.getByTestId('isCompleted-0')).toHaveAttribute('data-checked')
    expect(screen.getByTestId('isCompleted-1')).toHaveAttribute('data-checked')
  })

  test('Verify work order details in completed state', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel?.toLocaleLowerCase() === 'completed')
    const projectData = PROJECTS.find(p => p.id === workOrder?.projectId)
    const transactions = []
    await renderWorkOrderDetails({ onClose, workOrder, projectData, transactions })

    expect(screen.getByTestId('Completed by Vendor').textContent).toEqual(
      workOrder?.workOrderDateCompleted ? dateFormat(workOrder?.workOrderDateCompleted) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('Completed by Vendor').textContent).not.toEqual('mm/dd/yy')
  })
})
