import { AddIcon } from '@chakra-ui/icons'
import { HStack, Box, Icon, Button, Spacer, Flex, Stack } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { VendorFilters } from 'features/project-coordinator/vendor/vendor-filter'
import { VendorTable, VENDOR_COLUMNS } from 'features/project-coordinator/vendor/vendor-table'
import { t } from 'i18next'
import { useState } from 'react'
import { BsBoxArrowUp } from 'react-icons/bs'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings } from 'utils/table-column-settings'

const Vendors = () => {
  const [vendorTableInstance, setInstance] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const { tableColumns, resizeElementRef, isLoading } = useTableColumnSettings(VENDOR_COLUMNS, TableNames.vendors)
  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
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
                variant="solid"
                colorScheme="gray"
                size="md"
                roundedTopLeft="0"
                roundedTopRight="0"
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
            </>
          )}
        </Flex>
      </Stack>
    </Box>
  )
}

export default Vendors
