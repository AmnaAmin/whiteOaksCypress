import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import WorkOrderDetailTab from './work-order-detail-tab'

const NewWorkOrder = ({ isOpen, onClose }) => {
  const { t } = useTranslation()

  const TabStyle = {
    fontWeight: 500,
    fontSize: '14px',
    fontStyle: 'normal',
    color: 'gray.600',
    _hover: {
      backgroundColor: 'gray.200',
    },
  }
  return (
    <div>
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Work Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Tabs>
                <TabList>
                  <Flex h="40px"></Flex>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <WorkOrderDetailTab onClose={onClose} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default NewWorkOrder
