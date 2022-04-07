import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Button,
  Grid,
  ModalProps,
  ModalCloseButton,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import { AddProjectInfo } from './add-project-info'
import { AddPropertyInfo } from './add-property-info'
import { ManageProject } from './manage-project'

type AddProjectFormProps = {
  onClose: () => void
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose }) => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <>
      <form id="newTransactionForm">
        <Grid
          templateColumns="repeat(4, 1fr)"
          gap={'1rem 0.5rem'}
          borderBottom="2px solid"
          borderColor="gray.200"
          pb="3"
          mb="5"
        >
          <Stack w={{ base: '971px', xl: '100%' }} spacing={3}>
            <Tabs variant="enclosed" onChange={index => setTabIndex(index)} mt="7">
              <TabList color="#4A5568">
                <Tab minW={180} _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}>
                  {'Project Information'}
                </Tab>
                <Tab minW={200} _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}>
                  {'Property Information'}
                </Tab>
                <Tab minW={180} _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}>
                  {'Managing Project'}
                </Tab>
                <Tab
                  minW={180}
                  _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}
                ></Tab>
              </TabList>
              <TabPanels mt="31px" h="100%">
                <TabPanel p="0px" h="100%">
                  <AddProjectInfo isLoading={false} />
                </TabPanel>
                <TabPanel p="0px" h="100%">
                  <AddPropertyInfo isLoading={false} />
                </TabPanel>
                <TabPanel p="0px" h="100%">
                  <ManageProject isLoading={false} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </Grid>
      </form>
    </>
  )
}

type CustomModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>
type AddNewProjectProps = CustomModalProps
type UpdateProjectProps = CustomModalProps & {
  selectedProjectId: number
}

export const AddNewProjectModal: React.FC<AddNewProjectProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent minH="500px">
        <ModalHeader borderBottom="1px solid #eee">{'New Project'}</ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} />

        <ModalBody px="6" pt="3" pb="1">
          <AddProjectForm onClose={onClose} />
        </ModalBody>
        <ModalFooter display="flex" alignItems="center">
          <Button onClick={onClose} variant="ghost" size="sm">
            {'Close'}
          </Button>

          <Button
            colorScheme="CustomPrimaryColor"
            _focus={{ outline: 'none' }}
            _hover={{ bg: 'blue' }}
            type="submit"
            form="newProjectForm"
            ml="3"
            size="sm"
            disabled={true}
          >
            {'Next'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const UpdateProjectModal: React.FC<UpdateProjectProps> = ({ isOpen, onClose, selectedProjectId }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader bg="gray.50" borderBottom="1px solid #eee">
          Update Project
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} />
        <ModalBody px="6" pt="3" pb="1">
          <AddProjectForm onClose={onClose} />
        </ModalBody>
        <ModalFooter display="flex" alignItems="center">
          <Button onClick={onClose} variant="ghost" size="sm">
            Close
          </Button>

          <Button
            colorScheme="CustomPrimaryColor"
            _hover={{ bg: 'blue' }}
            _focus={{ outlin: 'none' }}
            type="submit"
            form="newProjectForm"
            ml="3"
            size="sm"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
