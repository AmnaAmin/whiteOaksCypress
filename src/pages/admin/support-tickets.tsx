import { Button, HStack, useDisclosure, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { SupportModal } from 'features/support/support-modal'
import { SupportTable } from 'features/support/support-table'
import { SUPPORT } from 'features/support/support.i18n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const SupportTickets = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('SUPPORT.READ')
  const SUPPORT_PAGE = 'support_page'
  return (
    <Card px="12px" py="16px">
      <HStack justifyContent="space-between" mb="16px">
        <Text data-testid="users" fontSize="18px" fontWeight={600} color="#4A5568">
          {t(`${SUPPORT}.support`)}
        </Text>
        <>
          {!isReadOnly &&(
        <Button onClick={onOpen} colorScheme="brand" leftIcon={<BiAddToQueue />}>
          {t(`${SUPPORT}.newticket`)}
        </Button>
          )}
          </>
      </HStack>

      <SupportTable />
      <SupportModal onClose={onClose} isOpen={isOpen} supportPage={SUPPORT_PAGE} />
    </Card>
  )
}
