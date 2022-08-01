import React, { useEffect } from 'react'
import { useNoteMutation } from 'utils/work-order'

import { useAccountDetails } from 'utils/vendor-details'
import { NotesTab } from 'features/common/notes-tab'
import { useProjectNotes } from 'utils/projects'

export const ProjectNotes: React.FC<any> = props => {
  const { setNotesCount, projectId } = props

  const { mutate: createNotes } = useNoteMutation(projectId)
  const { data: account } = useAccountDetails()

  const { notes = [] } = useProjectNotes({
    projectId: projectId,
  })

  useEffect(() => {
    if (notes && notes.length > 0) {
      setNotesCount(notes.filter((note: any) => note.createdBy !== account.login)?.length)
    }
  }, [notes])

  const saveNote = data => {
    const payload = {
      comment: data.message,
      projectId: projectId,
    }
    createNotes(payload)
  }
  return (
    <NotesTab
      saveNote={saveNote}
      notes={notes}
      messageBoxStyle={{ height: '120px', resize: 'none' }}
      chatListStyle={{ height: '340px' }}
      contentStyle={{ padding: '25px' }}
      pageLayoutStyle={{ bg: 'white', rounded: 16, pb: 2 }}
    />
  )
}

export default ProjectNotes
