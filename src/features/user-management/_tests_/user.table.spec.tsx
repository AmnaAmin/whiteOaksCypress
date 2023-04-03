import { render, screen } from '@testing-library/react'
import { Providers } from 'providers'
import { waitForLoadingToFinish } from 'utils/test-utils'
import { DevtekUsersTable } from '../devtek-users-table'
import { VendorUsersTable } from '../vendor-users-table'
import { WOAUsersTable } from '../woa-users-table'

const renderWOAUsersTable = async () => {
  await render(<WOAUsersTable />, { wrapper: Providers })
  await waitForLoadingToFinish()
}

const renderDevtekUsers = async () => {
  await render(<DevtekUsersTable />, { wrapper: Providers })
  await waitForLoadingToFinish()
}

const renderVendorUsers = async () => {
  await render(<VendorUsersTable />, { wrapper: Providers })
  await waitForLoadingToFinish()
}

describe('Given a User Management Table Render properly', () => {
  describe('When the component is mounted', () => {
    test('User Management Should render properly WOA Users Table', async () => {
      await renderWOAUsersTable()
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

  describe('When the component is mounted', () => {
    test('User Management Should render properly Devtek Users', async () => {
      await renderDevtekUsers()
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

  describe('When the component is mounted', () => {
    test('User Management Should render properly Vendor Users', async () => {
      await renderVendorUsers()
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
