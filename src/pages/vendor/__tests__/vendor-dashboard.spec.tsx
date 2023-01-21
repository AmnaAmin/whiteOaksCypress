import App from 'App'
import { render, screen, waitForLoadingToFinish } from '../../../utils/test-utils'

jest.setTimeout(150000)

describe('Dashboard Test Cases', () => {
  test('Dasbhoard should render widgets properly', async () => {
    render(<App />, { route: '/vendorDashboard' })

    await waitForLoadingToFinish()

    expect(global.window.location.pathname).toEqual('/vendorDashboard')
    //await waitForLoadingToFinish()

    expect(screen.getByText(/Score/)).toBeInTheDocument()
    expect(screen.getByTestId('vendor-score').textContent).toEqual('1')

    expect(screen.getByTestId('coi-wc-expiration-date')).toBeInTheDocument()
    expect(screen.getByTestId('coi-wc-expiration-date').textContent).toEqual('06/19/2021')

    // screen.debug(undefined, 100000)
    expect(screen.getByTestId('Electrical')).toBeInTheDocument()
    expect(screen.getByTestId('Electrical').textContent).toEqual('01/10/2022')

    // expect(screen.getByTestId('summary-active')).toBeInTheDocument()
    // expect(screen.getByTestId('summary-active').textContent).toEqual('1')

    // expect(screen.getByTestId('summary-pastDue')).toBeInTheDocument()
    // expect(screen.getByTestId('summary-pastDue').textContent).toEqual('9')

    // expect(screen.getByTestId('summary-completedAndInvoiced')).toBeInTheDocument()
    // expect(screen.getByTestId('summary-completedAndInvoiced').textContent).toEqual('')

    // expect(screen.getByTestId('summary-notInvoiced')).toBeInTheDocument()
    // expect(screen.getByTestId('summary-notInvoiced').textContent).toEqual('')

    // expect(screen.getByTestId('summary-upcomingInvoiceTotal')).toBeInTheDocument()
    // expect(screen.getByTestId('summary-upcomingInvoiceTotal').textContent).toEqual('$0.00')
  })
})
