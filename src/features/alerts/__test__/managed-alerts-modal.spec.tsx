import { fireEvent, render, waitFor } from '@testing-library/react'
import { Providers } from 'providers'
import { waitForLoadingToFinish, screen, selectOption } from 'utils/test-utils'
import { ManagedAlertsForm } from '../managed-alerts-modal'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setToken } from 'utils/storage.utils'
import { MANAGED_ALERT } from 'mocks/api/alerts/alerts'

export const renderNewWorkOrder = async ({ onClose, onSubmit, selectedAlert }: any) => {
  await render(
    <ManagedAlertsForm isOpen={true} onClose={onClose} onSubmit={onSubmit} selectedAlert={selectedAlert} />,
    {
      wrapper: Providers,
    },
  )
  await waitForLoadingToFinish()
}

beforeAll(() => {
  setToken('pc')
})

jest.setTimeout(150000)
describe('Verify creating different alerts for the system ', () => {
  test('Verify Creating an alert for Project > Project Manager Change', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    await renderNewWorkOrder({
      onClose,
      onSubmit,
      selectedAlert: null,
    })
    userEvent.type(screen.getByTestId('title'), 'Alert Test')

    await selectOption(screen.getByTestId('typeSelection'), 'Project')
    await selectOption(screen.getByTestId('attributeSelection'), 'Project Manager')
    await selectOption(screen.getByTestId('behaviourSelection'), 'Change')
    userEvent.click(screen.getByTestId('nextDetail'))

    userEvent.click(screen.getByTestId('userType.Admin'))
    userEvent.click(screen.getByTestId('userType.Accounting'))

    userEvent.type(screen.getByTestId('recipientEmailAddress'), 'test@gmail.com')
    userEvent.type(screen.getByTestId('recipientPhoneNumber'), '1234567890')
    // @ts-ignore
    expect(screen.getByTestId('messageBody').value).toEqual(
      'When Project Project Manager changes from old value to any new value.',
    )

    act(() => {
      fireEvent.submit(screen.getByTestId('saveAlert'))
    })
    await waitFor(() => expect(onSubmit).toBeCalledTimes(1))
  })
  test('Verify Creating an alert for Project > Status Equal To Invoiced', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    await renderNewWorkOrder({
      onClose,
      onSubmit,
      selectedAlert: null,
    })
    userEvent.type(screen.getByTestId('title'), 'Alert Test')

    await selectOption(screen.getByTestId('typeSelection'), 'Project')
    await selectOption(screen.getByTestId('attributeSelection'), 'Status')
    await selectOption(screen.getByTestId('behaviourSelection'), 'Equal To')
    await selectOption(screen.getByTestId('customAttributeSelection'), 'Invoiced')
    userEvent.click(screen.getByTestId('nextDetail'))

    userEvent.click(screen.getByTestId('userType.Admin'))
    userEvent.click(screen.getByTestId('userType.Accounting'))

    userEvent.type(screen.getByTestId('recipientEmailAddress'), 'test@gmail.com')
    userEvent.type(screen.getByTestId('recipientPhoneNumber'), '1234567890')
    // @ts-ignore
    expect(screen.getByTestId('messageBody').value).toEqual('When Project Status equals to Invoiced.')

    act(() => {
      fireEvent.submit(screen.getByTestId('saveAlert'))
    })
    await waitFor(() => expect(onSubmit).toBeCalledTimes(1))
  })
  test('Verify Creating an alert for Vendor > Score to be greater than 10', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    await renderNewWorkOrder({
      onClose,
      onSubmit,
      selectedAlert: null,
    })
    userEvent.type(screen.getByTestId('title'), 'Alert Test')

    await selectOption(screen.getByTestId('typeSelection'), 'Vendor')
    await selectOption(screen.getByTestId('attributeSelection'), 'Score')
    await selectOption(screen.getByTestId('behaviourSelection'), 'Greater Than')
    userEvent.type(screen.getByTestId('customAttributeInput'), '10')
    userEvent.click(screen.getByTestId('nextDetail'))

    userEvent.click(screen.getByTestId('userType.Admin'))
    userEvent.click(screen.getByTestId('userType.Accounting'))

    userEvent.type(screen.getByTestId('recipientEmailAddress'), 'test@gmail.com')
    userEvent.type(screen.getByTestId('recipientPhoneNumber'), '1234567890')
    // @ts-ignore
    expect(screen.getByTestId('messageBody').value).toEqual('When Vendor Score is greater than 10.')

    act(() => {
      fireEvent.submit(screen.getByTestId('saveAlert'))
    })
    await waitFor(() => expect(onSubmit).toBeCalledTimes(1))
  })

  test('Verify Creating an alert for Transaction > Amount to be less than 1000', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    await renderNewWorkOrder({
      onClose,
      onSubmit,
      selectedAlert: null,
    })
    userEvent.type(screen.getByTestId('title'), 'Alert Test')

    await selectOption(screen.getByTestId('typeSelection'), 'Transaction')
    await selectOption(screen.getByTestId('attributeSelection'), 'Amount')
    await selectOption(screen.getByTestId('behaviourSelection'), 'Less Than')
    userEvent.type(screen.getByTestId('customAttributeInput'), '1000')
    userEvent.click(screen.getByTestId('nextDetail'))

    userEvent.click(screen.getByTestId('userType.Admin'))
    userEvent.click(screen.getByTestId('userType.Accounting'))

    userEvent.type(screen.getByTestId('recipientEmailAddress'), 'test@gmail.com')
    userEvent.type(screen.getByTestId('recipientPhoneNumber'), '1234567890')
    // @ts-ignore
    expect(screen.getByTestId('messageBody').value).toEqual('When Transaction Amount is less than 1000.')

    act(() => {
      fireEvent.submit(screen.getByTestId('saveAlert'))
    })
    await waitFor(() => expect(onSubmit).toBeCalledTimes(1))
  })

  test('Verify selecting an alert and saving it with changes', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    await renderNewWorkOrder({
      onClose,
      onSubmit,
      selectedAlert: MANAGED_ALERT[0],
    })
    userEvent.type(screen.getByTestId('customAttributeInput'), '500')
    act(() => {
      fireEvent.submit(screen.getByTestId('saveDetails'))
    })
    await waitFor(() => expect(onSubmit).toBeCalledTimes(1))
  })
})
