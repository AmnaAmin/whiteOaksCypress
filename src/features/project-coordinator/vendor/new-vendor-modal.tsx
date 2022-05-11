import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'components/tabs/tabs'
import React from 'react'
import Details from './details'

export const NewVendorTabs = () => {
  return (
    <Tabs size="md" variant="enclosed" colorScheme="brand">
      <TabList>
        <Tab>Details</Tab>
        <Tab>Documents</Tab>
        <Tab>License</Tab>
        <Tab>Trade</Tab>
        <Tab>Market</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p="0" mt="4">
          <Details />
        </TabPanel>
        <TabPanel></TabPanel>
        <TabPanel></TabPanel>
        <TabPanel>Trade section</TabPanel>
        <TabPanel>Market section</TabPanel>
      </TabPanels>
    </Tabs>
  )
}

type NewVendorModalType = {
  isOpen: boolean
  onClose: () => void
}

const NewVendorModal: React.FC<NewVendorModalType> = props => {
  return (
    <Box>
      <Modal onClose={props.onClose} isOpen={props.isOpen} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Vendor New Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <NewVendorTabs />
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose} variant="outline" colorScheme="brand" size="lg" mr="4">
              Close
            </Button>
            <Button variant="solid" colorScheme="brand" size="lg">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default NewVendorModal
