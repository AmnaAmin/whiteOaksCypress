import { Box, Button, Flex, HStack, Icon, useDisclosure } from '@chakra-ui/react'
import { MarketsTable } from 'features/vendor-manager/markets-table'
import { NewMarketModal } from 'features/vendor-manager/new-market-modal'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMarkets } from 'api/vendor-details'
import { BiBookAdd, BiExport } from 'react-icons/bi'
import { Card } from 'components/card/card'

export const Markets = () => {
  const { markets, isLoading } = useMarkets()
  const { t } = useTranslation()
  const [projectTableInstance, setInstance] = useState<any>(null)
  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }
  const { isOpen: isOpenDocumentModal, onClose: onDocumentModalClose, onOpen: onDocumentModalOpen } = useDisclosure()

  return (
    <>
      <Card px="11px" py="11px">
        <HStack justifyContent="end" mb="11px">
          <Button colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />} onClick={onDocumentModalOpen}>
            {t(`${VENDOR_MANAGER}.newMarket`)}
          </Button>
        </HStack>
        <MarketsTable setTableInstance={setProjectTableInstance} isLoading={isLoading} markets={markets} />
        <Flex width="100%" justifyContent="end">
          <Box borderRadius="0 0 6px 6px" bg="#F7FAFC" border="1px solid #E2E8F0">
            <Button
              m={0}
              variant="ghost"
              colorScheme="darkBlue"
              fontWeight="500"
              onClick={() => {
                if (projectTableInstance) {
                  projectTableInstance?.exportData('csv', false)
                }
              }}
            >
              <Icon as={BiExport} fontSize="16px" mr={1} />
              {t('export')}
            </Button>
          </Box>
        </Flex>
      </Card>
      <NewMarketModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} />
    </>
  )
}
