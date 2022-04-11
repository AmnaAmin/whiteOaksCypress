import { render, screen } from 'utils/test-utils'
import { fireEvent, waitFor, render as directRender } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import App from 'App'
import { VENDOR_DATA } from 'mocks/api/vendor-dashboard/data'
import { MARKETS } from 'mocks/api/vendor-profile/data'
import { MarketForm } from 'features/vendor-details/markets'

jest.setTimeout(30000)

describe('Vendor Profile Market Test Cases', () => {
  it('Market Data is rendered', async () => {
    await render(<App />, { route: '/vendors' })

    const markettab = screen.getByTestId('markettab')
    act(() => {
      fireEvent.click(markettab)
    })
    await waitFor(() => {
      const openTab = screen.getByRole('tab', { selected: true })
      expect(openTab.innerHTML).toEqual('Market')
      expect(screen.getAllByTestId(/^marketChecks/).length).toBeGreaterThan(0)
    })
  })

  it('Market options can be toggled', async () => {
    await render(<App />, { route: '/vendors' })

    const marketOptions = screen.getAllByTestId(/^marketChecks/)
    /* based on marketOptions data, first option is unchecked */
    expect(marketOptions[0].querySelector('.checkboxButton')).not.toHaveAttribute('data-checked')
    act(() => {
      fireEvent.click(marketOptions[0])
    })
    await waitFor(() => {
      expect(marketOptions[0].querySelector('.checkboxButton')).toHaveAttribute('data-checked')
    })
    act(() => {
      fireEvent.click(marketOptions[0])
    })
    await waitFor(() => {
      expect(marketOptions[0].querySelector('.checkboxButton')).not.toHaveAttribute('data-checked')
    })
  })

  it('Market skills options are selected', async () => {
    await render(<App />, { route: '/vendors' })
    const markets = VENDOR_DATA.markets.map(m => m.id)
    markets.forEach(m => {
      expect(screen.getByTestId(`marketChecks.${m}`).querySelector('.checkboxButton')).toHaveAttribute('data-checked')
    })
  })

  it('Market form saves successfully', async () => {
    const mockSave = jest.fn()
    directRender(<MarketForm vendorProfileData={VENDOR_DATA} submitForm={mockSave} markets={MARKETS} />)
    act(() => {
      fireEvent.submit(screen.getByTestId('saveMarkets'))
    })
    await waitFor(() => expect(mockSave).toBeCalledTimes(1))
  })
})
