import { render } from '@testing-library/react'
import { Providers } from 'providers'
import { PROJECTS } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish, screen, selectOption } from 'utils/test-utils'

export const renderNewWorkOrder = async ({ onClose, isOpen, projectData }: any) => {
  /*await render(
    <NewWorkOrderForm
      projectData={projectData}
      isOpen={isOpen}
      onClose={onClose}
      isSuccess={false}
      onSubmit={() => {}}
      swoProject={}
    />,
    {
      wrapper: Providers,
    },
  )
  await waitForLoadingToFinish()*/
}

jest.setTimeout(150000)
describe('Work Order modal showing work order specific details', () => {
  test('Verify work order details in active state', async () => {
    const onClose = jest.fn()
    const projectData = PROJECTS[0]
    await renderNewWorkOrder({ isOpen: true, onClose, projectData })
    screen.debug(undefined, 1000000000000000000000)
  })
})
