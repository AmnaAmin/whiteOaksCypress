import { render } from '@testing-library/react'
import { Providers } from 'providers'
import { BrowserRouter } from 'react-router-dom'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { ProjectsTable } from './projects-table'

const renderProjectType = async () => {
  await render(
    <BrowserRouter>
      <ProjectsTable />
    </BrowserRouter>,
    { wrapper: Providers },
  )
  await waitForLoadingToFinish()
}

describe('Vendor Project Table', () => {
  describe('When the component is mounted', () => {
    test('Vendor-Project table Should render properly', async () => {
      await renderProjectType()

      expect(screen.queryByText('Project ID')).toBeInTheDocument()
      expect(screen.queryByText('WO Status')).toBeInTheDocument()
      expect(screen.queryByText('WO ID')).toBeInTheDocument()
      expect(screen.queryByText('Address')).toBeInTheDocument()
      expect(screen.queryByText('Trade')).toBeInTheDocument()
      expect(screen.queryByText('Due Date WO')).toBeInTheDocument()
      expect(screen.queryByText('Expected Payment Date')).toBeInTheDocument()

      expect(screen.getByRole('gridcell', { name: '5213' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: 'Invoiced' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '2101 Southridge Drive' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: 'Painter' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '11/06/2022' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '11/25/2022' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '12583' })).toBeInTheDocument()
      //screen.debug(undefined, 10000)
    })
  })
})
