import { Control, useWatch } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import { isValidAndNonEmpty } from 'utils'

export const useProjectInformationNextButtonDisabled = (control: Control<ProjectFormValues>, errors): boolean => {
  const formValues = useWatch({ control })

  return (
    !formValues?.projectType ||
    !formValues?.clientStartDate ||
    !formValues?.clientDueDate ||
    !isValidAndNonEmpty(formValues?.sowOriginalContractAmount) ||
    !formValues?.documents ||
    !!errors.documents
  )
}

export const usePropertyInformationNextDisabled = (
  control: Control<ProjectFormValues>,
  isDuplicateAddress: boolean,
): boolean => {
  const formValues = useWatch({ control })

  // Acknowledge check appears based on address selected from saved address list so here we also check that in case user has entered new address
  const isAcknowledgeCheck = formValues?.property && isDuplicateAddress ? formValues?.acknowledgeCheck : true
  const isHoaPhone = formValues?.hoaPhone!.replace(/\D+/g, '').length! < 10

  return (
    !formValues.streetAddress ||
    !formValues.city ||
    !formValues.state?.value ||
    !formValues.zipCode ||
    !formValues.newMarket?.value ||
    !isAcknowledgeCheck ||
    isHoaPhone
  )
}

export const useAddressShouldBeVerified = (control: Control<ProjectFormValues>): boolean => {
  const property = useWatch({ name: 'property', control })

  return !property
}

export const useProjectManagementSaveButtonDisabled = (control: Control<ProjectFormValues>): boolean => {
  const formValues = useWatch({ control })

  return !formValues?.projectManager?.value || !formValues?.projectCoordinator?.value || !formValues?.client?.value
}

export const useWOStartDateMin = (control: Control<ProjectFormValues>): string => {
  const clientStartDate = useWatch({ name: 'clientStartDate', control })

  return clientStartDate ? new Date(clientStartDate).toISOString().split('T')[0] : ''
}
