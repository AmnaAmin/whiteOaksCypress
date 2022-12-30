import { Box } from '@chakra-ui/react'
import TableColumnSettings from 'components/table/table-column-settings'
import React from 'react'
import { useParams } from 'react-router'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { useDocuments } from 'api/vendor-projects'
import { DOCUMENTS_TABLE_COLUMNS } from 'constants/documents.constants'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import { Table } from 'components/table-refactored/table'
import { ExportCustomButton } from 'components/table-refactored/export-button'

export const VendorDocumentsTable = React.forwardRef((_, ref) => {
  const { projectId } = useParams<'projectId'>()
  const { documents = [] } = useDocuments({
    projectId,
  })

  const { mutate: postDocumentColumn } = useTableColumnSettingsUpdateMutation(TableNames.document)
  const { tableColumns, settingColumns, isLoading } = useTableColumnSettings(
    DOCUMENTS_TABLE_COLUMNS,
    TableNames.document,
  )

  const onSave = columns => {
    postDocumentColumn(columns)
  }

  const onRowClick = row => {}

  return (
    <Box border="1px solid #CBD5E0" borderRadius="6px" roundedRight={{ base: '0px', sm: '6px' }}>
      <TableContextProvider data={documents} columns={tableColumns}>
        <Table onRowClick={onRowClick} isLoading={isLoading} isEmpty={!isLoading && !documents?.length} />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportCustomButton columns={tableColumns} data={documents} fileName="documents" />

            {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
          </ButtonsWrapper>
        </TableFooter>
      </TableContextProvider>
    </Box>
  )
})
