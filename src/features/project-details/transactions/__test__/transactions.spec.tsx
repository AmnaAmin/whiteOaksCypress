import { act, getByText, screen, selectOption, waitForLoadingToFinish } from 'utils/test-utils'
import { render, fireEvent, getByRole } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setToken } from 'utils/storage.utils'
import { TransactionForm, TransactionFormProps } from '../transaction-form'
import { Providers } from 'providers'
import {
  WORK_ORDERS,
  CHANGE_ORDERS,
  CHANGE_ORDER_AGAINST_VENDOR_TRANSACTION_ID,
  CHANGE_ORDER_AGAINST_PROJECT_SOW_TRANSACTION_ID,
  DRAW_TRANSACTION_AGAINST_VENDOR_ID,
  // DRAW_TRANSACTION_AGAINST_PROJECT_SOW_ID,
  MATERIAL_TRANSACTION_ID,
  PAYMENT_TRANSACTION_ID,
  APPROVED_TRANSACTION_ID,
  AGAINST_SELECTED_OPTION,
  TRANSACTION_OF_CHANGE_ORDER_AGAINST_PROJECT_SOW_NOT_APPLICABLE_WORK_ORDER_ID,
  OVERPAYMENT_TRANSACTION_ID,
} from 'mocks/api/projects/data'
import { createAgainstLabel, createChangeOrderLabel, createWorkOrderLabel } from 'api/transactions'
import { dateFormat } from 'utils/date-time-utils'
import {
  REQUIRED_FIELD_ERROR_MESSAGE,
  STATUS_SHOULD_NOT_BE_PENDING_ERROR_MESSAGE,
} from 'features/project-details/transactions/transaction.constants'

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
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()
      expect(screen.getByText('Against', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw', 'Payment', 'Material']
      await selectOption(screen.getByTestId('transaction-type'), 'Change Order')

      // User first select Against, one of ['Project SOW', 'Vendor']
      await selectOption(
        screen.getByTestId('against-select-field'),
        createAgainstLabel(workOrder.companyName, workOrder.skillName),
      )

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Change Order'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Change Order')).toBeInTheDocument()
      // expect(screen.getByText('Expected Completion', { selector: 'label' })).toBeInTheDocument()
      expect(screen.getByText('New Expected Completion', { selector: 'label' })).toBeInTheDocument()
      const expectedCompletionDate = screen.getByTestId('expected-completion-date') as HTMLInputElement
      const newExpectedCompletionDate = screen.getByTestId('new-expected-completion-date') as HTMLInputElement
      const totalAmount = screen.getByTestId('total-amount')

      expect(expectedCompletionDate).toBeDisabled()
      expect(expectedCompletionDate.value).toEqual('11/30/2021')
      expect(newExpectedCompletionDate).not.toBeDisabled()
      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added painting')
      await userEvent.type(amountField, '3000')

      expect(totalAmount.textContent).toEqual('Total: $3,000.00')

      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })

    // We should resume this test case After Draw flow Lien Waiver support added
    test('Then User should create Change Order transaction against Project SOW of Vendor WorkOrder successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

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

      // User first select Work Order, one of ['SOW-1', 'SOW-2']
      const workOrderOptionLabel = createWorkOrderLabel(workOrder.skillName, workOrder.companyName)
      await selectOption(screen.getByTestId('work-order-select'), workOrderOptionLabel)
      expect(getByText(screen.getByTestId('work-order-select'), workOrderOptionLabel)).toBeInTheDocument()

      // User first select Change Order, one of ['Change Order-1', 'Change Order-2']
      const changeOrderOptionLabel = createChangeOrderLabel(changeOrder.changeOrderAmount, changeOrder.name)
      await selectOption(screen.getByTestId('change-order-select'), changeOrderOptionLabel)
      expect(getByText(screen.getByTestId('change-order-select'), changeOrderOptionLabel)).toBeInTheDocument()

      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: $0.00')

      // Fill the description and amount fields
      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added painting')
      await userEvent.type(amountField, '3000')

      // Check the total amount is correct
      expect(totalAmount.textContent).toEqual('Total: $3,000.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })

    test('Then user should create Change Order transaction against Project SOW of work order ignore (not applicable)', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

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

      // User first select Work Order, one of ['SOW-1', 'SOW-2']
      const workOrderOptionLabel = 'ignore (Not applicable)'
      await selectOption(screen.getByTestId('work-order-select'), workOrderOptionLabel)
      expect(getByText(screen.getByTestId('work-order-select'), workOrderOptionLabel)).toBeInTheDocument()

      // User first select Change Order, one of ['Change Order-1', 'Change Order-2']
      const changeOrderOptionLabel = '$0.00'
      await selectOption(screen.getByTestId('change-order-select'), changeOrderOptionLabel)
      expect(getByText(screen.getByTestId('change-order-select'), changeOrderOptionLabel)).toBeInTheDocument()

      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: $0.00')

      // Fill the description and amount fields
      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added painting')
      await userEvent.type(amountField, '3000')

      // Check the total amount is correct
      expect(totalAmount.textContent).toEqual('Total: $3,000.00')

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
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Draw')

      // User first select Against, one of ['SOW', 'Vendor']
      expect(
        getByText(
          screen.getByTestId('against-select-field'),
          createAgainstLabel(workOrder.companyName, workOrder.skillName),
        ),
      ).toBeInTheDocument()

      // --- Change of Requirement --- Removing this as there is no Project SOW against Draw Transaction
      // await selectOption(
      //   screen.getByTestId('against-select-field'),
      //   createAgainstLabel(workOrder.companyName, workOrder.skillName),
      // )

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Draw'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Draw')).toBeInTheDocument()
      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')
      const showLienWaiverFormButton = screen.getByTestId('next-to-lien-waiver-form')

      expect(showLienWaiverFormButton).toBeDisabled()

      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      expect(totalAmount.textContent).toEqual('Total: -$400.00')
      fireEvent.change(screen.getByTestId(`invoice-date`), { target: { value: '2023-01-01' } })

      // show lien waiver form
      await act(async () => {
        await userEvent.click(screen.getByTestId('next-to-lien-waiver-form'))
      })

      // Check lien waiver form rendered properly
      expect(screen.getByText('-$400.00')).toBeInTheDocument()
      expect(screen.getByTestId('claimants-title')).toBeInTheDocument()

      // Fill the lien waiver form
      await userEvent.type(screen.getByTestId('claimants-title'), 'Ahmed')
      expect((screen.getByTestId('claimants-title') as HTMLInputElement).value).toEqual('Ahmed')

      // open lien waiver signature modal
      act(() => {
        userEvent.click(screen.getByTestId('add-signature'))
      })

      expect(screen.getByText('Type Your Name Here')).toBeInTheDocument()

      // Fill the lien waiver signature modal
      userEvent.type(screen.getByTestId('signature-input'), 'Ahmed')
      expect((screen.getByTestId('signature-input') as HTMLInputElement).value).toEqual('Ahmed')

      // Click on save button
      await act(async () => await userEvent.click(screen.getByTestId('save-signature')))

      // Check lien waiver form rendered properly
      expect((screen.getByTestId('signature-date') as HTMLInputElement).value).toEqual(dateFormat(new Date()))

      // User submit the transaction
      //  await act(async () => {
      //   await userEvent.click(screen.getByTestId('next-to-lien-waiver-form'))
      // })

      // await waitForLoadingToFinish()

      // expect(onClose).toHaveBeenCalled()
    })

    // --- Change of Requirement --- Removing this as there is no Project SOW against Draw Transaction

    // test('Then User should create Draw transaction against Project SOW successfully', async () => {
    //   const onClose = jest.fn()
    //   await renderTransactionForm({ onClose, projectId: '1212' })

    //   expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

    //   // User first select Transaction type, one of ['Change Order', 'Draw']
    //   await selectOption(screen.getByTestId('transaction-type'), 'Draw')

    //   // User first select Against, one of ['SOW', 'Vendor']
    //   await selectOption(screen.getByTestId('against-select-field'), 'Project SOW')

    //   // user select payment term select option
    //   await selectOption(screen.getByTestId('payment-term-select'), '20')

    //   await fireEvent.change(screen.getByTestId(`invoice-date`), { target: { value: '2022-10-01' } })

    //   /**
    //    * Check the following fields changed properly,
    //    * 1- Transaction Type selected with 'Draw'
    //    * 2- Expected Completion Date field visible with already filled value of current Date but disabled
    //    * 3- New Expected Completion Date field visible
    //    */
    //   expect(getByText(screen.getByTestId('transaction-type'), 'Draw')).toBeInTheDocument()
    //   expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()
    //   expect(getByText(screen.getByTestId('payment-term-select'), '20')).toBeInTheDocument()
    //   expect((screen.getByTestId('invoice-date') as HTMLInputElement).value).toEqual('2022-10-01')

    //   const totalAmount = screen.getByTestId('total-amount')

    //   expect(totalAmount.textContent).toEqual('Total: $0.00')

    //   const descriptionField = screen.getByTestId('transaction-description-0')
    //   const amountField = screen.getByTestId('transaction-amount-0')

    //   await userEvent.type(descriptionField, 'Added')
    //   await userEvent.type(amountField, '400')

    //   // User submit the transaction
    //   await act(async () => {
    //     await userEvent.click(screen.getByTestId('save-transaction'))
    //   })

    //   await waitForLoadingToFinish()

    //   expect(onClose).toHaveBeenCalled()
    // })
  })

  // Write test suite for when the user create transaction of payment type Material
  describe('When the user create transaction of payment type Material', () => {
    test('Then User should create Material transaction against vendor successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Material')

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Material'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Material')).toBeInTheDocument()
      expect(
        getByText(
          screen.getByTestId('against-select-field'),
          createAgainstLabel(workOrder.companyName, workOrder.skillName),
        ),
      ).toBeInTheDocument()
      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      expect(totalAmount.textContent).toEqual('Total: -$400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })

    test('Then User should create Material transaction against Vendor with refund material checkbox checked successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Material')

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Material'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Material')).toBeInTheDocument()
      expect(
        getByText(
          screen.getByTestId('against-select-field'),
          createAgainstLabel(workOrder.companyName, workOrder.skillName),
        ),
      ).toBeInTheDocument()
      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.click(screen.getByTestId('refund'))
      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      expect(totalAmount.textContent).toEqual('Total: $400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
  })

  // write test suite for when the user create transaction of payment type Payment
  describe('When the user create transaction of payment type Payment', () => {
    test('Then User should create Payment transaction against vendor successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Payment')

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Payment'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Payment')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()

      // add payment received date
      fireEvent.change(screen.getByTestId('payment-received-date'), { target: { value: '2022-10-01' } })

      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
  })

  // write test suite for when the user create transaction of type Deductible
  describe('When the user create transaction of type Deductible', () => {
    test('Then User should create Deductible transaction against Project SOW successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      await selectOption(screen.getByTestId('transaction-type'), 'Deductible')
      expect(getByText(screen.getByTestId('transaction-type'), 'Deductible')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()

      // add payment received date
      fireEvent.change(screen.getByTestId('payment-received-date'), { target: { value: '2022-10-01' } })

      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
  })
})

