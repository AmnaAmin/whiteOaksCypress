import { act, getByText, screen, selectOption, waitForLoadingToFinish } from 'utils/test-utils'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setToken } from 'utils/storage.utils'
import { TransactionForm, TransactionFormProps } from '../transaction-form'
import { Providers } from 'providers'
import { WORK_ORDERS, CHANGE_ORDERS } from 'mocks/api/projects/data'
import { createAgainstOptionLabel, createChangeOrderLabel, createWorkOrderLabel } from 'utils/transactions'

beforeAll(() => {
  setToken('pc')
})

jest.setTimeout(150000)

const renderTransactionForm = async (props: TransactionFormProps) => {
  render(<TransactionForm {...props} />, { wrapper: Providers })

  await waitForLoadingToFinish()
}

const workOrder = WORK_ORDERS[0]
const changeOrder = CHANGE_ORDERS[0]

describe('Given Project Coordinator create new transaction', () => {
  describe('When the user create transaction of payment type Change Order', () => {
    test('Then User should create Change Order transaction against vendor successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose })

      expect(screen.getByText('Payment Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Change Order')

      // User first select Against, one of ['SOW', 'Vendor']
      await selectOption(
        screen.getByTestId('against-select-field'),
        createAgainstOptionLabel(workOrder.companyName, workOrder.skillName),
      )

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Change Order'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Change Order')).toBeInTheDocument()
      expect(screen.getByText('Expected Completion', { selector: 'label' })).toBeInTheDocument()
      expect(screen.getByText('New Expected Completion', { selector: 'label' })).toBeInTheDocument()
      const expectedCompletionDate = screen.getByTestId('expected-completion-date') as HTMLInputElement
      const newExpectedCompletionDate = screen.getByTestId('new-expected-completion-date') as HTMLInputElement
      const totalAmount = screen.getByTestId('total-amount')

      expect(expectedCompletionDate).toBeDisabled()
      expect(expectedCompletionDate.value).toEqual('11/30/2021')
      expect(newExpectedCompletionDate).not.toBeDisabled()
      expect(totalAmount.textContent).toEqual('Total: $0')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added painting')
      await userEvent.type(amountField, '3000')

      expect(totalAmount.textContent).toEqual('Total: $3,000')

      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })

    // We should resume this test case After Draw flow Lien Waiver support added
    test('Then User should create Change Order transaction against SOW successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({ onClose })

      // User first select Payment type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Change Order')

      // User first select Against, one of ['Project SOW', 'Vendor']
      await selectOption(screen.getByTestId('against-select-field'), 'Project SOW')

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Change Order'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Change Order')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('work-order-select'), 'Work Order')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('change-order-select'), 'Change Order')).toBeInTheDocument()
      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: $0')

      // User first select Work Order, one of ['SOW-1', 'SOW-2']
      const workOrderOptionLabel = createWorkOrderLabel(workOrder.skillName, workOrder.companyName)
      await selectOption(screen.getByTestId('work-order-select'), workOrderOptionLabel)
      expect(getByText(screen.getByTestId('work-order-select'), workOrderOptionLabel)).toBeInTheDocument()

      // User first select Change Order, one of ['Change Order-1', 'Change Order-2']
      const changeOrderOptionLabel = createChangeOrderLabel(changeOrder.changeOrderAmount, changeOrder.name)
      await selectOption(screen.getByTestId('change-order-select'), changeOrderOptionLabel)
      expect(getByText(screen.getByTestId('change-order-select'), changeOrderOptionLabel)).toBeInTheDocument()

      // Fill the description and amount fields
      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added painting')
      await userEvent.type(amountField, '3000')

      // Check the total amount is correct
      expect(totalAmount.textContent).toEqual('Total: $3,000')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('When the user create transaction of payment type Draw', () => {
    test('Then User should create Draw transaction against vendor successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose })

      expect(screen.getByText('Payment Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Draw')

      // User first select Against, one of ['SOW', 'Vendor']
      await selectOption(
        screen.getByTestId('against-select-field'),
        createAgainstOptionLabel(workOrder.companyName, workOrder.skillName),
      )

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Draw'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Draw')).toBeInTheDocument()
      //   expect(screen.getByText('Expected Completion', { selector: 'label' })).toBeInTheDocument()
      //   expect(screen.getByText('New Expected Completion', { selector: 'label' })).toBeInTheDocument()
      //   const expectedCompletionDate = screen.getByTestId('expected-completion-date') as HTMLInputElement
      //   const newExpectedCompletionDate = screen.getByTestId('new-expected-completion-date') as HTMLInputElement
      const totalAmount = screen.getByTestId('total-amount')

      //   expect(expectedCompletionDate).toBeDisabled()
      //   expect(expectedCompletionDate.value).toEqual('11/30/2021')
      //   expect(newExpectedCompletionDate).not.toBeDisabled()
      expect(totalAmount.textContent).toEqual('Total: $0')

      //   const descriptionField = screen.getByTestId('transaction-description-0')
      //   const amountField = screen.getByTestId('transaction-amount-0')

      //   await userEvent.type(descriptionField, 'Added)
    })
  })
})

describe('Given update transaction', () => {
  describe('When user click on transaction row', () => {})
})
