import { render, screen } from 'utils/test-utils'
import App from 'App'

describe('Vendor Dashboard Test Cases', () => {
  test('Render app should redirect to /vendorDashboard', async () => {
    await render(<App />, { route: '/vendorDashboard' })

    expect(global.window.location.pathname).toEqual('/vendorDashboard')

    // Check Vendor Score card render properly
    expect(screen.getByText(/Vendor Score/)).toBeInTheDocument()
    expect(screen.getByTestId('vendor-score').textContent).toEqual('1')

    // screen.debug(undefined, 100000);
  })
})
