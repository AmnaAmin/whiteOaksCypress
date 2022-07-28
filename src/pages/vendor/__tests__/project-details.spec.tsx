import userEvent from '@testing-library/user-event'
import { UploadDocumentModal } from 'features/projects/documents/upload-document'
import { Providers } from 'providers'
import { act, render, screen, selectOption, waitForLoadingToFinish } from 'utils/test-utils'

const renderDocumentUploadModal = async () => {
  render(<UploadDocumentModal isOpen={true} />, { wrapper: Providers })

  await waitForLoadingToFinish()
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

jest.setTimeout(150000)

describe('Porject Details: Document tab test cases', () => {
  test('Should render project details page and switch to document tab', async () => {
    await renderDocumentUploadModal()
  })

  test('Upload document button should open upload document modal with form', async () => {
    await renderDocumentUploadModal()

    expect(screen.getByText('Upload Document', { selector: 'header' })).toBeInTheDocument()
  })

  test('Upload document happy flow', async () => {
    await renderDocumentUploadModal()

    // Fill document form
    // userEvent.selectOptions(screen.getByLabelText('Document Type', { selector: 'select' }), ['56'])
    // const selectedOption = screen.getByRole('option', { name: 'Drawings' }) as HTMLOptionElement
    // expect(selectedOption.selected).toBe(true)
    // User first select Transaction type, one of ['Change Order', 'Draw']
    await selectOption(screen.getByTestId('document-type'), 'Drawings')

    chooseFileByLabel(/Choose File/i)

    await act(async () => {
      await userEvent.click(screen.getByText(/Save/i))
    })

    // expect(await screen.findAllByText('New document has been uploaded successfully.')).not.toEqual(null)

    expect(await screen.findByText(/dummy-file\.png/i)).toBeInTheDocument()
  })

  test('Upload document Empty fields validation', async () => {
    await renderDocumentUploadModal()

    act(() => {
      userEvent.click(screen.getByText(/Save/i))
    })
    expect(screen.getByText(/Document type is required/i)).toBeInTheDocument()
  })
})