describe('Given update transaction', () => {
  describe('When user update Change Order transaction of status pending', () => {
    test('Then open transaction against Vendor in update transaction form with prepopulated fields and update the form successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: CHANGE_ORDER_AGAINST_VENDOR_TRANSACTION_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is prepopulated with 'Change Order' and disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('transaction-type'), 'Change Order')).toBeInTheDocument()

      // Check Against select field is prepopulated with Vendor and disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('against-select-field'), AGAINST_SELECTED_OPTION)).toBeInTheDocument()

      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: $1,980.00')

      const descriptionField = screen.getByTestId('transaction-description-0') as HTMLInputElement
      const amountField = screen.getByTestId('transaction-amount-0') as HTMLInputElement

      // Check the description and amount field are prepopulated with the values of the transaction
      expect(descriptionField.value).toEqual('Exclude')
      expect(amountField.value).toEqual('1980')

      // Clear the description and amount field
      await userEvent.clear(descriptionField)
      await userEvent.clear(amountField)

      // update the description and amount field
      await userEvent.type(descriptionField, 'Updated')
      await userEvent.type(amountField, '400')

      // Check the total amount is updated
      expect(totalAmount.textContent).toEqual('Total: $400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })

    test('Then open transaction against Project SOW in update transaction form with prepopulated fields and update the form successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: CHANGE_ORDER_AGAINST_PROJECT_SOW_TRANSACTION_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is prepopulated with 'Change Order' and disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('transaction-type'), 'Change Order')).toBeInTheDocument()

      // Check Against select field is prepopulated with Vendor and disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()

      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: $4,925.50')

      const descriptionField = screen.getByTestId('transaction-description-0') as HTMLInputElement
      const amountField = screen.getByTestId('transaction-amount-0') as HTMLInputElement

      // Check the description and amount field are prepopulated with the values of the transaction
      expect(descriptionField.value).toEqual('Description for test case')
      expect(amountField.value).toEqual('4925.5')

      // Clear the description and amount field
      await userEvent.clear(descriptionField)
      await userEvent.clear(amountField)

      // update the description and amount field
      await userEvent.type(descriptionField, 'Updated')
      await userEvent.type(amountField, '400')

      // Check the total amount is updated
      expect(totalAmount.textContent).toEqual('Total: $400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })

    test('Then open transaction against Project SOW of not applicable work order and update successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: TRANSACTION_OF_CHANGE_ORDER_AGAINST_PROJECT_SOW_NOT_APPLICABLE_WORK_ORDER_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is prepopulated with 'Change Order' and disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('transaction-type'), 'Change Order')).toBeInTheDocument()

      // Check Against select field is prepopulated with Vendor and disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()

      // Check work order select field is prepopulated with 'Ignore (Not Applicable)' and disabled
      expect(getByRole(screen.getByTestId('work-order-select'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('work-order-select'), 'ignore (Not applicable)')).toBeInTheDocument()

      // Check change order select field is prepopulated with '$0.00' and disabled
      expect(getByRole(screen.getByTestId('change-order-select'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('change-order-select'), '$0.00')).toBeInTheDocument()

      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: $500.00')

      const descriptionField = screen.getByTestId('transaction-description-0') as HTMLInputElement
      const amountField = screen.getByTestId('transaction-amount-0') as HTMLInputElement

      // Check the description and amount field are prepopulated with the values of the transaction
      expect(descriptionField.value).toEqual('test')
      expect(amountField.value).toEqual('500')

      // Clear the description and amount field
      await userEvent.clear(descriptionField)
      await userEvent.clear(amountField)

      // update the description and amount field
      await userEvent.type(descriptionField, 'Updated')
      await userEvent.type(amountField, '400')

      // Check the total amount is updated
      expect(totalAmount.textContent).toEqual('Total: $400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })
    })
  })

  describe('When user update Draw transaction of status pending', () => {
    test('Then open transaction against Vendor in update transaction form with prepopulated fields and update the form successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: DRAW_TRANSACTION_AGAINST_VENDOR_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is prepopulated with 'Draw' and disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('transaction-type'), 'Draw')).toBeInTheDocument()

      // Check Against select field is prepopulated with Vendor and disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('against-select-field'), AGAINST_SELECTED_OPTION)).toBeInTheDocument()

      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: -$4,000.00')

      const descriptionField = screen.getByTestId('transaction-description-0') as HTMLInputElement
      const amountField = screen.getByTestId('transaction-amount-0') as HTMLInputElement

      // Check the description and amount field are prepopulated with the values of the transaction
      expect(descriptionField.value).toEqual('Draw paid 5/27/22')
      expect(amountField.value).toEqual('-4000')

      // Clear the description and amount field
      await userEvent.clear(descriptionField)
      await userEvent.clear(amountField)

      // update the description and amount field
      await userEvent.type(descriptionField, 'Updated')
      await userEvent.type(amountField, '5000')

      // Check the total amount is updated
      expect(totalAmount.textContent).toEqual('Total: -$5,000.00')
      fireEvent.change(screen.getByTestId(`invoice-date`), { target: { value: '2023-01-01' } })
      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('next-to-lien-waiver-form'))
      })

      // Check lien waiver form rendered properly
      expect(screen.getByText('-$5,000.00')).toBeInTheDocument()
      expect(screen.getByTestId('claimants-title')).toBeInTheDocument()

      // Fill the lien waiver form
      await userEvent.type(screen.getByTestId('claimants-title'), 'Ahmed')
      expect((screen.getByTestId('claimants-title') as HTMLInputElement).value).toEqual('Ahmed')

      // open lien waiver signature modal
      act(() => {
        userEvent.click(screen.getByTestId('add-signature'))
      })

      expect(screen.getByText('Type Your Name Here')).toBeInTheDocument()

      // Fill the lien waiver signature modal
      userEvent.type(screen.getByTestId('signature-input'), 'Ahmed')
      expect((screen.getByTestId('signature-input') as HTMLInputElement).value).toEqual('Ahmed')

      // Click on save button
      await act(async () => await userEvent.click(screen.getByTestId('save-signature')))

      // Check lien waiver form rendered properly
      expect((screen.getByTestId('signature-date') as HTMLInputElement).value).toEqual(dateFormat(new Date()))
    })

    // --- Change of Requirement --- Removing this as there is no Project SOW against Draw Transaction

    // test('Then open transaction against Project SOW in update transaction form with prepopulated fields and update the form successfully', async () => {
    //   const onClose = jest.fn()

    //   await renderTransactionForm({
    //     onClose,
    //     selectedTransactionId: DRAW_TRANSACTION_AGAINST_PROJECT_SOW_ID,
    //     projectId: '1212',
    //   })

    //   // Check Transaction Type select field is prepopulated with 'Draw' and disabled
    //   expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
    //   expect(getByText(screen.getByTestId('transaction-type'), 'Draw')).toBeInTheDocument()

    //   // Check Against select field is prepopulated with Vendor and disabled
    //   expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
    //   expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()

    //   // Check Invoice date field is prepopulated with Invoice date
    //   expect((screen.getByTestId('invoice-date') as HTMLInputElement).value).toEqual('2022-07-08')

    //   const descriptionField = screen.getByTestId('transaction-description-0') as HTMLInputElement
    //   const amountField = screen.getByTestId('transaction-amount-0') as HTMLInputElement

    //   // Check the description and amount field are prepopulated with the values of the transaction
    //   expect(descriptionField.value).toEqual('Test')
    //   expect(amountField.value).toEqual('-300')

    //   // Check total amount is rendered properly
    //   const totalAmount = screen.getByTestId('total-amount')
    //   expect(totalAmount.textContent).toEqual('Total: -$300.00')

    //   // Add paid date
    //   await fireEvent.change(screen.getByTestId('paid-date'), { target: { value: '2022-07-20' } })
    //   expect((screen.getByTestId('paid-date') as HTMLInputElement).value).toEqual('2022-07-20')

    //   // Check pay date variance is calculated like (invoiced date) - paid date = variance
    //   // (07/08/2022) - (07/20/2022) = -12
    //   const payDateVariance = screen.getByTestId('pay-date-variance') as HTMLInputElement
    //   expect(payDateVariance.value).toEqual('-12')

    //   // Clear the description and amount field
    //   await userEvent.clear(descriptionField)
    //   await userEvent.clear(amountField)

    //   // update the description and amount field
    //   await userEvent.type(descriptionField, 'Updated')
    //   await userEvent.type(amountField, '4000')

    //   // Check the total amount is updated
    //   expect(totalAmount.textContent).toEqual('Total: -$4,000.00')

    //   // User submit the transaction
    //   await act(async () => {
    //     await userEvent.click(screen.getByTestId('save-transaction'))
    //   })

    //   await waitForLoadingToFinish()

    //   expect(onClose).toHaveBeenCalled()
    // })
  })

  describe('When user update Material transaction of status pending', () => {
    test('Then open Material transaction in update transaction form with prepopulated fields and update the form successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: MATERIAL_TRANSACTION_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is prepopulated with 'Material' and disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('transaction-type'), 'Material')).toBeInTheDocument()

      // Check Against select field is prepopulated with Vendor and disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('against-select-field'), AGAINST_SELECTED_OPTION)).toBeInTheDocument()

      const descriptionField = screen.getByTestId('transaction-description-0') as HTMLInputElement
      const amountField = screen.getByTestId('transaction-amount-0') as HTMLInputElement

      // Check the description and amount field are prepopulated with the values of the transaction
      expect(descriptionField.value).toEqual('Test')
      expect(amountField.value).toEqual('-233')

      // Check total amount is rendered properly
      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: -$233.00')

      // check the status is prepopulated with 'Pending'
      expect(getByText(screen.getByTestId('status-select-field'), 'Pending')).toBeInTheDocument()

      // Mark refund material checkbox as checked
      const refundMaterialCheckbox = screen.getByTestId('refund') as HTMLInputElement
      // expect(refundMaterialCheckbox.checked).toBe(false)
      await userEvent.click(refundMaterialCheckbox)

      // expect(refundMaterialCheckbox.checked).toBe(true)

      // check total amount is updated
      expect(totalAmount.textContent).toEqual('Total: $233.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('When user update Payment transaction of status pending', () => {
    test('Then open Payment transaction in update transaction form with prepopulated fields and update the form successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: PAYMENT_TRANSACTION_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is prepopulated with 'Payment' and disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('transaction-type'), 'Payment')).toBeInTheDocument()

      // Check Against select field is prepopulated with Vendor and disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()

      const descriptionField = screen.getByTestId('transaction-description-0') as HTMLInputElement
      const amountField = screen.getByTestId('transaction-amount-0') as HTMLInputElement

      // Check the description and amount field are prepopulated with the values of the transaction
      expect(descriptionField.value).toEqual('hello')
      expect(amountField.value).toEqual('400')

      // Check total amount is rendered properly
      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: $400.00')

      // check the status is prepopulated with 'Pending'
      expect(getByText(screen.getByTestId('status-select-field'), 'Pending')).toBeInTheDocument()

      // Select the status as 'Approved'
      await selectOption(screen.getByTestId('status-select-field'), 'Approved', 'Pending')

      // Check status select field selected value is 'Approved'
      expect(getByText(screen.getByTestId('status-select-field'), 'Approved')).toBeInTheDocument()

      // Submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('When user update Overpayment transaction of status pending', () => {
    test('Then open Overpayment transaction in update transaction form with prepopulated fields and update the transaction as paid successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: OVERPAYMENT_TRANSACTION_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is prepopulated with 'Overpayment' and disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('transaction-type'), 'Overpayment')).toBeInTheDocument()

      // Check Against select field is prepopulated with Vendor and disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()

      // check MarkAs select field is prepopulated with 'Paid Back'
      expect(getByText(screen.getByTestId('mark-as-select-field'), 'Paid Back')).toBeInTheDocument()

      // check the status is prepopulated with 'Pending'
      expect(getByText(screen.getByTestId('status-select-field'), 'Pending')).toBeInTheDocument()

      // Fill Paid Back date and status as 'Approved'
      await selectOption(screen.getByTestId('status-select-field'), 'Approved', 'Pending')
      await userEvent.type(screen.getByTestId('paid-back-date'), '2021-01-01')

      // Check status select field selected value is 'Approved'
      expect(getByText(screen.getByTestId('status-select-field'), 'Approved')).toBeInTheDocument()

      const descriptionField = screen.getByTestId('transaction-description-0') as HTMLInputElement
      const amountField = screen.getByTestId('transaction-amount-0') as HTMLInputElement

      // Check the description and amount field are prepopulated with the values of the transaction
      expect(descriptionField.value).toEqual('Overpayment')
      expect(amountField.value).toEqual('11103')

      // Check total amount is rendered properly
      const totalAmount = screen.getByTestId('total-amount')
      expect(totalAmount.textContent).toEqual('Total: $11,103.00')

      // Submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })

    test('Then open Overpayment transaction in update transaction form with prepopulated fields and update the transaction as revenue successfully', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: OVERPAYMENT_TRANSACTION_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is prepopulated with 'Overpayment' and disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('transaction-type'), 'Overpayment')).toBeInTheDocument()

      // Check Against select field is prepopulated with Vendor and disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()

      // Check the MarkAs select field is prepopulated with 'Paid Back' and select 'Revenue'
      expect(getByText(screen.getByTestId('mark-as-select-field'), 'Paid Back')).toBeInTheDocument()
      await selectOption(screen.getByTestId('mark-as-select-field'), 'Revenue', 'Paid Back')

      // Check the form fields updated properly, like markAs value and status and Paid Back fields should be hidden
      expect(getByText(screen.getByTestId('mark-as-select-field'), 'Revenue')).toBeInTheDocument()
      expect(screen.queryByTestId('paid-back-date')).not.toBeInTheDocument()
      expect(screen.queryByTestId('status-select-field')).not.toBeInTheDocument()

      // Submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })

    test('Then open Overpayment transaction in update transaction form with prepopulated fields and update the transaction with pending status should show form errors', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: OVERPAYMENT_TRANSACTION_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is prepopulated with 'Overpayment' and disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('transaction-type'), 'Overpayment')).toBeInTheDocument()

      // Check Against select field is prepopulated with Vendor and disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()

      // check MarkAs select field is prepopulated with 'Paid Back'
      expect(getByText(screen.getByTestId('mark-as-select-field'), 'Paid Back')).toBeInTheDocument()

      // check the paid back date is empty
      expect(screen.getByTestId('paid-back-date').textContent).toEqual('')

      // check the status is prepopulated with 'Pending'
      expect(getByText(screen.getByTestId('status-select-field'), 'Pending')).toBeInTheDocument()

      // Submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      // Check the form errors
      expect(screen.getByText(REQUIRED_FIELD_ERROR_MESSAGE)).toBeInTheDocument()
      expect(screen.getByText(STATUS_SHOULD_NOT_BE_PENDING_ERROR_MESSAGE)).toBeInTheDocument()
    })
  })

  describe('When user open transaction of status "Approved"', () => {
    test('Then user can see all transaction form fields as disabled', async () => {
      const onClose = jest.fn()

      await renderTransactionForm({
        onClose,
        selectedTransactionId: APPROVED_TRANSACTION_ID,
        projectId: '1212',
        projectStatus: 'invoiced',
      })

      // Check Transaction Type select field is disabled
      expect(getByRole(screen.getByTestId('transaction-type'), 'combobox')).toBeDisabled()

      // Check Against select field is disabled
      expect(getByRole(screen.getByTestId('against-select-field'), 'combobox')).toBeDisabled()

      // Check status select field is disabled and selected value is 'Approved'
      expect(getByRole(screen.getByTestId('status-select-field'), 'combobox')).toBeDisabled()
      expect(getByText(screen.getByTestId('status-select-field'), 'Approved')).toBeInTheDocument()

      // Check new expected completion date field is hidden
      expect(screen.queryByTestId('new-expected-completion-date')).toBeNull()

      const descriptionField = screen.getByTestId('transaction-description-0') as HTMLInputElement
      const amountField = screen.getByTestId('transaction-amount-0') as HTMLInputElement

      // check the description and amount fields are disabled
      expect(descriptionField).toHaveAttribute('readonly')
      expect(amountField).toHaveAttribute('readonly')

      // Check save transaction button is hidden
      expect(screen.queryByTestId('save-transaction')).toBeNull()

      // Close the transaction form by clicking on the close button
      await act(async () => {
        await userEvent.click(screen.getByTestId('close-transaction-form'))
      })

      expect(onClose).toHaveBeenCalled()
    })
  })

  // Write test suite for when the user create transaction of payment type Material
  describe('When the user create transaction of shipping type', () => {
    test('Then User should create Shipping  Fee transaction against Project SOW successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Shipping Fee')

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Shipping Fee'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Shipping Fee')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()
      fireEvent.change(screen.getByTestId(`invoice-date`), { target: { value: '2023-02-20' } })
      await selectOption(screen.getByTestId('payment-term-select'), '20')
      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      expect(totalAmount.textContent).toEqual('Total: -$400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
    test('Then User should create Shipping Fee transaction against Project SOW with refund checkbox checked successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Shipping Fee')

      expect(getByText(screen.getByTestId('transaction-type'), 'Shipping Fee')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()
      fireEvent.change(screen.getByTestId(`invoice-date`), { target: { value: '2023-02-20' } })
      await selectOption(screen.getByTestId('payment-term-select'), '20')
      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.click(screen.getByTestId('refund'))
      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      expect(totalAmount.textContent).toEqual('Total: $400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
  })

  // Write test suite for when the user create transaction of payment type Carrier Fee
  describe('When the user create transaction of carrier type', () => {
    test('Then User should create Carrier Fee transaction against Project SOW successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Carrier Fee')

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Shipping Fee'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Carrier Fee')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()
      fireEvent.change(screen.getByTestId(`invoice-date`), { target: { value: '2023-02-20' } })
      await selectOption(screen.getByTestId('payment-term-select'), '20')
      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      expect(totalAmount.textContent).toEqual('Total: -$400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
    test('Then User should create Carrier Fee transaction against Project SOW with refund checkbox checked successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Carrier Fee')

      expect(getByText(screen.getByTestId('transaction-type'), 'Carrier Fee')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()
      fireEvent.change(screen.getByTestId(`invoice-date`), { target: { value: '2023-02-20' } })
      await selectOption(screen.getByTestId('payment-term-select'), '20')
      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.click(screen.getByTestId('refund'))
      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      expect(totalAmount.textContent).toEqual('Total: $400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
  })

  // Write test suite for when the user create transaction of payment type Permit
  describe('When the user create transaction of Permit type', () => {
    test('Then User should create Permit Fee transaction against Project SOW successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Permit Fee')

      /**
       * Check the following fields changed properly,
       * 1- Transaction Type selected with 'Shipping Fee'
       * 2- Expected Completion Date field visible with already filled value of current Date but disabled
       * 3- New Expected Completion Date field visible
       */
      expect(getByText(screen.getByTestId('transaction-type'), 'Permit Fee')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()
      fireEvent.change(screen.getByTestId(`invoice-date`), { target: { value: '2023-02-20' } })
      await selectOption(screen.getByTestId('payment-term-select'), '20')
      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      expect(totalAmount.textContent).toEqual('Total: -$400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
    test('Then User should create Permit Fee transaction against Project SOW with refund checkbox checked successfully', async () => {
      const onClose = jest.fn()
      await renderTransactionForm({ onClose, projectId: '1212', projectStatus: 'invoiced' })

      expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

      // User first select Transaction type, one of ['Change Order', 'Draw']
      await selectOption(screen.getByTestId('transaction-type'), 'Permit Fee')

      expect(getByText(screen.getByTestId('transaction-type'), 'Permit Fee')).toBeInTheDocument()
      expect(getByText(screen.getByTestId('against-select-field'), 'Project SOW')).toBeInTheDocument()
      fireEvent.change(screen.getByTestId(`invoice-date`), { target: { value: '2023-02-20' } })
      await selectOption(screen.getByTestId('payment-term-select'), '20')
      const totalAmount = screen.getByTestId('total-amount')

      expect(totalAmount.textContent).toEqual('Total: $0.00')

      const descriptionField = screen.getByTestId('transaction-description-0')
      const amountField = screen.getByTestId('transaction-amount-0')

      await userEvent.click(screen.getByTestId('refund'))
      await userEvent.type(descriptionField, 'Added')
      await userEvent.type(amountField, '400')

      expect(totalAmount.textContent).toEqual('Total: $400.00')

      // User submit the transaction
      await act(async () => {
        await userEvent.click(screen.getByTestId('save-transaction'))
      })

      await waitForLoadingToFinish()

      expect(onClose).toHaveBeenCalled()
    })
  })
})
