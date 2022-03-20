import { render } from 'utils/test-utils'
import App from 'App'

describe('Vendor Projects Test Cases', () => {
  test('App should redirect to /projects', async () => {
    await render(<App />, { route: '/projects' })

    expect(global.window.location.pathname).toEqual('/projects')

    // screen.debug(undefined, 100000);
  })
})
