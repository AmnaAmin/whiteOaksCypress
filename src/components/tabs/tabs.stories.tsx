import { Tab, TabList, Tabs, TabPanels, TabPanel } from './tabs'
export default {
  title: 'UI/Tabs',
}

export const TabsEnclosed = () => {
  return (
    <Tabs size="md" variant="filled" colorScheme="blue">
      <TabList>
        <Tab>One</Tab>
        <Tab>Two</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export const TabsLine = () => {
  return (
    <Tabs size="md" variant="line" colorScheme="blue">
      <TabList>
        <Tab>One</Tab>
        <Tab>Two</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
