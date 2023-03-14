import { fireEvent, getByText, render, screen, waitFor } from '@testing-library/react'
import { Providers } from 'providers'
import { WORK_ORDERS } from 'mocks/api/workorder/data'
import { selectOption, waitForLoadingToFinish } from 'utils/test-utils'
import { Modal } from '@chakra-ui/react'
import PaymentInfoTab from '../payment/payment-tab'
import { datePickerFormat } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'
import { addDays, isWednesday, nextFriday, nextWednesday } from 'date-fns'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'

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
  test('Work Order Payment Tab in Past Due State with all fields readonly', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel === 'PAST DUE')
    await renderPayments({ onClose, workOrder })

    expect((screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).value).toEqual('')
    expect(screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('paymentTermDate') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('expectedPaymentDate') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('datePaymentProcessed') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('datePaid') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('invoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.invoiceAmount as number),
    )
    expect(screen.getByTestId('invoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('clientOriginalApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientOriginalApprovedAmount as number),
    )
    expect(screen.getByTestId('clientOriginalApprovedAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('clientApprovedAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('clientApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientApprovedAmount as number),
    )
    expect(screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.finalInvoiceAmount as number),
    )
    expect(screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.finalInvoiceAmount as number),
    )
    expect(screen.getByTestId('partial-payment-field') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('partial-payment-field') as HTMLInputElement).value).toEqual('$0')

    expect(screen.getByTestId('partialPaymentDate') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('partialPaymentDate') as HTMLInputElement).value).toEqual('')
  })

  test('Work Order Payment Tab in Completed State with all field readonly', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel === 'Completed')
    await renderPayments({ onClose, workOrder })

    expect((screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).value).toEqual('')
    expect(screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('paymentTermDate') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('expectedPaymentDate') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('datePaymentProcessed') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('datePaid') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('invoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.invoiceAmount as number),
    )
    expect(screen.getByTestId('invoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('clientOriginalApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientOriginalApprovedAmount as number),
    )
    expect(screen.getByTestId('clientOriginalApprovedAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('clientApprovedAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('clientApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientApprovedAmount as number),
    )
    expect(screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.finalInvoiceAmount as number),
    )
    expect(screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.finalInvoiceAmount as number),
    )
    expect(screen.getByTestId('partial-payment-field') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('partial-payment-field') as HTMLInputElement).value).toEqual('$0')

    expect(screen.getByTestId('partialPaymentDate') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('partialPaymentDate') as HTMLInputElement).value).toEqual('')
  })

  test('Work Order Payment Tab in Invoiced State. Changing Payment Term should recalculate payment term date, date payment processed and expected pay date', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel === 'Invoiced')
    await renderPayments({ onClose, workOrder })

    expect((screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).value).toEqual(
      datePickerFormat(workOrder?.dateInvoiceSubmitted),
    )
    expect(screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('paymentTermDate') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('paymentTermDate') as HTMLInputElement).value).toEqual(
      datePickerFormat(workOrder?.paymentTermDate),
    )
    expect(screen.getByTestId('expectedPaymentDate') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('expectedPaymentDate') as HTMLInputElement).value).toEqual(
      datePickerFormat(workOrder?.expectedPaymentDate),
    )
    expect((screen.getByTestId('datePaymentProcessed') as HTMLInputElement).value).toEqual(
      datePickerFormat(workOrder?.datePaymentProcessed),
    )
    expect((screen.getByTestId('invoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.invoiceAmount as number),
    )
    expect(screen.getByTestId('invoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('clientOriginalApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientOriginalApprovedAmount as number),
    )
    expect(screen.getByTestId('clientOriginalApprovedAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect(screen.getByTestId('clientApprovedAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('clientApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientApprovedAmount as number),
    )
    expect(screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.finalInvoiceAmount as number),
    )
    expect(screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).toHaveAttribute('disabled')
    expect((screen.getByTestId('finalInvoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.finalInvoiceAmount as number),
    )
    expect((screen.getByTestId('partial-payment-field') as HTMLInputElement).value).toEqual('$0')
    expect((screen.getByTestId('partialPaymentDate') as HTMLInputElement).value).toEqual('')
    await act(async () => {
      await selectOption(screen.getByTestId('paymentTerms'), '30', '20')
      expect(getByText(screen.getByTestId('paymentTerms'), '30')).toBeInTheDocument()
    })

    await waitFor(() => {
      /* Add payment term to date invoiced */
      const paymentTermDate = addDays(new Date(workOrder?.dateInvoiceSubmitted as string), 30)
      expect((screen.getByTestId('paymentTermDate') as HTMLInputElement).value).toEqual(
        datePickerFormat(paymentTermDate),
      )
      /* Next Wed of Payment Term Date */
      const paymentTermDateValue = new Date((screen.getByTestId('paymentTermDate') as HTMLInputElement).value)
      const datePaymentProcessed = isWednesday(paymentTermDateValue)
        ? paymentTermDateValue
        : nextWednesday(paymentTermDateValue)
      expect((screen.getByTestId('datePaymentProcessed') as HTMLInputElement).value).toEqual(
        datePickerFormat(datePaymentProcessed),
      )
      /* Next Fri of Payment Term Date */
      const expectedPaymentDate = nextFriday(datePaymentProcessed)
      expect((screen.getByTestId('expectedPaymentDate') as HTMLInputElement).value).toEqual(
        datePickerFormat(expectedPaymentDate),
      )
    })
  })
  test('Adding Payment in Invoiced State should enter partial Payment Date', async () => {
    const onClose = jest.fn()
    const onSave = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel === 'Invoiced')
    await renderPayments({ onClose, workOrder, onSave })

    userEvent.type(screen.getByTestId('partial-payment-field'), '10')
    fireEvent.blur(screen.getByTestId('partial-payment-field'))
    await waitFor(() => {
      expect((screen.getByTestId('partialPaymentDate') as HTMLInputElement).value).toEqual(datePickerFormat(new Date()))
    })
    fireEvent.submit(screen.getByTestId('submit-btn'))
    await waitFor(() => {
      expect(onSave).toBeCalledTimes(1)
    })
  })
})
