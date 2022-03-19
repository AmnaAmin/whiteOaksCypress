import { render, screen } from 'utils/test-utils'
import { fireEvent, waitFor, render as directRender } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { useTrades } from 'utils/vendor-details'
import { QueryClient, QueryClientProvider } from 'react-query'
import { act } from 'react-dom/test-utils'
import App from 'App'
import { VENDOR_DATA } from '../../mocks/api/vendor-dashboard/data'
import { VENDOR_SKILLS } from '../../mocks/api/vendor-profile/data'
import { TradeForm } from '../../features/vendor-details/trades'

const queryClient = new QueryClient()
const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

describe('Vendor Profile Trade Test Cases', () => {
  it('Trade API should return data', async () => {
    const { result, waitFor } = renderHook(() => useTrades(), { wrapper })

    await waitFor(() => {
      return expect(result?.current?.data).not.toBeUndefined()
    })
  })

  it('Trade Data is rendered', async () => {
    await render(<App />, { route: '/vendors' })

    const tradetab = screen.getByTestId('tradetab')
    act(() => {
      fireEvent.click(tradetab)
    })

    await waitFor(() => {
      expect(screen.getAllByTestId(/^tradeChecks/).length).toBeGreaterThan(0)
      const openTab = screen.getByRole('tab', { selected: true })
      expect(openTab.innerHTML).toEqual('Trade')
    })
  })

  it('Trade Data is rendered', async () => {
    await render(<App />, { route: '/vendors' })

    const tradetab = screen.getByTestId('tradetab')
    act(() => {
      fireEvent.click(tradetab)
    })
    await waitFor(() => {
      expect(screen.getAllByTestId(/^tradeChecks/).length).toBeGreaterThan(0)
    })
  })

  it('Trade options can be toggled', async () => {
    await render(<App />, { route: '/vendors' })

    const tradeOptions = screen.getAllByTestId(/^tradeChecks/)
    /* based on mock data, first option is unchecked */
    expect(tradeOptions[0].querySelector('.checkboxButton')).not.toHaveAttribute('data-checked')
    act(() => {
      fireEvent.click(tradeOptions[0])
    })
    await waitFor(() => {
      expect(tradeOptions[0].querySelector('.checkboxButton')).toHaveAttribute('data-checked')
    })
    act(() => {
      fireEvent.click(tradeOptions[0])
    })
    await waitFor(() => {
      expect(tradeOptions[0].querySelector('.checkboxButton')).not.toHaveAttribute('data-checked')
    })
  })

  it('Vendor skills options are selected', async () => {
    await render(<App />, { route: '/vendors' })
    const skills = VENDOR_DATA.vendorSkills.map(vs => vs.id)
    skills.forEach(s => {
      expect(screen.getByTestId(`tradeChecks.${s}`).querySelector('.checkboxButton')).toHaveAttribute('data-checked')
    })
  })

  it('Trade form saves successfully', async () => {
    const mockSave = jest.fn()
    directRender(<TradeForm vendorProfileData={VENDOR_DATA} submitForm={mockSave} trades={VENDOR_SKILLS} />)
    act(() => {
      fireEvent.submit(screen.getByTestId('saveVendorSkills'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(1))
  })
})
