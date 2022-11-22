import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'

import { PROJECT_COLUMNS } from 'constants/projects.constants'
import { useFetchFilteredProjects } from 'api/admin-dashboard'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import { ExportButton } from 'components/table-refactored/export-button'
import { CARD_URL } from './admin-dashboard.utils'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { useNavigate } from 'react-router-dom'
type ProjectProps = {
  selectedCard: string
}

export const FilteredProjectsData: React.FC<ProjectProps> = ({ selectedCard }) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (selectedCard) {
      setFilteredUrl(CARD_URL[selectedCard])
    }
  }, [selectedCard])

  const [filteredUrl, setFilteredUrl] = useState<string | null>(null)
  const { data, isLoading, isFetching } = useFetchFilteredProjects(filteredUrl)

  const onRowClick = rowData => {
    navigate(`/project-details/${rowData.id}`)
  }

  return (
    <Box h={'500px'} overflow="auto">
      <TableContextProvider
        data={data}
        columns={PROJECT_COLUMNS}
        totalPages={data?.length ? Math.ceil(data?.length / 10) : -1}
        manualPagination={false}
      >
        <Table onRowClick={onRowClick} isLoading={isLoading || isFetching} isEmpty={!isLoading && !data?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              columns={PROJECT_COLUMNS}
              fetchedData={data}
              isLoading={isLoading}
              colorScheme="brand"
              fileName="projects.xlsx"
            />
          </ButtonsWrapper>
          <TablePagination>
            <ShowCurrentRecordsWithTotalRecords dataCount={data ? data?.length : 0} />
            <GotoFirstPage />
            <GotoPreviousPage />
            <GotoNextPage />
            <GotoLastPage />
          </TablePagination>
        </TableFooter>
      </TableContextProvider>
    </Box>
  )
}
