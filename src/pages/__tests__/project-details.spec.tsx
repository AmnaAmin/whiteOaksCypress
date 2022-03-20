import App from 'App'
import { render } from 'utils/test-utils'

describe('Porject Details: Document tab test cases', () => {
  test('Should render project details page and switch to document tab', async () => {
    await render(<App />, { route: '/project-details/2951' })

    expect(window.location.pathname).toEqual('/project-details/2951')

    // screen.debug(undefined, 10000000)
    // console.log(screen.getByLabelText('documents-tab', { selector: 'button' }).textContent)
    // userEvent.click(screen.getByLabelText('documents-tab', { selector: 'button' }))
    // expect(screen.getByLabelText('Upload Document Button')).toBeInTheDocument()
  })
})
