import userEvent from '@testing-library/user-event'
import { UploadDocumentModal } from 'features/project-details/documents/upload-document'
import { Providers } from 'providers'
import { act, render, screen, selectOption, waitForLoadingToFinish } from 'utils/test-utils'

const onClose = jest.fn()

const renderDocumentUploadModal = async () => {
  render(<UploadDocumentModal isOpen={true} onClose={onClose} />, { wrapper: Providers })

  await waitForLoadingToFinish()
}

// const chooseFileByLabel = (inputElement, fileName = 'dummy-file.png') => {
//   // Create dummy file then upload
//   const file = new File(['(⌐□_□)'], fileName, {
//     type: 'image/png',
//   })

//   userEvent.upload(inputElement, file)

//   expect(screen.getByText(fileName)).toBeInTheDocument()
// }

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

    // chooseFileByLabel(screen.getByTestId('choose-document'))

    await act(async () => {
      await userEvent.click(screen.getByText(/Save/i))
    })

    // expect(await screen.findAllByText('New document has been uploaded successfully.')).not.toEqual(null)

    // expect(await screen.findByText(/dummy-file\.png/i)).toBeInTheDocument()
  })

  test('Upload document Empty fields validation', async () => {
    await renderDocumentUploadModal()

    await act(async () => {
      await userEvent.click(screen.getByText(/Save/i))
    })
    expect(screen.getByText(/Document type is required/i)).toBeInTheDocument()

    await userEvent.click(screen.getByText(/Cancel/i))
  })

  test('Upload document with longer name than 255 character validation', async () => {
    await renderDocumentUploadModal()

    // Fill document form
    await selectOption(screen.getByTestId('document-type'), 'Drawings')

    // chooseFileByLabel(
    //   screen.getByTestId('choose-document'),
    //   'dummy-file-with-long-name-more-than-255-characters-Lorem-ipsum-dolor-sit-amet-consectetur adipisicing-elito-Commodi-aeos-perspiciatisa-Id-fugit-labore-magni-quae-sit-laudantium-atque maiores-aperiam-quaerat-maxime-quisquam-ipsam-temporaa-sint-necessitatab.png',
    // )

    await act(async () => {
      await userEvent.click(screen.getByText(/Save/i))
    })

    // expect(screen.getByText(/File name length should be less than 255/i)).toBeInTheDocument()
  })
})
