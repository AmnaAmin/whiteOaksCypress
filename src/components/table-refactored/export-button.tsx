// Export React Table to excel button component
// Language: typescript

import { Button, ButtonProps, HStack, Icon, Text } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { BiExport } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'
import { useSaveToExcel } from './util'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

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
  const { isFPM } = useUserRolesSelector()

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
    <Button
      variant="ghost"
      onClick={handleExport}
      {...rest}
      isDisabled={isLoading || isFPM}
      colorScheme="darkBlue"
    >
      {children ?? (
        <HStack spacing={1}>
          <Icon as={BiExport} fontSize={'18px'} mb="1px" fontWeight={500} />
          <Text fontWeight={500}>{t('export')}</Text>
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
    <Button variant="ghost" colorScheme="darkBlue" onClick={handleExport} {...rest}>
      {children ?? (
        <HStack spacing={1}>
          <BiExport fontSize={'18px'} />

          <Text fontWeight={500}>{t('export')}</Text>
        </HStack>
      )}
    </Button>
  )
}
