import { HStack, Text, Button, VStack } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { ACCESS_CONTROL } from 'features/access-control/access-control.i18n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'
import { useFetchRolesPermissions } from 'api/access-control'
import { useState } from 'react'
import { RolesList } from 'features/access-control/roles-list'
import { RolesPermissions } from 'features/access-control/roles-permissions'

export const AccessControl: React.FC = () => {
  const { t } = useTranslation()
  const [selectedRole, setSelectedRole] = useState<string | null>()
  const { data: permissions } = useFetchRolesPermissions(selectedRole)
  return (
    <Card>
      <VStack w="70%" gap="20px">
        <HStack justifyContent="space-between" w="100%">
          <Text data-testid="access-control" fontSize="18px" fontWeight={600} color="#4A5568">
            {t(`${ACCESS_CONTROL}.accessControl`)}
          </Text>

          <Button onClick={() => {}} colorScheme="brand" leftIcon={<BiAddToQueue />}>
            {t(`${ACCESS_CONTROL}.newRole`)}
          </Button>
        </HStack>
        <RolesList setSelectedRole={setSelectedRole} />
        <RolesPermissions permissions={permissions} />
      </VStack>
    </Card>
  )
}
