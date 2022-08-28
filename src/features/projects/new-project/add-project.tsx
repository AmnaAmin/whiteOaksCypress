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
import { useToast } from '@chakra-ui/react'
import { useSaveProjectDetails } from 'api/pc-projects'
import { dateISOFormat } from 'utils/date-time-utils'
import { useNavigate } from 'react-router-dom'
import { DevTool } from '@hookform/devtools'
import { useTranslation } from 'react-i18next'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { useProjectInformationNextButtonDisabled, usePropertyInformationNextDisabled } from './hooks'
import { createDocumentPayload } from 'utils/file-utils'

type AddProjectFormProps = {
  onClose: () => void
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose }) => {
  const { t } = useTranslation()
  const toast = useToast()

  const { mutate: saveProjectDetails } = useSaveProjectDetails()
  const [tabIndex, setTabIndex] = useState(0)
  const [isDuplicateAddress, setIsDuplicateAddress] = useState(false)
  const navigate = useNavigate()

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  const methods = useForm<ProjectFormValues>({
    defaultValues: {
      acknowledgeCheck: false,
      name: '',
      projectType: null,
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
      state: null,
      zipCode: '',
      newMarket: null,
      gateCode: '',
      lockBoxCode: '',
      hoaPhone: '',
      hoaPhoneNumberExtension: '',
      hoaEmailAddress: '',
      projectManager: null,
      projectCoordinator: null,
      clientName: '',
      client: null,
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

  const isProjectInfoNextButtonDisabled = useProjectInformationNextButtonDisabled(methods.control)
  const isPropertyInformationNextButtonDisabled = usePropertyInformationNextDisabled(
    methods.control,
    isDuplicateAddress,
  )

  const { handleSubmit } = methods

  const onSubmit = useCallback(
    async values => {
      let fileContents: any = null
      const doc = values.documents
      if (doc) {
        fileContents = await createDocumentPayload(doc, 39)
      }

      const property = {
        streetAddress: values.streetAddress,
        city: values.city,
        marketId: values.newMarket?.value,
        state: values.state?.value,
        zipCode: values.zipCode,
      }

      const newProjectPayload = {
        name: values.name,
        projectType: `${values.projectType?.value}`,
        woNumber: values.woNumber,
        poNumber: values.poNumber,
        clientStartDate: dateISOFormat(values.clientStartDate),
        clientDueDate: dateISOFormat(values.clientDueDate),
        woaStartDate: dateISOFormat(values.woaStartDate),
        sowOriginalContractAmount: values.sowOriginalContractAmount,
        documents: fileContents ? [fileContents] : [],
        newProperty: property,
        property,
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state?.value,
        zipCode: values.zipCode,
        newMarketId: values.newMarket?.value,
        gateCode: values.gateCode,
        lockBoxCode: values.lockBoxCode,
        hoaPhone: values.hoaPhone,
        hoaPhoneNumberExtension: values.hoaPhoneNumberExtension,
        hoaEmailAddress: values.hoaEmailAddress,
        projectManagerId: values.projectManager?.value,
        projectCordinatorId: values.projectCoordinator?.value,
        clientName: values.client?.label,
        clientId: values.client?.value,
        superLastName: values.superLastName,
        superEmailAddress: values.superEmailAddress,
        superPhoneNumber: values.superPhoneNumber,
        superPhoneNumberExtension: values.superPhoneNumberExtension,
        propertyId: values.propertyId,
      }

      saveProjectDetails(newProjectPayload, {
        onSuccess(response: any) {
          const projectId = response?.data?.id
          toast({
            title: 'Project Details',
            description: `New project has been created successfully with project id: ${projectId}`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
          onClose()
          navigate(`/project-details/${projectId}`)
        },
        onError(error: any) {
          toast({
            title: 'Project Details',
            description: (error.title as string) ?? 'Unable to save project.',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        },
      })
    },
    [saveProjectDetails],
  )

  return (
    <>
      <Flex>
        <Grid templateColumns="repeat(4, 1fr)" gap={'1rem 0.5rem'}>
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
                    <Tab>{t(`${NEW_PROJECT}.projectInformation`)}</Tab>
                    <Tab isDisabled={isProjectInfoNextButtonDisabled}>{t(`${NEW_PROJECT}.propertyInformation`)}</Tab>
                    <Tab isDisabled={isPropertyInformationNextButtonDisabled}>
                      {t(`${NEW_PROJECT}.projectManagement`)}
                    </Tab>
                  </TabList>
                  <TabPanels mt="31px" h="100%">
                    <TabPanel p="0px" h="100%">
                      <AddProjectInfo setNextTab={setNextTab} onClose={onClose} />
                    </TabPanel>
                    <TabPanel p="0px" h="100%">
                      <AddPropertyInfo
                        isLoading={false}
                        setNextTab={setNextTab}
                        onClose={onClose}
                        isDuplicateAddress={isDuplicateAddress}
                        setIsDuplicateAddress={setIsDuplicateAddress}
                      />
                    </TabPanel>
                    <TabPanel p="0px" h="100%">
                      <ManageProject isLoading={false} onClose={onClose} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </form>

              <DevTool control={methods.control} />
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
}

export const AddNewProjectModal: React.FC<UpdateProjectProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" closeOnEsc={true} closeOnOverlayClick={true} variant="custom">
      <ModalOverlay>
        <ModalContent minH="600px">
          <ModalHeader>{t(`${NEW_PROJECT}.title`)}</ModalHeader>
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
