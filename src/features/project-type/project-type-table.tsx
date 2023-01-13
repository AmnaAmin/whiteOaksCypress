import { Box, useDisclosure } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
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
      return dateFormat(cellInfo.createdDate)
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
      return dateFormat(cellInfo.lastModifiedDate)
    },
    meta: { format: 'date' },
  },
]

export const ProjectTypeTable = () => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [selectedProjectType, setSelectedProjectType] = useState()
  const { data: projectType, isLoading } = useProjectType()
  return (
    <Box overflow="auto" roundedTop={8}>
      <ProjectTypeModal
        projectTypetDetails={selectedProjectType}
        onClose={() => {
          setSelectedProjectType(undefined)
          onCloseDisclosure()
        }}
        isOpen={isOpen}
      />

      <Box overflow={'auto'} h="calc(100vh - 160px)" roundedTop={6}>
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
