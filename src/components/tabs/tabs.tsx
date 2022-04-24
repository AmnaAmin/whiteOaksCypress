import {
  Tabs,
  TabList as ChakraTabList,
  TabPanels as ChakraTabPanels,
  Tab as ChakraTab,
  TabPanel as ChakraTabPanel,
  TabListProps,
  TabPanelsProps,
  TabPanelProps,
  TabProps,
} from '@chakra-ui/react'

const TabList: React.FC<TabListProps> = props => {
  return (
    <ChakraTabList
      borderBottomWidth="2px"
      borderStyle="solid"
      borderColor="gray.200"
      whiteSpace="nowrap"
      color="gray.600"
      fontWeight={500}
      {...props}
    >
      {props.children}
    </ChakraTabList>
  )
}

const TabPanels: React.FC<TabPanelsProps> = props => {
  return <ChakraTabPanels {...props}>{props.children}</ChakraTabPanels>
}

const TabPanel: React.FC<TabPanelProps> = props => {
  return <ChakraTabPanel {...props}>{props.children}</ChakraTabPanel>
}

const Tab: React.FC<TabProps> = props => {
  return (
    <ChakraTab _focus={{ outline: 'none' }} {...props}>
      {props.children}
    </ChakraTab>
  )
}

export { TabList, TabPanel, TabPanels, Tab, Tabs }
