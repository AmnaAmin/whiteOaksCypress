// Export React Table to excel button component
// Language: typescript

import { Button, ButtonProps, Flex, Text } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { BiExport } from 'react-icons/bi'
import { reduceArrayToObject } from 'utils'
import XLSX from 'xlsx'
import { useTableContext } from './table-context'
import { useTranslation } from 'react-i18next'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'

type ExportButtonProps = ButtonProps & {
  columns: ColumnDef<any>[]
  isLoading?: boolean
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<any[], unknown>>
  fileName?: string
}

/*
   This is used when exporting full CSV data from the server side pagination table        
*/
export const ExportButton: React.FC<ExportButtonProps> = ({ children, fileName, refetch, isLoading, ...rest }) => {
  const { t } = useTranslation()
  const { tableInstance } = useTableContext()

  const handleExport = () => {
    refetch?.()?.then(({ data }) => {
      if (data && tableInstance) {
        // Make dictionary object of columns key with accessorKey and value the object of column because
        // we want access the accessorKey value through accessorFn for customize value
        const columnDefWithAccessorKeyAsKey = reduceArrayToObject(tableInstance?.options?.columns || [], 'accessorKey')

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
        const ws = XLSX.utils.json_to_sheet(dataMapped)

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
        XLSX.writeFile(wb, fileName ?? 'export.csv')
      } else if (data) {
        console.error('Export button should be inside tableContext.provider tree')
      }
    })
  }

  return (
    <Button variant="ghost" onClick={handleExport} {...rest} isDisabled={isLoading}>
      {children ?? (
        <Flex justifyContent="center">
          <BiExport fontSize={'18px'} />

          <Text ml="2.88">{t('projects.export')}</Text>
        </Flex>
      )}
    </Button>
  )
}

/*
   This is used when exporting custom CSV with formatted data     
*/
type ExportCustomButtonProps = ButtonProps & { columns: ColumnDef<any>[]; data: any; fileName?: string }
export const ExportCustomButton: React.FC<ExportCustomButtonProps> = ({ data, children, fileName, ...rest }) => {
  const handleExport = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
    XLSX.writeFile(wb, fileName ?? 'export.csv')
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
