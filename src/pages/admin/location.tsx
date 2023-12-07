import { Button, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import { LocationModal } from 'features/location/location-modal'
import { LocationTable } from 'features/location/location-table'
import { LOCATION } from 'features/location/location.i18n'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const Location = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('LOCATION.READ')
  return (
    <Card px="12px" py="16px">
      <HStack justifyContent="space-between" mb="16px">
        <Text data-testid="users" fontSize="18px" fontWeight={600} color="#4A5568">
          {t(`${LOCATION}.location`)}
        </Text>
        {!isReadOnly && (
          <Button onClick={onOpen} colorScheme="brand" leftIcon={<BiAddToQueue />}>
            {t(`${LOCATION}.addLocation`)}
          </Button>
        )}
      </HStack>

      <LocationTable />
      <LocationModal onClose={onClose} isOpen={isOpen} />
    </Card>
  )
}
