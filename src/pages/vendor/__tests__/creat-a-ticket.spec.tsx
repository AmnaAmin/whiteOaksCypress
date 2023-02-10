import userEvent from '@testing-library/user-event'
import { Providers } from 'providers'
import { render, waitForLoadingToFinish, screen, selectOption, waitFor, fireEvent } from 'utils/test-utils'
import CreateATicketForm from '../create-a-ticket-form'

const renderCreateATicketForm = async () => {
  render(<CreateATicketForm />, { wrapper: Providers })

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
  await renderCreateATicketForm()
  expect(screen.getByText('Create a Ticket')).toBeInTheDocument()
  expect(screen.getByText('Issue Type')).toBeInTheDocument()
  expect(screen.getByText('Severity')).toBeInTheDocument()
  expect(screen.getByText('Title')).toBeInTheDocument()
  expect(screen.getByText('Description (1000 Characters)')).toBeInTheDocument()
  expect(screen.getByText('File Upload')).toBeInTheDocument()
})

test('Create a ticket happy flow', async () => {
  await renderCreateATicketForm()
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

  fireEvent.submit(screen.getByTestId('save'))

  expect(await screen.findByText('Ticket created successfully.')).toBeInTheDocument()
  //screen.debug(undefined, 1000000)
})
