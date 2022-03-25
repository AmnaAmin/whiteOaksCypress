import userEvent from '@testing-library/user-event'
import App from 'App'
import { dateFormat } from 'utils/date-time-utils'
import {
  act,
  getByText,
  render,
  screen,
  selectOption,
  waitForElementToBeRemoved,
  waitForLoadingToFinish,
} from 'utils/test-utils'

const renderProjectDetailsAndSwitchToDocumentTab = async () => {
  await render(<App />, { route: '/project-details/2951' })

  expect(window.location.pathname).toEqual('/project-details/2951')

  // screen.debug(undefined, 10000000)
  userEvent.click(screen.getByText('Documents', { selector: 'button' }))
  const uploadDocumentButton = screen.getByText('Upload', { selector: 'button' })
  expect(uploadDocumentButton).toBeInTheDocument()
}

const chooseFileByLabel = (labelRegExp: RegExp) => {
  const inputEl = screen.getByLabelText(labelRegExp)
  // Create dummy file then upload
  const file = new File(['(⌐□_□)'], 'dummy-file.png', {
    type: 'image/png',
  })

  userEvent.upload(inputEl, file)

  expect(screen.getByText(/dummy-file\.png/)).toBeInTheDocument()
}

jest.setTimeout(50000)

describe('Porject Details: Transaction tab test cases', () => {
  test('User should create new transaction', async () => {
    await render(<App />, { route: '/project-details/2951' })

    expect(window.location.pathname).toEqual('/project-details/2951')
    expect(screen.getByRole('tab', { selected: true }).textContent).toEqual('Transaction')

    // userEvent.click(screen.getByText('Transaction', { selector: 'button' }))

    const newTransactionButton = screen.getByText('New Transaction', { selector: 'button' })
    expect(newTransactionButton).toBeInTheDocument()
    expect(screen.getByText(/WO-ADT Renovations Inc-11\/13\/2021/i)).toBeInTheDocument()
    expect(screen.getAllByRole('row').length).toEqual(4)

    // Open new Transaction Modal
    userEvent.click(newTransactionButton)

    await waitForLoadingToFinish()

    // Check Modal opened properly
    const modalHeader = screen.getByText('New Transaction', { selector: 'header' })
    expect(modalHeader).toBeInTheDocument()
    expect(screen.getByText('Transaction Type', { selector: 'label' })).toBeInTheDocument()

    // User first select Transaction type, one of ['Change Order', 'Draw']
    await selectOption(screen.getByTestId('transaction-type'), 'Change Order')

    // screen.debug(undefined, 100000)
    /**
     * Check the following fields changed properly,
     * 1- Transaction Type selected with 'Change Order'
     * 2- Expected Completion Date field visible with already filled value of current Date but disabled
     * 3- New Expected Completion Date field visible
     */
    expect(getByText(screen.getByTestId('transaction-type'), 'Change Order')).toBeInTheDocument()
    expect(screen.getByText('Expected Completion Date', { selector: 'label' })).toBeInTheDocument()
    expect(screen.getByText('New Expected Completion Date', { selector: 'label' })).toBeInTheDocument()
    const expectedCompletionDate = screen.getByTestId('expected-completion-date') as HTMLInputElement
    const newExpectedCompletionDate = screen.getByTestId('new-expected-completion-date') as HTMLInputElement
    const totalAmount = screen.getByTestId('total-amount')

    expect(expectedCompletionDate).toBeDisabled()
    expect(expectedCompletionDate.value).toEqual('11/30/2021')
    expect(newExpectedCompletionDate).not.toBeDisabled()
    expect(totalAmount.textContent).toEqual('$0')

    const descriptionField = screen.getByTestId('transaction-description-0')
    const amountField = screen.getByTestId('transaction-amount-0')

    await userEvent.type(descriptionField, 'Added painting')
    await userEvent.type(amountField, '3000')

    expect(totalAmount.textContent).toEqual('$3,000')

    await act(async () => {
      await userEvent.click(screen.getByTestId('save-transaction'))
    })

    await waitForLoadingToFinish()

    expect(await screen.findByText(`CO-ADT Renovations Inc-${dateFormat(new Date())}`)).toBeInTheDocument()
    expect(screen.getByText('3000')).toBeInTheDocument()
  })

  test('New transaction with Transaction Type "Draw" flow', async () => {
    await render(<App />, { route: '/project-details/2951' })

    const newTransactionButton = screen.getByText('New Transaction', { selector: 'button' })

    // Open new Transaction Modal
    userEvent.click(newTransactionButton)
    await waitForLoadingToFinish()

    // User first select Transaction type, one of ['Change Order', 'Draw']
    await selectOption(screen.getByTestId('transaction-type'), 'Draw')

    /**
     * Check the following fields changed properly,
     * Transaction Type selected with 'Change Order'
     */
    expect(screen.getByText('Draw')).toBeInTheDocument()
    const totalAmount = screen.getByTestId('total-amount')

    expect(totalAmount.textContent).toEqual('$0')

    await userEvent.type(screen.getByTestId('transaction-description-0'), 'Exclude painting')
    await userEvent.type(screen.getByTestId('transaction-amount-0'), '400')

    expect(totalAmount.textContent).toEqual('-$400')

    await act(async () => {
      await userEvent.click(screen.getByTestId('save-transaction'))
    })
    await waitForLoadingToFinish()

    expect(await screen.findByText(`DR-ADT Renovations Inc-${dateFormat(new Date())}`)).toBeInTheDocument()
    expect(screen.getByText('-400')).toBeInTheDocument()
  })

  test('Update transaction by clicking on transaction row which will open Update Transaction modal', async () => {
    await render(<App />, { route: '/project-details/2951' })

    const pendingTransaction = screen.getByText(/PENDING/i)
    expect(pendingTransaction).toBeInTheDocument()

    // Click on sending transaction row which will open the update transaction modal
    userEvent.click(pendingTransaction)

    // Waiting for modal loading state
    await waitForLoadingToFinish()

    // Check Modal opened with data loaded from API.
    expect(screen.getByText(/Update Transaction/, { selector: 'header' })).toBeInTheDocument()
    expect(getByText(screen.getByTestId('transaction-type'), /Change Order/i)).toBeInTheDocument()
    expect(screen.getByText('360 Management Services (General Labor)')).toBeInTheDocument()

    const totalAmount = screen.getByTestId('total-amount')
    expect(totalAmount.textContent).toEqual('$1,980')

    // Add new row for adding additional amount
    await userEvent.click(screen.getByText('Add New Row'))

    const descriptionSecondField = screen.getByTestId('transaction-description-1') as HTMLInputElement
    const amountSecondField = screen.getByTestId('transaction-amount-1') as HTMLInputElement

    await userEvent.type(descriptionSecondField, 'Include painting')
    await userEvent.type(amountSecondField, '1000')
    expect(descriptionSecondField.value).toEqual('Include painting')
    expect(amountSecondField.value).toEqual('1000')
    expect(totalAmount.textContent).toEqual('$2,980')

    // Submit the Form
    await act(async () => {
      await userEvent.click(screen.getByTestId('update-transaction'))
    })
    await waitForLoadingToFinish()

    expect(await screen.findByText('Transaction has been updated successfully.')).toBeInTheDocument()
    await screen.findByText('2980')
    expect(screen.getByText('2980')).toBeInTheDocument()
  })
})

