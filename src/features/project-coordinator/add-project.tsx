import React, { useCallback, useState } from 'react'
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
import { FormProvider, useForm } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import { readFileContent } from 'utils/vendor-details'
import { useToast } from '@chakra-ui/react'
import { useSaveProjectDetails } from 'utils/pc-projects'
import { dateISOFormat } from 'utils/date-time-utils'

type AddProjectFormProps = {
  onClose: () => void
  projectTypes?: any
  properties?: any
  markets?: any
  fieldProjectManager?: any
  statesData?: any
  projectCoordinator?: any
  client?: any
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({
  onClose,
  projectTypes,
  properties,
  markets,
  fieldProjectManager,
  statesData,
  projectCoordinator,
  client,
}) => {
  const toast = useToast()
  const { mutate: saveProjectDetails } = useSaveProjectDetails()
  const [tabIndex, setTabIndex] = useState(0)
  const [projectinfoBtn, setProjectinfoBtn] = useState(false)
  const [propertyinfoBtn, setpropertyinfoBtn] = useState(false)
  const [manageProjBtn, setmanageProjBtn] = useState(false)

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  const methods = useForm<ProjectFormValues>({
    defaultValues: {
      acknowledgeCheck: false,
      name: '',
      projectType: 0,
      projectTypeLabel: '',
      woNumber: '',
      poNumber: '',
      clientStartDate: '',
      clientDueDate: '',
      clientSignoffDate: '',
      clientWalkthroughDate: '',
      woaStartDate: '',
      sowOriginalContractAmount: '',
      sowDocumentFile: '',
      documents: null,
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      newMarketId: '',
      gateCode: '',
      lockBoxCode: '',
      hoaPhone: '',
      hoaPhoneNumberExtension: '',
      hoaEmailAddress: '',
      projectManagerId: 0,
      projectCoordinator: '',
      projectCoordinatorId: 0,
      clientName: '',
      clientId: 0,
      superLastName: '',
      superEmailAddress: '',
      superPhoneNumber: '',
      superPhoneNumberExtension: '',
      projectClosedDate: '',
      projectExpectedCloseDate: '',
      projectStartDate: '',
      woaCompletionDate: '',
      propertyId: 0,
      property: '',
    },
  })

  const { watch, handleSubmit } = methods

  const onSubmit = useCallback(
    async values => {
      let fileContents: any = null
      const doc = values.documents
      if (doc) {
        fileContents = await readFileContent(doc)
      }
      const newProjectPayload = {
        name: values.name,
        projectType: values.projectType,
        woNumber: values.woNumber,
        poNumber: values.poNumber,
        clientStartDate: dateISOFormat(values.clientStartDate),
        clientDueDate: dateISOFormat(values.clientDueDate),
        woaStartDate: dateISOFormat(values.woaStartDate),
        sowOriginalContractAmount: values.sowOriginalContractAmount,
        sowDocumentFile: fileContents,
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        newMarketId: values.newMarketId,
        gateCode: values.gateCode,
        lockBoxCode: values.lockBoxCode,
        hoaPhone: values.hoaPhone,
        hoaPhoneNumberExtension: values.hoaPhoneNumberExtension,
        hoaEmailAddress: values.hoaEmailAddress,
        projectManagerId: values.projectManagerId,
        projectCoordinator: values.projectCoordinator,
        clientName: values.clientName,
        clientId: values.clientId,
        superLastName: values.superLastName,
        superEmailAddress: values.superEmailAddress,
        superPhoneNumber: values.superPhoneNumber,
        superPhoneNumberExtension: values.superPhoneNumberExtension,
        propertyId: values.propertyId,
      }

      saveProjectDetails(newProjectPayload, {
        onSuccess() {
          toast({
            title: 'Project Details',
            description: 'New Project has been created successfully.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          onClose()
        },
        onError(error: any) {
          toast({
            title: 'Project Details',
            description: (error.title as string) ?? 'Unable to save project.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        },
      })
    },
    [saveProjectDetails],
  )

  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {
      if (
        value?.projectTypeLabel &&
        value?.clientStartDate &&
        value?.clientDueDate &&
        value?.sowOriginalContractAmount &&
        value?.documents
      ) {
        setProjectinfoBtn(true)
      } else {
        setProjectinfoBtn(false)
      }

      if (value?.streetAddress && value?.city && value?.zipCode && value?.newMarketId) {
        setpropertyinfoBtn(true)
      } else {
        setpropertyinfoBtn(false)
      }
      if (
        value?.projectCoordinator &&
        value?.projectManagerId &&
        value?.clientName &&
        value?.streetAddress &&
        value?.city &&
        value?.zipCode &&
        value?.newMarketId &&
        value?.projectTypeLabel &&
        value?.clientStartDate &&
        value?.clientDueDate &&
        value?.sowOriginalContractAmount &&
        value?.documents
      ) {
        setmanageProjBtn(true)
      } else {
        setmanageProjBtn(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])

  return (
    <>
      <Flex>
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
              <form onSubmit={handleSubmit(onSubmit)} id="newProjectForm">
                <Tabs
                  colorScheme="brand"
                  variant="enclosed"
                  index={tabIndex}
                  onChange={index => setTabIndex(index)}
                  mt="7"
                >
                  <TabList color="#4A5568">
                    <Tab>{'Project Information'}</Tab>
                    <Tab>{'Property Information'}</Tab>
                    <Tab>{'Managing Project'}</Tab>
                  </TabList>
                  <TabPanels mt="31px" h="100%">
                    <TabPanel p="0px" h="100%">
                      <AddProjectInfo
                        projectTypes={projectTypes}
                        buttonCondition={projectinfoBtn}
                        setNextTab={setNextTab}
                        onClose={onClose}
                      />
                    </TabPanel>
                    <TabPanel p="0px" h="100%">
                      <AddPropertyInfo
                        properties={properties}
                        markets={markets}
                        statesData={statesData}
                        buttonCondition={propertyinfoBtn}
                        isLoading={false}
                        setNextTab={setNextTab}
                        onClose={onClose}
                      />
                    </TabPanel>
                    <TabPanel p="0px" h="100%">
                      <ManageProject
                        fieldProjectManager={fieldProjectManager}
                        projectCoordinator={projectCoordinator}
                        client={client}
                        buttonCondition={manageProjBtn}
                        isLoading={false}
                        onClose={onClose}
                      />
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
// type AddNewProjectProps = CustomModalProps
type UpdateProjectProps = CustomModalProps & {
  selectedProjectId?: number
  projectTypes: any
  properties: any
  markets: any
  fieldProjectManager: any
  projectCoordinator: any
  client: any
  statesData: any
}

export const AddNewProjectModal: React.FC<UpdateProjectProps> = ({
  isOpen,
  onClose,
  projectTypes,
  statesData,
  properties,
  markets,
  fieldProjectManager,
  client,
  projectCoordinator,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" closeOnEsc={true} closeOnOverlayClick={true}>
      <ModalOverlay>
        <ModalContent minH="600px">
          <ModalHeader borderBottom="1px solid #eee">{'New Project'}</ModalHeader>
          <ModalCloseButton _focus={{ outline: 'none' }} />
          <ModalBody px="6">
            <AddProjectForm
              fieldProjectManager={fieldProjectManager}
              statesData={statesData}
              projectCoordinator={projectCoordinator}
              client={client}
              markets={markets}
              properties={properties}
              projectTypes={projectTypes}
              onClose={onClose}
            />
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
