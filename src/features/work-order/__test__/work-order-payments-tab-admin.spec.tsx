import { render, screen } from '@testing-library/react'
import { Providers } from 'providers'
import { WORK_ORDERS } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish } from 'utils/test-utils'
import { Modal } from '@chakra-ui/react'
import PaymentInfoTab from '../payment/payment-tab'
import { currencyFormatter } from 'utils/string-formatters'
import { setToken } from 'utils/storage.utils'

export const renderPayments = async ({ onClose, workOrder, onSave }: any) => {
  const setTabIndex = jest.fn()
  const component = await render(
    <Modal isOpen={true} onClose={onClose} size="none">
      <PaymentInfoTab
        workOrder={workOrder}
        onClose={onClose}
        projectData={null}
        setTabIndex={setTabIndex}
        onSave={onSave}
        navigateToProjectDetails={null}
        isWorkOrderUpdating={false}
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
  beforeAll(() => {
    setToken('admin')
  })

  test('Work Order Payment Tab in Past Due State with all fields readonly', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel === 'PAST DUE')
    await renderPayments({ onClose, workOrder })

    expect((screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).value).toEqual('')
    expect(screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect(screen.getByTestId('paymentTermDate') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect(screen.getByTestId('expectedPaymentDate') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect(screen.getByTestId('datePaymentProcessed') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect(screen.getByTestId('datePaid') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect((screen.getByTestId('invoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.invoiceAmount as number),
    )
    expect(screen.getByTestId('invoiceAmount') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect((screen.getByTestId('clientOriginalApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientOriginalApprovedAmount as number),
    )
    expect(screen.getByTestId('clientOriginalApprovedAmount') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect(screen.getByTestId('clientApprovedAmount') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect((screen.getByTestId('clientApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientApprovedAmount as number),
    )
    expect(screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.finalInvoiceAmount as number),
    )
    expect(screen.getByTestId('partial-payment-field') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect((screen.getByTestId('partial-payment-field') as HTMLInputElement).value).toEqual('$0')

    expect(screen.getByTestId('partialPaymentDate') as HTMLInputElement).not.toHaveAttribute('disabled')
    expect((screen.getByTestId('partialPaymentDate') as HTMLInputElement).value).toEqual('')
  })
})
