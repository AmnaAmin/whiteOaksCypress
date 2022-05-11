import { dateFormat } from 'utils/date-time-utils'
import { act, getByText, render, screen, selectOption, waitForLoadingToFinish } from 'utils/test-utils'
import App from 'App'
import userEvent from '@testing-library/user-event'

jest.setTimeout(150000)

describe('Porject Details: Transaction tab test cases', () => {
  test('User should create new transaction', async () => {
    await render(<App />, { route: '/project-details/2951' })

    expect(window.location.pathname).toEqual('/project-details/2951')
    expect(screen.getByRole('tab', { selected: true }).textContent).toEqual('Transactions')

    // userEvent.click(screen.getByText('Transaction', { selector: 'button' }))

    const newTransactionButton = screen.getByTestId('new-transaction-button')
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

    expect(await screen.findByText(`CO-ADT Renovations Inc-${dateFormat(new Date())}`)).toBeInTheDocument()
    expect(screen.getByText('3000')).toBeInTheDocument()
  })

  // We should resume this test case After Draw flow Lien Waiver support added
  test('New transaction with Transaction Type "Draw" flow', async () => {
    await render(<App />, { route: '/project-details/2951' })

    const newTransactionButton = screen.getByTestId('new-transaction-button')

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

    expect(totalAmount.textContent).toEqual('Total: $0')

    expect(screen.getByTestId('next-to-lien-waiver-form')).toBeDisabled()

    await userEvent.type(screen.getByTestId('transaction-description-0'), 'Exclude painting')
    await userEvent.type(screen.getByTestId('transaction-amount-0'), '400')

    expect(totalAmount.textContent).toEqual('Total: -$400')
    expect(screen.getByTestId('next-to-lien-waiver-form')).not.toBeDisabled()

    // Add lien waiver to transaction.
    await act(async () => await userEvent.click(screen.getByTestId('next-to-lien-waiver-form')))

    // Check lien waiver form rendered properly
    expect(screen.getByText('-$400')).toBeInTheDocument()
    expect(screen.getByTestId('claimants-title')).toBeInTheDocument()

    // Fill the lien waiver form
    await userEvent.type(screen.getByTestId('claimants-title'), 'Ahmed')
    expect((screen.getByTestId('claimants-title') as HTMLInputElement).value).toEqual('Ahmed')

    // open lien waiver signature modal
    act(() => {
      userEvent.click(screen.getByTestId('add-signature'))
    })

    expect(screen.getByText('Type Your Name Here')).toBeInTheDocument()
    const signatureImageBefore = screen.getByTestId('signature-img') as HTMLImageElement

    expect(signatureImageBefore.src).not.toBeTruthy()

    userEvent.type(screen.getByTestId('signature-input'), 'Ahmed')
    expect((screen.getByTestId('signature-input') as HTMLInputElement).value).toEqual('Ahmed')

    await act(async () => await userEvent.click(screen.getByTestId('save-signature')))

    expect((screen.getByTestId('signature-date') as HTMLInputElement).value).toEqual(dateFormat(new Date()))
    // const signatureImageAfter = screen.getByTestId('signature-img') as HTMLImageElement

    // expect(signatureImageAfter.src).toBeTruthy()

    // await act(async () => {
    //   await userEvent.click(screen.getByTestId('save-transaction'))
    // })

    // await waitForLoadingToFinish()

    // expect(await screen.findByText(`DR-ADT Renovations Inc-${dateFormat(new Date())}`)).toBeInTheDocument()
    // expect(screen.getByText('-400')).toBeInTheDocument()
  })

  test('New transaction form validation should work properly', async () => {
    await render(<App />, { route: '/project-details/2951' })

    const newTransactionButton = screen.getByText('New Transaction')

    // Open new Transaction Modal
    userEvent.click(newTransactionButton)
    await waitForLoadingToFinish()

    await act(async () => {
      await userEvent.click(screen.getByTestId('save-transaction'))
    })

    expect(screen.getAllByText(/This is required field/).length).toEqual(3)
  })

  test('Update transaction by clicking on transaction row which will open Update Transaction modal', async () => {
    await render(<App />, { route: '/project-details/2951' })

    const pendingTransaction = screen.getByText(/pending/i)
    expect(pendingTransaction).toBeInTheDocument()

    // Click on sending transaction row which will open the update transaction modal
    userEvent.click(pendingTransaction)

    // Waiting for modal loading state
    await waitForLoadingToFinish()

    // Check Modal opened with data loaded from API.
    expect(screen.getByText(/Update Transaction/i)).toBeInTheDocument()
    expect(getByText(screen.getByTestId('transaction-type'), /Change Order/i)).toBeInTheDocument()
    expect(screen.getByText('360 Management Services (General Labor)')).toBeInTheDocument()

    const totalAmount = screen.getByTestId('total-amount')
    expect(totalAmount.textContent).toEqual('Total: $1,980')

    // Add new row for adding additional amount
    await userEvent.click(screen.getByTestId('add-new-row-button'))

    const descriptionSecondField = screen.getByTestId('transaction-description-1') as HTMLInputElement
    const amountSecondField = screen.getByTestId('transaction-amount-1') as HTMLInputElement

    await userEvent.type(descriptionSecondField, 'Include painting')
    await userEvent.type(amountSecondField, '1000')
    expect(descriptionSecondField.value).toEqual('Include painting')
    expect(amountSecondField.value).toEqual('1000')
    expect(totalAmount.textContent).toEqual('Total: $2,980')

    // Submit the Form
    await act(async () => {
      await userEvent.click(screen.getByTestId('save-transaction'))
    })
    await waitForLoadingToFinish()

    // Chakra UI toast message rendered twice in DOM, that's why we are going to assert like this.
    expect((await screen.findAllByText('Transaction has been updated successfully.')).length).toBeGreaterThan(0)

    expect(await screen.findByText('2980')).toBeInTheDocument()
  })
})
