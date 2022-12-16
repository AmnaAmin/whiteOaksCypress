import { Divider, HStack, Text } from '@chakra-ui/react'
import { t } from 'i18next'
import { VENDORPROFILE } from './vendor-profile.i18n'

export const SaveChangedFieldAlert = () => {
  return (
    <HStack pt="25px">
      <Divider orientation="vertical" border="1px solid #CBD5E0 !important" h="20px" />
      <Text fontStyle="italic" color="#F56565" fontSize="12px">
        {t(`${VENDORPROFILE}.changeFieldMessage`)}
      </Text>
    </HStack>
  )
}
