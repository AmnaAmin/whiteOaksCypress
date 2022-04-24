import { render, screen } from 'utils/test-utils'
import { fireEvent, waitFor, render as directRender } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import App from 'App'
import userEvent from '@testing-library/user-event'
import { LicenseForm } from 'features/vendor-details/license'
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

describe('Vendor Profile License', () => {
  it('License tab displays and data is rendered', async () => {
    await render(<App />, { route: '/vendors' })

    const license = screen.getByTestId('license')
    act(() => {
      fireEvent.click(license)
    })

    await waitFor(() => {
      expect(screen.getByTestId('licenseForm')).toBeInTheDocument()
      const openTab = screen.getByRole('tab', { selected: true })
      expect(openTab.innerHTML).toEqual('License')
      expect(screen.getAllByTestId('licenseRows')).toHaveLength(2)
      expect((screen.getByTestId('licenseType-0') as HTMLSelectElement).value).toEqual('1')
      expect((screen.getByTestId('licenseType-1') as HTMLSelectElement).value).toEqual('4')
      expect((screen.getByTestId('licenseNumber-0') as HTMLInputElement).value).toEqual('1233333')
      expect((screen.getByTestId('licenseNumber-1') as HTMLInputElement).value).toEqual('45434')
      expect((screen.getByTestId('expiryDate-0') as HTMLInputElement).value).toEqual('01/10/2022')
      expect((screen.getByTestId('expiryDate-1') as HTMLInputElement).value).toEqual('01/24/2022')
      expect(screen.getByText(new RegExp('project cost 1.png'))).toBeInTheDocument()
      expect(screen.getByText(new RegExp('New Text Document.txt'))).toBeInTheDocument()
    })
  })
  it('Add / Delete License Rows', async () => {
    await render(<App />, { route: '/vendors' })

    const license = screen.getByTestId('license')
    act(() => {
      fireEvent.click(license)
    })

    const addLicense = screen.getByTestId('addLicense')
    act(() => {
      fireEvent.click(addLicense)
    })

    await waitFor(() => {
      expect(screen.getAllByTestId('licenseRows')).toHaveLength(3)
      expect(screen.getByTestId('removeLicense-2')).toBeInTheDocument()
    })
    act(() => {
      fireEvent.click(screen.getByTestId('removeLicense-2'))
    })
    await waitFor(() => {
      expect(screen.getAllByTestId('licenseRows')).toHaveLength(2)
    })
  })

  it('Save form after adding a new license', async () => {
    const mockSave = jest.fn()
    directRender(<LicenseForm vendor={VENDOR_DATA} onSubmit={mockSave} />)
    await waitFor(() => {
      act(() => {
        fireEvent.click(screen.getByTestId('addLicense'))
      })
    })
    await waitFor(() => {
      act(() => {
        fireEvent.submit(screen.getByTestId('saveLicenses'))
      })
    })
    /* submit will not be called if licenseType, licenseNumber and expirationfile is missing */
    await waitFor(() => expect(mockSave).toBeCalledTimes(0))
    await waitFor(() => {
      act(() => {
        fireEvent.change(screen.getByTestId('licenseType-2'), {
          target: { value: '2' },
        })
      })
    })
    await waitFor(() => {
      act(() => {
        fireEvent.change(screen.getByTestId('licenseNumber-2'), {
          target: { value: '123456782' },
        })
      })
    })
    await waitFor(() => {
      act(() => {
        chooseFilebyTestId('expirationFile-2', 'expirationFile.png')
      })
    })
    /* submit after entering licenseType, licenseNumber and expirationfile */
    await waitFor(() => {
      fireEvent.submit(screen.getByTestId('saveLicenses'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(1))
  })
})
