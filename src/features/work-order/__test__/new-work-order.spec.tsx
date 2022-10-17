import { render } from '@testing-library/react'
import { Providers } from 'providers'
import { PROJECTS, SWO_PROJECT } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish, screen, selectOption } from 'utils/test-utils'
import { NewWorkOrderForm } from '../new-work-order'
import { dateFormat } from 'utils/date-time-utils'

export const renderNewWorkOrder = async ({ onClose, isOpen, projectData, swoProject, onSubmit }: any) => {
  await render(
    <NewWorkOrderForm
      projectData={projectData}
      isOpen={isOpen}
      onClose={onClose}
      isSuccess={false}
      onSubmit={onSubmit}
      swoProject={swoProject}
    />,
    {
      wrapper: Providers,
    },
  )
  await waitForLoadingToFinish()
}

jest.setTimeout(150000)
describe('New Work Order modal showing project specific details', () => {
  test('Verify work order details in active state', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    const projectData = PROJECTS?.find(p => p.id === SWO_PROJECT.projectId)
    await renderNewWorkOrder({
      isOpen: true,
      onClose,
      projectData: projectData,
      swoProject: { SWO_PROJECT },
      onSubmit,
    })
    expect(screen.getByTestId('clientStart').textContent).toEqual(
      projectData?.clientStartDate ? dateFormat(projectData?.clientStartDate) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('clientEnd').textContent).toEqual(
      projectData?.clientDueDate ? dateFormat(projectData?.clientDueDate) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('profitPercentage')).toBeInTheDocument()
    expect(screen.getByTestId('finalSowAmount')).toBeInTheDocument()
    expect(screen.getByTestId('clientApprovedAmount')).toHaveAttribute('disabled')
    expect(screen.getByTestId('vendorWorkOrderAmount')).toHaveAttribute('disabled')
    await selectOption(screen.getByTestId('vendorSkillId'), 'Appliances')
    await selectOption(screen.getByTestId('vendorId'), 'WhiteOaks Aligned')
    screen.debug(undefined, 10000000000000000000000000000000000)
  })
})

describe('New Work Order modal showing project specific details', () => {})
