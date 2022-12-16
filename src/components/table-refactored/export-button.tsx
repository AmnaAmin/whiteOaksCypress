// Export React Table to excel button component
// Language: typescript

import { Button, ButtonProps, Flex, HStack, Icon, Text } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { BiExport } from 'react-icons/bi'
import { reduceArrayToObject } from 'utils'
import { useTableContext } from './table-context'
import { useTranslation } from 'react-i18next'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'
import { useCallback } from 'react'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

type ExportButtonProps = ButtonProps & {
  columns: ColumnDef<any>[]
  isLoading?: boolean
  fetchedData?: Array<any> | undefined | null
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<any[], unknown>>
  fileName?: string
}

const useSaveToExcel = () => {
  const { t } = useTranslation()
  const { tableInstance } = useTableContext()
  const workbook = new Excel.Workbook()

  const formatCurrency =
    (locale = 'en-US', options = { currency: 'USD', minimumFractionDigits: 2 }) =>
    amount => {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        ...options,
      })

      return formatter.format(amount || 0)
    }

  const exportToExcel = useCallback(
    async (data: any[], fileName?: string) => {
      try {
        const worksheet = workbook.addWorksheet('Sheet 1')
        // each columns contains header and its mapping key from data
        const columns = tableInstance?.options?.columns || []
        const columnsNames = columns.map((column, index) => {
          const style = {}
          // @ts-ignore

          return { header: t(column.header as string), key: t(column.header as string), style }
        })
        worksheet.columns = columnsNames

        const columnDefWithAccessorKeyAsKey = reduceArrayToObject(columns, 'accessorKey')
        const dataMapped = data.map((row: any) => {
          return Object.keys(row).reduce((acc, key) => {
            const columnDef = columnDefWithAccessorKeyAsKey[key]
            const header = columnDef?.header
            const formatter = formatCurrency()
            const value = columnDef?.meta?.format === 'currency' ? formatter(row[key]) : row[key]

            // If the header is not defined we don't want to export it
            if (!header) return acc

            return {
              ...acc,
              [t(header)]: value,
            }
          }, {})
        })

        // loop through data and add each one to worksheet
        dataMapped.forEach(singleData => {
          worksheet.addRow(singleData)
        })

        // write the content using writeBuffer
        const buf = await workbook.xlsx.writeBuffer()

        // download the processed file
        saveAs(new Blob([buf]), `${fileName ?? 'export'}.xlsx`)
      } catch (error) {
        console.error('Error...', error)
      } finally {
        // removing worksheet's instance to create new one
        workbook.removeWorksheet('Sheet 1')
      }
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
          <Icon as={BiExport} fontSize={'18px'} mb="1px" />
          <Text>{t('projects.export')}</Text>
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
