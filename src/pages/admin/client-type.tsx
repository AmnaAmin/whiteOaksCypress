import { Button, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { ClientTypeModal } from 'features/client-type/client-type-modal'
import { ClientTypeTable } from 'features/client-type/client-type-table'
import { PROJECT_TYPE } from 'features/project-type/project-type.i18n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const ClientType = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('CLIENTTYPE.READ')
  return (
    <Card px="12px" py="16px">
      <HStack justifyContent="space-between" mb="16px">
        <Text data-testid="users" fontSize="18px" fontWeight={600} color="#4A5568">
          {t(`${PROJECT_TYPE}.clientType`)}
        </Text>
        {!isReadOnly && (
          <Button onClick={onOpen} colorScheme="brand" leftIcon={<BiAddToQueue />}>
            {t(`${PROJECT_TYPE}.addClientType`)}
          </Button>
        )}
      </HStack>

      <ClientTypeTable />
      <ClientTypeModal onClose={onClose} isOpen={isOpen} />
    </Card>
  )
}
