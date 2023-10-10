import { Button, HStack, Icon, useDisclosure, Text } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { NewVendorSkillsModal } from 'features/vendor-manager/new-vendor-skill-modal'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { VendorSkillsTable } from 'features/vendor-manager/vendor-skills-table'
import { useTranslation } from 'react-i18next'
import { BiBookAdd } from 'react-icons/bi'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const VendorSkills = () => {
  const {
    isOpen: isOpenVendorSkillModal,
    onClose: onVendorSkillModalClose,
    onOpen: onVendorSkillModalOpen,
  } = useDisclosure()
  const { t } = useTranslation()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('VENDORSKILL.READ')
  return (
    <>
      <Card px="12px" py="16px">
        <HStack justifyContent="space-between" mb="16px">
          <Text fontWeight={600} fontSize="18px" color="gray.600">
            {t(`${VENDOR_MANAGER}.vendorSkills`)}
          </Text>
          <>
          {!isReadOnly &&(
          <Button colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />} onClick={onVendorSkillModalOpen}>
            {t(`${VENDOR_MANAGER}.newVendorSkills`)}
          </Button>
  )}
  </>
        </HStack>
        <VendorSkillsTable isReadOnly={isReadOnly}/>
      </Card>
      {isOpenVendorSkillModal && (
        <NewVendorSkillsModal isOpen={isOpenVendorSkillModal} onClose={onVendorSkillModalClose} />
      )}
    </>
  )
}
