import { Divider, HStack, Text } from '@chakra-ui/react'
import { t } from 'i18next'
import { VENDORPROFILE } from './vendor-profile.i18n'

export const SaveChangedFieldAlert = () => {
  return (
    <HStack pt="10px" spacing={{ base: 0, sm: '0.5rem' }}>
      <Divider
        orientation="vertical"
        border="1px solid #CBD5E0 !important"
        h="20px"
        display={{ base: 'none', sm: 'block' }}
      />
      <Text fontStyle="italic" color="#F56565" fontSize="12px" w="150px">
        {t(`${VENDORPROFILE}.changeFieldMessage`)}
      </Text>
    </HStack>
  )
}
