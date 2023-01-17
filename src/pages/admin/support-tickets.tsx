import { Box, Button, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { SupportModal } from 'features/support/support-modal'
import { SupportTable } from 'features/support/support-table'
import { SUPPORT } from 'features/support/support.i18n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'

export const SupportTickets = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const SUPPORT_PAGE = 'support_page'
  return (
    <Box>
      <HStack h="50px" justifyContent="space-between">
        <Text data-testid="users" fontSize="18px" fontWeight={600} color="#4A5568">
          {t(`${SUPPORT}.support`)}
        </Text>

        <Button onClick={onOpen} colorScheme="brand" leftIcon={<BiAddToQueue />}>
          {t(`${SUPPORT}.newticket`)}
        </Button>
      </HStack>

      <SupportTable />
      <SupportModal onClose={onClose} isOpen={isOpen} supportPage={SUPPORT_PAGE} />
    </Box>
  )
}
