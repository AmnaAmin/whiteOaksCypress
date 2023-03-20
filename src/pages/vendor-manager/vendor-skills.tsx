import { Button, HStack, Icon, useDisclosure, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { NewVendorSkillsModal } from 'features/vendor-manager/new-vendor-skill-modal'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { VendorSkillsTable } from 'features/vendor-manager/vendor-skills-table'
import { useTranslation } from 'react-i18next'
import { BiBookAdd } from 'react-icons/bi'

export const VendorSkills = () => {
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()
  const { t } = useTranslation()

  return (
    <>
      <Card px="12px" py="16px">
        <HStack justifyContent="space-between" mb="16px">
          <Text fontWeight={600} fontSize="18px" color="gray.600">
            {t(`${VENDOR_MANAGER}.vendorSkills`)}
          </Text>
          <Button colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />} onClick={onDocumentModalOpen}>
            {t(`${VENDOR_MANAGER}.newVendorSkills`)}
          </Button>
        </HStack>
        <VendorSkillsTable />
      </Card>
      {isOpenDocumentModal && <NewVendorSkillsModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} />}
    </>
  )
}
