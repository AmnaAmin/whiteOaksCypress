import { Box, useDisclosure } from '@chakra-ui/react'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { PROJECT_TYPE } from './project-type.i18n'
import { useState } from 'react'
import { ProjectTypeModal } from './project-type-modal'
import { useProjectType } from 'api/project-type'

export const PROJECT_TYPE_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${PROJECT_TYPE}.type`,
    accessorKey: 'value',
  },
  {
    header: `${PROJECT_TYPE}.createdBy`,
    accessorKey: 'createdBy',
  },
  {
    header: `${PROJECT_TYPE}.createdDate`,
    accessorKey: 'createdDate',
    accessorFn(cellInfo) {
      return datePickerFormat(cellInfo.createdDate)
    },
    cell: (row: any) => {
      const value = row?.row.original?.createdDate
      return value ? dateFormat(value) : '- - -'
    },
    meta: { format: 'date' },
  },
  {
    header: `${PROJECT_TYPE}.modifiedBy`,
    accessorKey: 'lastModifiedBy',
  },
  {
    header: `${PROJECT_TYPE}.modifiedDate`,
    accessorKey: 'lastModifiedDate',
    accessorFn(cellInfo) {
      return datePickerFormat(cellInfo.lastModifiedDate)
    },
    cell: (row: any) => {
      const value = row?.row.original?.lastModifiedDate
      return value ? dateFormat(value) : '- - -'
    },
    meta: { format: 'date' },
  },
]

export const ProjectTypeTable = () => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [selectedProjectType, setSelectedProjectType] = useState()
  const { data: projectType, isLoading } = useProjectType()
  return (
    <Box overflow="auto" roundedTop={6} border="1px solid #CBD5E0">
      <ProjectTypeModal
        projectTypeDetails={selectedProjectType}
        onClose={() => {
          setSelectedProjectType(undefined)
          onCloseDisclosure()
        }}
        isOpen={isOpen}
      />

      <Box overflowX={'auto'} h="calc(100vh - 170px)" roundedTop={6}>
        <TableContextProvider data={projectType} columns={PROJECT_TYPE_COLUMNS}>
          <Table
            isLoading={isLoading}
            onRowClick={row => {
              setSelectedProjectType(row)
              onOpen()
            }}
          />
        </TableContextProvider>
      </Box>
    </Box>
  )
}
