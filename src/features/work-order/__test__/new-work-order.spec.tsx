import { fireEvent, render, waitFor } from '@testing-library/react'
import { Providers } from 'providers'
import { PROJECTS, SWO_PROJECT, TRADES, VENDORS } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish, screen, selectOption } from 'utils/test-utils'
import { NewWorkOrderForm } from '../new-work-order'
import { dateFormat } from 'utils/date-time-utils'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setToken } from 'utils/storage.utils'

const chooseFilebyTestId = (id, filename) => {
  const inputEl = screen.getByTestId(id)
  //   // Create dummy file then upload
  const file = new File(['(⌐□_□)'], filename, {
    type: 'image/png',
  })

  userEvent.upload(inputEl, file)

  expect(screen.getByText(new RegExp(filename))).toBeInTheDocument()
}

export const renderNewWorkOrder = async ({
  onClose,
  isOpen,
  projectData,
  swoProject,
  onSubmit,
  setVendorSkillId,
  trades,
  vendors,
}: any) => {
  await render(
    <NewWorkOrderForm
      isWorkOrderCreating={false}
      trades={trades}
      vendors={vendors}
      projectData={projectData}
      isOpen={isOpen}
      onClose={onClose}
      isSuccess={false}
      onSubmit={onSubmit}
      swoProject={swoProject}
      setVendorSkillId={setVendorSkillId}
    />,
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
describe('New Work Order modal test cases', () => {
  test('Verify new work order showing project specific details and rendering form correctly', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    const setVendorSkillId = jest.fn()
    const projectData = PROJECTS?.find(p => p.id === SWO_PROJECT.projectId)
    await renderNewWorkOrder({
      isOpen: true,
      onClose,
      projectData: projectData,
      swoProject: SWO_PROJECT,
      onSubmit,
      setVendorSkillId,
      vendors: VENDORS,
      trades: TRADES,
    })
    expect(screen.getByTestId('clientStart').textContent).toEqual(
      projectData?.clientStartDate ? dateFormat(projectData?.clientStartDate) : 'mm/dd/yy',
    )
    expect(screen.getByTestId('clientEnd').textContent).toEqual(
      projectData?.clientDueDate ? dateFormat(projectData?.clientDueDate) : 'mm/dd/yy',
    )
    //form fields
    expect(screen.getByTestId('profitPercentage')).toBeInTheDocument()
    expect(screen.getByTestId('finalSowAmount')).toBeInTheDocument()
    expect(screen.getByTestId('vendorId')).toBeInTheDocument()
    expect(screen.getByTestId('vendorSkillId')).toBeInTheDocument()
    expect(screen.getByTestId('clientApprovedAmount')).toBeInTheDocument()
    expect(screen.getByTestId('vendorWorkOrderAmount')).toBeInTheDocument()
    expect(screen.getByTestId('percentage')).toBeInTheDocument()
    expect(screen.getByTestId('workOrderStartDate')).toBeInTheDocument()
    expect(screen.getByTestId('workOrderExpectedCompletionDate')).toBeInTheDocument()

    expect(screen.getByTestId('clientApprovedAmount')).toHaveAttribute('disabled')
    expect(screen.getByTestId('vendorWorkOrderAmount')).toHaveAttribute('disabled')

    // Line Items Fields
    expect(screen.getByTestId('addItemsBtn')).toBeInTheDocument()
    expect(screen.getByTestId('uploadWO')).toBeInTheDocument()
    expect(screen.getByTestId('showPriceCheckBox')).toBeInTheDocument()
    //expect(screen.getByTestId('notifyVendorCheckBox')).toBeInTheDocument()
    expect(screen.queryByTestId('showMarkAllIsVerified')).not.toBeInTheDocument()
    expect(screen.queryByTestId('showMarkAllIsComplete')).not.toBeInTheDocument()
    expect(screen.queryByTestId('downloadPdf')).not.toBeInTheDocument()
  })
  /* Commented out. Needs to be reviewed and fixed.
  test('Assigning Line Items to work Order and saving work order. The profit entered on the form will apply to all line items. The sum of Client Amount for Line Items is equal to client amount field in form. The sum of Vendor Amounts for Line Items is equal to vendor amount of the work order', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    const setVendorSkillId = jest.fn()
    const projectData = PROJECTS?.find(p => p.id === SWO_PROJECT.projectId)
    await renderNewWorkOrder({
      isOpen: true,
      onClose,
      projectData: projectData,
      swoProject: SWO_PROJECT,
      onSubmit,
      setVendorSkillId,
      vendors: VENDORS,
      trades: TRADES,
    })

    await selectOption(screen.getByTestId('vendorSkillId'), 'Appliances')
    await selectOption(screen.getByTestId('vendorId'), 'Sibi')
    userEvent.type(screen.getByTestId('percentage'), '10')

    fireEvent.change(screen.getByTestId('workOrderStartDate'), { target: { value: '2022-10-01' } })
    expect((screen.getByTestId('workOrderStartDate') as HTMLInputElement).value).toEqual('2022-10-01')
    fireEvent.change(screen.getByTestId('workOrderExpectedCompletionDate'), { target: { value: '2022-10-05' } })
    expect((screen.getByTestId('workOrderExpectedCompletionDate') as HTMLInputElement).value).toEqual('2022-10-05')
    await act(async () => {
      userEvent.click(screen.getByTestId('addItemsBtn'))
    })
    await waitFor(
      () => {
        expect(screen.getByTestId('checkAllItems')).toBeInTheDocument()
      },
      {
        timeout: 30000,
      },
    )

    userEvent.click(screen.getByTestId('checkAllItems'))
    await act(async () => {
      userEvent.click(screen.getByTestId('saveListItems'))
    })
    expect(screen.getByTestId('cell-0-profit').textContent).toEqual('10%')
    expect(screen.getByTestId('cell-1-profit').textContent).toEqual('10%')

    expect(screen.getByTestId('clientApprovedAmount')).toHaveAttribute('value', '$78')
    expect(screen.getByTestId('vendorWorkOrderAmount')).toHaveAttribute('value', '$70.2')

    act(() => {
      fireEvent.submit(screen.getByTestId('saveWorkOrder'))
    })
    await waitFor(() =>
      expect(onSubmit).toBeCalledWith(
        expect.objectContaining({
          clientApprovedAmount: expect.any(Number),
          invoiceAmount: expect.any(Number),
          percentage: expect.any(Number),
          assignedItems: expect.any(Array),
          vendorId: expect.anything(),
          vendorSkillId: expect.anything(),
          showPrice: expect.any(Boolean),
        }),
      ),
    )
  })*/

  test('Upload SOW in new work order modal and save new work order. By uploading sow, assigned items will be null and CAA and VAA will be enabled fields.', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    const setVendorSkillId = jest.fn()
    const projectData = PROJECTS?.find(p => p.id === SWO_PROJECT.projectId)
    await renderNewWorkOrder({
      isOpen: true,
      onClose,
      projectData: projectData,
      swoProject: SWO_PROJECT,
      onSubmit,
      setVendorSkillId,
      vendors: VENDORS,
      trades: TRADES,
    })

    await selectOption(screen.getByTestId('vendorSkillId'), 'Appliances')
    await selectOption(screen.getByTestId('vendorId'), 'Sibi')

    fireEvent.change(screen.getByTestId('workOrderStartDate'), { target: { value: '2022-10-01' } })
    expect((screen.getByTestId('workOrderStartDate') as HTMLInputElement).value).toEqual('2022-10-01')
    fireEvent.change(screen.getByTestId('workOrderExpectedCompletionDate'), { target: { value: '2022-10-05' } })
    expect((screen.getByTestId('workOrderExpectedCompletionDate') as HTMLInputElement).value).toEqual('2022-10-05')

    chooseFilebyTestId('uploadWO', 'test-sow.png')

    expect(screen.getByTestId('uploadedSOW').textContent).toEqual('test-sow.png')
    userEvent.type(screen.getByTestId('clientApprovedAmount'), '100')

    // commenting it for now as default value now will be 35% for percentageFormatter
    // userEvent.type(screen.getByTestId('percentage'), '10')

    //according to that, 35% of 100 will be 65$
    expect(screen.getByTestId('vendorWorkOrderAmount')).toHaveAttribute('value', '$65')

    act(() => {
      fireEvent.submit(screen.getByTestId('saveWorkOrder'))
    })
    await waitFor(() =>
      expect(onSubmit).toBeCalledWith(
        expect.objectContaining({
          clientApprovedAmount: expect.any(Number),
          invoiceAmount: expect.any(Number),
          percentage: expect.any(Number),
          uploadWO: expect.anything(),
          vendorId: expect.anything(),
          vendorSkillId: expect.anything(),
          showPrice: expect.any(Boolean),
        }),
      ),
    )
  })

  test('When SOW is uploaded, Add new items is disabled. When SOW is removed, Add New Items is enabled.', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    const setVendorSkillId = jest.fn()
    const projectData = PROJECTS?.find(p => p.id === SWO_PROJECT.projectId)
    await renderNewWorkOrder({
      isOpen: true,
      onClose,
      projectData: projectData,
      swoProject: SWO_PROJECT,
      onSubmit,
      setVendorSkillId,
      vendors: VENDORS,
      trades: TRADES,
    })

    chooseFilebyTestId('uploadWO', 'test-sow.png')
    expect(screen.getByTestId('uploadedSOW').textContent).toEqual('test-sow.png')

    expect(screen.getByTestId('addItemsBtn')).toBeDisabled()
    expect(screen.getByTestId('clientApprovedAmount')).toBeEnabled()
    expect(screen.getByTestId('vendorWorkOrderAmount')).toBeEnabled()
  })

  /* Commented out. Needs to be reviewed and fixed.
  test('Assign and Unassign Line Items from Remaining Items Modal. Assigned items from Remaining items modal shows in the Line Items Grid. If any item is unassigned from line items grid, it will be shown back in remaining list.', async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    const setVendorSkillId = jest.fn()
    const projectData = PROJECTS?.find(p => p.id === SWO_PROJECT.projectId)
    await renderNewWorkOrder({
      isOpen: true,
      onClose,
      projectData: projectData,
      swoProject: SWO_PROJECT,
      onSubmit,
      setVendorSkillId,
      vendors: VENDORS,
      trades: TRADES,
    })
    // Open Remaining Items Modal. Assign (check all items). And Save
    await act(async () => {
      userEvent.click(screen.getByTestId('addItemsBtn'))
    })
    await waitFor(
      () => {
        expect(screen.getByTestId('checkAllItems')).toBeInTheDocument()
      },
      {
        timeout: 30000,
      },
    )
    userEvent.click(screen.getByTestId('checkAllItems'))
    await act(async () => {
      userEvent.click(screen.getByTestId('saveListItems'))
    })

    //Assigned Items will be shows in Line Items
    expect(screen.getByTestId('cell-0-sku').textContent).toEqual('sku1')
    expect(screen.getByTestId('cell-1-sku').textContent).toEqual('sku2')

    // Line Item can be removed/unassigned individually or be unassign all icon in header.
    userEvent.click(screen.getByTestId('unassign-0'))
    expect(screen.getByTestId('cell-0-sku').textContent).toEqual('sku2')
    act(() => {
      fireEvent.click(screen.getByTestId('unassign-all'))
    })

    expect(screen.queryByTestId('cell-0-sku')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cell-1-sku')).not.toBeInTheDocument()
    expect(screen.getByText('There is no data to display.')).toBeInTheDocument()

    //unassign items should show in remaining items modal
    //The last assign items will be at the top
    userEvent.click(screen.getByTestId('addItemsBtn'))
    expect(screen.getByTestId('cell-0-sku').textContent).toEqual('sku2')
    expect(screen.getByTestId('cell-1-sku').textContent).toEqual('sku1')
  }) */
})
