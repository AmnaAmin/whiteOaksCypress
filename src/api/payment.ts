import { useToast } from '@chakra-ui/react'
import { TokenResult } from '@stripe/stripe-js'
import { CreditCardFormValues } from 'features/vendors/vendor-payments/vendor-cc-modal'
import { useMutation } from 'react-query'
import { VendorProfile } from 'types/vendor.types'
import { useClient } from 'utils/auth-context'

type CreditCardPayload = {
  organizationId: number;
  platform: string | undefined;
  billingAddress: {
      line1: string;
      city: string;
      postalCode: string;
      state: string;
  };
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  expMonth: number | undefined;
  expYear: number | undefined;
  stripeToken: string | undefined;
}

const paymentServiceUrl = process.env.REACT_APP_PAYMENT_SERVICE_URL ?? null;
const woaPlatformId = process.env.REACT_APP_PAYMENT_SERVICE_WOA_PLATFORM_ID ?? null;


export const mapCCFormValuesToPayload = (values: CreditCardFormValues, stripeData: TokenResult, vendorProfileData: VendorProfile) => {
    const payload: CreditCardPayload = {
        organizationId: vendorProfileData?.id,
        platform: woaPlatformId?.toString(),
        billingAddress: {
            line1: values?.billingAddress?.line1,
            city: values?.billingAddress?.city,
            postalCode: values?.billingAddress?.postalCode,
            state: values?.billingAddress?.state?.label            
        },
        email: values?.email,
        firstName: values?.firstName,
        lastName: values?.lastName,
        phone: values?.phone,
        expMonth: stripeData?.token?.card?.exp_month,
        expYear: stripeData?.token?.card?.exp_year,
        stripeToken: stripeData?.token?.id
    };
    return payload;
}

export const useCreateNewCreditCard = () => {
  const client = useClient()
  const toast = useToast()

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
        toast({
          title: 'Payment Method',
          description: 'Credit Card added successfully.',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
      onError(error: any) {
        let description = error.title ?? 'Unable to save the credit card.'
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
