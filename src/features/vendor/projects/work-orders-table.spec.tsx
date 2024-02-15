import { render, screen } from '@testing-library/react'
import { Providers } from 'providers'
import { waitForLoadingToFinish } from 'utils/test-utils'
import { WorkOrdersTable } from '../vendor-work-order/work-orders-table'
import { PROJECT } from './data'

const renderWorkOrderData = async () => {
  const projectData = PROJECT
  await render(<WorkOrdersTable projectData={projectData as any} />, { wrapper: Providers })
  await waitForLoadingToFinish()
}

describe('Vendor Work Orders Table', () => {
  describe('When the component is mounted', () => {
    test('Vendor-Project table Should render properly', async () => {
      await renderWorkOrderData()
      // Work Order Columns
      expect(screen.queryByText('Work Order ID')).toBeInTheDocument()
      expect(screen.queryByText('WO Status')).toBeInTheDocument()
      expect(screen.queryByText('Skill')).toBeInTheDocument()
      expect(screen.queryByText('Name')).toBeInTheDocument()
      expect(screen.queryByText('Email')).toBeInTheDocument()
      expect(screen.queryByText('Phone')).toBeInTheDocument()
      expect(screen.queryByText('Final Invoice')).toBeInTheDocument()
      expect(screen.queryByText('Issue')).toBeInTheDocument()
      expect(screen.queryByText('Expected Completion')).toBeInTheDocument()
      expect(screen.queryByText('% Completion')).toBeInTheDocument()

      // Completed Work Order Row
      expect(screen.getByRole('gridcell', { name: 'General Labor' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '360 Management Services' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '6269' })).toBeInTheDocument()
      // Cancelled Record Data should not be shown
      expect(screen.queryByRole('gridcell', { name: '6268' })).not.toBeInTheDocument()
      expect(screen.queryByRole('gridcell', { name: 'Electrical' })).not.toBeInTheDocument()
    })
  })
})
