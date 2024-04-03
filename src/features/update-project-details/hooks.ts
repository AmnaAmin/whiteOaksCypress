import { ProjectStatus as STATUS } from 'types/project-details.types'
import { Control, useWatch, FieldErrors } from 'react-hook-form'
import { ProjectDetailsFormValues } from 'types/project-details.types'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { PROJECT_STATUS } from 'features/common/status'
import { isValidDate } from 'utils/date-time-utils'
import moment from 'moment'

export const useFieldsDisabled = (control: Control<ProjectDetailsFormValues>, projectData?: any) => {
  const status = useWatch({ name: 'status', control })
  const isProjectStatusInvoiced = projectData?.projectStatus === PROJECT_STATUS.invoiced.label
  const invoiceBackDate = useWatch({ name: 'invoiceBackDate', control })
  const remainingPayment = useWatch({ name: 'remainingPayment', control })
  const { permissions } = useRoleBasedPermissions()
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
  const isStatusAwaitingPunch = projectStatus === STATUS.Awaitingpunch
  const isStatusReconciled = projectStatus === STATUS.Reconcile

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
      !permissions.some(p => ['PROJECTDETAIL.MGMT.WOASTART.EDIT', 'ALL'].includes(p)) ||
      isStatusClosed ||
      isStatusInvoiced ||
      isStatusClientPaid ||
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
      !permissions.some(p => ['PROJECTDETAIL.MGMT.CLIENTSTART.EDIT', 'ALL'].includes(p)) ||
      isStatusClosed ||
      isStatusInvoiced ||
      isStatusClientPaid ||
      isStatusPaid ||
      isStatusOverPayment,
    isClientDueDateDisabled:
      !permissions.some(p => ['PROJECTDETAIL.MGMT.CLIENTDUEDATE.EDIT', 'ALL'].includes(p)) ||
      isStatusClosed ||
      isStatusInvoiced ||
      isStatusClientPaid ||
      isStatusPaid ||
      isStatusOverPayment,
    isClientWalkthroughDisabled:
      isStatusNew ||
      isStatusActive ||
      isStatusAwaitingPunch ||
      isStatusInvoiced ||
      (isStatusClientPaid && !isAdmin) ||
      isStatusPaid ||
      isStatusOverPayment,
    isClientSignOffDisabled:
      isStatusNew ||
      isStatusActive ||
      isStatusAwaitingPunch ||
      (isStatusClientPaid && !isAdmin) ||
      isStatusPaid ||
      isStatusOverPayment ||
      isStatusInvoiced,
    isReconcileDisabled: !permissions.some(p => ['PROJECTDETAIL.MGMT.PROJECTVERIFIED.EDIT', 'ALL'].includes(p)),

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
    isProjectCoordinatorDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.PC.EDIT', 'ALL'].includes(p)),
    isProjectCoordinatorPhoneNumberDisabled: isAllTimeDisabled,
    isProjectCoordinatorExtensionDisabled: isAllTimeDisabled,
    isFieldProjectManagerDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.FPM.EDIT', 'ALL'].includes(p)),
    isFieldProjectManagerPhoneNumberDisabled: isAllTimeDisabled,
    isFieldProjectManagerExtensionDisabled: isAllTimeDisabled,
    isClientDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.CLIENT.EDIT', 'ALL'].includes(p)),

    // Location Form fields states
    isAddressDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.ADDRESS.EDIT', 'ALL'].includes(p)),

    isCityDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.ADDRESS.EDIT', 'ALL'].includes(p)),
    isStateDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.ADDRESS.EDIT', 'ALL'].includes(p)),
    isZipDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.ADDRESS.EDIT', 'ALL'].includes(p)),
    isMarketDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.MARKET.EDIT', 'ALL'].includes(p)),
    isGateCodeDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.GATECODE.EDIT', 'ALL'].includes(p)),
    isLockBoxCodeDisabled: !permissions.some(p => ['PROJECTDETAIL.CONTACT.LOCKBOX.EDIT', 'ALL'].includes(p)),
  }
}

export const useFieldsRequired = (control: Control<ProjectDetailsFormValues>) => {
  const status = useWatch({ name: 'status', control })

  const projectStatus = status?.value
  const isStatusActive = projectStatus === STATUS.Active
  const isStatusClosed = projectStatus === STATUS.Closed
  const isStatusAwaitingPunch = projectStatus === STATUS.Awaitingpunch
  const isStatusPunch = projectStatus === STATUS.Punch
  const isStatusReconcile = projectStatus === STATUS.Reconcile

  return {
    // Project Management form fields states
    isWOAStartDateRequired: isStatusActive,
    isWOACompletionDateRequired: isStatusClosed || isStatusPunch || isStatusReconcile,
    isWOACompletionDateRequiredNew: isStatusClosed || isStatusAwaitingPunch || isStatusReconcile,
    isClientWalkthroughDateRequired: isStatusClosed,
    isClientWalkthroughDateRequiredNew: isStatusPunch,
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
      !!errors.woaCompletionDate ||
      !!errors.clientWalkthroughDate ||
      !!errors.clientSignOffDate ||
      !!errors.type ||
      !!errors.woaStartDate,
    isContactsFormErrors:
      !!errors.projectCoordinator || !!errors.fieldProjectManager || !!errors.client || !!errors.clientType,
    isLocationFormErrors: !!errors.zip || !!errors.city || !!errors.market || !!errors.address || !!errors.state,
  }
}

// Min of woa start date will be client start date
// Min of woa completion date will be woa start date
export const useMinMaxDateSelector = (control: Control<ProjectDetailsFormValues>) => {
  const clientStartDate = useWatch({ name: 'clientStartDate', control }) ?? new Date().toString()
  const woaStartDate = useWatch({ name: 'woaStartDate', control }) ?? new Date().toString()

  return {
    woaStartMin: isValidDate(new Date(clientStartDate))
      ? new Date(clientStartDate)?.toISOString()?.split('T')?.[0]
      : '',
    woaCompletionMin: isValidDate(new Date(woaStartDate)) ? moment.utc(woaStartDate).format('YYYY-MM-DD') : '',
  }
}

// Current date
export const useCurrentDate = () => {
  let date = new Date().toISOString().split('T')[0]
  return date
}
