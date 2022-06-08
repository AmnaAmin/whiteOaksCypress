import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormLabel,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tabs,
} from '@chakra-ui/react'
import { AlertsDetailsTab } from 'features/alerts-details-tab'

type AlertsDatailTypes = {
  isOpen: boolean
  onClose: () => void
}

export const AlertsDetails: React.FC<AlertsDatailTypes> = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <FormLabel variant="strong-label"> Alert-226 COLLUM</FormLabel>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="enclosed" colorScheme="brand">
              <TabList>
                <Tab>Details</Tab>
                <Tab>Notify</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <AlertsDetailsTab />
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" colorScheme="brand" mr={3}>
              Save
            </Button>
            <Button colorScheme="brand">Next</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
