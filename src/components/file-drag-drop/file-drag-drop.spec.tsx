import { render } from '@testing-library/react'
import { Providers } from 'providers'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import FileDragDrop from './file-drag-drop'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setToken } from 'utils/storage.utils'

const chooseFilebyTestId = async id => {
  const inputEl = screen.getByTestId(id)
  //   // Create dummy file then upload
  const file1 = new File(['(⌐□_□)'], 'test1.png', {
    type: 'image/png',
  })
  const file2 = new File(['(⌐□_□)'], 'test2.png', {
    type: 'image/png',
  })
  const file3 = new File(['(⌐□_□)'], 'test3.png', {
    type: 'image/png',
  })
  const file4 = new File(['(⌐□_□)'], 'test4.png', {
    type: 'image/png',
  })
  await act(async () => {
    userEvent.upload(inputEl, [file1, file2, file3, file4])
  })
}

export const renderFileDragDrop = async ({ onUpload }: any) => {
  await render(<FileDragDrop onUpload={onUpload} />, {
    wrapper: Providers,
  })
  await waitForLoadingToFinish()
}

beforeAll(() => {
  setToken('pc')
})

jest.setTimeout(150000)
describe('Verify creating different alerts for the system ', () => {
  test('Verify Creating an alert for Project > Project Manager Change', async () => {
    const onUpload = jest.fn()
    await renderFileDragDrop({
      onUpload,
    })

    await chooseFilebyTestId('chooseFile')

    expect(onUpload).toBeCalled()
    expect(screen.getByText(new RegExp('test1.png'))).toBeInTheDocument()
    expect(screen.getByText(new RegExp('test2.png'))).toBeInTheDocument()
    expect(screen.getByText(new RegExp('test3.png'))).toBeInTheDocument()
    expect(screen.getByText(new RegExp('test4.png'))).toBeInTheDocument()
    await act(async () => {
      userEvent.click(screen.getByTestId('delete-3'))
    })
    expect(screen.queryByTestId(new RegExp('test4.png'))).not.toBeInTheDocument()
  })
})
