import React, { useState } from 'react'
import { Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react'
import { EditUserModal } from './edit-user-modal'
import { useTranslation } from 'react-i18next'
import { Card } from 'components/card/card'
import { USER_MANAGEMENT } from './user-management.i8n'
import { VendorUsersTable } from './vendor-users-table'
import { WOAUsersTable } from './woa-users-table'
import { DevtekUsersTable } from './devtek-users-table'

export const UserManagementTabs = React.forwardRef((props: any, ref) => {
  const [selectedUser, setSelectedUser] = useState(undefined)
  const { t } = useTranslation()

  const { onOpen } = useDisclosure()

  return (
    <>
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={selectedUser ? true : false}
          onClose={() => {
            setSelectedUser(undefined)
          }}
        />
      )}
      <Tabs variant="enclosed" colorScheme="brand">
        <TabList whiteSpace="nowrap" border="none">
          <Tab>{t(`${USER_MANAGEMENT}.table.vendorUsers`)}</Tab>
          <Tab>{t(`${USER_MANAGEMENT}.table.woaUsers`)}</Tab>
          <Tab>{t(`${USER_MANAGEMENT}.table.devtekUsers`)}</Tab>
        </TabList>
        <Card rounded="0px" roundedRight={{ base: '0px', md: '6px' }} roundedBottom="6px" pr={{ base: 0, sm: '15px' }}>
          <TabPanels>
            <TabPanel px={0}>
              <VendorUsersTable setSelectedUser={setSelectedUser} onOpen={onOpen} />
            </TabPanel>
            <TabPanel px={0}>
              <WOAUsersTable setSelectedUser={setSelectedUser} onOpen={onOpen} />
            </TabPanel>
            <TabPanel px={0}>
              <DevtekUsersTable setSelectedUser={setSelectedUser} onOpen={onOpen} />
            </TabPanel>
          </TabPanels>
        </Card>
      </Tabs>
    </>
  )
})
