import userEvent from '@testing-library/user-event'
import { Providers } from 'providers'
import { render, waitForLoadingToFinish, screen, selectOption, act, waitFor } from 'utils/test-utils'
import CreateATicket from '../create-a-ticket'

const renderCreateATicket = async () => {
  render(<CreateATicket />, { wrapper: Providers })

  await waitForLoadingToFinish()
}

const chooseFileByLabel = (inputElement, fileName = 'dummy-file.png') => {
  // Create dummy file then upload
  const file = new File(['(⌐□_□)'], fileName, {
    type: 'image/png',
  })
  userEvent.upload(inputElement, file)
  expect(screen.getByText(fileName)).toBeInTheDocument()
}

test('Open Support page with form', async () => {
  await renderCreateATicket()
  expect(screen.getByText('Create a Ticket')).toBeInTheDocument()
})

test('Create a ticket happy flow', async () => {
  await renderCreateATicket()

  await selectOption(screen.getByTestId('issue-Type'), 'Bug')
  await selectOption(screen.getByTestId('severity'), 'Low')

  userEvent.type(screen.getByTestId('title-input'), 'hello')
  await waitFor(() => {
    expect(screen.getByTestId('title-input')).toHaveValue('hello')
  })

  userEvent.type(screen.getByTestId('descriptions'), '1000 Characters')
  await waitFor(() => {
    expect(screen.getByTestId('descriptions')).toHaveValue('1000 Characters')
  })

  chooseFileByLabel(screen.getByTestId('file-Upload'))

  await act(async () => {
    await userEvent.click(screen.getByText(/Save/i))
  })
})
