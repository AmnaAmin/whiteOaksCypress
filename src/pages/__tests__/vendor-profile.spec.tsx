import { render, screen } from 'utils/test-utils'
import { fireEvent, waitFor, render as directRender } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { useVendorProfile } from 'utils/vendor-details'
import { QueryClient, QueryClientProvider } from 'react-query'
import { act } from 'react-dom/test-utils'
import user from '@testing-library/user-event'
import App from 'App'
import { DetailsForm } from '../../features/vendor-details/details'
import { VENDOR_DATA } from '../../mocks/api/vendor-dashboard/data'

const queryClient = new QueryClient()
const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

describe('Vendor Profile Test Cases', () => {
  test('App should redirect to /vendors', async () => {
    await render(<App />, { route: '/vendors' })

    expect(global.window.location.pathname).toEqual('/vendors')
  })

  test('Vendor details opens details tab', async () => {
    await render(<App />, { route: '/vendors' })

    const openTab = screen.getByRole('tab', { selected: true })
    expect(openTab.innerHTML).toEqual('Details')
  })

  it('Vendor Details API should return data', async () => {
    const { result, waitFor } = renderHook(() => useVendorProfile(258), { wrapper })

    await waitFor(() => {
      return expect(result?.current?.data?.id).not.toBeUndefined()
    })
  })

  it('Vendor Business name is not empty/null', async () => {
    await render(<App />, { route: '/vendors' })

    const businessName = screen.getByTestId('businessName')
    expect(businessName.innerHTML).not.toEqual('')
  })

  it('Vendor Street Address is not empty/null', async () => {
    await render(<App />, { route: '/vendors' })

    const streetAddress = screen.getByTestId('streetAddress')
    expect(streetAddress.innerHTML).not.toEqual('')
  })

  it('Form renders field', async () => {
    await render(<App />, { route: '/vendors' })

    const primaryContact = screen.getByTestId('primaryContact')
    expect(primaryContact).toBeInTheDocument()
  })

  it('Validating primary contact field', async () => {
    const mockSave = jest.fn()
    directRender(<DetailsForm vendorProfileData={VENDOR_DATA} submitForm={mockSave} />)
    act(() => {
      fireEvent.input(screen.getByTestId('primaryContact'), {
        target: {
          value: '',
        },
      })

      fireEvent.submit(screen.getByTestId('saveDetails'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(0))
  })

  it('Validating business phoneNumber field', async () => {
    const mockSave = jest.fn()
    directRender(<DetailsForm vendorProfileData={VENDOR_DATA} submitForm={mockSave} />)
    act(() => {
      fireEvent.input(screen.getByTestId('businessPhoneNumber'), {
        target: {
          value: '',
        },
      })

      fireEvent.submit(screen.getByTestId('saveDetails'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(0))
  })

  it('Validating primary email field', async () => {
    const mockSave = jest.fn()
    directRender(<DetailsForm vendorProfileData={VENDOR_DATA} submitForm={mockSave} />)
    act(() => {
      fireEvent.input(screen.getByTestId('primaryEmail'), {
        target: {
          value: '',
        },
      })

      fireEvent.submit(screen.getByTestId('saveDetails'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(0))
  })

  it('Save success with default values', async () => {
    const mockSave = jest.fn()
    directRender(<DetailsForm vendorProfileData={VENDOR_DATA} submitForm={mockSave} />)
    act(() => {
      fireEvent.submit(screen.getByTestId('saveDetails'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(1))
  })
})
