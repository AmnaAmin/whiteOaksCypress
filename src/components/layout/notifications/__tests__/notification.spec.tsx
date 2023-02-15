/*eslint-disable */
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Providers } from 'providers'
import { WORK_ORDERS, PROJECTS, assignedItems, SWO_PROJECT, DOCUMENTS } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { Notification } from '../notification'
import { setToken } from 'utils/storage.utils'

export const renderNotifications = async ({ onSave, onClose, workOrder, projectData }: any) => {
  await render(<Notification />, {
    wrapper: Providers,
  })

  await waitForLoadingToFinish()
}
beforeAll(() => {
  setToken('pc')
})

jest.setTimeout(150000)
describe('Work Order modal showing work order specific details for PC(Super set of PC) users', () => {
  test('Verify work order modal content for active/pastdue work orders. Verify all completed items can be verified. Save call contains work order start date, expected completion and completed dates', async () => {})
  test('Verify work order details in completed state', async () => {})
})
/*eslint-disable */
