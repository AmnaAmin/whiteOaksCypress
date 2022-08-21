// Export React Table to excel button component
// Language: typescript

import { Button, ButtonProps, Flex, Text } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { BiExport } from 'react-icons/bi'
import XLSX from 'xlsx'

type ExportButtonProps = ButtonProps & { columns: ColumnDef<any>[]; data: any; fileName?: string }
export const ExportButton: React.FC<ExportButtonProps> = ({ data, children, fileName, ...rest }) => {
  const handleExport = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
    XLSX.writeFile(wb, fileName ?? 'export.csv')
  }

  return (
    <Button variant="ghost" onClick={handleExport} {...rest}>
      {children ?? (
        <Flex justifyContent="center">
          <BiExport fontSize={'18px'} />
          <Text ml="2.88">Export</Text>
        </Flex>
      )}
    </Button>
  )
}
