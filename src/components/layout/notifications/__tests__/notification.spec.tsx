/*eslint-disable */
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Providers } from 'providers'
import { WORK_ORDERS, PROJECTS, assignedItems, SWO_PROJECT, DOCUMENTS } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { Notification } from '../notification'
import { setToken } from 'utils/storage.utils'
import { Menu } from '@chakra-ui/react'
import { Header } from 'components/layout/header'
import { BrowserRouter } from 'react-router-dom'
import { TRIGGEREDALERTS } from 'mocks/api/alerts/alerts'
import { formatDistanceToNow } from 'date-fns'

export const renderNotifications = async ({}: any) => {
  await render(
    <BrowserRouter>
      <Menu isOpen={true}>
        <Notification />
      </Menu>
    </BrowserRouter>,
    {
      wrapper: Providers,
    },
  )
  await waitForLoadingToFinish()
}
beforeAll(() => {
  setToken('pc')
})

jest.setTimeout(150000)
describe('Test Alerts', () => {
  test('Test Alerts', async () => {
    await renderNotifications({})
    await waitFor(() => {
      expect(screen.getByTestId('alert-0')).toBeInTheDocument()
      expect(screen.getByTestId('alert-1')).toBeInTheDocument()
      expect(screen.getByTestId('alert-2')).toBeInTheDocument()

      expect(screen.getByTestId('alert-0-title').textContent).toEqual('Project')
      expect(screen.getByTestId('alert-0-message').textContent).toEqual(`Project 'projectType' Changed from  to `)
      expect(screen.getByTestId('alert-0-time').textContent).toEqual(
        formatDistanceToNow(new Date('2023-02-16T08:22:25Z')) + ' ago',
      )
      expect(screen.getByTestId('alert-1-title').textContent).toEqual('Project')
      expect(screen.getByTestId('alert-1-message').textContent).toEqual(`Project 'projectType' Changed from  to `)
      expect(screen.getByTestId('alert-1-time').textContent).toEqual(
        formatDistanceToNow(new Date('2023-02-13T08:22:26Z')) + ' ago',
      )
      expect(screen.getByTestId('alert-2-title').textContent).toEqual('Project')
      expect(screen.getByTestId('alert-2-message').textContent).toEqual(`Project 'projectType' Changed from  to `)
      expect(screen.getByTestId('alert-2-time').textContent).toEqual(
        formatDistanceToNow(new Date('2023-01-16T08:22:26Z')) + ' ago',
      )
    })
  })
})
/*eslint-disable */
