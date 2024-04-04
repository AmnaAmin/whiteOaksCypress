import React, { useEffect } from 'react'
import { useNotes, useNoteMutation } from 'api/work-order'
import { NotesTab } from 'features/common/notes-tab'
import { useAccountDetails } from 'api/vendor-details'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { WORK_ORDER_STATUS } from 'components/chart/Overview'
import { useLocation } from 'react-router-dom'

export const WorkOrderNotes: React.FC<any> = props => {
  const { workOrder, onClose, setNotesCount, navigateToProjectDetails } = props
  const { mutate: createNotes, isLoading: isNotesLoading } = useNoteMutation(workOrder?.id)
  const { data: account } = useAccountDetails()
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const isPayableRead = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ') && isPayable
  const isProjRead = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
  const isReadOnly = isPayableRead || isProjRead
  const isWOCancelled = WORK_ORDER_STATUS.Cancelled === workOrder?.status

  const { notes = [] } = useNotes({
    workOrderId: workOrder?.id,
  })

  useEffect(() => {
    if (notes?.length > 0 && setNotesCount) {
      setNotesCount(notes.filter((note: any) => note.createdBy !== account?.login)?.length)
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
        hideSave={isReadOnly}
        saveNote={saveNote}
        isNotesLoading={isNotesLoading}
        notes={notes}
        onClose={onClose}
        isWOCancelled={isWOCancelled}
        navigateToProjectDetails={navigateToProjectDetails}
        messageBoxStyle={{ resize: 'none' }}
        contentStyle={{ padding: { base: '0px', lg: '25px' }, maxHeight: 'calc(100vh - 500px)' }}
        pageLayoutStyle={{ overflow: 'hidden', borderRadius: '3px' }}
      />
    </>
  )
}

export default WorkOrderNotes
