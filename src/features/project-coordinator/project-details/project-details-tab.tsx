import { HStack } from '@chakra-ui/react'
import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Card } from 'components/card/card'
import Contact from './contact'

const tabStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'gray.500',
}

const ProjectDetailsTab = () => {
  return (
    <Card rounded="16px" padding="0">
      <Tabs>
        <TabList bg="#F7FAFC" rounded="6px 6px 0 0" pt="7">
          <HStack spacing={5}>
            <Tab
              sx={tabStyle}
              _selected={{ borderBottom: '2px solid #4E87F8', fontWeight: 600, color: '#4E87F8' }}
              _focus={{ outline: 'none' }}
            >
              Project Management
            </Tab>
            <Tab
              sx={tabStyle}
              _selected={{ borderBottom: '2px solid #4E87F8', fontWeight: 600, color: '#4E87F8' }}
              _focus={{ outline: 'none' }}
            >
              Invoicing & payment
            </Tab>
            <Tab
              sx={tabStyle}
              _selected={{ borderBottom: '2px solid #4E87F8', fontWeight: 600, color: '#4E87F8' }}
              _focus={{ outline: 'none' }}
            >
              Contacts
            </Tab>
            <Tab
              sx={tabStyle}
              _selected={{ borderBottom: '2px solid #4E87F8', fontWeight: 600, color: '#4E87F8' }}
              _focus={{ outline: 'none' }}
            >
              Location
            </Tab>
            <Tab
              sx={tabStyle}
              _selected={{ borderBottom: '2px solid #4E87F8', fontWeight: 600, color: '#4E87F8' }}
              _focus={{ outline: 'none' }}
            >
              Misc
            </Tab>
          </HStack>
        </TabList>

        <TabPanels>
          <TabPanel mt="12" p="0" ml="6"></TabPanel>
          <TabPanel></TabPanel>
          <TabPanel>
            <Contact />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  )
}

export default ProjectDetailsTab
