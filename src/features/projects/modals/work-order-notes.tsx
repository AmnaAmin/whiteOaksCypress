import React, { useEffect } from 'react'
import { useNotes, useNoteMutation } from 'utils/work-order'
import { NotesTab } from '../../common/notes-tab'
import { useAccountDetails } from 'utils/vendor-details'

export const WorkOrderNotes: React.FC<any> = props => {
  const { workOrder, onClose, setNotesCount } = props
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
      messageBoxStyle={{ height: '120px', resize: 'none' }}
      chatListStyle={{ height: '340px' }}
      pageLayoutStyle={{ padding: '25px', pb: 0 }}
    />
  )
}

export default WorkOrderNotes
