import { ProjectStatus as STATUS } from 'types/project-details.types'
import { Control, useWatch } from 'react-hook-form'
import { ProjectDetailsFormValues } from 'types/project-details.types'

export const useFieldsDisabled = (control: Control<ProjectDetailsFormValues>) => {
  const status = useWatch({ name: 'status', control })
  const invoiceBackDate = useWatch({ name: 'invoiceBackDate', control })

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
    isWOAStartDisabled: isStatusClosed || isStatusInvoiced || isStatusClientPaid || isStatusPaid || isStatusOverPayment,
    isWOACompletionDisabled:
      isStatusNew || isStatusActive || isStatusInvoiced || isStatusClientPaid || isStatusPaid || isStatusOverPayment,
    isClientStartDateDisabled:
      isStatusClosed || isStatusInvoiced || isStatusClientPaid || isStatusPaid || isStatusOverPayment,
    isClientDueDateDisabled:
      isStatusClosed || isStatusInvoiced || isStatusClientPaid || isStatusPaid || isStatusOverPayment,
    isClientWalkthroughDisabled:
      isStatusNew || isStatusActive || isStatusClientPaid || isStatusPaid || isStatusOverPayment,
    isClientSignOffDisabled: isStatusNew || isStatusActive || isStatusClientPaid || isStatusPaid || isStatusOverPayment,

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
    isPaymentDisabled: !(isStatusClientPaid || isStatusInvoiced || invoiceBackDate),

    // Contacts field states
    isProjectCoordinatorDisabled: isAllTimeDisabled,
    isProjectCoordinatorPhoneNumberDisabled: isAllTimeDisabled,
    isProjectCoordinatorExtensionDisabled: isAllTimeDisabled,
    isFieldProjectManagerDisabled: isStatusInvoiced || isStatusClosed,
    isFieldProjectManagerPhoneNumberDisabled: isAllTimeDisabled,
    isFieldProjectManagerExtensionDisabled: isAllTimeDisabled,
    isClientDisabled: isAllTimeDisabled,

    // Location Form fields states
    isAddressDisabled: isAllTimeDisabled,
    isCityDisabled: isAllTimeDisabled,
    isStateDisabled: isAllTimeDisabled,
    isZipDisabled: isAllTimeDisabled,
    isMarketDisabled: isAllTimeDisabled,
    isGateCodeDisabled: isAllTimeDisabled,
    isLockBoxCodeDisabled: isAllTimeDisabled,
  }
}

// Min of woa start date will be client start date
export const useWOAStartDateMin = (control: Control<ProjectDetailsFormValues>) => {
  const clientStartDate = useWatch({ name: 'clientStartDate', control }) ?? new Date().toString()

  return new Date(clientStartDate).toISOString().split('T')[0]
}
