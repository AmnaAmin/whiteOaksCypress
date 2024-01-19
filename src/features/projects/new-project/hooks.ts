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
    !formValues?.emailNotificationDate ||
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
  const isHoaEmailValid = formValues?.hoaEmailAddress === '' || isValidEmail(formValues?.hoaEmailAddress)
  const isCityNotEmpty = formValues?.city && formValues?.city.trim() !== '';
  return (
    !formValues.streetAddress ||
    !isCityNotEmpty ||
    !formValues.state?.value ||
    !formValues.zipCode ||
    !formValues.newMarket?.value ||
    !isHomeOwnerPhoneValue ||
    !isHomeOwnerEmailValid ||
    !isHoaEmailValid ||
    !isAcknowledgeCheck
  )
}

/* Property is undefined for any new address. When a new street address is created or current street locality (state, zip, city) is changed, property is undefined.*/
/* When property is undefined the address needs to ver verified through usps*/
export const useAddressShouldBeVerified = (control: Control<any>): boolean => {
  const property = useWatch({ name: 'property', control })

  return !property
}

export const useProjectManagementSaveButtonDisabled = (control: Control<ProjectFormValues>): boolean => {
  const formValues = useWatch({ control })

  return (
    !formValues?.projectManager?.value ||
    !formValues?.projectCoordinator?.value ||
    !formValues?.client?.value ||
    !formValues?.clientType
  )
}

export const useWOStartDateMin = (control: Control<ProjectFormValues>): string => {
  const clientStartDate = useWatch({ name: 'clientStartDate', control })

  return clientStartDate ? new Date(clientStartDate).toISOString().split('T')[0] : ''
}

export const useNewClientNextButtonDisabled = ({ control }: any) => {
  const [companyName, paymentTerm, streetAddress, city, state] = useWatch({
    control,
    name: ['companyName', 'paymentTerm', 'streetAddress', 'city', 'state'],
  });
  const contact = useWatch({ control, name: ['contacts'] });
  const contactArray = contact?.length > 0 ? contact[0] : [];

  const accountPayable = useWatch({ control, name: ['accountPayableContactInfos'] });
  const accountPayableArray = accountPayable?.length > 0 ? accountPayable[0] : [];

  const isFieldEmptyOrSpaces = (fieldValue: string | undefined | null): boolean => {
    return  fieldValue === undefined || fieldValue === null || (typeof fieldValue === 'string' && fieldValue.trim() === '');
  };

  return {
    isNewClientDetails:
      isFieldEmptyOrSpaces(companyName) ||
      isFieldEmptyOrSpaces(paymentTerm) ||
      isFieldEmptyOrSpaces(streetAddress) ||
      isFieldEmptyOrSpaces(city) ||
      isFieldEmptyOrSpaces(state),
    isContactSection:
      contactArray?.some(
        contact =>
          isFieldEmptyOrSpaces(contact?.contact) ||
          isFieldEmptyOrSpaces(contact?.emailAddress) ||
          isFieldEmptyOrSpaces(contact?.phoneNumber) 
      ) ?? false,
    isAccountPayableSection:
      accountPayableArray?.some(
        accountPayable =>
          isFieldEmptyOrSpaces(accountPayable?.contact) ||
          isFieldEmptyOrSpaces(accountPayable?.phoneNumber) ||
          isFieldEmptyOrSpaces(accountPayable?.emailAddress) ||
          isFieldEmptyOrSpaces(accountPayable?.comments)
      ) ?? false,
  };
};
