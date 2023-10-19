import { Box, Button, useDisclosure } from '@chakra-ui/react'
import TableColumnSettings from 'components/table/table-column-settings'
import React, { createContext, useEffect, useState } from 'react'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import { INVOICING_TABLE_COLUMNS } from 'constants/invoicing.constants'
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
import { Project } from 'types/project.type'
import { BiBookAdd } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import InvoiceModal from './add-invoice-modal'

type InvoicingProps = {
  isReadOnly?: boolean
  projectData: Project | undefined
}
export const InvoicingContext = createContext<{ projectData?: Project; invoiceCount?: number }>({
  projectData: undefined,
  invoiceCount: 0,
})

export const Invoicing = React.forwardRef((props: InvoicingProps, ref) => {
  const { isReadOnly, projectData } = props
  const { t } = useTranslation()
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const {
    isOpen: isOpenTransactionModal,
    onClose: onTransactionModalClose,
    onOpen: onTransactionModalOpen,
  } = useDisclosure()

  const { mutate: postDocumentColumn } = useTableColumnSettingsUpdateMutation(TableNames.invoicing)
  const {
    tableColumns,
    settingColumns,
    isLoading,
    refetch: refetchColumns,
  } = useTableColumnSettings(INVOICING_TABLE_COLUMNS, TableNames.invoicing)

  const onSave = columns => {
    postDocumentColumn(columns)
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
    setTotalPages(Math.ceil((projectData?.resubmissionDTOList?.length ?? 0) / 50))
    setTotalRows(projectData?.resubmissionDTOList?.length ?? 0)
  }, [projectData?.resubmissionDTOList?.length])

  return (
    <>
      <Box display={'flex'} w="100%" justifyContent={'end'}>
        <Button colorScheme="brand" onClick={onTransactionModalOpen} leftIcon={<BiBookAdd />} mb="15px">
          {t('project.projectDetails.newInvoice')}
        </Button>
      </Box>
      {projectData?.resubmissionDTOList && (
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
            totalPages={totalPages}
            manualPagination={false}
            data={projectData?.resubmissionDTOList}
            columns={tableColumns}
            isExpandable={true}
          >
            <Table
              onRowClick={onRowClick}
              isLoading={isLoading}
              isEmpty={!isLoading && !projectData?.resubmissionDTOList?.length}
            />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportCustomButton
                  columns={tableColumns}
                  data={projectData?.resubmissionDTOList}
                  fileName="documents"
                />
                <CustomDivider />
                {settingColumns && (
                  <TableColumnSettings
                    refetch={refetchColumns}
                    disabled={isLoading}
                    onSave={onSave}
                    columns={settingColumns?.filter(t => !!t.contentKey)}
                    tableName={TableNames.invoicing}
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
        </Box>
      )}
      <InvoicingContext.Provider value={{ projectData, invoiceCount: projectData?.resubmissionDTOList?.length }}>
        <InvoiceModal isOpen={isOpenTransactionModal} onClose={onTransactionModalClose} />
      </InvoicingContext.Provider>
    </>
  )
})
