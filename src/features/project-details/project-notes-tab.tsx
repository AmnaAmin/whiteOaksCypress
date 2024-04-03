import React, { useEffect } from 'react'
import { useNoteMutation } from 'api/work-order'

import { useAccountDetails } from 'api/vendor-details'
import { NotesTab } from 'features/common/notes-tab'
import { useProjectNotes } from 'api/projects'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { useLocation } from 'react-router-dom'

export const ProjectNotes: React.FC<any> = props => {
  const { setNotesCount, projectId, projectData } = props
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const isPayableRead = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ') && isPayable
  const isProjRead = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
  const isReadOnly = isPayableRead || isProjRead
  const { mutate: createNotes } = useNoteMutation(projectId)
  const { data: account } = useAccountDetails()

  const { notes = [] } = useProjectNotes({
    projectId: projectId,
  })

  useEffect(() => {
    if (notes?.length > 0 && setNotesCount) {
      setNotesCount(notes.filter((note: any) => note.createdBy !== account?.login)?.length)
    }
  }, [notes])

  const saveNote = data => {
    const payload = {
      comment: data.message,
      projectId: projectId,
      percentageCompletion: data.percentageCompletion,
    }
    createNotes(payload)
  }
  return (
    <NotesTab
      hideSave={isReadOnly}
      saveNote={saveNote}
      projectData={projectData}
      notes={notes}
      projectCompletion={true}
      contentStyle={{ padding: '25px', maxHeight: '450px' }}
      pageLayoutStyle={{ bg: 'white', rounded: 6, pb: 2 }}
      isPercentageDisabled={true}
    />
  )
}

export default ProjectNotes
