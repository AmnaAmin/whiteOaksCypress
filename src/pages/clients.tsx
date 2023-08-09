import { Box, Button, Flex, Icon, useDisclosure } from '@chakra-ui/react'
import { useClients } from 'api/clients'
import { Card } from 'components/card/card'
import { ClientsTable } from 'features/clients/clients-table'
import { CLIENTS } from 'features/clients/clients.i18n'
import NewClientModal from 'features/clients/new-client-modal'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiBookAdd } from 'react-icons/bi'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

export const Client = () => {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { data: clients } = useClients( '', 20)
  const { isOpen: isOpenNewClientModal, onClose: onNewClientModalClose, onOpen: onNewClientModalOpen } = useDisclosure()
  const { isProjectCoordinator } = useUserRolesSelector()
  const [createdClientId, setCreatedClientId] = useState<string | null | undefined>(null)
  const [selectedClient, setSelectedClient] = useState<string | null | undefined>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const client = (location?.state as any)?.data || {}

  useEffect(() => {
    if (client?.id) {
      navigate(location.pathname, {})
    }
  }, [client])

  useEffect(() => {
    if (clients && clients.length > 0 && !!createdClientId) {
      const updatedClient = clients?.find(c => c.id === createdClientId)
      if (updatedClient) {
        setSelectedClient({ ...updatedClient })
      }
    } else {
      setSelectedClient(null)
    }
  }, [clients, createdClientId])

  return (
    <>
      <Card pt="16px" pb="26px" px="10px" rounded="6px">
        <Flex mb="16px" alignItems="center" justifyContent="flex-end">
          <>
            {!isProjectCoordinator && (
              <Button onClick={onNewClientModalOpen} colorScheme="brand" fontSize="14px">
                <Icon as={BiBookAdd} fontSize="18px" mr={2} />
                {t(`${CLIENTS}.newClient`)}
              </Button>
            )}
          </>
        </Flex>
        <Box>
          <ClientsTable ref={tabsContainerRef} createdClientId={createdClientId} defaultSelected={client} />
        </Box>
      </Card>
      {isOpenNewClientModal && (
        <NewClientModal
          setCreatedClientId={setCreatedClientId}
          isOpen={isOpenNewClientModal}
          onClose={onNewClientModalClose}
          createdClient={selectedClient}
        />
      )}
    </>
  )
}

export default Client
