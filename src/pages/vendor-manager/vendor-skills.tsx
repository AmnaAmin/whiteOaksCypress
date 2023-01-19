import { Box, Button, HStack, Icon, Text, useDisclosure } from '@chakra-ui/react'
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
      <Box>
        <HStack justifyContent="space-between" h="60px">
          <Text fontWeight={600} fontSize="18px" color="gray.600">
            {t(`${VENDOR_MANAGER}.vendorSkills`)}
          </Text>
          <Button colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />} onClick={onDocumentModalOpen}>
            {t(`${VENDOR_MANAGER}.newVendorSkills`)}
          </Button>
        </HStack>
        <VendorSkillsTable />
      </Box>
      <NewVendorSkillsModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} />
    </>
  )
}
