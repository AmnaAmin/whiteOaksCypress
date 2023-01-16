import React, { useEffect } from 'react'
import { useNotes, useNoteMutation } from 'api/work-order'
import { NotesTab } from 'features/common/notes-tab'
import { useAccountDetails } from 'api/vendor-details'

export const WorkOrderNotes: React.FC<any> = props => {
  const { workOrder, onClose, setNotesCount, navigateToProjectDetails } = props
  const { mutate: createNotes, isLoading: isNotesLoading } = useNoteMutation(workOrder?.id)
  const { data: account } = useAccountDetails()

  const { notes = [] } = useNotes({
    workOrderId: workOrder?.id,
  })

  useEffect(() => {
    if (notes?.length > 0 && setNotesCount) {
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
    <>
      <NotesTab
        saveNote={saveNote}
        isNotesLoading={isNotesLoading}
        notes={notes}
        onClose={onClose}
        navigateToProjectDetails={navigateToProjectDetails}
        messageBoxStyle={{ resize: 'none' }}
        contentStyle={{ padding: { base: '0px', lg: '25px' }, maxHeight: 'calc(100vh - 300px)' }}
        pageLayoutStyle={{ overflow: 'hidden', borderRadius: '3px' }}
      />
    </>
  )
}

export default WorkOrderNotes
