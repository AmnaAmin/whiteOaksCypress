import { Box, Button, Divider, Flex, Icon, Stack, useDisclosure, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import Location from './location'
import Contact from './contact'
import ProjectManagement from './project-management'
import Misc from './misc'
import { BiErrorCircle, BiSpreadsheet } from 'react-icons/bi'
import { AddressInfo, Project } from 'types/project.type'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import {
  // getProjectStatusSelectOptions,
  parseFormValuesFromAPIData,
  parseProjectDetailsPayloadFromFormData,
  useGetClientSelectOptions,
  useGetOverpayment,
  useGetProjectTypeSelectOptions,
  useGetUsersByType,
  useProjectDetailsUpdateMutation,
  useProjectStatusSelectOptions,
  useProjectOverrideStatusSelectOptions,
} from 'api/project-details'
import { DevTool } from '@hookform/devtools'
import { Link, useNavigate } from 'react-router-dom'
import { useSubFormErrors } from './hooks'
import {
  useDeleteProjectMutation,
  useGetAddressVerification,
  useProjectAllowDelete,
  useProjectExtraAttributes,
  useProperties,
} from 'api/pc-projects'
// import { PROJECT_DETAILS } from './projectDetails.i18n'
import { useMarkets, useStates } from 'api/pc-projects'

import { useTranslation } from 'react-i18next'
import { useTransactionsV1 } from 'api/transactions'
import { TransactionStatusValues, TransactionTypeValues } from 'types/transaction.type'
import { AddressVerificationModal } from 'features/projects/new-project/address-verification-modal'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { useClientType } from 'api/client-type'
import { ConfirmationBox } from 'components/Confirmation'

type tabProps = {
  projectData: Project
  onClose?: () => void
  style?: { backgroundColor: string; marginLeft: string; marginRight: string; height: string; pt: string }
  tabVariant?: string
  isRecievable?: boolean
  paymentSourceOptions?: any
}

const ProjectDetailsTab = (props: tabProps) => {
  const { style, onClose, tabVariant, projectData, isRecievable,paymentSourceOptions } = props
  const isRecievableRead = useRoleBasedPermissions()?.permissions?.includes('RECEIVABLE.READ') && isRecievable
  const isProjRead = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
  const isReadOnly = isRecievableRead || isProjRead
  const [tabIndex, setTabIndex] = useState(0)
  const { propertySelectOptions } = useProperties()
  const { data: projectExtraAttributes } = useProjectExtraAttributes(projectData?.id as number)
  const { data: deleteCheck } = useProjectAllowDelete(projectData?.id as number)
  const { mutate: deleteProjectCall, isLoading: deleteLoading } = useDeleteProjectMutation()

  const { projectTypeSelectOptions } = useGetProjectTypeSelectOptions()
  const { userSelectOptions: fpmSelectOptions } = useGetUsersByType(5)
  const { userSelectOptions: projectCoordinatorSelectOptions } = useGetUsersByType(112)
  const { clientSelectOptions } = useGetClientSelectOptions()
  const { clientTypesSelectOptions } = useClientType()
  const { isAdmin } = useUserRolesSelector()
  const projectStatusSelectOptions = useProjectStatusSelectOptions(projectData, isAdmin)
  const { data: overPayment } = useGetOverpayment(projectData?.id)
  const { stateSelectOptions, states } = useStates()
  const { marketSelectOptions, markets } = useMarkets()

  const { mutate: updateProjectDetails, isLoading } = useProjectDetailsUpdateMutation()
  const projectOverrideStatusSelectOptions = useProjectOverrideStatusSelectOptions(projectData)
  const { transactions } = useTransactionsV1(`${projectData?.id}`)

  const formReturn = useForm<ProjectDetailsFormValues>()
  const toast = useToast()
  const { t } = useTranslation()

  const {
    control,
    formState: { errors, isSubmitting },
    watch,
  } = formReturn
  const { isProjectManagementFormErrors, isContactsFormErrors, isLocationFormErrors } = useSubFormErrors(errors)
  const watchClient = watch('client')

  const carrierSelected = watchClient?.carrier?.filter(e => e.id === projectData?.carrierId)
 
  useEffect(() => {
    const formValues = parseFormValuesFromAPIData({
      project: projectData,
      projectExtraAttributes,
      overPayment,
      projectTypeSelectOptions,
      projectManagerSelectOptions: fpmSelectOptions,
      projectCoordinatorSelectOptions,
      clientSelectOptions,
      stateSelectOptions,
      marketSelectOptions,
      propertySelectOptions,
      clientTypesSelectOptions,
      paymentSourceOptions,
    })
    formReturn.reset(formValues)
  }, [
    paymentSourceOptions,
    projectData,
    projectExtraAttributes,
    fpmSelectOptions?.length,
    projectCoordinatorSelectOptions?.length,
    projectTypeSelectOptions?.length,
    clientSelectOptions?.length,
    overPayment,
    stateSelectOptions?.length,
    marketSelectOptions?.length,
    propertySelectOptions?.length,
    clientTypesSelectOptions?.length,
  ])

  const hasPendingDrawsOnPaymentSave = (payment, depreciation) => {
    if (!!payment || !!depreciation) {
      const pendingDraws = transactions?.filter(
        t =>
          [
            TransactionTypeValues.draw,
            TransactionTypeValues.payment,
            TransactionTypeValues.depreciation,
            TransactionTypeValues.carrierFee,
          ].includes(t.transactionType) &&
          !t?.parentWorkOrderId &&
          [TransactionStatusValues.pending].includes(t?.status as TransactionStatusValues),
      )
      if (pendingDraws && pendingDraws?.length > 0) {
        toast({
          title: 'Payments Error',
          description: t(`project.projectDetails.paymentError`),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        return true
      }
    }
    return false
  }

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [isVerifiedAddress, setVerifiedAddress] = useState(true)
  const navigate = useNavigate()

  // Get all values of Address Info
  const watchAddress = useWatch({ name: 'address', control })
  const watchCity = useWatch({ name: 'city', control })
  const watchState = useWatch({ name: 'state', control })
  const watchZipCode = useWatch({ name: 'zip', control })

  // Set all values of Address Info
  useEffect(() => {
    setAddressInfo({
      address: (watchAddress as any) || '',
      city: watchCity || '',
      state: watchState?.label || '',
      zipCode: watchZipCode || '',
    })
  }, [watchAddress, watchCity, watchState, watchZipCode])

  const {
    data: isAddressVerified,
    refetch,
    isLoading: addressVerificationLoading,
  } = useGetAddressVerification(addressInfo)

  const {
    isOpen: isAddressVerficationModalOpen,
    onOpen: onAddressVerificationModalOpen,
    onClose: onAddressVerificationModalClose,
  } = useDisclosure()

  const {
    isOpen: isDeleteProjecModalOpen,
    onOpen: onDeleteProjecModalOpen,
    onClose: onDeleteProjecModalClose,
  } = useDisclosure()
  
  const validateAndDiscardSpaces = (value) => {   
    if (value === null || value === undefined) {
      return null
    }
    const trimmedValue = value.trim()
    return trimmedValue === '' ? null : trimmedValue
  }

  const onSubmit = async (formValues: ProjectDetailsFormValues) => {
    formValues.woNumber = validateAndDiscardSpaces(formValues?.woNumber)
    formValues.poNumber = validateAndDiscardSpaces(formValues?.poNumber)
    formValues.projectName = validateAndDiscardSpaces(formValues?.projectName)
    formValues.reoNumber = validateAndDiscardSpaces(formValues?.reoNumber)
    formValues.claimNumber = validateAndDiscardSpaces(formValues?.claimNumber)
    formValues.superName = validateAndDiscardSpaces(formValues?.superName)
    formValues.superPhoneNumberExtension = validateAndDiscardSpaces(formValues?.superPhoneNumberExtension)
    formValues.superEmail = validateAndDiscardSpaces(formValues?.superEmail)
    formValues.agentName = validateAndDiscardSpaces(formValues?.agentName)
    formValues.homeOwnerName = validateAndDiscardSpaces(formValues?.homeOwnerName)
    formValues.homeOwnerEmail = validateAndDiscardSpaces(formValues?.homeOwnerEmail)
    formValues.superEmail = validateAndDiscardSpaces(formValues?.superEmail)
    formValues.gateCode = validateAndDiscardSpaces(formValues?.gateCode)
    formValues.lockBoxCode = validateAndDiscardSpaces(formValues?.lockBoxCode)
    formValues.hoaContactEmail = validateAndDiscardSpaces(formValues?.hoaContactEmail)
    formValues.hoaContactExtension = validateAndDiscardSpaces(formValues?.hoaContactExtension)
    formValues.superEmail = validateAndDiscardSpaces(formValues?.superEmail)
    if (hasPendingDrawsOnPaymentSave(formValues.payment, formValues.depreciation)) {
      return
    }
    
    if (!isVerifiedAddress) {
      refetch()
      onAddressVerificationModalOpen()
    } else {
      const payload = await parseProjectDetailsPayloadFromFormData(formValues, projectData)
      updateProjectDetails(payload)
      setVerifiedAddress(true)
    }
  }

  const handleTabsChange = index => {
    setTabIndex(index)
  }

  const deleteProject = () => {
    onDeleteProjecModalOpen()
  }

  const confirmDelete = () => {
    deleteProjectCall(projectData?.id as number, {
      onSuccess() {
        navigate('/projects')
        onDeleteProjecModalClose()
        toast({
          title: 'Project Deleted',
          description: `Project is deleted successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        toast({
          title: 'Project Delete',
          description: (error.title as string) ?? 'Unable to Delete Project.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    })
  }

  // const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ')

  useEffect(() => {
    if (isReadOnly) {
      Array.from(document.querySelectorAll('input')).forEach(input => {
        if (input.getAttribute('data-testid') !== 'tableFilterInputField') {
          input.setAttribute('disabled', 'true')
        }
      })
    }
  }, [])

  return (
    <>
      <FormProvider {...formReturn}>
        <form onSubmit={formReturn.handleSubmit(onSubmit, err => console.log('err..', err))} id="project-details">
          <Tabs variant={tabVariant || 'line'} colorScheme="brand" onChange={handleTabsChange}>
            <TabList
              borderBottom={isRecievable ? 0 : '2px solid'}
              marginBottom="1px"
              bg={style?.backgroundColor ? '' : '#F7FAFC'}
              rounded="6px 6px 0px 0px"
             
            >
              <TabCustom isError={isProjectManagementFormErrors && tabIndex !== 0}>
                {t(`project.projectDetails.projectManagement`)}
              </TabCustom>

              <TabCustom datatest-id="contacts-1" isError={isContactsFormErrors && tabIndex !== 3}>
                {t(`project.projectDetails.contacts`)}
              </TabCustom>
              <TabCustom isError={isLocationFormErrors && tabIndex !== 4}>
                {t(`project.projectDetails.location`)}
              </TabCustom>
              <TabCustom>{t(`project.projectDetails.misc`)}</TabCustom>
            </TabList>
            <Box
              bg="white"
              p="15px"
              boxShadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
              borderTopRightRadius={isRecievable ? '6px' : '0px'}
              borderBottomRightRadius="4px"
              borderTopLeftRadius="4px"
              borderBottomLeftRadius="4px"
            >
              <TabPanels>
                <TabPanel p="0" ml="32px" h={style?.height ?? 'auto'} overflowY={'auto'}>
                  <ProjectManagement
                    projectStatusSelectOptions={projectStatusSelectOptions}
                    projectOverrideStatusSelectOptions={projectOverrideStatusSelectOptions}
                    projectTypeSelectOptions={projectTypeSelectOptions}
                    projectData={projectData}
                    isReadOnly={isReadOnly}
                  />
                </TabPanel>

                <TabPanel p="0" ml="32px" h={style?.height ?? 'auto'} overflow={style?.height ? 'auto' : 'none'}>
                  <Contact
                    carrierSelected={carrierSelected}
                    projectCoordinatorSelectOptions={projectCoordinatorSelectOptions}
                    clientSelectOptions={clientSelectOptions}
                    clientTypesSelectOptions={clientTypesSelectOptions}
                  />
                </TabPanel>
                <TabPanel p="0" ml="32px" h={style?.height ?? 'auto'}>
                  <Location
                    stateSelectOptions={stateSelectOptions}
                    marketSelectOptions={marketSelectOptions}
                    propertySelectOptions={propertySelectOptions}
                    markets={markets}
                    states={states}
                    setVerifiedAddress={setVerifiedAddress}
                  />
                </TabPanel>

                <TabPanel p="0" ml="32px" h={style?.height ?? 'auto'}>
                  <Misc
                  projectData={projectData} />
                </TabPanel>
              </TabPanels>

              <Stack>
                <Box mt="3">
                  <Divider border="1px solid" />
                </Box>
                <Box h="70px" w="100%" pb="3">
                  {!isReadOnly && (
                    <Button
                      mt="8px"
                      mr="32px"
                      float={'right'}
                      variant="solid"
                      colorScheme="brand"
                      type="submit"
                      form="project-details"
                      fontSize="16px"
                      disabled={isSubmitting || isLoading}
                    >
                      {t(`project.projectDetails.save`)}
                    </Button>
                  )}
                  {deleteCheck && !isRecievable && (
                    <Button
                      fontSize="16px"
                      mt="8px"
                      mr="5"
                      float={'right'}
                      variant="outline"
                      colorScheme="brand"
                      isDisabled={deleteLoading}
                      onClick={deleteProject}
                    >
                      Delete
                    </Button>
                  )}
                  {onClose && (
                    <>
                      <Button
                        fontSize="16px"
                        onClick={onClose}
                        mt="8px"
                        mr="5"
                        float={'right'}
                        variant="outline"
                        colorScheme="brand"
                      >
                        {t(`project.projectDetails.cancel`)}
                      </Button>
                      <Button
                        mt="8px"
                        ml="32px"
                        as={Link}
                        to={`/project-details/${projectData?.id}`}
                        variant="outline"
                        colorScheme="brand"
                        leftIcon={<Icon boxSize={6} as={BiSpreadsheet} mb="0.5" />}
                      >
                        {t(`project.projectDetails.seeProjectDetails`)}
                      </Button>
                    </>
                  )}
                </Box>
              </Stack>
            </Box>
          </Tabs>
        </form>
        <DevTool control={control} />
      </FormProvider>
      <AddressVerificationModal
        isOpen={isAddressVerficationModalOpen}
        onClose={onAddressVerificationModalClose}
        isAddressVerified={isAddressVerified}
        isLoading={addressVerificationLoading}
        setSave={setVerifiedAddress}
      />

      <ConfirmationBox
        title="Delete Project"
        content="Are you sure you want to Delete this project?"
        isOpen={isDeleteProjecModalOpen}
        onClose={onDeleteProjecModalClose}
        isLoading={deleteLoading}
        onConfirm={confirmDelete}
      />
    </>
  )
}

const TabCustom: React.FC<{ isError?: boolean }> = ({ isError, children }) => {
  return (
    <Tab>
      {isError ? (
        <Flex alignItems="center">
          <Icon as={BiErrorCircle} size="18px" color="red.400" mr="1" />
          <Text color="red.400">{children}</Text>
        </Flex>
      ) : (
        children
      )}
    </Tab>
  )
}

export default ProjectDetailsTab
