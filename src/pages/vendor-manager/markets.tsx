import { Box, Button, Flex, HStack, Icon, Text, useDisclosure } from '@chakra-ui/react'
import { MarketsTable } from 'features/vendor-manager/markets-table'
import { NewMarketModal } from 'features/vendor-manager/new-market-modal'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMarkets } from 'api/vendor-details'
import { BiBookAdd, BiExport } from 'react-icons/bi'

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
      <Box>
        <HStack h="70px" justifyContent="space-between">
          <Text fontWeight={600} color="gray.600" fontSize="18px">
            {t(`${VENDOR_MANAGER}.markets`)}
          </Text>
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
              colorScheme="brand"
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
      </Box>
      <NewMarketModal isOpen={isOpenDocumentModal} onClose={onDocumentModalClose} />
    </>
  )
}
