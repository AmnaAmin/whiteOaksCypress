import { useToast } from '@chakra-ui/react'
import { TokenResult } from '@stripe/stripe-js'
import { CreditCardFormValues } from 'features/vendors/vendor-payments/vendor-cc-add-modal'
import { AccountType } from 'features/vendors/vendor-payments/vendor-financial-account-type'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { VendorProfile, StripePayment, StripePaymentMethodResponse } from 'types/vendor.types'
import { useClient } from 'utils/auth-context'

type CreditCardPayload = {
  organizationId: number
  organizationName: string
  organizationEmail: string
  platform: string | undefined
  billingAddress: {
    line1: string
    city: string
    postalCode: string
    state: string
  }
  email: string
  firstName: string
  lastName: string
  phone: string
  expMonth: number | undefined
  expYear: number | undefined
  stripeToken: string | undefined
  markPaymentMethodAsDefault?: boolean
}

const paymentServiceUrl = process.env.REACT_APP_PAYMENT_SERVICE_URL ?? null;
const woaPlatformId = process.env.REACT_APP_PAYMENT_SERVICE_WOA_PLATFORM_ID ?? null;
export const isPaymentServiceEnabled = process.env.REACT_APP_ENABLE_PAYMENT === "false" ? false : false;
console.log("Payment Service Enabled:", isPaymentServiceEnabled);
console.log("Trigger unit test");

export const mapCCToFormValues = (data: StripePayment | null | undefined, stateSelectOptions: any) => {
  if (!data) return {}
  return {
    billingAddress: {
      line1: data?.billing_details?.address?.line1,
      city: data?.billing_details?.address?.city,
      postalCode: data?.billing_details?.address?.postal_code,
      state: stateSelectOptions?.find(
        s => s?.label?.toLowerCase() === data?.billing_details?.address?.state?.toLowerCase(),
      ),
    },
    email: data?.billing_details?.email,
    firstName: data?.billing_details?.name?.split(', ')[1],
    lastName: data?.billing_details?.name?.split(', ')[0],
    phone: data?.billing_details?.phone,
    isPaymentMethodDefault: data?.isPaymentMethodDefault
  }
}

export const mapCCFormValuesToPayload = (
  values: CreditCardFormValues,
  stripeData: TokenResult,
  vendorProfileData: VendorProfile,
  isUpdate?: boolean
) => {
  const payload: CreditCardPayload = {
    organizationId: vendorProfileData?.id,
    organizationEmail: vendorProfileData?.businessEmailAddress,
    organizationName: vendorProfileData?.companyName,
    platform: woaPlatformId?.toString(),
    billingAddress: {
      line1: values?.billingAddress?.line1,
      city: values?.billingAddress?.city,
      postalCode: values?.billingAddress?.postalCode,
      state: values?.billingAddress?.state?.label,
    },
    email: values?.email,
    firstName: values?.firstName,
    lastName: values?.lastName,
    phone: values?.phone,
    expMonth: stripeData?.token?.card?.exp_month,
    expYear: stripeData?.token?.card?.exp_year,
    stripeToken: stripeData?.token?.id,
  }
  if (isUpdate) {
    payload.markPaymentMethodAsDefault = Boolean(values?.isPaymentMethodDefault);
  }
  return payload
}

export const createTableDataForAch = (vendorProfileData: VendorProfile | undefined) => {
  if (!vendorProfileData) return undefined;
  const achFields = ['bankName', 'bankPrimaryContact', 'bankEmail', 'bankPhoneNumber', 'bankAddress', 'bankCity', 'bankState', 'bankZipCode', 'bankRoutingNo', 'bankAccountingNo', 'bankSaving', 'bankChecking', 'bankVoidedCheckDate', 'bankVoidedCheckStatus', 'voidedDocumentLink', 'ownerSignatureLink', 'ownerSignatureName', 'bankDateSignature'];
  if (achFields.some(a => Boolean(vendorProfileData[a]?.length))) {
    const bankAccount = vendorProfileData?.bankAccountingNo?.toString();
    return {
      billing_details: {
        email: vendorProfileData?.businessEmailAddress,
        name: vendorProfileData?.ownerName,
        phone: vendorProfileData?.businessPhoneNumber
      },
      us_bank_account: {
        bank_name: vendorProfileData?.bankName,
        last4: bankAccount?.substring(bankAccount?.length - 4),
      },
      type: AccountType.ACH_BANK
    }
  } 
}

export const useCreateNewCreditCard = (id: string | number) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: CreditCardPayload) =>
      client(
        'payments/creditcard',
        {
          method: 'POST',
          data: payload,
        },
        paymentServiceUrl,
      ),
    {
      onSuccess() {
        queryClient.invalidateQueries(['payment-methods', id])
        toast({
          title: 'Payment Method',
          description: 'Credit Card added successfully.',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        console.error('Exception encountered in useCreateNewCreditCard:', error)
        let description = `${error?.detail}` ?? 'Unable to save the credit card.'
        toast({
          title: 'Payment Method',
          position: 'top-left',
          description,
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useFetchPaymentMethods = (id: string | number | undefined) => {
  const client = useClient()
  const toast = useToast()

  const urlPathVariable = `${woaPlatformId}/${id}`
  return useQuery(
    ['payment-methods', id],
    async () => {
      if (!id || !isPaymentServiceEnabled) return;
      const response = await client(`payments/payment-methods/${urlPathVariable}`, {}, paymentServiceUrl)
      if (response) {
        const jsonResponse: StripePaymentMethodResponse = JSON.parse(response.data)
        return jsonResponse
      } else {
        return null
      }
    },
    {
      onError(error: any) {
        console.error('Exception encountered in useFetchPaymentMethods:', error)
        let description = `${error?.detail}` ?? 'Something went wrong. Unable to retrieve payment methods.'
        toast({
          title: 'Payment Method',
          position: 'top-left',
          description,
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useUpdateCredtCard = (id: string | number, paymentMethodId: string) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: CreditCardPayload) =>
      client(
        `payments/creditcard/${paymentMethodId}`,
        {
          method: 'PUT',
          data: payload,
        },
        paymentServiceUrl,
      ),
    {
      onSuccess() {
        queryClient.invalidateQueries(['payment-methods', id])
        toast({
          title: 'Payment Method',
          description: 'Credit Card updated successfully.',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        console.error('Exception encountered in useUpdateCredtCard:', error)
        let description = `${error?.detail}` ?? 'Unable to update the credit card.'
        toast({
          title: 'Payment Method',
          position: 'top-left',
          description,
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}
