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
import { Project } from 'types/project.type'
import { BiBookAdd } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import InvoiceModal from './add-invoice-modal'
import { useFetchInvoices } from 'api/invoicing'
import { SelectOption } from 'types/transaction.type'

type InvoicingProps = {
  isReadOnly?: boolean
  projectData: Project | undefined
  clientSelected: SelectOption | undefined | null
}
export const InvoicingContext = createContext<{ projectData?: Project; invoiceCount?: number }>({
  projectData: undefined,
  invoiceCount: 0,
})

export const Invoicing = React.forwardRef((props: InvoicingProps, ref) => {
  const { isReadOnly, projectData, clientSelected } = props
  const { t } = useTranslation()
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const { invoices, isLoading: isLoadingInvoices } = useFetchInvoices({
    projectId: `${projectData?.id}`,
  })
  const { isOpen: isOpenInvoiceModal, onClose: onInvoiceModalClose, onOpen: onInvoiceModalOpen } = useDisclosure()

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

  const onRowClick = row => {
    setSelectedInvoice(row)
    onInvoiceModalOpen()
  }

  useEffect(() => {
    setTotalPages(Math.ceil((projectData?.resubmissionDTOList?.length ?? 0) / 50))
    setTotalRows(projectData?.resubmissionDTOList?.length ?? 0)
  }, [projectData?.resubmissionDTOList?.length])

  return (
    <>
      <Box display={'flex'} w="100%" justifyContent={'end'}>
        <Button colorScheme="brand" onClick={onInvoiceModalOpen} leftIcon={<BiBookAdd />} mb="15px">
          {t('project.projectDetails.newInvoice')}
        </Button>
      </Box>
      {invoices && (
        <Box
          overflowX={'auto'}
          w="100%"
          position="relative"
          border="1px solid #CBD5E0"
          borderRadius="6px"
          roundedRight={{ base: '0px', sm: '6px' }}
          h="550px"
        >
          <TableContextProvider
            totalPages={totalPages}
            manualPagination={false}
            data={invoices}
            columns={tableColumns}
            isExpandable={true}
          >
            <Table
              onRowClick={onRowClick}
              isLoading={isLoadingInvoices}
              isEmpty={!isLoadingInvoices && !invoices?.length}
            />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportCustomButton columns={tableColumns} data={invoices} fileName="invoices" />
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
      <InvoicingContext.Provider value={{ projectData, invoiceCount: invoices?.length }}>
        <InvoiceModal
          isOpen={isOpenInvoiceModal}
          onClose={() => {
            setSelectedInvoice(null)
            onInvoiceModalClose()
          }}
          clientSelected={clientSelected}
          selectedInvoice={selectedInvoice}
        />
      </InvoicingContext.Provider>
    </>
  )
})
