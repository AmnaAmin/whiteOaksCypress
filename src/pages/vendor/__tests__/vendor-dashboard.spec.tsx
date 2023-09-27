import { render, screen } from '@testing-library/react'
import { Providers } from 'providers'
import { setToken } from 'utils/storage.utils'
import { BrowserRouter } from 'react-router-dom'
import { waitForLoadingToFinishLabelOnly } from 'utils/test-utils'
import Dashboard from '../dashboard'
import { currencyFormatter } from 'utils/string-formatters'
import { PROJECT_FILTER_CARDS } from 'features/vendor/projects/project-filter-mock'

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
    // expect(screen.getByRole('gridcell', { name: '$543.00' })).toBeInTheDocument()
    expect(screen.getByTestId('upcoming-payments').textContent).toEqual(
      currencyFormatter(PROJECT_FILTER_CARDS.find(wo => wo.label === 'upcomingInvoiceTotal')?.count as number),
    )
    //expect(screen.getByTestId('vendor-score').textContent).toEqual(VENDOR_DATA.score?.toLocaleString())
  })
})
