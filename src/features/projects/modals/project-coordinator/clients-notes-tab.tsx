import React from 'react'
import { NotesTab } from 'features/common/notes-tab'
import { useNotes } from 'utils/clients'
import { Button, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type clientNotesProps = {
  clientDetails?: any
  onClose?: () => void
}

export const ClientNotes = React.forwardRef((props: clientNotesProps, setNotesCount) => {
  const { clientDetails, onClose } = props
  const { t } = useTranslation()

  const { notes = [] } = useNotes({
    clientId: clientDetails?.id,
  })

  const saveNote = data => {}

  return (
    <>
      <NotesTab
        saveNote={saveNote}
        notes={notes}
        onClose={onClose}
        hideSave={true}
        messageBoxStyle={{ display: 'none' }}
        chatListStyle={{ height: '350px' }}
        pageLayoutStyle={{ height: '400px', padding: '25px' }}
        labelTextBoxStyle={{ display: 'none' }}
      />
      <Flex justifyContent="end">
        <Button colorScheme="brand" onClick={props?.onClose} mb={4}>
          {t('cancel')}
        </Button>
      </Flex>
    </>
  )
})
export default ClientNotes
