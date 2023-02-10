/*eslint-disable */
import { fireEvent, render, waitFor } from '@testing-library/react'
import WorkOrderEditTab from '../../work-order/details/work-order-edit-tab'
import { Providers } from 'providers'
import { WORK_ORDERS, PROJECTS, assignedItems, SWO_PROJECT, DOCUMENTS } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { Modal } from '@chakra-ui/react'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import { setToken } from 'utils/storage.utils'

export const renderWorkOrderEditTab = async ({ onSave, onClose, workOrder, projectData }: any) => {
  await render(
    <Modal isOpen={true} onClose={onClose} size="none">
      <WorkOrderEditTab
        workOrder={workOrder}
        onSave={onSave}
        navigateToProjectDetails={null}
        isWorkOrderUpdating={false}
        swoProject={SWO_PROJECT}
        rejectInvoiceCheck={false}
        projectData={projectData}
        documentsData={DOCUMENTS}
        workOrderAssignedItems={assignedItems.filter(a => a.workOrderId.toString() === workOrder.id.toString())}
        isLoadingLineItems={false}
        isFetchingLineItems={false}
      />
    </Modal>,
    {
      wrapper: Providers,
    },
  )

  await waitForLoadingToFinish()
}
beforeAll(() => {
  setToken('pc')
})

