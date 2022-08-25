import { Box, Button, Flex, HStack, Icon, Text } from '@chakra-ui/react'
import { ExportButton } from 'components/table-refactored/export-button'
import { MarketsTable } from 'features/vendor-manager/markets-table'
import { t } from 'i18next'
import { BsPlus } from 'react-icons/bs'
import { useMarkets } from 'utils/vendor-details'

export const Markets = () => {
  const { markets, isLoading } = useMarkets()

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
      <MarketsTable isLoading={isLoading} markets={markets} />
      <Flex width="100%" justifyContent="end">
        <Box rounded="0px 0px 9px 9px" bg="white" border="1px solid #E2E8F0">
          <ExportButton columns={[]} data={markets} colorScheme="brand" />
        </Box>
      </Flex>
    </Box>
  )
}
