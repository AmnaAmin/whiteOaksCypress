import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  chakra,
  useMediaQuery,
} from '@chakra-ui/react'
import { VendorProfile, Vendor as VendorType } from 'types/vendor.types'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { t } from 'i18next'
import { ColumnDef } from '@tanstack/react-table'
import { useTableColumnSettings } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import { BiBookAdd } from 'react-icons/bi'
import VendorUserModal from './vendor-user-modal'
import { useToggleVendorActivation, useVendorUsers } from 'api/vendor-user'
import { StatusUserMgt } from 'features/user-management/status-user-mgt'
import { useAuth } from 'utils/auth-context'
import { useQueryClient } from 'react-query'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

type UserProps = {
  onClose?: () => void
  vendorProfileData: VendorProfile
}
export const VendorUsersTab: React.FC<UserProps> = ({ vendorProfileData, onClose }) => {
  //eslint-disable-next-line
  const mainVendorId = vendorProfileData?.id
  const permissions = useRoleBasedPermissions()

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
          return row.vendorAdmin ? 'Admin' : 'User'
        },
        cell: (row: any) => {
          const value = row?.row.original?.vendorAdmin
          return value ? 'Admin' : 'User'
        },
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
        },
      },
    ]
  }, [])

  const [selectedVendorUser, setSelectedVendorUser] = useState<VendorType>()
  const { tableColumns } = useTableColumnSettings(VENDOR_USERS_TABLE_COLUMNS, TableNames.vendorUsers)
  const [tableData, setTableData] = useState<any>([])
  const [toggleSwitchVendors, setToggleSwitchVendors] = useState<boolean>(false)
  //const { data, isLoading } = useUserManagement()

  //const [activationSwitch, setActivationSwitch] = useState<boolean>(false)

  const { mutate: toggleVendorActivations } = useToggleVendorActivation()

  const { data: userInfo } = useAuth()

  const { data, isLoading } = useVendorUsers(mainVendorId, userInfo?.user?.email, userInfo?.user?.id)

  const handleActivationSwitch = e => {
    setToggleSwitchVendors(e.target.checked)
    confirmationDialogOpen()
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
        account: u.vendorAdmin,
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
  const {
    isOpen: confirmationDialogIsOpen,
    onOpen: confirmationDialogOpen,
    onClose: confirmationDialogClose,
  } = useDisclosure()

  const cancelRef = useRef()

  const handleCancelActivationLogic = () => {
    setToggleSwitchVendors(!toggleSwitchVendors)
    confirmationDialogClose()
  }

  const handleActivationLogic = () => {
    const status = toggleSwitchVendors ? 'inactive' : 'active'
    toggleVendorActivations({ vendorId: mainVendorId, action: status })

    confirmationDialogClose()
  }

  const queryClient = useQueryClient()

  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const isReadOnly = useRoleBasedPermissions()?.includes('VENDOR.READ')

  return (
    <>
      <VendorUserModal
        parentVendorId={mainVendorId}
        vendorDetails={selectedVendorUser as VendorType}
        isOpen={isOpen}
        onClose={() => {
          setSelectedVendorUser(undefined)
          onCloseUsersModal()
          queryClient.resetQueries('vendor-users-list')
        }}
      />
      <Box w="100%">
        <HStack px="11px" gap="20px" mb="14px">
          {permissions.includes('VENDOR.DEACTIVEVENDOR') && (
            <FormControl display="flex">
              <FormLabel variant="strong-label" size="md">
                Deactivate Vendors
              </FormLabel>
              <chakra.span>
                <Switch
                  id="deactivate-vendors"
                  data-testid="deactivate-vendors"
                  onChange={handleActivationSwitch}
                  isChecked={toggleSwitchVendors}
                  disabled={!tableData || tableData.length === 0}
                />
              </chakra.span>
            </FormControl>
          )}
          {!isMobile && <Spacer />}
          {!isReadOnly && (
            <Box display="flex" alignItems={{ sm: '', lg: 'flex-end' }}>
              <Button onClick={openNewUserForm} colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />}>
                New User
              </Button>
            </Box>
          )}
        </HStack>
        <VStack
          px="11px"
          gap="20px"
          mb="14px"
          sx={{
            '@media screen and (max-width: 480px)': {
              width: '320px',
            },
          }}
        >
          <Box
            overflow={'auto'}
            w="100%"
            h="530px"
            position="relative"
            roundedTop={6}
            border="1px solid #CBD5E0"
            rounded="3px"
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
      </Box>
      <AlertDialog
        isOpen={confirmationDialogIsOpen}
        leastDestructiveRef={cancelRef as any}
        onClose={confirmationDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {toggleSwitchVendors ? 'Deactivate Vendors' : 'Activate Vendors'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {toggleSwitchVendors &&
                'Vendor and all of its users will be deactivated. They will not be able to login to the portal and no new work order can be assigned to the vendor.'}
              {!toggleSwitchVendors &&
                'Vendor and all of its users will be activated. They will be able to login to the portal.'}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                variant="outline"
                colorScheme="brand"
                ref={cancelRef as any}
                onClick={handleCancelActivationLogic}
              >
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleActivationLogic} mr={3} ml={5}>
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
