import { Box, Button, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { ProjectTypeModal } from 'features/project-type/project-type-modal'
import { ProjectTypeTable } from 'features/project-type/project-type-table'
import { PROJECT_TYPE } from 'features/project-type/project-type.i18n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'

export const ProjectType = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box>
      <HStack h="50px" justifyContent="space-between">
        <Text data-testid="users" fontSize="18px" fontWeight={600} color="#4A5568">
          {t(`${PROJECT_TYPE}.projectType`)}
        </Text>

        <Button onClick={onOpen} colorScheme="brand" leftIcon={<BiAddToQueue />}>
          {t(`${PROJECT_TYPE}.addProjectType`)}
        </Button>
      </HStack>

      <ProjectTypeTable />
      <ProjectTypeModal onClose={onClose} isOpen={isOpen} />
    </Box>
  )
}
