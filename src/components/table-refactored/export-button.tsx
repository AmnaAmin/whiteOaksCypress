// Export React Table to excel button component
// Language: typescript

import { Button, ButtonProps, Center, Divider, Flex, HStack, Icon, Text } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { BiExport } from 'react-icons/bi'
import { reduceArrayToObject } from 'utils'
import XLSX from 'xlsx'
import { useTableContext } from './table-context'
import { useTranslation } from 'react-i18next'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'
import { useCallback } from 'react'

type ExportButtonProps = ButtonProps & {
  columns: ColumnDef<any>[]
  isLoading?: boolean
  fetchedData?: Array<any> | undefined | null
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<any[], unknown>>
  fileName?: string
}

const useExportToExcel = () => {
  const { t } = useTranslation()
  const { tableInstance } = useTableContext()

  const exportToExcel = useCallback(
    (data: any[], fileName?: string) => {
      const columns = tableInstance?.options?.columns || []
      const columnsNames = columns.map(column => t(column.header as string))

      // Make dictionary object of columns key with accessorKey and value the object of column because
      // we want access the accessorKey value through accessorFn for customize value
      const columnDefWithAccessorKeyAsKey = reduceArrayToObject(columns, 'accessorKey')

      // Here we map all the key values with accessorFn
      const dataMapped = data.map((row: any) => {
        return Object.keys(row).reduce((acc, key) => {
          const columnDef = columnDefWithAccessorKeyAsKey[key]
          const header = columnDef?.header

          const value = columnDef?.accessorFn?.(row) || row[key]

          // If the header is not defined we don't want to export it
          if (!header) return acc

          return {
            ...acc,
            [t(header)]: value,
          }
        }, {})
      })

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(dataMapped, { header: columnsNames })

      XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
      XLSX.writeFile(wb, fileName ?? 'export.csv')
    },
    [tableInstance],
  )

  return exportToExcel
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
  const exportToExcel = useExportToExcel()

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
    <Center>
      <Button variant="ghost" onClick={handleExport} {...rest} isDisabled={isLoading}>
        {children ?? (
          <HStack spacing={1}>
            <Icon as={BiExport} fontSize={'18px'} mb="3px" />
            <Text>{t('projects.export')}</Text>
          </HStack>
        )}
      </Button>
      <Divider orientation="vertical" height={'15px'} border="1px solid" borderColor="gray.300" />
    </Center>
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
  const exportToExcel = useExportToExcel()

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
