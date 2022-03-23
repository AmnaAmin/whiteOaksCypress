import userEvent from '@testing-library/user-event'
import App from 'App'
import { render, screen, waitForElementToBeRemoved } from 'utils/test-utils'

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

jest.setTimeout(30000)

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