describe('Porject Details: Document tab test cases', () => {
  test('Should render project details page and switch to document tab', async () => {
    await renderProjectDetailsAndSwitchToDocumentTab()
  })

  test('Upload document button should open upload document modal with form', async () => {
    await renderProjectDetailsAndSwitchToDocumentTab()

    const uploadDocumentButton = screen.getByText('Upload', { selector: 'button' })
    userEvent.click(uploadDocumentButton)
    expect(screen.getByText('Upload', { selector: 'header' })).toBeInTheDocument()
  })

  test('Upload document happy flow', async () => {
    await renderProjectDetailsAndSwitchToDocumentTab()

    const uploadDocumentButton = screen.getByText('Upload', { selector: 'button' })
    userEvent.click(uploadDocumentButton)

    // Fill document form
    userEvent.selectOptions(screen.getByLabelText('Document Type', { selector: 'select' }), ['56'])
    const selectedOption = screen.getByRole('option', { name: 'Drawings' }) as HTMLOptionElement
    expect(selectedOption.selected).toBe(true)

    chooseFileByLabel(/Choose File/i)

    userEvent.click(screen.getByText(/Save/i))

    await waitForElementToBeRemoved(() => [screen.getByText('Upload', { selector: 'header' })], { timeout: 5000 })

    expect(screen.getByText(/New document has been uploaded successfully./i)).toBeInTheDocument()
    expect(screen.getByText(/dummy-file\.png/i)).toBeInTheDocument()
  })

  test('Upload document Empty fields validation', async () => {
    await renderProjectDetailsAndSwitchToDocumentTab()

    const uploadDocumentButton = screen.getByText('Upload', { selector: 'button' })
    userEvent.click(uploadDocumentButton)

    userEvent.click(screen.getByText(/Save/i))
    expect(screen.getByText(/Document type is required/i)).toBeInTheDocument()
  })
})
