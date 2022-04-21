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

const Tab: React.FC<TabProps & { variant?: 'enclosed' | 'line' }> = ({ variant = 'enclosed', ...props }) => {
  const selectedStyle =
    variant === 'enclosed'
      ? { color: 'white', bg: '#4E87F8', fontWeight: 600, _hover: { backgroundColor: '#4E87F8' } }
      : { borderBottom: '2px solid #4E87F8', color: '#4E87F8', fontWeight: '600' }

  return (
    <ChakraTab _focus={{ outline: 'none' }} _selected={selectedStyle} {...props}>
      {props.children}
    </ChakraTab>
  )
}

export { TabList, TabPanel, TabPanels, Tab, Tabs }
