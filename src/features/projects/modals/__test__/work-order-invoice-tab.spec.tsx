import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Providers } from 'providers'
import { WORK_ORDERS, DOCUMENTS, TRANSACTIONS } from 'mocks/api/projects/data'
import { waitForLoadingToFinish, screen, act } from 'utils/test-utils'
import { InvoiceTab } from '../invoice-tab'
import { Modal } from '@chakra-ui/react'
import { currencyFormatter } from 'utils/stringFormatters'
import { TransactionStatusValues as TSV, TransactionTypeValues } from 'types/transaction.type'

export const renderInvoice = async ({ onClose, workOrder, documentsData, transactions }: any) => {
  const component = await render(
    <Modal isOpen={true} onClose={onClose} size="none">
      <InvoiceTab
        workOrder={workOrder}
        documentsData={documentsData}
        onClose={onClose}
        projectData={null}
        transactions={transactions}
      />
    </Modal>,
    {
      wrapper: Providers,
    },
  )

  await waitForLoadingToFinish()
  return component
}

jest.setTimeout(150000)

describe('Work Order Invoice Test Cases', () => {
  test('User is able to view readonly info on Invoice Tab. User cannot generate invoice till the workorder is completed', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel === 'PAST DUE')
    const documentsData = []
    await renderInvoice({ onClose, workOrder, documentsData })
    expect(screen.getByTestId('Invoice No.').textContent).toEqual(workOrder?.invoiceNumber)
    expect(screen.getByTestId('Final Invoice').textContent).toEqual(
      workOrder?.finalInvoiceAmount ? currencyFormatter(workOrder?.finalInvoiceAmount) : '',
    )
    expect(screen.getByTestId('PO Number').textContent).toEqual(workOrder?.propertyAddress)
    expect(screen.getByTestId('Invoice Date').textContent).toEqual('mm/dd/yy')
    expect(screen.getByTestId('Due Date').textContent).toEqual('mm/dd/yy')
    expect(screen.queryByTestId('seeInvoice')).not.toBeInTheDocument()

    expect(screen.queryByTestId('generateInvoice')).toHaveAttribute('disabled')
  })
  test('User can generate invoice in completed state. The table shows transactions in approved state', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.id == 8984 && w.statusLabel?.toLocaleLowerCase() === 'completed')
    const documentsData = []

    const transactionItems = TRANSACTIONS.filter(co => co.status === TSV.approved && co.parentWorkOrderId === 8984)

    await renderInvoice({ onClose, workOrder, documentsData, transactions: TRANSACTIONS })
    expect(screen.queryByTestId('generateInvoice')).not.toHaveAttribute('disabled')
    expect(screen.queryAllByTestId('invoice-items')).toHaveLength(transactionItems.length)
    expect(screen.queryByTestId('balanceDue')?.textContent).toEqual(
      workOrder?.finalInvoiceAmount ? currencyFormatter(workOrder?.finalInvoiceAmount) : '$0.00',
    )
    // Generate Invoice and confirmation message shows
    await act(async () => await userEvent.click(screen.getByTestId('generateInvoice')))
    expect(screen.queryByTestId('confirmation-message')).toBeInTheDocument()

    // Confirm yes will start loading as api is called
    await act(async () => await userEvent.click(screen.getByTestId('confirmation-yes')))
    expect(screen.queryByText(/Loading/i)).toBeInTheDocument()
  })

  test('User can view invoice in invoiced/paid state', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel?.toLocaleLowerCase() === 'invoiced')
    const documentsData = DOCUMENTS
    await renderInvoice({ onClose, workOrder, documentsData, transactions: TRANSACTIONS })
    expect(screen.queryByTestId('generateInvoice')).not.toBeInTheDocument()
    expect(screen.queryByTestId('seeInvoice')).toBeInTheDocument()
  })

  test('User can regenerate invoice in declined state', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel?.toLocaleLowerCase() === 'declined')
    const documentsData = []
    await renderInvoice({ onClose, workOrder, documentsData, transactions: TRANSACTIONS })
    expect(screen.queryByTestId('generateInvoice')).toBeInTheDocument()
    expect(screen.queryByTestId('seeInvoice')).not.toBeInTheDocument()
    await act(async () => await userEvent.click(screen.getByTestId('generateInvoice')))
    expect(screen.queryByTestId('confirmation-message')).toBeInTheDocument()

    // Confirm yes will start loading as api is called
    await act(async () => await userEvent.click(screen.getByTestId('confirmation-yes')))
    expect(screen.queryByText(/Loading/i)).toBeInTheDocument()
  })
})
