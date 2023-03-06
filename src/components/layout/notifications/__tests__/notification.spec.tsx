/*eslint-disable */
import { render, waitFor } from '@testing-library/react'
import { Providers } from 'providers'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { Notification } from '../notification'
import { setToken } from 'utils/storage.utils'
import { Menu } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

export const renderNotifications = async ({}: any) => {
  const setNavigating = jest.fn()
  const setAlertCount = jest.fn()
  await render(
    <BrowserRouter>
      <Menu isOpen={true}>
        <Notification setNavigating={setNavigating} setAlertCoun={setAlertCount} />
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
describe('Bell Notification Test Cases', () => {
  test('Notifications show up in the bell menu. They are ordered on the basis of most recent notifications.', async () => {
    await renderNotifications({})

    await waitFor(() => {
      expect(screen.getByTestId('alert-0')).toBeInTheDocument()
      expect(screen.getByTestId('alert-1')).toBeInTheDocument()
      expect(screen.getByTestId('alert-2')).toBeInTheDocument()

      expect(screen.getByTestId('alert-0-title').textContent).toEqual('Project')
      expect(screen.getByTestId('alert-0-message').textContent).toEqual(`Project 'projectType' Changed from  to `)
      expect(screen.getByTestId('alert-0-time').textContent).toEqual(
        formatDistanceToNow(new Date('2023-01-16T08:22:26Z')) + ' ago',
      )
      expect(screen.getByTestId('alert-1-title').textContent).toEqual('Project')
      expect(screen.getByTestId('alert-1-message').textContent).toEqual(`Project 'projectType' Changed from  to `)
      expect(screen.getByTestId('alert-1-time').textContent).toEqual(
        formatDistanceToNow(new Date('2023-02-13T08:22:26Z')) + ' ago',
      )
      expect(screen.getByTestId('alert-2-title').textContent).toEqual('Project')
      expect(screen.getByTestId('alert-2-message').textContent).toEqual(`Project 'projectType' Changed from  to `)
      expect(screen.getByTestId('alert-2-time').textContent).toEqual(
        formatDistanceToNow(new Date('2023-02-16T08:22:25Z')) + ' ago',
      )
    })
  })
})
/*eslint-disable */
