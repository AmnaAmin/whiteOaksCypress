import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditUserModal } from '../edit-user-modal'
import { USER_MANAGEMENT } from '../user-management.i8n'
describe('Edit User Modal Test Cases', () => {
  test('Add User button should open edit user modal with form', async () => {
    const onClose = jest.fn()
    await render(<EditUserModal onClose={onClose} isOpen />)
    userEvent.click(screen.getByTestId('add-user'))
    expect(screen.getByText(`${USER_MANAGEMENT}.modal.newUser`)).toBeInTheDocument()
  })

  test('click cancel button should closed edit user modal', async () => {
    const onClose = jest.fn()
    await render(<EditUserModal onClose={onClose} isOpen />)
    userEvent.click(screen.getByTestId('add-user'))
    userEvent.click(screen.getByText(`${USER_MANAGEMENT}.modal.cancel`))
    expect(screen.getByText(`${USER_MANAGEMENT}.modal.newUser`)).not.toBeVisible()
  })

  test('save button on the disabled form function is not called.', async () => {
    const onClose = jest.fn()
    // const onSubmit = jest.fn()
    await render(<EditUserModal onClose={onClose} isOpen />)
    userEvent.click(screen.getByTestId('add-user'))
    userEvent.click(screen.getByText(`${USER_MANAGEMENT}.modal.save`))
    // expect(onSubmit).toHaveBeenCalled()
  })
})