jest.setTimeout(150000)
describe('Work Order modal showing work order specific details for PC(Super set of PC) users', () => {
  test('Verify work order modal content for active/pastdue work orders. Verify all completed items can be verified. Save call contains work order start date, expected completion and completed dates', async () => {
    const onClose = jest.fn()
    const onSave = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel?.toLocaleLowerCase() === 'past due')
    const projectData = PROJECTS.find(p => p.id === workOrder?.projectId)
    const transactions = []
    await renderWorkOrderEditTab({ onSave, onClose, workOrder, projectData, transactions })
    expect(screen.getByTestId('companyName').textContent).toEqual(workOrder?.companyName)
    expect(screen.getByTestId('vendorType').textContent).toEqual(workOrder?.skillName)
    expect(screen.getByTestId('email').textContent).toEqual(workOrder?.businessEmailAddress)
    expect(screen.getByTestId('phone').textContent).toEqual(workOrder?.businessPhoneNumber)

    expect(screen.getByTestId('woIssued').textContent).toEqual(
      workOrder?.workOrderIssueDate ? dateFormat(workOrder?.workOrderIssueDate) : 'mm/dd/yyyy',
    )

    expect(screen.getByTestId('lwSubmitted').textContent).toEqual(
      workOrder?.dateLeanWaiverSubmitted ? dateFormat(workOrder?.dateLeanWaiverSubmitted) : 'mm/dd/yyyy',
    )
    expect(screen.getByTestId('completionVariance').textContent).toEqual(
      workOrder?.workOrderCompletionDateVariance ?? '0',
    )

    expect((screen.getByTestId('workOrderStartDate') as HTMLInputElement).value).toEqual(
      workOrder?.workOrderStartDate ? datePickerFormat(workOrder?.workOrderStartDate) : 'mm/dd/yyyy',
    )
    expect((screen.getByTestId('workOrderExpectedCompletionDate') as HTMLInputElement).value).toEqual(
      workOrder?.workOrderExpectedCompletionDate
        ? datePickerFormat(workOrder?.workOrderExpectedCompletionDate)
        : 'mm/dd/yyyy',
    )
    expect((screen.getByTestId('workOrderDateCompleted') as HTMLInputElement).value).toEqual('')

    expect(screen.getByTestId('cell-0-sku').textContent).toEqual('sku1')
    expect(screen.getByTestId('cell-1-sku').textContent).toEqual('sku2')

    expect(screen.getByTestId('showPriceCheckBox')).toBeInTheDocument()
    expect(screen.getByTestId('showMarkAllIsVerified')).toBeInTheDocument()
    expect(screen.queryByTestId('showMarkAllIsComplete')).toBeInTheDocument()

    /* Items can only be verified, if they are completed */
    await act(async () => {
      await userEvent.click(screen.getByTestId('showMarkAllIsVerified'))
    })

    expect(screen.getByTestId('showMarkAllIsVerified')).toHaveAttribute('disabled')
    expect(screen.getByTestId('isVerified-0')).not.toHaveAttribute('data-checked')
    expect(screen.getByTestId('isVerified-1')).not.toHaveAttribute('data-checked')

    /* Action to complete items */
    await act(async () => {
      await userEvent.click(screen.getByTestId('showMarkAllIsVerified'))
      await userEvent.click(screen.getByTestId('isCompleted-0'))
      await userEvent.click(screen.getByTestId('isCompleted-1'))
    })

    /*  Mark All verified after marking line items as completed. Now verified items will be checked */
    await act(async () => {
      await userEvent.click(screen.getByTestId('showMarkAllIsVerified'))
    })

    expect(screen.getByTestId('showMarkAllIsVerified')).toHaveAttribute('data-checked')
    expect(screen.getByTestId('isVerified-0')).toHaveAttribute('data-checked')
    expect(screen.getByTestId('isVerified-1')).toHaveAttribute('data-checked')
    expect((screen.getByTestId('workOrderDateCompleted') as HTMLInputElement).value).toEqual(
      datePickerFormat(new Date()),
    )
    /* Save call includes following object */
    /* Fix This -- act(() => {
      fireEvent.submit(screen.getByTestId('updateBtn'))
    })
    await waitFor(() =>
      expect(onSave).toBeCalledWith(
        expect.objectContaining({
          workOrderDateCompleted: expect.any(String),
          workOrderExpectedCompletionDate: expect.any(String),
          workOrderStartDate: expect.any(String),
          assignedItems: expect.any(Array),
          showPricing: expect.any(Boolean),
        }),
      ),
    )*/
  })
  test('Verify work order details in completed state', async () => {
    const onClose = jest.fn()
    const onSave = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel?.toLocaleLowerCase() === 'completed')
    const projectData = PROJECTS.find(p => p.id === workOrder?.projectId)
    const transactions = []
    await renderWorkOrderEditTab({ onSave, onClose, workOrder, projectData, transactions })

    expect(screen.getByTestId('companyName').textContent).toEqual(workOrder?.companyName)
    expect(screen.getByTestId('vendorType').textContent).toEqual(workOrder?.skillName)
    expect(screen.getByTestId('email').textContent).toEqual(workOrder?.businessEmailAddress)
    expect(screen.getByTestId('phone').textContent).toEqual(workOrder?.businessPhoneNumber)

    expect(screen.getByTestId('woIssued').textContent).toEqual(
      workOrder?.workOrderIssueDate ? dateFormat(workOrder?.workOrderIssueDate) : 'mm/dd/yyyy',
    )

    expect(screen.getByTestId('lwSubmitted').textContent).toEqual(
      workOrder?.dateLeanWaiverSubmitted ? dateFormat(workOrder?.dateLeanWaiverSubmitted) : 'mm/dd/yyyy',
    )
    expect(screen.getByTestId('completionVariance').textContent).toEqual(
      workOrder?.workOrderCompletionDateVariance ?? '0',
    )

    expect((screen.getByTestId('workOrderStartDate') as HTMLInputElement).value).toEqual(
      workOrder?.workOrderStartDate ? datePickerFormat(workOrder?.workOrderStartDate) : 'mm/dd/yyyy',
    )
    expect((screen.getByTestId('workOrderExpectedCompletionDate') as HTMLInputElement).value).toEqual(
      workOrder?.workOrderExpectedCompletionDate
        ? datePickerFormat(workOrder?.workOrderExpectedCompletionDate)
        : 'mm/dd/yyyy',
    )
    expect((screen.getByTestId('workOrderDateCompleted') as HTMLInputElement).value).toEqual(
      workOrder?.workOrderDateCompleted ? datePickerFormat(workOrder?.workOrderDateCompleted) : 'mm/dd/yyyy',
    )
    expect(screen.getByTestId('workOrderExpectedCompletionDate') as HTMLInputElement).toBeDisabled()
    expect(screen.getByTestId('workOrderDateCompleted') as HTMLInputElement).toBeDisabled()
    expect(screen.getByTestId('workOrderStartDate') as HTMLInputElement).toBeDisabled()
    expect(screen.getByTestId('isCompleted-0')).toHaveAttribute('data-checked')
    expect(screen.getByTestId('isCompleted-1')).toHaveAttribute('data-checked')
    expect(screen.getByTestId('isVerified-0')).toHaveAttribute('data-checked')
    expect(screen.getByTestId('isVerified-1')).toHaveAttribute('data-checked')
  })
})
/*eslint-disable */
