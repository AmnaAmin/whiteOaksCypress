import { fireEvent, render, waitFor } from '@testing-library/react'
import { Providers } from 'providers'
import { LINEITEMS, SWO_PROJECT } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { setToken } from 'utils/storage.utils'
import RemainingItemsModal from '../details/remaining-items-modal'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

export const renderRemainingItems = async ({ onClose, setAssignedItems, swoProject, isOpen }: any) => {
  await render(
    <RemainingItemsModal
      isOpen={isOpen}
      onClose={onClose}
      setAssignedItems={setAssignedItems}
      remainingItems={LINEITEMS}
      isLoading={false}
      swoProject={swoProject}
      isAssignmentAllowed={true}
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
describe('Remaining Items test Cases', () => {
  test('Remaining Items rendered in the table', async () => {
    const onClose = jest.fn()
    const setAssignedItems = jest.fn()
    await renderRemainingItems({
      isOpen: true,
      onClose,
      swoProject: SWO_PROJECT,
      setAssignedItems,
    })
    expect(screen.getByTestId('add-row-btn')).toBeInTheDocument()
    expect(screen.getByTestId('delete-row-button')).toBeInTheDocument()
    expect(screen.getByTestId('cell-0-sku').textContent).toEqual('sku1')
    expect(screen.getByTestId('cell-0-productName').textContent).toEqual('Electrical')
    expect(screen.getByTestId('cell-0-description').textContent).toEqual('Electrical')
    expect(screen.getByTestId('cell-0-unitPrice').textContent).toEqual('$22.00')
    expect(screen.getByTestId('cell-0-quantity').textContent).toEqual('2')
    expect(screen.getByTestId('cell-0-totalPrice').textContent).toEqual('$44.00')
    expect(screen.getByTestId('cell-1-sku').textContent).toEqual('sku2')
    expect(screen.getByTestId('cell-1-productName').textContent).toEqual('Windows/Doors')
    expect(screen.getByTestId('cell-1-description').textContent).toEqual('Windows/Doors')
    expect(screen.getByTestId('cell-1-unitPrice').textContent).toEqual('$34.00')
    expect(screen.getByTestId('cell-1-quantity').textContent).toEqual('1')
    expect(screen.getByTestId('cell-1-totalPrice').textContent).toEqual('$34.00')
  })
  test('Add new row will add an empty row at the top of the table. Remove Button will remove the row from that index. On Save required fields are', async () => {
    const onClose = jest.fn()
    const setAssignedItems = jest.fn()
    await renderRemainingItems({
      isOpen: true,
      onClose,
      swoProject: SWO_PROJECT,
      setAssignedItems,
    })

    await userEvent.click(screen.getByTestId('add-row-btn'))

    expect(screen.getByTestId('input-0-sku')).toHaveAttribute('value', '')
    expect(screen.getByTestId('input-0-productName')).toHaveAttribute('value', '')
    expect(screen.getByTestId('input-0-description')).toHaveAttribute('value', '')
    expect(screen.getByTestId('input-0-unitPrice')).toHaveAttribute('value', '')
    expect(screen.getByTestId('input-0-quantity')).toHaveAttribute('value', '')
    expect(screen.getByTestId('cell-0-totalPrice').textContent).toEqual('$0.00')

    await act(async () => {
      await userEvent.click(screen.getByTestId('saveListItems'))
    })
    expect(screen.getAllByText('*Required')).toHaveLength(4)
    await userEvent.click(screen.getByTestId('remove-0'))
    // When new item row is removed, index 0 will contain the existing data first row.
    expect(screen.getByTestId('cell-0-sku').textContent).toEqual('sku1')
    expect(screen.getByTestId('cell-0-productName').textContent).toEqual('Electrical')
    expect(screen.getByTestId('cell-0-description').textContent).toEqual('Electrical')
  })

  test('Delete Row will Open Confirmation', async () => {
    const onClose = jest.fn()
    const setAssignedItems = jest.fn()
    await renderRemainingItems({
      isOpen: true,
      onClose,
      swoProject: SWO_PROJECT,
      setAssignedItems,
    })
    await userEvent.click(screen.getByTestId('check-0'))
    expect(screen.getByTestId('check-0')).toHaveAttribute('data-checked')
    await userEvent.click(screen.getByTestId('delete-row-button'))
    expect(screen.getByText('Are You Sure?', { selector: 'header' }))
  })

  test('User can edit a cell on a row by clicking on it. On click input will appear. User can enter text and as input is focused out the cell will display updated value.', async () => {
    const onClose = jest.fn()
    const setAssignedItems = jest.fn()

    await renderRemainingItems({
      isOpen: true,
      onClose,
      swoProject: SWO_PROJECT,
      setAssignedItems,
    })
    await userEvent.click(screen.getByTestId('cell-0-productName'))
    expect(screen.getByTestId('editableField-0-productName')).toBeInTheDocument()
    await userEvent.type(screen.getByTestId('editableField-0-productName'), '/Meter')
    expect(screen.getByTestId('editableField-0-productName')).toHaveFocus()
    act(() => {
      fireEvent.focusOut(screen.getByTestId('editableField-0-productName'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('cell-0-productName').textContent).toEqual('Electrical/Meter')
    })
  })
})
