import { FieldErrors } from "react-hook-form"
import { VendorAccountsFormValues } from "types/vendor.types"

/**
 * @description - useVendorSubFormErrors returns object of booleans indicating form errors.
 * @param errors - errors object of react hook form errors of all fields
 * @returns - isAccountFormErrors for showing error indicator on Accounts form tab
 */
export const useVendorSubFormErrors = (errors: FieldErrors<VendorAccountsFormValues>) => {
    const validations = {
        isAccountFormErrors: false
    }
    if (errors?.businessEmailAddress || errors?.companyName || errors?.ownerName || errors?.businessPhoneNumber || errors?.streetAddress || errors?.city || errors?.state || errors?.zipCode) validations.isAccountFormErrors = true;
    
    return validations;
  }