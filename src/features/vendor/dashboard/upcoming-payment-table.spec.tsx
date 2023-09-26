import { render, screen } from '@testing-library/react'
import { Providers } from 'providers'
import { waitForLoadingToFinish } from 'utils/test-utils'
import { UpcomingPaymentTable } from './upcoming-payment-table'

const renderProjectType = async () => {
  await render(<UpcomingPaymentTable />, { wrapper: Providers })
  await waitForLoadingToFinish()
}

describe('Upcoming Payment Table Type table', () => {
  describe('When the component is mounted', () => {
    test('Upcoming Payment Table Should render properly', async () => {
      await renderProjectType()

      expect(screen.queryByText('Project ID')).toBeInTheDocument()
      expect(screen.queryByText('WO Status')).toBeInTheDocument()
      expect(screen.queryByText('WO ID')).toBeInTheDocument()
      expect(screen.queryByText('Address')).toBeInTheDocument()
      expect(screen.queryByText('Trade')).toBeInTheDocument()
      expect(screen.queryByText('Due Date WO')).toBeInTheDocument()
      expect(screen.queryByText('Expected Payment')).toBeInTheDocument()
      expect(screen.queryByText('Invoice Date')).toBeInTheDocument()
      expect(screen.queryByText('Final Invoice')).toBeInTheDocument()

      expect(screen.getByRole('gridcell', { name: '5525' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: 'Invoiced' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '13466' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '7513 MOURNING DOVE WAY' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: 'Cabinets' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '02/01/2023' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '12/22/2022' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '12/01/2022' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '$543.00' })).toBeInTheDocument()
    })
  })
})
