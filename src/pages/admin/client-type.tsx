import { Button, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { ClientTypeTable } from 'features/client-type/client-type-table'
import { ProjectTypeModal } from 'features/project-type/project-type-modal'
import { PROJECT_TYPE } from 'features/project-type/project-type.i18n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'

export const ClientType = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Card px="12px" py="16px">
      <HStack justifyContent="space-between" mb="16px">
        <Text data-testid="users" fontSize="18px" fontWeight={600} color="#4A5568">
          {t(`${PROJECT_TYPE}.clientType`)}
        </Text>

        <Button onClick={onOpen} colorScheme="brand" leftIcon={<BiAddToQueue />}>
          {t(`${PROJECT_TYPE}.addClientType`)}
        </Button>
      </HStack>

      <ClientTypeTable />
      <ProjectTypeModal clientType={true} onClose={onClose} isOpen={isOpen} />
    </Card>
  )
}
