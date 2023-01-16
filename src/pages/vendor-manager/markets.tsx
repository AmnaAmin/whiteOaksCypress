import { Button, HStack, Icon, useDisclosure } from '@chakra-ui/react'
import { MarketsTable } from 'features/vendor-manager/markets-table'
import { NewMarketModal } from 'features/vendor-manager/new-market-modal'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { useTranslation } from 'react-i18next'
import { BiBookAdd } from 'react-icons/bi'
import { Card } from 'components/card/card'

export const Markets = () => {
  const { t } = useTranslation()
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()

  return (
    <>
      <Card px="11px" py="11px">
        <HStack justifyContent="end" mb="11px">
          <Button colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />} onClick={onDocumentModalOpen}>
            {t(`${VENDOR_MANAGER}.newMarket`)}
          </Button>
        </HStack>
        <MarketsTable />
      </Card>
      <NewMarketModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} />
    </>
  )
}
