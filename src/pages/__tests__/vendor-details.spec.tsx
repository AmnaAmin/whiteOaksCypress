import { render, screen } from 'utils/test-utils'
import { fireEvent, waitFor, render as directRender } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { useVendorProfile, useTrades } from 'utils/vendor-details'
import { QueryClient, QueryClientProvider } from 'react-query'
import { act } from 'react-dom/test-utils'
import App from 'App'
import { DetailsForm } from '../../features/vendor-details/details'
import { VENDOR_DATA } from '../../mocks/api/vendor-dashboard/data'

const queryClient = new QueryClient()
const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

/* Details Tab Test Cases */

describe('Vendor Profile Test Cases', () => {
  test('App should redirect to /vendors with default details tab open', async () => {
    await render(<App />, { route: '/vendors' })

    expect(global.window.location.pathname).toEqual('/vendors')
    const openTab = screen.getByRole('tab', { selected: true })
    expect(openTab.innerHTML).toEqual('Details')
  })

  it('Vendor details is not empty/null', async () => {
    await render(<App />, { route: '/vendors' })

    const streetAddress = screen.getByTestId('streetAddress')
    const businessName = screen.getByTestId('businessName')
    expect(businessName.innerHTML).not.toEqual('')
    expect(streetAddress.innerHTML).not.toEqual('')
  })

  it('Form renders field', async () => {
    await render(<App />, { route: '/vendors' })

    const primaryContact = screen.getByTestId('primaryContact')
    const businessPhoneNumber = screen.getByTestId('businessPhoneNumber')
    const primaryEmail = screen.getByTestId('primaryEmail')
    expect(primaryContact).toBeInTheDocument()
    expect(businessPhoneNumber).toBeInTheDocument()
    expect(primaryEmail).toBeInTheDocument()
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
