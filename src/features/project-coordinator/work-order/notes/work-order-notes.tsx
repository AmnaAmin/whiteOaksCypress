import React, { useEffect } from 'react'
import { useNotes, useNoteMutation } from 'utils/work-order'
import { NotesTab } from '../../../common/notes-tab'
import { useAccountDetails } from 'utils/vendor-details'

export const WorkOrderNotes: React.FC<any> = props => {
  const { workOrder, onClose, setNotesCount, navigateToProjectDetails } = props
  const { mutate: createNotes } = useNoteMutation(workOrder?.id)
  const { data: account } = useAccountDetails()

  const { notes = [] } = useNotes({
    workOrderId: workOrder?.id,
  })

  useEffect(() => {
    if (notes && notes.length > 0) {
      setNotesCount(notes.filter((note: any) => note.createdBy !== account.login)?.length)
    }
  }, [notes])

  const saveNote = data => {
    const payload = {
      comment: data.message,
      workOrderId: workOrder?.id,
      projectId: workOrder?.projectId,
    }
    createNotes(payload)
  }

  return (
    <NotesTab
      saveNote={saveNote}
      notes={notes}
      onClose={onClose}
      navigateToProjectDetails={navigateToProjectDetails}
      messageBoxStyle={{ resize: 'none' }}
      contentStyle={{ padding: '25px', maxHeight: '400px' }}
      pageLayoutStyle={{ overflow: 'hidden', borderRadius: '3px' }}
    />
  )
}

export default WorkOrderNotes
