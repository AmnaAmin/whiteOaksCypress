import { render, screen } from 'utils/test-utils'
import { fireEvent, waitFor, render as directRender } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import App from 'App'
import userEvent from '@testing-library/user-event'
import { DocumentsForm } from 'features/vendor-details/documents-card'
import { VENDOR_DATA } from 'mocks/api/vendor-dashboard/data'
jest.setTimeout(150000)

const chooseFilebyTestId = (id, filename) => {
  const inputEl = screen.getByTestId(id)
  // Create dummy file then upload
  const file = new File(['(⌐□_□)'], filename, {
    type: 'image/png',
  })

  userEvent.upload(inputEl, file)

  expect(screen.getByText(new RegExp(filename))).toBeInTheDocument()
}

describe('Vendor Profile Documents', () => {
  it('Documents tab displays and data is rendered', async () => {
    await render(<App />, { route: '/vendors' })

    const documents = screen.getByTestId('documents')
    act(() => {
      fireEvent.click(documents)
    })

    await waitFor(() => {
      expect(screen.getByTestId('documentForm')).toBeInTheDocument()
      const openTab = screen.getByRole('tab', { selected: true })
      expect(openTab.innerHTML).toEqual('Documents')
      expect(screen.getByTestId('w9DocumentDate').innerHTML).toEqual('01/10/2022')
      expect((screen.getByTestId('agreementSignedDate') as HTMLInputElement).value).toEqual('01/02/2021')
      expect((screen.getByTestId('coiGlExpDate') as HTMLInputElement).value).toEqual('07/06/2021')
      expect((screen.getByTestId('coiWcExpDate') as HTMLInputElement).value).toEqual('06/19/2021')
      expect(screen.getByTestId('agreementLink') as HTMLAnchorElement).toHaveAttribute('download')
      expect(screen.getByTestId('autoInsuranceLink') as HTMLAnchorElement).toHaveAttribute('download')
      expect(screen.getByTestId('coiGlExpLink') as HTMLAnchorElement).toHaveAttribute('download')
      expect(screen.getByTestId('coiWcExpLink') as HTMLAnchorElement).toHaveAttribute('download')
    })
  })

  it('W9 document is required for submitting form', async () => {
    const mockSave = jest.fn()
    directRender(<DocumentsForm vendor={VENDOR_DATA as any} onSubmit={mockSave} />)
    /* data from api doesnot have w9 document, hence submit will not be called */
    act(() => {
      fireEvent.submit(screen.getByTestId('saveDocumentCards'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(0))

    /* upload w9 document and call submit*/
    chooseFilebyTestId('fileInputW9Document', 'w9document.png')
    act(() => {
      fireEvent.submit(screen.getByTestId('saveDocumentCards'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(1))
  })

  it('With a change in date, document upload is required', async () => {
    const mockSave = jest.fn()
    directRender(<DocumentsForm vendor={VENDOR_DATA as any} onSubmit={mockSave} />)
    /* change date field, without uploading corresponding document - submit will not be called */
    act(() => {
      fireEvent.change(screen.getByTestId('agreementSignedDate'), {
        target: { value: 'Fri Mar 11 2022 00:00:00 GMT+0500 (Pakistan Standard Time)' },
      })
    })
    await waitFor(() => {
      act(() => {
        fireEvent.submit(screen.getByTestId('saveDocumentCards'))
      })
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(0))
    /* upload w9 document and agreement */
    chooseFilebyTestId('fileInputW9Document', 'w9document.png')
    chooseFilebyTestId('fileInputAgreement', 'agreement.png')
    act(() => {
      fireEvent.submit(screen.getByTestId('saveDocumentCards'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(1))
  })
})
