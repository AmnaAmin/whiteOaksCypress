import userEvent from '@testing-library/user-event'
import { PROJECT_TYPE_MODAL_MOCK } from 'mocks/api/project-type/project-type-mocks'

import { Providers } from 'providers'
import { fireEvent, render, screen, waitFor } from 'utils/test-utils'
import { ProjectTypeModal } from './project-type-modal'

jest.setTimeout(250000)

const renderNewProjectTypeModal = async ({ onClose, isOpen, projectTypetDetails }) => {
  await render(<ProjectTypeModal projectTypetDetails={projectTypetDetails} onClose={onClose} isOpen={isOpen} />, {
    wrapper: Providers,
  })
}

describe('Project type maodal test case', () => {
  test('New Project-Type modal Should render properly and submit button and type input field test case', async () => {
    const onClose = jest.fn()
    const projectTypetDetails = undefined
    await renderNewProjectTypeModal({ onClose, isOpen: true, projectTypetDetails })
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()

    expect(screen.getByTestId('type')).toBeInTheDocument()
    expect(screen.getByTestId('cancelModal')).toBeInTheDocument()
    expect(screen.getByTestId('saveProjectType')).toBeInTheDocument()

    expect(screen.getByTestId('saveProjectType')).toBeDisabled()
    userEvent.type(screen.getByTestId('type'), 'Other')
    await waitFor(() => {
      expect(screen.getByTestId('type')).toHaveValue('Other')
    })
    expect(screen.getByTestId('saveProjectType')).toBeEnabled()

    // fix this -- fireEvent.submit(screen.getByTestId('saveProjectType'))
    // expect(await screen.findByText('New Project Type has been created successfully.')).toBeInTheDocument()
  })

  test('Edit Project-Type modal Should render properly', async () => {
    const onClose = jest.fn()
    const projectTypetDetails = PROJECT_TYPE_MODAL_MOCK
    await renderNewProjectTypeModal({ onClose, isOpen: true, projectTypetDetails })
    expect(screen.getByText('Created By')).toBeInTheDocument()
    expect(screen.getByText('Created Date')).toBeInTheDocument()
    expect(screen.getByText('Modified By')).toBeInTheDocument()
    expect(screen.getByText('Modified Date')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  test('Edit Project-Type modal Submit button and type input feild test case', async () => {
    const onClose = jest.fn()
    const projectTypetDetails = PROJECT_TYPE_MODAL_MOCK
    await renderNewProjectTypeModal({ onClose, isOpen: true, projectTypetDetails })
    expect(screen.getByTestId('createdBy')).toBeInTheDocument()
    expect(screen.getByTestId('createdDate')).toBeInTheDocument()
    expect(screen.getByTestId('modifiedBy')).toBeInTheDocument()
    expect(screen.getByTestId('modifiedDate')).toBeInTheDocument()
    expect(screen.getByTestId('cancelModal')).toBeInTheDocument()
    expect(screen.getByTestId('saveProjectType')).toBeInTheDocument()

    userEvent.type(screen.getByTestId('type'), 'Other')
    await waitFor(() => {
      expect(screen.getByTestId('type')).toHaveValue()
    })
    expect(screen.getByTestId('saveProjectType')).toBeEnabled()

    // fix this -- fireEvent.submit(screen.getByTestId('saveProjectType'))
    // expect(await screen.findByText('Project Type has been Updated successfully.')).toBeInTheDocument()
  })
})
