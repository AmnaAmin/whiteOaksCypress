import { Control, useWatch } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import { isValidAndNonEmpty } from 'utils'
import { isValidEmail, isValidPhoneNumber } from 'utils/string-formatters'

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
  const isHomeOwnerPhoneValue = formValues?.homeOwnerPhone === '' || isValidPhoneNumber(formValues?.homeOwnerPhone)
  const isHomeOwnerEmailValid = formValues?.homeOwnerEmail === '' || isValidEmail(formValues?.homeOwnerEmail)

  return (
    !formValues.streetAddress ||
    !formValues.city ||
    !formValues.state?.value ||
    !formValues.zipCode ||
    !formValues.newMarket?.value ||
    !isHomeOwnerPhoneValue ||
    !isHomeOwnerEmailValid ||
    !isAcknowledgeCheck
  )
}

export const useAddressShouldBeVerified = (control: Control<any>): boolean => {
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

export const useNewClientNextButtonDisabled = ({ control }: any) => {
  const [companyName, paymentTerm, streetAddress, city, state] = useWatch({
    control,
    name: ['companyName', 'paymentTerm', 'streetAddress', 'city', 'state'],
  })
  const contact = useWatch({ control, name: ['contacts'] })
  const contactArray = contact?.length > 0 ? contact[0] : []

  const accountPayable = useWatch({ control, name: ['accountPayableContactInfos'] })
  const accountPayableArray = accountPayable?.length > 0 ? accountPayable[0] : []

  return {
    isNewClientDetails: !companyName || !paymentTerm || !streetAddress || !city || !state,
    isContactSection: contactArray?.some(
      contact => !contact.contact || !contact.emailAddress || !contact.phoneNumber || !contact.market,
    ),
    isAccountPayableSection: accountPayableArray?.some(
      accountPayable =>
        !accountPayable.contact ||
        !accountPayable.phoneNumber ||
        !accountPayable.emailAddress ||
        !accountPayable.comments,
    ),
  }
}
