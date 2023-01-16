import { Box, Button, HStack, Icon, Text, useDisclosure } from '@chakra-ui/react'
import { MarketsTable } from 'features/vendor-manager/markets-table'
import { NewMarketModal } from 'features/vendor-manager/new-market-modal'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { useTranslation } from 'react-i18next'
import { BiBookAdd } from 'react-icons/bi'

export const Markets = () => {
  const { t } = useTranslation()
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()

  return (
    <>
      <Box>
        <HStack h="70px" justifyContent="space-between">
          <Text fontWeight={600} color="gray.600" fontSize="18px">
            {t(`${VENDOR_MANAGER}.markets`)}
          </Text>
          <Button colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />} onClick={onDocumentModalOpen}>
            {t(`${VENDOR_MANAGER}.newMarket`)}
          </Button>
        </HStack>
        <MarketsTable />
      </Box>
      <NewMarketModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} />
    </>
  )
}
