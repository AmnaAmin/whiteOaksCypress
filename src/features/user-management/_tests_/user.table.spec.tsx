import { render, screen } from '@testing-library/react'
import { UserManagement } from 'pages/admin/user-management'
import { Providers } from 'providers'
import { waitForLoadingToFinish } from 'utils/test-utils'

const renderProjectFileters = async () => {
  await render(<UserManagement />, { wrapper: Providers })
  await waitForLoadingToFinish()
}

describe('Given a User Management Table Render properly', () => {
  describe('When the component is mounted', () => {
    test('User Management Should render properly', async () => {
      await renderProjectFileters()
      expect(screen.getByTestId('users').textContent).toEqual('Users')
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('First Name')).toBeInTheDocument()
      expect(screen.getByText('Last Name')).toBeInTheDocument()
      expect(screen.getByText('Account')).toBeInTheDocument()
      expect(screen.getByText('Language')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Created Date')).toBeInTheDocument()
      expect(screen.getByText('Modified By')).toBeInTheDocument()
      expect(screen.getByText('Modified Date')).toBeInTheDocument()
    })
  })
})
