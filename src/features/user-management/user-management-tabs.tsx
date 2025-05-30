import React, { useState } from 'react'
import { Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react'
import { EditUserModal } from './edit-user-modal'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'
import { USER_MANAGEMENT } from './user-management.i8n'
import { VendorUsersTable } from './vendor-users-table'
import { WOAUsersTable } from './woa-users-table'
import { DevtekUsersTable } from './devtek-users-table'
import { BiAddToQueue } from 'react-icons/bi'
import { useAccountData } from 'api/user-account'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const UserManagementTabs = React.forwardRef((props: any, ref) => {
  const [selectedUser, setSelectedUser] = useState(undefined)
  const { t } = useTranslation()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('USERMANAGER.READ')
  const { onOpen } = useDisclosure()
  const { data } = useAccountData()
  const [tabIndex, setTabIndex] = useState<number | undefined>(0)

  return (
    <>
      {selectedUser && (
        <EditUserModal
          tabIndex={tabIndex}
          user={selectedUser}
          isOpen={selectedUser ? true : false}
          onClose={() => {
            setSelectedUser(undefined)
          }}
        />
      )}
      <Tabs index={tabIndex} onChange={index => setTabIndex(index)} variant="enclosed" colorScheme="brand">
        <TabList whiteSpace="nowrap" border="none">
          <Tab>{t(`${USER_MANAGEMENT}.table.woaUsers`)}</Tab>
          <Tab>{t(`${USER_MANAGEMENT}.table.vendorUsers`)}</Tab>
          {data?.devAccount && <Tab>{t(`${USER_MANAGEMENT}.table.devtekUsers`)}</Tab>}
        </TabList>
        <Flex justifyContent="flex-end" alignItems="center">
          <>
            {!isReadOnly && (
              <Button
                mt="-54px"
                data-testid="add-user"
                colorScheme="brand"
                onClick={props.onOpenUserModal}
                leftIcon={<BiAddToQueue />}
              >
                {t(`${USER_MANAGEMENT}.modal.addUser`)}
              </Button>
            )}
          </>
        </Flex>
        <Card
          mt="1px"
          rounded="0px"
          roundedRight={{ base: '0px', md: '6px' }}
          roundedBottom="6px"
          pr={{ base: 0, sm: '15px' }}
        >
          <TabPanels>
            <TabPanel px={0}>
              <WOAUsersTable setSelectedUser={setSelectedUser} onOpen={onOpen} isReadOnly={isReadOnly} />
            </TabPanel>
            <TabPanel px={0}>
              <VendorUsersTable setSelectedUser={setSelectedUser} onOpen={onOpen} isReadOnly={isReadOnly} />
            </TabPanel>
            {data?.devAccount && (
              <TabPanel px={0}>
                <DevtekUsersTable setSelectedUser={setSelectedUser} onOpen={onOpen} isReadOnly={isReadOnly} />
              </TabPanel>
            )}
          </TabPanels>
        </Card>
      </Tabs>
    </>
  )
})
