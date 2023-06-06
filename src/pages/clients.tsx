import { Box, Button, Divider, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react'
import { useClients } from 'api/clients'
import { Card } from 'components/card/card'
import { ClientsTable } from 'features/clients/clients-table'
import { CLIENTS } from 'features/clients/clients.i18n'
import NewClientModal from 'features/clients/new-client-modal'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiBookAdd } from 'react-icons/bi'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const Client = () => {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { data: clients } = useClients()
  const { isOpen: isOpenNewClientModal, onClose: onNewClientModalClose, onOpen: onNewClientModalOpen } = useDisclosure()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('CLIENT.READ')

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
            {!isReadOnly && (
              <Button onClick={onNewClientModalOpen} colorScheme="brand" fontSize="14px">
                <Icon as={BiBookAdd} fontSize="18px" mr={2} />
                {t(`${CLIENTS}.newClient`)}
              </Button>
            )}
          </>
        </Flex>
        <Flex
          px={7}
          alignItems="center"
          h="52px"
          border="1px solid #CBD5E0"
          borderBottom="none"
          borderTopRadius={6}
          fontSize="18px"
          fontWeight={500}
          color="gray.600"
          bg="#F2F3F4"
        >
          <Text flex={1}>{t(`${CLIENTS}.businessName`)}</Text>
          <Divider orientation="vertical" border="1px solid" />
          <Text textAlign="center" flex={1}>
            {t(`${CLIENTS}.accountPayable`)}
          </Text>
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
