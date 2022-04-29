import { AddIcon } from '@chakra-ui/icons'
import { HStack, Box, Icon, Button, Spacer } from '@chakra-ui/react'
import { VendorFilters } from 'features/project-coordinator/vendor/vendor-filter'
import { VendorTable, VENDOR_COLUMNS } from 'features/project-coordinator/vendor/vendorTable'
import { useState } from 'react'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings } from 'utils/table-column-settings'

const Vendors = () => {
  const [
    ,
    // vendorTableInstance
    setInstance,
  ] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const {
    tableColumns,
    resizeElementRef,
    //  settingColumns, isLoading
  } = useTableColumnSettings(VENDOR_COLUMNS, TableNames.vendors)
  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }

  return (
    <Box mt="5">
      <VendorFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />

      <HStack mt="1" mb="1">
        <Button
          _focus={{ outline: 'none' }}
          variant="ghost"
          color="#4E87F8"
          fontSize="14px"
          fontWeight={600}
          onClick={() => setSelectedCard('')}
        >
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
    </Box>
  )
}

export default Vendors
