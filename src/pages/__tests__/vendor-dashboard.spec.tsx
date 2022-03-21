import App from 'App'
import { render, screen } from '../../utils/test-utils'

describe('Vendor Score Test Cases', () => {
  test('Vendor score ', async () => {
    await render(<App />, { route: '/vendorDashboard' })
    expect(global.window.location.pathname).toEqual('/vendorDashboard')
    expect(screen.getByText(/Vendor Score/)).toBeInTheDocument()
    expect(screen.getByTestId('vendor-score').textContent).toEqual('1')
  })

  test('Insurance test', async () => {
    await render(<App />, { route: '/vendorDashboard' })
    expect(screen.getByTestId('coi-wc-expiration-date')).toBeInTheDocument()
    expect(screen.getByTestId('coi-wc-expiration-date').textContent).toEqual('06/19/2021')
  })

  test('License test', async () => {
    await render(<App />, { route: '/vendorDashboard' })
    expect(screen.getByTestId('Electrical')).toBeInTheDocument()
    expect(screen.getByTestId('Electrical').textContent).toEqual('01/10/2022')
  })
})

describe('Vendor summary Test Cases', () => {
  test('Vendor summary active', async () => {
    await render(<App />, { route: '/vendorDashboard' })
    expect(global.window.location.pathname).toEqual('/vendorDashboard')
    expect(screen.getByTestId('summary-active')).toBeInTheDocument()
    expect(screen.getByTestId('summary-active').textContent).toEqual('1')
  })

  test('Vendor summary ', async () => {
    await render(<App />, { route: '/vendorDashboard' })
    expect(global.window.location.pathname).toEqual('/vendorDashboard')
    expect(screen.getByTestId('summary-pastDue')).toBeInTheDocument()
    expect(screen.getByTestId('summary-pastDue').textContent).toEqual('9')
  })

  test('Vendor summary completed and inoviced', async () => {
    await render(<App />, { route: '/vendorDashboard' })
    expect(global.window.location.pathname).toEqual('/vendorDashboard')
    expect(screen.getByTestId('summary-completedAndInvoiced')).toBeInTheDocument()
    expect(screen.getByTestId('summary-completedAndInvoiced').textContent).toEqual('')
  })

  test('Vendor summary not inoviced', async () => {
    await render(<App />, { route: '/vendorDashboard' })
    expect(global.window.location.pathname).toEqual('/vendorDashboard')
    expect(screen.getByTestId('summary-notInvoiced')).toBeInTheDocument()
    expect(screen.getByTestId('summary-notInvoiced').textContent).toEqual('')
  })

  test('Vendor summary upcomming', async () => {
    await render(<App />, { route: '/vendorDashboard' })
    expect(global.window.location.pathname).toEqual('/vendorDashboard')
    expect(screen.getByTestId('summary-upcomingInvoiceTotal')).toBeInTheDocument()
    expect(screen.getByTestId('summary-upcomingInvoiceTotal').textContent).toEqual('$0.00')
  })
})
