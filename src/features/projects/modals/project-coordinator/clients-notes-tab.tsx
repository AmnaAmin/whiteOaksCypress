import React from 'react'
import { NotesTab } from 'features/common/notes-tab'
import { useNotes } from 'utils/clients'
import { Box, Button, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type clientNotesProps = {
  clientDetails?: any
  onClose: () => void
}

export const ClientNotes = React.forwardRef((props: clientNotesProps, setNotesCount) => {
  const { clientDetails, onClose } = props
  const { t } = useTranslation()

  const { notes = [] } = useNotes({
    clientId: clientDetails?.id,
  })

  const saveNote = data => {}

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
   // borderTop: '1px solid #CBD5E0',
  }

  return (
    <>
      <Box p={0} >
        <NotesTab
          saveNote={saveNote}
          notes={notes}
          onClose={onClose}
          hideSave={true}
          messageBoxStyle={{ height: '120px', resize: 'none', display: 'none' }}
          chatListStyle={{ height: '390px' }}
          pageLayoutStyle={{ height: '395px' }}
          labelTextBoxStyle={{ display: 'none' }}
        />
      </Box>
      <Flex style={ btnStyle } pb="4">
        <Button colorScheme="brand" onClick={props?.onClose}>
          Cancel
        </Button>
      </Flex>
    </>
  )
})
export default ClientNotes
