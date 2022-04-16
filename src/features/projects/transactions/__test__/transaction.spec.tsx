import { render, screen } from '@testing-library/react'
import React, { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { FormValues } from 'types/transaction.type'
import { transactionDefaultFormValues } from 'utils/transactions'
import { TransactionAmountForm } from '../transaction-amount-form'

const TransactionForm = () => {
  const [document, setDocument] = useState<File | null>(null)
  const defaultValues: FormValues = useMemo(() => {
    return transactionDefaultFormValues('test@test.com')
  }, [])

  const form = useForm<FormValues>({
    defaultValues,
  })

  return <TransactionAmountForm formReturn={form} setDocument={setDocument} document={document} />
}

const FIELD_CHECKBOX_SELECTOR = 'td input[type=checkbox]'
const ALL_CHECKBOX_SLELECTOR = 'th input[type=checkbox]'

describe('Transaction amount adding/removing interactions test cases', () => {
  test('On "Add New Row" button click should append row to amounts table', async () => {
    const { container } = render(<TransactionForm />)

    expect(screen.getAllByRole('row').length).toEqual(2)

    const addNewRowButton = screen.getByTestId('add-new-row-button')
    const deleteRowButton = screen.getByTestId('delete-row-button')

    expect(deleteRowButton).toBeDisabled()

    // Add new row for adding additional amount
    await userEvent.click(addNewRowButton)

    expect(screen.getAllByRole('row').length).toEqual(3)
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

  test('Check one of checkbox should change AllCheckbox state to indeterminate', async () => {
    const allCheckboxIndeterminateSelector = 'th input[type=checkbox]+span[data-indeterminate]'

    const { container } = render(<TransactionForm />)

    const addNewRowButton = screen.getByTestId('add-new-row-button')

    // Add new row for adding additional amount
    await userEvent.click(addNewRowButton)

    const fieldCheckboxes = container.querySelectorAll(FIELD_CHECKBOX_SELECTOR) as NodeListOf<HTMLInputElement>
    expect(container.querySelector(allCheckboxIndeterminateSelector)).not.toBeInTheDocument()

    await userEvent.click(fieldCheckboxes[1])

    expect(container.querySelector(allCheckboxIndeterminateSelector)).toBeInTheDocument()
  })

  test('Remove amount rows in case one row left, checkbox should hide for only one row.', async () => {
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

    expect(screen.getByText('Delete Transaction Row', { selector: 'header' }))

    userEvent.click(screen.getByText('Delete', { selector: 'button' }))

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

    expect(screen.getByText('Delete Transaction Row', { selector: 'header' }))

    await userEvent.click(screen.getByText('Delete', { selector: 'button' }))

    expect(screen.getByTestId('transaction-description-0')).toBeInTheDocument()
  })
})
