import { render, screen } from '@testing-library/react'
import { Providers } from 'providers'
import { WORK_ORDERS } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish } from 'utils/test-utils'
import { Modal } from '@chakra-ui/react'
import { setToken } from 'utils/storage.utils'
import InvoicingAndPaymentTab from 'features/vendor/vendor-work-order/payment/invoicing-and-payment-tab'
import { dateFormatNew } from 'utils/date-time-utils'

export const renderPayments = async ({ onClose, workOrder, onSave }: any) => {
  const component = await render(
    <Modal isOpen={true} onClose={onClose} size="none">
      <InvoicingAndPaymentTab onClose={onClose} invoiceAndPaymentData={workOrder} />
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
  beforeAll(() => {
    setToken('pc')
  })

  test('Work Order Payment Tab in Past Due State with all fields readonly', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel === 'PAST DUE')
    await renderPayments({ onClose, workOrder })
    expect((screen.getByTestId('paymentTermDate') as HTMLInputElement).textContent).toEqual(
      workOrder?.paymentTermDate ? dateFormatNew(workOrder?.paymentTermDate) : 'mm/dd/yy',
    )
    expect((screen.getByTestId('payDateVariance') as HTMLInputElement).textContent).toEqual(
      workOrder?.workOrderPayDateVariance ? dateFormatNew(workOrder?.workOrderPayDateVariance) : '0',
    )
    expect((screen.getByTestId('paymentTerm') as HTMLInputElement).textContent).toEqual(
      workOrder?.paymentTerm ? workOrder?.paymentTerm : '20',
    )
    expect((screen.getByTestId('datePaid') as HTMLInputElement).textContent).toEqual(
      workOrder?.datePaid ? dateFormatNew(workOrder?.datePaid) : 'mm/dd/yy',
    )
    expect((screen.getByTestId('dateLeanWaiverSubmitted') as HTMLInputElement).textContent).toEqual(
      workOrder?.dateLeanWaiverSubmitted ? dateFormatNew(workOrder?.dateLeanWaiverSubmitted) : 'mm/dd/yy',
    )
    expect((screen.getByTestId('datePermitsPulled') as HTMLInputElement).textContent).toEqual(
      workOrder?.datePermitsPulled ? dateFormatNew(workOrder?.datePermitsPulled) : 'mm/dd/yy',
    )
    expect((screen.getByTestId('datePaymentProcessed') as HTMLInputElement).textContent).toEqual(
      workOrder?.datePaymentProcessed ? dateFormatNew(workOrder?.datePaymentProcessed) : 'mm/dd/yy',
    )
    expect((screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).textContent).toEqual(
      workOrder?.dateInvoiceSubmitted ? dateFormatNew(workOrder?.dateInvoiceSubmitted) : 'mm/dd/yy',
    )
    expect((screen.getByTestId('expectedPaymentDate') as HTMLInputElement).textContent).toEqual(
      workOrder?.expectedPaymentDate ? dateFormatNew(workOrder?.expectedPaymentDate) : 'mm/dd/yy',
    )
  })
})
