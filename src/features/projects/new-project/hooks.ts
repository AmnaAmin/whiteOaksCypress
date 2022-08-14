import { Control, useWatch } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'

export const useProjectInformationNextButtonDisabled = (control: Control<ProjectFormValues>): boolean => {
  const formValues = useWatch({ control })

  return (
    !formValues?.projectType ||
    !formValues?.clientStartDate ||
    !formValues?.clientDueDate ||
    !formValues?.sowOriginalContractAmount ||
    !formValues?.documents
  )
}

export const usePropertyInformationNextDisabled = (control: Control<ProjectFormValues>): boolean => {
  const formValues = useWatch({ control })

  console.log('formValues', formValues)
  // Acknowledge check appears based on address selected from saved address list so here we also check that in case user has entered new address
  const isAcknowledgeCheck = formValues?.property ? formValues?.acknowledgeCheck : true

  return (
    !formValues.streetAddress ||
    !formValues.city ||
    !formValues.state?.value ||
    !formValues.zipCode ||
    !isAcknowledgeCheck
  )
}

export const useProjectManagementSaveButtonDisabled = (control: Control<ProjectFormValues>): boolean => {
  const formValues = useWatch({ control })

  return !formValues?.projectManager?.value || !formValues?.projectCoordinator?.value || !formValues?.client?.value
}

export const useAddressShouldBeVerified = (control: Control<ProjectFormValues>): boolean => {
  const property = useWatch({ name: 'property', control })

  return !property
}

export const useWOStartDateMin = (control: Control<ProjectFormValues>): string => {
  const clientStartDate = useWatch({ name: 'clientStartDate', control })

  return clientStartDate ? new Date(clientStartDate).toISOString().split('T')[0] : ''
}
