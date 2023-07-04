import { Button, HStack, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
// import { ProjectTypeModal } from 'features/project-type/project-type-modal'
// import { ProjectTypeTable } from 'features/project-type/project-type-table'
import { PROJECT_TYPE } from 'features/project-type/project-type.i18n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'

export const ClientType = () => {
  const { t } = useTranslation()
  //   const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Card px="12px" py="16px">
      <HStack justifyContent="space-between" mb="16px">
        <Text data-testid="users" fontSize="18px" fontWeight={600} color="#4A5568">
          {t(`${PROJECT_TYPE}.clientType`)}
        </Text>

        <Button colorScheme="brand" leftIcon={<BiAddToQueue />}>
          {t(`${PROJECT_TYPE}.addClientType`)}
        </Button>
      </HStack>

      {/* <ProjectTypeTable /> */}
      {/* <ProjectTypeModal onClose={onClose} isOpen={isOpen} /> */}
    </Card>
  )
}
