import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Flex,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Icon,
  HStack,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react'
import { VendorProfile, Vendor as VendorType } from 'types/vendor.types'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { t } from 'i18next'
import { ColumnDef } from '@tanstack/react-table'
import { useTableColumnSettings } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import { Card } from 'components/card/card'
import { BiBookAdd } from 'react-icons/bi'
import VendorUserModal from './vendor-user-modal'
import { useToggleVendorActivation, useVendorUsers } from 'api/vendor-user'
import { StatusUserMgt } from 'features/user-management/status-user-mgt'
import { useAuth } from 'utils/auth-context'

type UserProps = {
  onClose?: () => void
  vendorProfileData: VendorProfile
}
export const VendorUsersTab: React.FC<UserProps> = ({ vendorProfileData, onClose }) => {
  //eslint-disable-next-line
  const mainVendorId = vendorProfileData.id

  const VENDOR_USERS_TABLE_COLUMNS: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'First Name',
        accessorKey: 'firstName',
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        header: 'Account',
        accessorKey: 'accountType',
        accessorFn: row => {
          return row?.account ? 'Admin' : 'User'
        },
        cell: ( row: any ) => {
          return row.account ? "Admin" : "User"
        }
      },
      {
        header: 'Language',
        accessorKey: 'language',
      },
      {
        header: 'status',
        accessorKey: 'Status',
        accessorFn: row => {
          return row?.status ? 'Activated' : 'Deactivate'
        },
        cell: (row: any) => {
          const value = row?.row.original?.status
          return <StatusUserMgt id={value} />
        }
      },
    ]
  }, [])

  const [selectedVendorUser, setSelectedVendorUser] = useState<VendorType>()
  const { tableColumns } = useTableColumnSettings(VENDOR_USERS_TABLE_COLUMNS, TableNames.vendorUsers)
  const [tableData, setTableData] = useState<any>([])
  //const { data, isLoading } = useUserManagement()
  
  const [ activationSwitch, setActivationSwitch ] = useState<boolean>(false);

  const { mutate: toggleVendorActivations } = useToggleVendorActivation()

  const { data: userInfo } = useAuth();

  console.log( userInfo );

  const { data, isLoading } = useVendorUsers( mainVendorId, userInfo?.user?.email );
  
  const handleActivationSwitch = e => {
    const status = e.target.checked ? 'active' : 'inactive'
    toggleVendorActivations({ vendorId: mainVendorId, action: status })
  }

  const mapToTable = data => {
    return data?.map(u => {
      return {
        ...u,
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        status: u.activated,
        email: u.email,
        language: u.langKey,
        account: u.primaryAdmin,
      }
    })
  }

  useEffect(() => {
    setTableData(mapToTable(data))
  }, [isLoading])

  const openNewUserForm = () => {
    setSelectedVendorUser(undefined)
    onOpen()
  }

  const setSelectedVendor = r => {
    setSelectedVendorUser(r)
    onOpen()
  }

  const { isOpen, onOpen, onClose: onCloseUsersModal } = useDisclosure()

  return (
    <Card px={0}>
      <VendorUserModal
        parentVendorId={mainVendorId}
        vendorDetails={selectedVendorUser as VendorType}
        isOpen={isOpen}
        onClose={() => {
          setSelectedVendorUser(undefined)
          onCloseUsersModal()
        }}
      />
      <HStack px="11px" gap="20px" mb="14px">
        <FormControl display="flex">
          <FormLabel htmlFor="deactivate-vendors" mb="0">
            Deactivate Vendors
          </FormLabel>
          <Switch id="deactivate-vendors" data-testid="deactivate-vendors" onChange={handleActivationSwitch} />
        </FormControl>
        <Spacer />
        <Box display="flex" alignItems="flex-end">
          <Button onClick={openNewUserForm} colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />}>
            New User
          </Button>
        </Box>
      </HStack>
      <VStack px="11px" gap="20px" mb="14px">
        <Box
          overflow={'auto'}
          w="100%"
          h="530px"
          position="relative"
          roundedTop={6}
          border="1px solid #CBD5E0"
          rounded="6px"
        >
          <TableContextProvider data={tableData} columns={tableColumns}>
            <Table isLoading={isLoading} isEmpty={!tableData?.length} onRowClick={r => setSelectedVendor(r)} />
          </TableContextProvider>
        </Box>
      </VStack>
      <Flex
        px={2}
        borderTop="2px solid #E2E8F0"
        alignItems="center"
        height="66px"
        pt="8px"
        w="100%"
        justifyContent="end"
      >
        {onClose && (
          <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
            {t('cancel')}
          </Button>
        )}
      </Flex>
    </Card>
  )
}
