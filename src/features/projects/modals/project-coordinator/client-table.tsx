import {
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { ProjectType } from 'types/project.type'
import DetailsTab from './clitent-details-tab'

const Client: React.FC<{
  projectData: ProjectType
  isOpen: boolean
  onClose: () => void
}> = ({ projectData, isOpen, onClose }) => {
  return (
    <div>
      <Modal size="none" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="1137px" rounded={3} borderTop="2px solid #4E87F8">
          <ModalHeader h="63px" borderBottom="1px solid #E2E8F0" color="gray.600" fontSize={16} fontWeight={500}>
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500} h="32px">
                <Text borderRight="1px solid #E2E8F0" lineHeight="22px" h="22px" pr={2}>
                  New Client
                </Text>
                <Text lineHeight="22px" h="22px">
                  A Chimney Sweep
                </Text>
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody justifyContent="center">
            <Stack spacing={5}>
              <Tabs variant="enclosed" whiteSpace="nowrap">
                <TabList height="50px" alignItems={'end'}>
                  <Flex h="40px">
                    <Tab
                      _focus={{ border: 'none' }}
                      minW="109px"
                      //   sx={TabStyle}
                      _selected={{
                        color: 'white',
                        bg: '#4E87F8',
                        fontWeight: 600,
                        _hover: { backgroundColor: '#4E87F8' },
                      }}
                    >
                      Details
                    </Tab>
                    <Tab
                      minW="109px"
                      _focus={{ border: 'none' }}
                      _selected={{
                        color: 'white',
                        bg: '#4E87F8',
                        fontWeight: 600,
                        _hover: { backgroundColor: '#4E87F8' },
                      }}
                      //   sx={TabStyle}
                    >
                      Market
                    </Tab>
                    <Tab
                      minW="109px"
                      _focus={{ border: 'none' }}
                      _selected={{
                        color: 'white',
                        bg: '#4E87F8',
                        fontWeight: 600,
                        id: 'checkId',
                        _hover: { backgroundColor: '#4E87F8' },
                      }}
                      //   sx={TabStyle}
                    >
                      Notes
                    </Tab>
                  </Flex>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <DetailsTab onClose={onClose} />
                  </TabPanel>
                  <TabPanel></TabPanel>
                  <TabPanel></TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Client
