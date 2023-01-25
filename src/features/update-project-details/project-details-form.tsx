import { Box, Button, Divider, Flex, Icon, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import Location from './location'
import Contact from './contact'
import ProjectManagement from './project-management'
import Misc from './misc'
import InvoiceAndPayments from './invoice-and-payments'
import { BiErrorCircle, BiSpreadsheet } from 'react-icons/bi'
import { Project } from 'types/project.type'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { FormProvider, useForm } from 'react-hook-form'
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
} from 'api/project-details'
import { DevTool } from '@hookform/devtools'
import { Link } from 'react-router-dom'
import { useSubFormErrors } from './hooks'
import { useProjectExtraAttributes } from 'api/pc-projects'
// import { PROJECT_DETAILS } from './projectDetails.i18n'
import { useMarkets, useStates } from 'api/pc-projects'

import { useTranslation } from 'react-i18next'

type tabProps = {
  projectData: Project
  onClose?: () => void
  style?: { backgroundColor: string; marginLeft: string; marginRight: string; height: string }
  tabVariant?: string
}

const ProjectDetailsTab = (props: tabProps) => {
  const { style, onClose, tabVariant, projectData } = props

  const [tabIndex, setTabIndex] = useState(0)

  const { data: projectExtraAttributes } = useProjectExtraAttributes(projectData?.id as number)
  const { projectTypeSelectOptions } = useGetProjectTypeSelectOptions()
  const { userSelectOptions: fpmSelectOptions } = useGetUsersByType(5)
  const { userSelectOptions: projectCoordinatorSelectOptions } = useGetUsersByType(112)
  const { clientSelectOptions } = useGetClientSelectOptions()
  const projectStatusSelectOptions = useProjectStatusSelectOptions(projectData)
  const { data: overPayment } = useGetOverpayment(projectData?.id)
  const { stateSelectOptions } = useStates()
  const { marketSelectOptions } = useMarkets()

  const { mutate: updateProjectDetails, isLoading } = useProjectDetailsUpdateMutation()

  const formReturn = useForm<ProjectDetailsFormValues>()

  const {
    control,
    formState: { errors, isSubmitting },
  } = formReturn
  const { isInvoiceAndPaymentFormErrors, isProjectManagementFormErrors, isContactsFormErrors } =
    useSubFormErrors(errors)

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
    })

    formReturn.reset(formValues)
  }, [
    projectData,
    projectExtraAttributes,
    fpmSelectOptions?.length,
    projectCoordinatorSelectOptions?.length,
    projectTypeSelectOptions?.length,
    clientSelectOptions?.length,
    overPayment,
    stateSelectOptions?.length,
    marketSelectOptions?.length,
  ])

  const onSubmit = async (formValues: ProjectDetailsFormValues) => {
    const payload = await parseProjectDetailsPayloadFromFormData(formValues, projectData)
    updateProjectDetails(payload)
  }

  const handleTabsChange = index => {
    setTabIndex(index)
  }

  const { t } = useTranslation()

  return (
    <FormProvider {...formReturn}>
      <form onSubmit={formReturn.handleSubmit(onSubmit)} id="project-details">
        <Tabs variant={tabVariant || 'line'} colorScheme="brand" onChange={handleTabsChange}>
          <TabList
            bg={style?.backgroundColor ? '' : '#F7FAFC'}
            rounded="6px 6px 0 0"
            pt="7"
            ml={style?.marginLeft || ''}
            mr={style?.marginRight || ''}
          >
            <TabCustom isError={isProjectManagementFormErrors && tabIndex !== 0}>
              {t(`project.projectDetails.projectManagement`)}
            </TabCustom>
            <TabCustom isError={isInvoiceAndPaymentFormErrors && tabIndex !== 1}>
              {t(`project.projectDetails.invoicingPayment`)}
            </TabCustom>
            <TabCustom isError={isContactsFormErrors && tabIndex !== 2}>
              {t(`project.projectDetails.contacts`)}
            </TabCustom>
            <TabCustom>{t(`project.projectDetails.location`)}</TabCustom>
            <TabCustom>{t(`project.projectDetails.misc`)}</TabCustom>
          </TabList>

          <TabPanels mt="31px">
            <TabPanel p="0" ml="32px" minH={style?.height ? '290px' : '343px'}>
              <ProjectManagement
                projectStatusSelectOptions={projectStatusSelectOptions}
                projectTypeSelectOptions={projectTypeSelectOptions}
              />
            </TabPanel>

            <TabPanel p="0" ml="32px" minH={style?.height ? '290px' : '343px'}>
              <InvoiceAndPayments />
            </TabPanel>

            <TabPanel p="0" ml="32px" minH={style?.height ? '380px' : '343px'}>
              <Contact
                projectCoordinatorSelectOptions={projectCoordinatorSelectOptions}
                projectManagerSelectOptions={fpmSelectOptions}
                clientSelectOptions={clientSelectOptions}
              />
            </TabPanel>
            <TabPanel p="0" ml="32px" minH={style?.height ? '290px' : '343px'}>
              <Location stateSelectOptions={stateSelectOptions} marketSelectOptions={marketSelectOptions} />
            </TabPanel>

            <TabPanel p="0" ml="32px" minH={style?.height ? '395px' : '343px'}>
              <Misc />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Stack>
          <Box mt="3">
            <Divider border="1px solid" />
          </Box>
          <Box h="70px" w="100%" pb="3">
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
      </form>
      <DevTool control={control} />
    </FormProvider>
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
