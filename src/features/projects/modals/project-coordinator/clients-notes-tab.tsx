import React, { useEffect } from 'react'
// import { useNotes, useNoteMutation } from 'utils/work-order'
import { useAccountDetails } from 'utils/vendor-details'
import { NotesTab } from 'features/common/notes-tab'
import { useNotes } from 'utils/clients'
import { Box, Button, Flex, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type clientNotesProps = {
  clientDetails?: any
  onClose?: () => void
}

export const ClientNotes = React.forwardRef((props: clientNotesProps, setNotesCount) => {
  const { clientDetails, onClose } = props
  const { data: account } = useAccountDetails()
  const { t } = useTranslation()

  const { notes = [] } = useNotes({
    clientId: clientDetails?.id,
  })

  const saveNote = data => {
    const payload = {
      comment: data.message,
      clientId: clientDetails?.id,
      projectId: clientDetails?.projectId,
    }
  }

  return (
    <>
      <NotesTab
        saveNote={saveNote}
        notes={notes}
        onClose={onClose}
        hideSave={true}
        messageBoxStyle={{ height: '120px', resize: 'none', display: 'none' }}
        chatListStyle={{ height: '200px' }}
        pageLayoutStyle={{ height: '400px', padding: '25px' }}
        labelTextBoxStyle={{ display: 'none' }}
      />
      <Flex justifyContent="end">
        <Button colorScheme="brand" onClick={props?.onClose} mb={4}>
          Cancel
        </Button>
      </Flex>
    </>
  )
})
export default ClientNotes
