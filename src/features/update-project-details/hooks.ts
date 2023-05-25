import { ProjectStatus as STATUS } from 'types/project-details.types'
import { Control, useWatch, FieldErrors } from 'react-hook-form'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { PROJECT_STATUS } from 'features/common/status'

export const useFieldsDisabled = (control: Control<ProjectDetailsFormValues>, projectData?: any) => {
  const status = useWatch({ name: 'status', control })
  const isProjectStatusInvoiced = projectData?.projectStatus === PROJECT_STATUS.invoiced.label
  const invoiceBackDate = useWatch({ name: 'invoiceBackDate', control })
  const remainingPayment = useWatch({ name: 'remainingPayment', control })
  const permissions = useRoleBasedPermissions()
  const { isAdmin } = useUserRolesSelector()

  const projectStatus = status?.value

  const isAllTimeDisabled = true
  const isStatusNew = projectStatus === STATUS.New
  const isStatusActive = projectStatus === STATUS.Active
  const isStatusPunch = projectStatus === STATUS.Punch
  const isStatusClosed = projectStatus === STATUS.Closed
  const isStatusClientPaid = projectStatus === STATUS.ClientPaid
  const isStatusOverPayment = projectStatus === STATUS.Overpayment
  const isStatusInvoiced = projectStatus === STATUS.Invoiced
  const isStatusPaid = projectStatus === STATUS.Paid
  // const isStatusPastDue = projectStatus === STATUS.PastDue
  const isStatusCancelled = projectStatus === STATUS.Cancelled

  const isStatusReconciled = projectStatus === STATUS.Reconcile
  // Enabled field status on location tab
  const newActivePunchEnabledFieldStatus =
    isStatusNew || isStatusActive || isStatusPunch || isStatusClientPaid || isStatusPaid

  return {
    isStatusNew,
    isStatusActive,
    isStatusPunch,
    isStatusInvoiced,
    isStatusClientPaid,
    isStatusClosed,
    isStatusCancelled,
    isStatusReconciled,
    // Project Management form fields states
    isWOAStartDateRequired: isStatusActive,
    isWOACompletionDateRequired: isStatusClosed,
    isClientWalkthroughDateRequired: isStatusClosed,
    isClientSignOffDateRequired: isStatusClosed,

    isWOAStartDisabled:
      !permissions.includes('PROJECTDETAIL.MGMT.WOASTART.EDIT') ||
      isStatusClosed ||
      isStatusInvoiced ||
      (isStatusClientPaid && !isAdmin) ||
      isStatusPaid ||
      isStatusOverPayment,
    isWOACompletionDisabled:
      isStatusClosed ||
      isStatusNew ||
      isStatusActive ||
      isStatusInvoiced ||
      (isStatusClientPaid && !isAdmin) ||
      isStatusPaid ||
      isStatusOverPayment,
    isClientStartDateDisabled:
      !permissions.includes('PROJECTDETAIL.MGMT.CLIENTSTART.EDIT') ||
      isStatusClosed ||
      isStatusInvoiced ||
      (isStatusClientPaid && !isAdmin) ||
      isStatusPaid ||
      isStatusOverPayment,
    isClientDueDateDisabled:
      !permissions.includes('PROJECTDETAIL.MGMT.CLIENTDUEDATE.EDIT') ||
      isStatusClosed ||
      isStatusInvoiced ||
      (isStatusClientPaid && !isAdmin) ||
      isStatusPaid ||
      isStatusOverPayment,
    isClientWalkthroughDisabled:
      isStatusNew ||
      isStatusActive ||
      isStatusInvoiced ||
      (isStatusClientPaid && !isAdmin) ||
      isStatusPaid ||
      isStatusOverPayment,
    isClientSignOffDisabled:
      isStatusNew ||
      isStatusActive ||
      (isStatusClientPaid && !isAdmin) ||
      isStatusPaid ||
      isStatusOverPayment ||
      isStatusInvoiced,
    isReconcileDisabled: !permissions?.includes('PROJECTDETAIL.MGMT.PROJECTVERIFIED.EDIT'),
    
    // Invoicing and payment form fields states
    isOriginalSOWAmountDisabled: isAllTimeDisabled,
    isFinalSOWAmountDisabled: isAllTimeDisabled,
    isInvoiceNumberDisabled: isStatusPaid,
    isUploadAttachmentDisabled: isStatusPaid,
    isInvoiceBackDateDisabled: isStatusPaid,
    isPaymentTermsDisabled: !isStatusInvoiced && !invoiceBackDate,
    isWOAInvoiceDateDisabled: isAllTimeDisabled,
    isOverPaymentDisalbed: isAllTimeDisabled,
    isWOAExpectedPayDateDisabled: isAllTimeDisabled,
    isRemainingPaymentDisabled: isAllTimeDisabled,
    isPaymentDisabled: !(isStatusClientPaid || isProjectStatusInvoiced || invoiceBackDate) || remainingPayment === 0,

    // Contacts field states
    isProjectCoordinatorDisabled: !permissions.includes('PROJECTDETAIL.CONTACT.PC.EDIT'),
    isProjectCoordinatorPhoneNumberDisabled: isAllTimeDisabled,
    isProjectCoordinatorExtensionDisabled: isAllTimeDisabled,
    isFieldProjectManagerDisabled: !permissions.includes('PROJECTDETAIL.CONTACT.FPM.EDIT'),
    isFieldProjectManagerPhoneNumberDisabled: isAllTimeDisabled,
    isFieldProjectManagerExtensionDisabled: isAllTimeDisabled,
    isClientDisabled: !permissions.includes('PROJECTDETAIL.CONTACT.CLIENT.EDIT'),

    // Location Form fields states
    isAddressDisabled: !permissions.includes('PROJECTDETAIL.CONTACT.ADDRESS.EDIT'),
    isCityDisabled: !permissions.includes('PROJECTDETAIL.CONTACT.ADDRESS.EDIT'),
    isStateDisabled: !permissions.includes('PROJECTDETAIL.CONTACT.ADDRESS.EDIT'),
    isZipDisabled: !permissions.includes('PROJECTDETAIL.CONTACT.ADDRESS.EDIT'),
    isMarketDisabled: !permissions.includes('PROJECTDETAIL.CONTACT.MARKET.EDIT'),
    isGateCodeDisabled: permissions.includes('PROJECTDETAIL.CONTACT.GATECODE.EDIT')
      ? !newActivePunchEnabledFieldStatus
      : isAllTimeDisabled,
    isLockBoxCodeDisabled: permissions.includes('PROJECTDETAIL.CONTACT.LOCKBOX.EDIT')
      ? !newActivePunchEnabledFieldStatus
      : isAllTimeDisabled,
  }
}

