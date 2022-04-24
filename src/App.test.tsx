import { render } from 'utils/test-utils'
import App from './App'

jest.setTimeout(30000)
describe('Application level Test cases', () => {
  test('Render app should redirect to /vendorDashboard', async () => {
    await render(<App />, { route: '/' })

    expect(global.window.location.pathname).toEqual('/vendorDashboard')
  })
})
