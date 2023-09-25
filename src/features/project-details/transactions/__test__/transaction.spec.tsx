import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { FormValues } from 'types/transaction.type'
import { transactionDefaultFormValues } from 'api/transactions'
import { TransactionAmountForm } from '../transaction-amount-form'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from 'theme/theme'
import { setToken } from 'utils/storage.utils'

const TransactionForm = () => {
  const queryClient = new QueryClient({})
  const defaultValues: FormValues = useMemo(() => {
    return transactionDefaultFormValues('test@test.com')
  }, [])

  const form = useForm<FormValues>({
    defaultValues,
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <TransactionAmountForm formReturn={form} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

const FIELD_CHECKBOX_SELECTOR = '#amounts-list input[type=checkbox]'
const ALL_CHECKBOX_SLELECTOR = '#all-checkbox input[type=checkbox]'
const ROW_ITEM_SELECTOR = '#amounts-list .amount-input-row'

describe('Transaction amount adding/removing interactions test cases', () => {
  test('On "Add New Row" button click should append row to amounts table', async () => {
    const { container } = render(<TransactionForm />)

    expect(container.querySelectorAll(ROW_ITEM_SELECTOR).length).toEqual(1)

    const addNewRowButton = screen.getByTestId('add-new-row-button')
    const deleteRowButton = screen.getByTestId('delete-row-button')

    expect(deleteRowButton).toBeDisabled()

    // Add new row for adding additional amount
    await userEvent.click(addNewRowButton)

    expect(container.querySelectorAll(ROW_ITEM_SELECTOR).length).toEqual(2)
    const allCheckbox = container.querySelector(ALL_CHECKBOX_SLELECTOR) as HTMLInputElement
    expect(allCheckbox).toBeInTheDocument()
    expect(allCheckbox.checked).toBeFalsy()

    // On All checkbox click verify the all rows checks checked
    userEvent.click(allCheckbox)

    expect(allCheckbox.checked).toBeTruthy()

    const fieldCheckboxes = container.querySelectorAll(FIELD_CHECKBOX_SELECTOR) as NodeListOf<HTMLInputElement>
    fieldCheckboxes.forEach(checkbox => {
      expect(checkbox.checked).toBeTruthy()
    })

    expect(deleteRowButton).not.toBeDisabled()

    // screen.debug(undefined, 10000)
  })

  test('Check one of checkbox should change AllCheckbox state to indeterminate. Transaction', async () => {
    const allCheckboxIndeterminateSelector = '#all-checkbox input[type=checkbox]+span[data-indeterminate]'

    const { container } = render(<TransactionForm />)

    const addNewRowButton = screen.getByTestId('add-new-row-button')

    // Add new row for adding additional amount
    await userEvent.click(addNewRowButton)

    const fieldCheckboxes = container.querySelectorAll(FIELD_CHECKBOX_SELECTOR) as NodeListOf<HTMLInputElement>
    expect(container.querySelector(allCheckboxIndeterminateSelector)).not.toBeInTheDocument()

    await userEvent.click(fieldCheckboxes[1])

    expect(container.querySelector(allCheckboxIndeterminateSelector)).toBeInTheDocument()
  })

  test('Remove amount rows in case one row left, checkbox should hide for only one row.Transaction', async () => {
    const { container } = render(<TransactionForm />)

    const addNewRowButton = screen.getByTestId('add-new-row-button')

    expect(container.querySelectorAll(FIELD_CHECKBOX_SELECTOR).length).toEqual(0)

    // Add new row for adding additional amount
    await userEvent.click(addNewRowButton)

    const fieldCheckboxes = container.querySelectorAll(FIELD_CHECKBOX_SELECTOR)
    expect(fieldCheckboxes.length).toEqual(2)

    await userEvent.click(container.querySelectorAll(FIELD_CHECKBOX_SELECTOR)[0])

    expect(container.querySelectorAll(FIELD_CHECKBOX_SELECTOR)[0])

    await userEvent.click(screen.getByTestId('delete-row-button'))

    expect(screen.getByText('Are You Sure?', { selector: 'header' }))

    userEvent.click(screen.getByText('Yes', { selector: 'button' }))

    expect(container.querySelectorAll(FIELD_CHECKBOX_SELECTOR).length).toEqual(0)
    expect(container.querySelector(ALL_CHECKBOX_SLELECTOR)).not.toBeInTheDocument()
  })

  test('Remove all rows but the last one should not remove because at least one row is mandatory for transaction', async () => {
    const { container } = render(<TransactionForm />)

    const addNewRowButton = screen.getByTestId('add-new-row-button')

    expect(container.querySelectorAll(FIELD_CHECKBOX_SELECTOR).length).toEqual(0)

    // Add new row for adding additional amount
    await userEvent.click(addNewRowButton)

    const fieldCheckboxes = container.querySelectorAll(FIELD_CHECKBOX_SELECTOR)
    expect(fieldCheckboxes.length).toEqual(2)

    await userEvent.click(fieldCheckboxes[0])
    await userEvent.click(fieldCheckboxes[1])

    await userEvent.click(screen.getByTestId('delete-row-button'))

    expect(screen.getByText('Are You Sure?', { selector: 'header' }))

    await userEvent.click(screen.getByText('Yes', { selector: 'button' }))

    expect(screen.getByTestId('transaction-description-0')).toBeInTheDocument()
  })
})
