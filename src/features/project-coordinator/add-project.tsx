import React, { useCallback, useEffect, useState } from 'react'
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
  Flex,
} from '@chakra-ui/react'
import { AddProjectInfo } from './add-project-info'
import { AddPropertyInfo } from './add-property-info'
import { ManageProject } from './manage-project'
import { FormProvider, useFormContext } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import { readFileContent } from 'utils/vendor-details'
import { currencyFormatter } from 'utils/stringFormatters'
import { useToast } from '@chakra-ui/react'
import { useProjectDetails } from 'utils/pc-projects'

type AddProjectFormProps = {
  onClose: () => void
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose }) => {
  const toast = useToast()
  const { data: projects, refetch } = useProjectDetails()

  const [tabIndex, setTabIndex] = useState(0)
  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  // const newProjectDefaultValue = projects => {
  //   const defaultValues = {
  //     name: '',
  //     projectType: '',
  //     woNumber: '',
  //     poNumber: '',
  //     clientStartDate: '',
  //     clientDueDate: '',
  //     woaStartDate: '',
  //     sowOriginalContractAmount: '',
  //     projectSOW: null,
  //     sowLink: null,
  //     streetAddress: '',
  //     city: '',
  //     state: '',
  //     zipCode: '',
  //     market: '',
  //     gateCode: '',
  //     lockBoxCode: '',
  //     hoaPhone: '',
  //     hoaPhoneNumberExtension: '',
  //     hoaEmailAddress: '',
  //     projectManager: '',
  //     projectCoordinator: '',
  //     clientName: '',
  //     superFirstName: '',
  //     superEmailAddress: '',
  //     superPhoneNumber: '',
  //     superPhoneNumberExtension: '',
  //   }
  //   return defaultValues
  // }

  // useEffect(() => {
  //   if (projects) {
  //     const defaultSettings = newProjectDefaultValue(projects)
  //     reset(defaultSettings)
  //   }
  // }, [projects, reset])

  const methods = useFormContext<ProjectFormValues>()

  const onSubmit = useCallback(
    async values => {
      let fileContents: any = null
      if (values.projectSOW && values.projectSOW[0]) {
        fileContents = await readFileContent(values.projectSOW[0])
      }
      const newProjectPayload = {
        name: values.name,
        projectType: values.projectType,
        woNumber: values.woNumber,
        poNumber: values.poNumber,
        clientStartDate: values.clientStartDate,
        clientDueDate: values.clientDueDate,
        woaStartDate: values.woaStartDate,
        sowOriginalContractAmount: currencyFormatter(values.sowOriginalContractAmount),
        projectSOW: values.projectSOW && values.projectSOW[0] ? values.projectSOW[0].name : null,
        sowLink: fileContents,
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        market: values.market,
        gateCode: values.gateCode,
        lockBoxCode: values.lockBoxCode,
        hoaPhone: values.hoaPhone,
        hoaPhoneNumberExtension: values.hoaPhoneNumberExtension,
        hoaEmailAddress: values.hoaEmailAddress,
        projectManager: values.projectManager,
        projectCoordinator: values.projectCoordinator,
        clientName: values.clientName,
        superFirstName: values.superFirstName,
        superEmailAddress: values.superEmailAddress,
        superPhoneNumber: values.superPhoneNumber,
        superPhoneNumberExtension: values.superPhoneNumberExtension,
      }
      console.log('new payload', newProjectPayload)
      saveProjectDetails(newProjectPayload, {
        onSuccess() {
          toast({
            title: 'Project Details',
            description: 'New Project has been created successfully.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        },
      })
    },
    [saveProjectDetails],
  )

  return (
    <>
      <Flex id="newProjectForm">
        <Grid
          templateColumns="repeat(4, 1fr)"
          gap={'1rem 0.5rem'}
          borderBottom="2px solid"
          borderColor="gray.200"
          pb="3"
          mb="5"
        >
          <Stack w={{ base: '971px', xl: '100%' }} spacing={3}>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Tabs variant="enclosed" index={tabIndex} onChange={index => setTabIndex(index)} mt="7">
                  <TabList color="#4A5568">
                    <Tab
                      minW={180}
                      _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}
                    >
                      {'Project Information'}
                    </Tab>
                    <Tab
                      minW={200}
                      _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}
                    >
                      {'Property Information'}
                    </Tab>
                    <Tab
                      minW={180}
                      _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}
                    >
                      {'Managing Project'}
                    </Tab>
                    <Tab
                      minW={180}
                      _selected={{ color: 'white', bg: 'button.300', fontWeight: '600', fontSize: '14px' }}
                    ></Tab>
                  </TabList>
                  <TabPanels mt="31px" h="100%">
                    <TabPanel p="0px" h="100%">
                      <AddProjectInfo setNextTab={setNextTab} onClose={onClose} />
                    </TabPanel>
                    <TabPanel p="0px" h="100%">
                      <AddPropertyInfo isLoading={false} setNextTab={setNextTab} />
                    </TabPanel>
                    <TabPanel p="0px" h="100%">
                      <ManageProject isLoading={false} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </form>
            </FormProvider>
          </Stack>
        </Grid>
      </Flex>
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
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" closeOnEsc={true} closeOnOverlayClick={true}>
      <ModalOverlay>
        <ModalContent minH="600px">
          <ModalHeader borderBottom="1px solid #eee">{'New Project'}</ModalHeader>
          <ModalCloseButton _focus={{ outline: 'none' }} />
          <ModalBody px="6">
            <AddProjectForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
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
function saveProjectDetails(
  addressInfo: {
    streetAddress: any
    city: any
    state: any
    zipCode: any
    market: any
    gateCode: any
    lockBoxCode: any
    hoaPhone: any
    hoaPhoneNumberExtension: any
    hoaEmailAddress: any
  },
  arg1: { onSuccess(): void },
) {
  throw new Error('Function not implemented.')
}
