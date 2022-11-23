import React from 'react'
import { Box, Button, HStack, Icon, Text } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { Table } from 'components/table-refactored/table'
import { RiCloseFill } from 'react-icons/ri'
import { ButtonsWrapper, TableFooter } from 'components/table-refactored/table-footer'
import { ExportButton } from 'components/table-refactored/export-button'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import TableColumnSettings from 'components/table/table-column-settings'
import { settingColumns } from 'components/table-refactored/make-data'
import { DASHBOARD } from './dashboard.i18n'
import { useTranslation } from 'react-i18next'

type workOrderType = {
  setSeeDetails: (boolean) => void
  setHoverButton: (boolean) => void
  seeDetails: boolean
  hoverButton: boolean
}

export const UpcomingPaymentTable: React.FC<workOrderType> = ({
  setSeeDetails,
  setHoverButton,
  seeDetails,
  hoverButton,
}) => {
  const { t } = useTranslation()

  const columns: ColumnDef<any>[] = [
    {
      header: t(`${DASHBOARD}.projectID`),
      accessorKey: 'companyName',
    },
    {
      header: t(`${DASHBOARD}.woStatus`),
      accessorKey: 'contacts[0].contact',
      //   accessorFn: row => row.contacts?.[0]?.contact,
    },
    {
      header: t(`${DASHBOARD}.woID`),
      accessorKey: 'streetAddress',
      //   accessorFn: row => row.streetAddress,
    },
    {
      header: t(`${DASHBOARD}.address`),
      accessorKey: 'contacts[0].phoneNumber',
      //   accessorFn: row => row.contacts?.[0]?.phoneNumber,
    },
    {
      header: t(`${DASHBOARD}.trade`),
      accessorKey: 'contacts[0].emailAddress',
      //   accessorFn: row => row.contacts?.[0]?.emailAddress,
    },
    {
      header: t(`${DASHBOARD}.dueDateWO`),
      accessorKey: 'accountPayableContactInfos[0].emailAddress',
      //   accessorFn: row => row.accountPayableContactInfos?.[0]?.emailAddress,
    },
    {
      header: () => {
        return (
          <HStack>
            <Text isTruncated w={160}>
              {t(`${DASHBOARD}.expectedPayment`)}
            </Text>
            {hoverButton && (
              <Button
                variant="ghost"
                colorScheme="gray"
                minW={'10px'}
                h={4}
                p={1}
                rounded={2}
                onClick={() => {
                  setSeeDetails(!seeDetails)
                  setHoverButton(false)
                }}
                transition={{ width: '10s', height: '4s' }}
                onMouseEnter={() => setHoverButton(true)}
              >
                <Icon as={RiCloseFill} fontSize={20} />
              </Button>
            )}
          </HStack>
        )
      },
      accessorKey: 'accountPayableContactInfos[0].phoneNumber',
      //   accessorFn: row => row.accountPayableContactInfos?.[0]?.phoneNumber,
    },
  ]

  const onSave = () => {}

  return (
    <Box overflow={'auto'} h="calc(100vh - 225px)">
      <TableContextProvider data={[]} columns={columns}>
        <Table
          onRowClick={() => {}}
          // isLoading={isLoading}
          isEmpty={true}
        />
        <TableFooter position="sticky" bottom="0" left="0" right="0">
          <ButtonsWrapper>
            <ExportButton
              columns={[]}
              //   refetch={refetch}
              isLoading={true}
              colorScheme="brand"
              fileName="projects.xlsx"
            />
            {settingColumns && <TableColumnSettings disabled={true} onSave={onSave} columns={[]} />}
          </ButtonsWrapper>
          <TablePagination>
            <ShowCurrentRecordsWithTotalRecords dataCount={[]} />
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
