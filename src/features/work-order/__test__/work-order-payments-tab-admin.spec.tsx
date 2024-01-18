import { getByText, render, screen, waitFor } from '@testing-library/react'
import { Providers } from 'providers'
import { WORK_ORDERS } from 'mocks/api/workorder/data'
import { selectOption, waitForLoadingToFinish } from 'utils/test-utils'
import { Modal } from '@chakra-ui/react'
import PaymentInfoTab from '../payment/payment-tab'
import { currencyFormatter } from 'utils/string-formatters'
import { setToken } from 'utils/storage.utils'
import { datePickerFormat } from 'utils/date-time-utils'
import { act } from 'react-dom/test-utils'
import { addDays, isWednesday, nextFriday, nextWednesday } from 'date-fns'
import moment from 'moment'
import { BrowserRouter } from 'react-router-dom'

export const renderPayments = async ({ onClose, workOrder, onSave }: any) => {
  const setTabIndex = jest.fn()
  const component = await render(
    <BrowserRouter>
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
      </Modal>
    </BrowserRouter>,
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

  test('Work Order Payment Tab in Invoiced State. Changing Payment Term should recalculate payment term date, date payment processed and expected pay date', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.statusLabel === 'Invoiced')
    await renderPayments({ onClose, workOrder })

    expect((screen.getByTestId('dateInvoiceSubmitted') as HTMLInputElement).value).toEqual(
      datePickerFormat(workOrder?.dateInvoiceSubmitted),
    )

    expect((screen.getByTestId('paymentTermDate') as HTMLInputElement).value).toEqual(
      datePickerFormat(workOrder?.paymentTermDate),
    )

    expect((screen.getByTestId('expectedPaymentDate') as HTMLInputElement).value).toEqual(
      datePickerFormat(workOrder?.expectedPaymentDate),
    )
    expect((screen.getByTestId('datePaymentProcessed') as HTMLInputElement).value).toEqual(
      datePickerFormat(workOrder?.datePaymentProcessed),
    )
    expect((screen.getByTestId('invoiceAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.invoiceAmount as number),
    )

    expect((screen.getByTestId('clientOriginalApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientOriginalApprovedAmount as number),
    )

    expect((screen.getByTestId('clientApprovedAmount') as HTMLInputElement).value).toEqual(
      currencyFormatter(workOrder?.clientApprovedAmount as number),
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
      const paymentTermDate = addDays(moment(workOrder?.dateInvoiceSubmitted as string).toDate(), 30)
      expect((screen.getByTestId('paymentTermDate') as HTMLInputElement).value).toEqual(
        datePickerFormat(paymentTermDate),
      )
      /* Next Wed of Payment Term Date */
      const paymentTermDateValue = moment((screen.getByTestId('paymentTermDate') as HTMLInputElement).value).toDate()
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
})
