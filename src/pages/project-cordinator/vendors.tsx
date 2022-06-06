import { AddIcon } from '@chakra-ui/icons'
import { HStack, Box, Icon, Button, Spacer, Flex, Stack, useDisclosure, Center, Divider } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import TableColumnSettings from 'components/table/table-column-settings'
import { VendorFilters } from 'features/project-coordinator/vendor/vendor-filter'
import { VendorTable, VENDOR_COLUMNS } from 'features/project-coordinator/vendor/vendor-table'
import NewVendorModal from 'features/projects/modals/project-coordinator/new-vendor-modal'
import { t } from 'i18next'
import { useState } from 'react'
import { BsBoxArrowUp } from 'react-icons/bs'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'

const Vendors = () => {
  const { isOpen: isOpenNewVendorModal, onOpen: onNewVendorModalOpen, onClose: onNewVendorModalClose } = useDisclosure()
  const [vendorTableInstance, setInstance] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<string>('')

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.vendors)
  const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
    VENDOR_COLUMNS,
    TableNames.vendors,
  )

  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }

  const onSave = columns => {
    postGridColumn(columns)
  }

  return (
    <Box mt="5">
      <VendorFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />

      <HStack mt="1" mb="1">
        <Button variant="ghost" colorScheme="brand" onClick={() => setSelectedCard('')}>
          Clear Filter
        </Button>
        <Spacer />
        <Box pt="4">
          <Button
            onClick={onNewVendorModalOpen}
            _focus={{ outline: 'none' }}
            variant="ghost"
            color="#4E87F8"
            leftIcon={<Icon boxSize={3} as={AddIcon} />}
            fontSize="14px"
            fontWeight={600}
          >
            New Vendor
          </Button>
        </Box>
      </HStack>

      <Box>
        <VendorTable
          selectedCard={selectedCard as string}
          resizeElementRef={resizeElementRef}
          projectColumns={tableColumns}
          setTableInstance={setProjectTableInstance}
        />
      </Box>
      <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="flex-end" spacing={5}>
        <Flex borderRadius="0 0 6px 6px" bg="#F7FAFC" border="1px solid #E2E8F0">
          {isLoading ? (
            <>
              <BlankSlate size="md" />
              <BlankSlate size="md" />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                colorScheme="brand"
                onClick={() => {
                  if (vendorTableInstance) {
                    vendorTableInstance?.exportData('xlsx', false)
                  }
                }}
              >
                <Box pos="relative" right="6px" fontWeight="bold" pb="3.3px">
                  <BsBoxArrowUp />
                </Box>
                {t('export')}
              </Button>
              <Center>
                <Divider orientation="vertical" height="25px" border="1px solid" ml="1" />
              </Center>
              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </>
          )}
        </Flex>
      </Stack>
      <NewVendorModal isOpen={isOpenNewVendorModal} onClose={onNewVendorModalClose} />
    </Box>
  )
}

export default Vendors
