import { Tab, TabList, Tabs, TabPanels, TabPanel } from './tabs'
export default {
  title: 'UI/Tabs',
}

export const TabsEnclosed = () => {
  return (
    <Tabs size="md" variant="enclosed" colorScheme="blue">
      <TabList>
        <Tab variant="enclosed">One</Tab>
        <Tab variant="enclosed">Two</Tab>
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
        <Tab variant="line">One</Tab>
        <Tab variant="line">Two</Tab>
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
