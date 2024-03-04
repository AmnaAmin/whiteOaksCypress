import { Box, Center, Spinner, useDisclosure } from '@chakra-ui/react'
import TableColumnSettings from 'components/table/table-column-settings'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { useDeleteDocument, useDocuments } from 'api/vendor-projects'
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
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { mapDataForDocxExpandableRows } from '../transactions/transaction.constants'
import { ConfirmationBox } from 'components/Confirmation'
import { useGetDocumentsTableColumn } from 'constants/documents.constants'
import { t } from 'i18next'
type DocumentsProps = {
  isReadOnly?: boolean
}
export const VendorDocumentsTable = React.forwardRef((props: DocumentsProps, ref) => {
  const { projectId } = useParams<'projectId'>()
  const {
    documents,
    isLoading: isLoadingDocuments,
    isFetching: isDocumentsFetching,
  } = useDocuments({
    projectId,
  })
  const { mutate: deleteSignature, isLoading: isDocmentDeleting } = useDeleteDocument(true)
  const [dataDocx, setDataDocx] = useState<any>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [docId, setDocId] = useState(undefined)

  const getDocId = e => {
    setDocId(e?.id)
  }
  const {
    isOpen: isResetConfirmationModalOpen,
    onClose: onResetConfirmationModalClose,
    onOpen: onResetConfirmationModalOpen,
  } = useDisclosure()

  const DOCUMENTS_TABLE_COLUMNS = useGetDocumentsTableColumn(onResetConfirmationModalOpen, getDocId)
  const { mutate: postDocumentColumn } = useTableColumnSettingsUpdateMutation(TableNames.document)
  const {
    tableColumns,
    settingColumns,
    isLoading,
    refetch: refetchColumns,
  } = useTableColumnSettings(DOCUMENTS_TABLE_COLUMNS as any, TableNames.document)

  const onSave = columns => {
    postDocumentColumn(columns)
  }

  // sort the array and specify that the value with workOrderId null comes before all other values, and that all other values are equal
  const sortTransData = data => {
    if (data && data?.length > 0) {
      data.sort((x, y) => {
        return x?.workOrderId === null ? -1 : y?.workOrderId === null ? 1 : 0
      })
      return data
    } else return []
  }

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

  useEffect(() => {
    const mutateDocuments = documents?.filter(e => e.deleted !== true)

    if (documents && documents?.length > 0) {
      setDataDocx(mapDataForDocxExpandableRows(mutateDocuments as any, isVendor as boolean))
    }
  }, [documents])

  useEffect(() => {
    setTotalPages(Math.ceil((documents?.length ?? 0) / 50))
    setTotalRows(documents?.length ?? 0)
  }, [documents])
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
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
            data={sortTransData(dataDocx)}
            columns={tableColumns}
            isExpandable={true}
          >
            <Table
              onRowClick={onRowClick}
              isLoading={isLoading || isDocumentsFetching}
              isEmpty={!isLoading && !documents?.length}
            />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportCustomButton columns={tableColumns} data={documents} fileName="documents" />
                <CustomDivider />
                {settingColumns && (
                  <TableColumnSettings
                    refetch={refetchColumns}
                    disabled={isLoading}
                    onSave={onSave}
                    columns={settingColumns?.filter(t => !!t.contentKey)}
                    tableName={TableNames.document}
                    isReadOnly={isReadOnly}
                  />
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
          <ConfirmationBox
            title={t('sureConfirmation')}
            yesButtonText={t('delete')}
            content={t(`deleteDocumentsMsg`)}
            isOpen={isResetConfirmationModalOpen}
            onClose={onResetConfirmationModalClose}
            isLoading={isDocmentDeleting}
            onConfirm={() => {
              deleteSignature(docId, {
                onSuccess() {
                  onResetConfirmationModalClose()
                  setDocId(undefined)
                },
              })
            }}
          />
        </Box>
      )}
    </>
  )
})
