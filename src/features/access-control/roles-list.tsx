import { HStack, Flex, useDisclosure, Box } from '@chakra-ui/react'
import { ACCESS_CONTROL } from 'features/access-control/access-control.i18n'
import { useTranslation } from 'react-i18next'
import { BiTrash } from 'react-icons/bi'
import { useDeleteRole, useFetchRoles } from 'api/access-control'
import { ConfirmationBox } from 'components/Confirmation'
import { TableContextProvider } from 'components/table-refactored/table-context'
import { TableFooter } from 'components/table-refactored/table-footer'
import {
  GotoFirstPage,
  GotoLastPage,
  GotoNextPage,
  GotoPreviousPage,
  ShowCurrentRecordsWithTotalRecords,
  TablePagination,
} from 'components/table-refactored/pagination'
import { useEffect, useMemo, useState } from 'react'
import Table from 'components/table-refactored/table'
import { ColumnDef } from '@tanstack/react-table'

export const RolesList = ({ setSelectedRole, selectedRole, allowEdit }) => {
  const { t } = useTranslation()
  const { data: roles, isFetching } = useFetchRoles()
  const { isOpen: isOpenDeleteModal, onClose: onCloseDeleteModal, onOpen: onOpenDeleteModal } = useDisclosure()
  const { mutate: deleteRole, isLoading } = useDeleteRole()
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [binIcon, setBinIcon] = useState(null)

  const ROLES_TABLE_COLUMNS: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: `${ACCESS_CONTROL}.roles`,
        accessorKey: 'name',
        cell: cell => {
          const role = cell?.row?.original as any
          return (
            <Flex justifyContent={'space-between'}>
              <Box>{role.name}</Box>
              <HStack gap="20px">
                {allowEdit && (
                  <Flex
                    gap="5px"
                    _hover={{ color: 'brand.600', cursor: 'pointer' }}
                    fontSize={'14px'}
                    display={binIcon === role.name ? 'block' : 'none'}
                    data-testid={'remove-' + role.name}
                    color="gray.500"
                    fontWeight={'400'}
                    fontStyle={'normal'}
                    onClick={() => {
                      setSelectedRole(role)
                      onOpenDeleteModal()
                    }}
                  >
                    <BiTrash></BiTrash>
                  </Flex>
                )}
              </HStack>
            </Flex>
          )
        },
      },
    ]
  }, [setSelectedRole, onOpenDeleteModal, binIcon, setBinIcon])

  useEffect(() => {
    if (!roles?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((roles?.length ?? 0) / 50))
      setTotalRows(roles?.length ?? 0)
    }
  }, [roles])

  const setPageCount = rows => {
    if (!rows?.length) {
      setTotalPages(1)
      setTotalRows(0)
    } else {
      setTotalPages(Math.ceil((rows?.length ?? 0) / 50))
      setTotalRows(rows?.length ?? 0)
    }
  }

  return (
    <>
      <Box
        w="100%"
        maxH="350px"
        position="relative"
        borderRadius="6px"
        border="1px solid #CBD5E0"
        overflowX="auto"
        roundedRight={{ base: '0px', sm: '6px' }}
      >
        <TableContextProvider
          totalPages={totalPages}
          data={roles}
          columns={ROLES_TABLE_COLUMNS}
          manualPagination={false}
        >
          <Table
            isLoading={isFetching}
            isEmpty={!isFetching && !roles?.length}
            onRowClick={setSelectedRole}
            hightlightSelectedRow={true}
            handleMouseEnter={row => {
              setBinIcon(row.name)
            }}
            handleMouseLeave={() => {
              setBinIcon(null)
            }}
          />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <Box h="35px" />

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
      <ConfirmationBox
        title={t(`${ACCESS_CONTROL}.deleteModal`)}
        content={t(`${ACCESS_CONTROL}.deleteRoleContent`)}
        isOpen={!!selectedRole && isOpenDeleteModal}
        onClose={onCloseDeleteModal}
        isLoading={isLoading}
        onConfirm={() => {
          deleteRole(selectedRole?.name)
          onCloseDeleteModal()
          setSelectedRole(null)
        }}
        showNoButton={true}
      />
    </>
  )
}
