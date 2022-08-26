import { Box, Button, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { NewVendorSkillsModal } from 'features/vendor-manager/new-vendor-skill-modal'
import { VendorSkillsTable } from 'features/vendor-manager/vendor-skills-table'
import { GoPlus } from 'react-icons/go'
// import { VendorSkillsTable } from '../features/vendor-skills/vendor-skills-table'
// import { NewVendorSkillsModal } from '../features/vendor-skills/new-vendor-skills-modal'
export const VendorSkills = () => {
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()
  return (
    <>
      <Box>
        <HStack justifyContent="space-between" h="70px">
          <Text fontWeight={600} fontSize="18px" color="gray.600">
            Vendor Skills
          </Text>
          <Button colorScheme="brand" leftIcon={<GoPlus />} onClick={onDocumentModalOpen}>
            New Vendor Skills
          </Button>
        </HStack>
        <VendorSkillsTable />
      </Box>
      <NewVendorSkillsModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} />
    </>
  )
}
