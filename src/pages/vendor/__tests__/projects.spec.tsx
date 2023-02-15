import { fireEvent, render, screen, waitForLoadingToFinishLabelOnly } from 'utils/test-utils'
import App from 'App'
import userEvent from '@testing-library/user-event'
// import { FIRST_PROJECT_ID } from '../../mocks/api/projects/data'

jest.setTimeout(150000)

describe('Vendor Projects Test Cases', () => {
  test('App should redirect to /projects', async () => {
    // render(<App />, { route: '/projects' })
    // await waitForLoadingToFinishLabelOnly()
    // expect(global.window.location.pathname).toEqual('/projects')
    //    userEvent.click(screen.getByTestId('column-settings-button'))
    // expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    //const list = screen.getByTestId('column-settings-list')
    //const allItems = document.querySelectorAll('#column-settings-list > div')
    //const firstItem = allItems[0].firstChild as ChildNode
    // const secondItem = allItems[1].firstChild as ChildNode
    //fireEvent.dragStart(firstItem)
    // fireEvent.dragOver(list)
    // fireEvent.dragEnter(list)
    // fireEvent.drop(firstItem)
    // fireEvent.dragEnd(list)
    // await jest.setTimeout(150000)
    // expect(screen.getByTestId('draggable-item-0').textContent).toEqual('Type')
    // expect(firstItem).toBeInTheDocument()
    // screen.debug(undefined, 100000)
  })
  test('Clicking on project redirects to project detail', async () => {
    /* await render(<App />, { route: '/projects' })

    expect(global.window.location.pathname).toEqual('/projects')
    fireEvent.click(screen.getAllByTestId('project-table-row')[0])

    await waitFor(() => {
      expect(global.window.location.pathname).toEqual(`/project-details/2951` || 'project-details/2775')
    // })*/
  })
})
