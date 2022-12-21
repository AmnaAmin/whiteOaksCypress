// Export React Table to excel button component
// Language: typescript

import { Button, ButtonProps, Flex, HStack, Icon, Text } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { BiExport } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'
import { useSaveToExcel } from './util'

type ExportButtonProps = ButtonProps & {
  columns: ColumnDef<any>[]
  isLoading?: boolean
  fetchedData?: Array<any> | undefined | null
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<any[], unknown>>
  fileName?: string
}

/*
   This is used when exporting full CSV data from the server side pagination table        
*/
export const ExportButton: React.FC<ExportButtonProps> = ({
  children,
  fileName,
  refetch,
  fetchedData,
  isLoading,
  ...rest
}) => {
  const { t } = useTranslation()
  const exportToExcel = useSaveToExcel()

  const handleExport = () => {
    if (fetchedData) {
      exportToExcel(fetchedData, fileName)
    } else {
      refetch?.()?.then(({ data }) => {
        if (data) {
          exportToExcel(data, fileName)
        } else if (data) {
          console.error('Export button should be inside tableContext.provider tree')
        }
      })
    }
  }

  return (
    <Button variant="ghost" onClick={handleExport} {...rest} isDisabled={isLoading}>
      {children ?? (
        <HStack spacing={1}>
          <Icon as={BiExport} fontSize={'18px'} mb="1px"  color='darkPrimary.400'/>
          <Text color='darkPrimary.400'>{t('projects.export')}</Text>
        </HStack>
      )}
    </Button>
  )
}

/*
   This is used when exporting custom CSV with formatted data     
*/
type ExportCustomButtonProps = ButtonProps & { columns: ColumnDef<any>[]; data: any; fileName?: string }
export const ExportCustomButton: React.FC<ExportCustomButtonProps> = ({
  data,
  children,
  fileName,
  columns,
  ...rest
}) => {
  const exportToExcel = useSaveToExcel()
  const handleExport = () => {
    exportToExcel(data, fileName)
  }

  const { t } = useTranslation()

  return (
    <Button variant="ghost" onClick={handleExport} {...rest}>
      {children ?? (
        <Flex justifyContent="center">
          <BiExport fontSize={'18px'} />
          <Text ml="2.88">{t('projects.export')}</Text>
        </Flex>
      )}
    </Button>
  )
}
