import { Box, Button, Divider, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react'
import { ClientsTable } from 'features/clients/clients-table'
import NewClientModal from 'features/clients/new-client-modal'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiBookAdd } from 'react-icons/bi'

export const Client = () => {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { isOpen: isOpenNewClientModal, onClose: onNewClientModalClose, onOpen: onNewClientModalOpen } = useDisclosure()

  return (
    <>
      <Box>
        <Flex h="52px" alignItems="center" justifyContent="space-between" px={2}>
          <Text fontSize="18px" fontWeight={500} color="gray.600">
            {t('clientOverview')}
          </Text>
          <Button onClick={onNewClientModalOpen} colorScheme="brand" fontSize="14px">
            <Icon as={BiBookAdd} fontSize="18px" mr={2} />
            {t('New Client')}
          </Button>
        </Flex>
        <Flex
          px={7}
          alignItems="center"
          bg="gray.50"
          h="52px"
          borderBottom="1px solid #E2E8F0"
          borderTopRadius={6}
          fontSize="18px"
          fontWeight={500}
          color="gray.600"
        >
          <Text flex={1}>{t('businessName')}</Text>
          <Divider orientation="vertical" border="1px solid" />
          <Text pl={5} flex={1}>
            {t('accountPayable')}
          </Text>
        </Flex>
        <Box>
          <ClientsTable ref={tabsContainerRef} />
        </Box>
      </Box>
      <NewClientModal isOpen={isOpenNewClientModal} onClose={onNewClientModalClose} />
    </>
  )
}

export default Client
