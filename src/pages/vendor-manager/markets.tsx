import { Box, Button, Flex, HStack, Icon, Text } from '@chakra-ui/react'
import { MarketsTable } from 'features/vendor-manager/markets-table'
import { t } from 'i18next'
import { useState } from 'react'
import { BiExport } from 'react-icons/bi'
import { BsPlus } from 'react-icons/bs'

export const Markets = () => {
  const [projectTableInstance, setInstance] = useState<any>(null)

  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }
  return (
    <Box>
      <HStack h="70px" justifyContent="space-between">
        <Text fontWeight={600} color="gray.600" fontSize="18px">
          {t('markets')}
        </Text>
        <Button colorScheme="brand" leftIcon={<Icon boxSize={4} as={BsPlus} />}>
          {t('newMarket')}
        </Button>
      </HStack>
      <MarketsTable setTableInstance={setProjectTableInstance} />
      <Flex width="100%" justifyContent="end">
        <Box rounded="0px 0px 9px 9px" bg="white" border="1px solid #E2E8F0">
          <Button
            m={0}
            colorScheme="brand"
            variant="ghost"
            onClick={() => {
              if (projectTableInstance) {
                projectTableInstance?.exportData('xlsx', false)
              }
            }}
          >
            <Icon as={BiExport} fontSize="18px" mr={1} />
            {t('export')}
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}
