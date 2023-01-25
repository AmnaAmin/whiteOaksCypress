import { ProjectStatus as STATUS } from 'types/project-details.types'
import { Control, useWatch, FieldErrors } from 'react-hook-form'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

export const useFieldsDisabled = (control: Control<ProjectDetailsFormValues>) => {
  const status = useWatch({ name: 'status', control })
  const invoiceBackDate = useWatch({ name: 'invoiceBackDate', control })
  const remainingPayment = useWatch({ name: 'remainingPayment', control })
  const { isFPM, isProjectCoordinator, isDoc, isAccounting, isAdmin } = useUserRolesSelector()

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

    // Project Management form fields states
    isWOAStartDateRequired: isStatusActive,
    isWOACompletionDateRequired: isStatusClosed,
    isClientWalkthroughDateRequired: isStatusClosed,
    isClientSignOffDateRequired: isStatusClosed,

    isWOAStartDisabled:
      isFPM ||
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
      isFPM ||
      isStatusClosed ||
      isStatusInvoiced ||
      (isStatusClientPaid && !isAdmin) ||
      isStatusPaid ||
      isStatusOverPayment,
    isClientDueDateDisabled:
      isFPM ||
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
    isPaymentDisabled: !(isStatusClientPaid || isStatusInvoiced || invoiceBackDate) || remainingPayment === 0,

    // Contacts field states
    isProjectCoordinatorDisabled: isStatusClosed || isStatusInvoiced || isStatusClientPaid || isStatusPaid,
    isProjectCoordinatorPhoneNumberDisabled: isAllTimeDisabled,
    isProjectCoordinatorExtensionDisabled: isAllTimeDisabled,
    isFieldProjectManagerDisabled: isStatusInvoiced || isStatusClosed || isFPM,
    isFieldProjectManagerPhoneNumberDisabled: isAllTimeDisabled,
    isFieldProjectManagerExtensionDisabled: isAllTimeDisabled,
    isClientDisabled: !isAdmin,

    // Location Form fields states
    isAddressDisabled: !isAdmin,
    isCityDisabled: !isAdmin,
    isStateDisabled: !isAdmin,
    isZipDisabled: !isAdmin,
    isMarketDisabled: !isAdmin,
    isGateCodeDisabled:
      isFPM || isDoc || isProjectCoordinator || isAccounting || isAdmin
        ? !newActivePunchEnabledFieldStatus
        : isAllTimeDisabled,
    isLockBoxCodeDisabled:
      isFPM || isDoc || isProjectCoordinator || isAccounting || isAdmin
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
  }
}

// Min of woa start date will be client start date
export const useWOAStartDateMin = (control: Control<ProjectDetailsFormValues>) => {
  const clientStartDate = useWatch({ name: 'clientStartDate', control }) ?? new Date().toString()

  return new Date(clientStartDate).toISOString().split('T')[0]
}
