import { render } from '@testing-library/react'
import { Providers } from 'providers'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { ProjectTypeTable } from './project-type-table'

const renderProjectType = async () => {
  await render(<ProjectTypeTable />, { wrapper: Providers })
  await waitForLoadingToFinish()
}

describe('Project Type table', () => {
  describe('When the component is mounted', () => {
    test('Project-Type table Should render properly', async () => {
      await renderProjectType()
      expect(screen.queryByText('Type')).toBeInTheDocument()
      expect(screen.queryByText('Created By')).toBeInTheDocument()
      expect(screen.queryByText('Created Date')).toBeInTheDocument()
      expect(screen.queryByText('Modified By')).toBeInTheDocument()
      expect(screen.queryByText('Modified Date')).toBeInTheDocument()

      // Update date strings in your assertions
      expect(screen.getByRole('gridcell', { name: 'Other' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: 'DevTek' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '11/01/2020' })).toBeInTheDocument() // Updated date format
      expect(screen.getByRole('gridcell', { name: 'admin' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '04/18/2021' })).toBeInTheDocument() // Updated date format
    })
  })
})