export const useFieldsRequired = (control: Control<ProjectDetailsFormValues>) => {
  const status = useWatch({ name: 'status', control })

  const projectStatus = status?.value
  const isStatusActive = projectStatus === STATUS.Active
  const isStatusClosed = projectStatus === STATUS.Closed
  const isStatusPunch = projectStatus === STATUS.Punch

  return {
    // Project Management form fields states
    isWOAStartDateRequired: isStatusActive,
    isWOACompletionDateRequired: isStatusClosed || isStatusPunch,
    isClientWalkthroughDateRequired: isStatusClosed,
    isClientSignOffDateRequired: isStatusClosed,
  }
}

/**
 * @description - useSubFormErrors returns object of booleans indicating form errors.
 * @param errors - errors object of react hook form errors of all fields
 * @returns - isInvoiceAndPaymentFormErrors for showing error indicator on Invoice & Payment form tab
 * isProjectDetailsFormErrors for showing error indicator on Project Management form tab
 */
export const useSubFormErrors = (errors: FieldErrors<ProjectDetailsFormValues>) => {
  return {
    isInvoiceAndPaymentFormErrors:
      !!errors.invoiceAttachment?.message || !!errors.paymentTerms || !!errors.invoiceBackDate,
    isProjectManagementFormErrors:
      !!errors.woaCompletionDate || !!errors.clientWalkthroughDate || !!errors.clientSignOffDate || !!errors.type,
    isContactsFormErrors: !!errors.projectCoordinator || !!errors.fieldProjectManager || !!errors.client,
    isLocationFormErrors: !!errors.zip || !!errors.city || !!errors.market || !!errors.address || !!errors.state,
  }
}

// Min of woa start date will be client start date
export const useWOAStartDateMin = (control: Control<ProjectDetailsFormValues>) => {
  const clientStartDate = useWatch({ name: 'clientStartDate', control }) ?? new Date().toString()

  return new Date(clientStartDate).toISOString().split('T')[0]
}
