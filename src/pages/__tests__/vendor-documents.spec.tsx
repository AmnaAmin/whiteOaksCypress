import { render, screen } from 'utils/test-utils'
import { fireEvent, waitFor, render as directRender } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import App from 'App'
import userEvent from '@testing-library/user-event'

jest.setTimeout(30000)

const chooseFilebyTestId = id => {
  const inputEl = screen.getByTestId('fileInputW9Document')
  // Create dummy file then upload
  const file = new File(['(⌐□_□)'], 'dummy-file.png', {
    type: 'image/png',
  })

  userEvent.upload(inputEl, file)

  expect(screen.getByText(/dummy-file\.png/)).toBeInTheDocument()
}

describe('Vendor Profile Documents', () => {
  it('Documents Tab and data is rendered', async () => {
    await render(<App />, { route: '/vendors' })

    const documents = screen.getByTestId('documents')
    act(() => {
      fireEvent.click(documents)
    })

    await waitFor(() => {
      expect(screen.getByTestId('documentForm')).toBeInTheDocument()
      const openTab = screen.getByRole('tab', { selected: true })
      expect(openTab.innerHTML).toEqual('Documents')
    })
  })
  it('Documents Data is rendered', async () => {
    await render(<App />, { route: '/vendors' })

    const documents = screen.getByTestId('documents')
    act(() => {
      fireEvent.click(documents)
    })

    expect(screen.getByTestId('w9DocumentDate').innerHTML).toEqual(' 01/10/2022')
    expect((screen.getByTestId('agreementSignedDate') as HTMLInputElement).value).toEqual('01/02/2021')
    expect((screen.getByTestId('coiGlExpDate') as HTMLInputElement).value).toEqual('07/06/2021')
    expect((screen.getByTestId('coiWcExpDate') as HTMLInputElement).value).toEqual('06/19/2021')
    expect(screen.getByTestId('agreementLink') as HTMLAnchorElement).toHaveAttribute('download')
    expect(screen.getByTestId('autoInsuranceLink') as HTMLAnchorElement).toHaveAttribute('download')
    expect(screen.getByTestId('coiGlExpLink') as HTMLAnchorElement).toHaveAttribute('download')
    expect(screen.getByTestId('coiWcExpLink') as HTMLAnchorElement).toHaveAttribute('download')
  })

  it('w9 document uploads successfully', async () => {
    await render(<App />, { route: '/vendors' })

    const documents = screen.getByTestId('documents')
    act(() => {
      fireEvent.click(documents)
    })
    chooseFilebyTestId('fileInputW9Document')
  })
})
