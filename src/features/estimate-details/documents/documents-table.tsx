import { Box, Center, Spinner } from '@chakra-ui/react'
import TableColumnSettings from 'components/table/table-column-settings'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { useDocuments } from 'api/vendor-projects'
import { DOCUMENTS_TABLE_COLUMNS } from 'constants/documents.constants'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportCustomButton } from 'components/table-refactored/export-button'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

export const VendorDocumentsTable = React.forwardRef((_, ref) => {
  const { projectId } = useParams<'projectId'>()
  const { documents, isLoading: isLoadingDocuments } = useDocuments({
    projectId,
  })
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)

  const { mutate: postDocumentColumn } = useTableColumnSettingsUpdateMutation(TableNames.document)
  const { tableColumns, settingColumns, isLoading } = useTableColumnSettings(
    DOCUMENTS_TABLE_COLUMNS,
    TableNames.document,
  )

  const onSave = columns => {
    postDocumentColumn(columns)
  }

  useEffect(() => {
    setTotalPages(Math.ceil((documents?.length ?? 0) / 50))
    setTotalRows(documents?.length ?? 0)
  }, [documents])

  const setPageCount = rows => {
    if (!rows?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((rows?.length ?? 0) / 50))
      setTotalRows(rows?.length ?? 0)
    }
  }

  const onRowClick = row => {}

  const { isVendor } = useUserRolesSelector()

  return (
    <>
      {isLoadingDocuments && (
        <Center minH="calc(100vh - 450px)">
          <Spinner size="lg" />
        </Center>
      )}
      {documents && (
        <Box
          overflowX={'auto'}
          w="100%"
          position="relative"
          border="1px solid #CBD5E0"
          borderRadius="6px"
          roundedRight={{ base: '0px', sm: '6px' }}
          minH={isVendor ? { sm: 'auto', md: 'calc(100vh - 370px)' } : { sm: 'auto', md: 'calc(100vh - 507px)' }}
        >
          <TableContextProvider
            totalPages={documents?.length ? totalPages : -1}
            manualPagination={false}
            data={documents}
            columns={tableColumns}
          >
            <Table onRowClick={onRowClick} isLoading={isLoading} isEmpty={!isLoading && !documents?.length} />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportCustomButton columns={tableColumns} data={documents} fileName="documents" />
                <CustomDivider />
                {settingColumns && (
                  <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />
                )}
              </ButtonsWrapper>
              <TablePagination>
                <ShowCurrentRecordsWithTotalRecords dataCount={totalRows} setPageCount={setPageCount} />
                <GotoFirstPage />
                <GotoPreviousPage />
                <GotoNextPage />
                <GotoLastPage />
              </TablePagination>
            </TableFooter>
          </TableContextProvider>
        </Box>
      )}
    </>
  )
})
