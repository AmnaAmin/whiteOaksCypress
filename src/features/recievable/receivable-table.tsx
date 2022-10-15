import React from 'react'
import { Box } from '@chakra-ui/react'
// import AccountReceivableModal from 'features/recievable/account-receivable-modal'
// import { usePCRecievable } from 'api/account-receivable'
// import UpdateTransactionModal from 'features/project-details/transactions/update-transaction-modal'
import { ColumnDef, ColumnFiltersState, PaginationState, Updater } from '@tanstack/react-table'
// import { TableContextProvider } from 'components/table-refactored/table-context'

type ReceivableProps = {
  receivableColumns: ColumnDef<any>[]
  setPagination: (updater: Updater<PaginationState>) => void
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  pagination: PaginationState
  queryStringWithPagination: string
  queryStringWithoutPagination: string
}

export const ReceivableTable: React.FC<ReceivableProps> = () => {
  // const [selectedTransactionId, setSelectedTransactionId] = useState<number>()
  // const [selectedProjectId, setSelectedProjectId] = useState<string>()
  // const {
  //   // isOpen: isAccountReceivableModal,
  //   // onOpen: onAccountReceivableModalOpen,
  //   // onClose: onAccountReceivableModalClose,
  // } = useDisclosure()
  // const { isOpen: isOpenTransactionModal, onOpen: onEditModalOpen, onClose: onTransactionModalClose } = useDisclosure()

  // const onRowClick = useCallback(
  //   (_, row) => {
  //     if (row.original.type === 'draw') {
  //       setSelectedTransactionId(row.original.changeOrderId)
  //       setSelectedProjectId(row.original.projectId)
  //       onEditModalOpen()
  //     } else {
  //       setSelectedProjectId(row.original.projectId)
  //       onAccountReceivableModalOpen()
  //     }
  //   },
  //   [onAccountReceivableModalOpen],
  // )
  // const { receivableData, isLoading } = usePCRecievable()
  // const receivable = receivableData?.arList

  // const [receivableFilterData, setFilterReceivableData] = useState(receivable)

  // useEffect(() => {
  //   if (!selectedCard && !selectedDay) setFilterReceivableData(receivable)
  //   setFilterReceivableData(
  //     receivable?.filter(
  //       project =>
  //         !selectedCard || project.durationCategory?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase(),
  //     ),
  //   )

  //   // Due Project Weekly Filter
  //   const getDates = weekDayFilters?.filter(day => selectedDay === day.id)

  //   const clientDate = getDates?.map(date => {
  //     return date?.date
  //   })

  //   if (selectedDay) {
  //     setFilterReceivableData(
  //       receivable?.filter(receivableValue => {
  //         return clientDate.includes(receivableValue.expectedPaymentDate?.substr(0, 10))
  //       }),
  //     )
  //   }
  // }, [selectedCard, selectedDay, receivable])

  return (
    <Box overflow="auto" width="100%">
      {/* <TableWrapper
        onRowClick={onRowClick}
        columns={receivableColumns}
        setTableInstance={setTableInstance}
        data={receivableFilterData || []}
        isLoading={isLoading}
        TableRow={ReceivableRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
        defaultFlexStyle={false}
      /> */}
      {/* <TableContextProvider
            data={workOrders}
            columns={receivableColumns}
            pagination={pagination}
            setPagination={setPagination}
            // columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            totalPages={totalPages}
          >
            <Table isLoading={isLoading} onRowClick={onRowClick} isEmpty={!isLoading && !workOrders?.length} />
            <TableFooter position="sticky" bottom="0" left="0" right="0">
              <ButtonsWrapper>
                <ExportButton
                  columns={tableColumns}
                  refetch={refetch}
                  isLoading={isExportDataLoading}
                  colorScheme="brand"
                  fileName="payable.xlsx"
                />
                {settingColumns && (
                  <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />
                )}
              </ButtonsWrapper>
              <TablePagination>
                <ShowCurrentPageWithTotal />
                <GotoFirstPage />
                <GotoPreviousPage />
                <GotoNextPage />
                <GotoLastPage />
              </TablePagination>
            </TableFooter>
          </TableContextProvider> */}
      {/* <AccountReceivableModal
        projectId={selectedProjectId}
        isOpen={isAccountReceivableModal}
        onClose={onAccountReceivableModalClose}
      />
      <UpdateTransactionModal
        isOpen={isOpenTransactionModal}
        onClose={onTransactionModalClose}
        selectedTransactionId={selectedTransactionId as number}
        projectId={selectedProjectId as string}
      /> */}
    </Box>
  )
}
