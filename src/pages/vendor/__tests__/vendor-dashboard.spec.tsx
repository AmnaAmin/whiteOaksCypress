import { render, screen } from '@testing-library/react'
import { Providers } from 'providers'
import { setToken } from 'utils/storage.utils'
import { VendorScore } from 'components/VendorScore/vendor-score'
import { BrowserRouter } from 'react-router-dom'
import { waitForLoadingToFinishLabelOnly } from 'utils/test-utils'
import Dashboard from '../dashboard'
import { VENDOR_DATA, VENDOR_WO_CARD } from 'mocks/api/vendor-dashboard/data'
import { currencyFormatter } from 'utils/string-formatters'

export const renderNewWorkOrder = async () => {
  await render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>,
    {
      wrapper: Providers,
    },
  )
  await waitForLoadingToFinishLabelOnly()
}

beforeAll(() => {
  setToken('vendor')
})

jest.setTimeout(150000)
describe('Verify Vendor Dashboard', () => {
  test('Verify vendor score and upcoming payments', async () => {
    await renderNewWorkOrder()
    expect(screen.queryByText('Final Invoice')).toBeInTheDocument()
    expect(screen.getByRole('gridcell', { name: '$543.00' })).toBeInTheDocument()
    expect(screen.getByTestId('upcoming-payments').textContent).toEqual(
      currencyFormatter(VENDOR_WO_CARD.find(wo => wo.label === 'upcomingInvoiceTotal')?.count as number),
    )
    expect(screen.getByTestId('vendor-score').textContent).toEqual(VENDOR_DATA.score?.toLocaleString())
  })
})
