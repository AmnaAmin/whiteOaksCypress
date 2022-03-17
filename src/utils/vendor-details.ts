import { useToast } from '@chakra-ui/toast'
import { useClient } from 'utils/auth-context'
import _ from 'lodash'
import { useMutation, useQuery } from 'react-query'
import {
  License,
  Market,
  Trade,
  VendorMarketFormValues,
  VendorProfile,
  VendorProfileDetailsFormData,
  VendorProfilePayload,
  VendorTradeFormValues,
} from '../types/vendor.types'
import { convertDateTimeFromServer, customFormat } from './date-time-utils'

export const licenseTypes = [
  { value: '1', label: 'Electrical' },
  { value: '2', label: 'Plumbing' },
  { value: '3', label: 'General Contractor' },
  { value: '4', label: 'Roofing' },
  { value: '5', label: 'Architecture' },
  { value: '6', label: 'Mechanical' },
]

export const useVendorProfile = (vendorId: number) => {
  const client = useClient()

  return useQuery<VendorProfile>('vendorProfile', async () => {
    const response = await client(`vendors/${vendorId}`, {})

    return response?.data
  })
}

export const useAccountDetails = () => {
  const client = useClient()

  return useQuery(
    'account-details',
    async () => {
      const response = await client(`account`, {})

      return response?.data
    },
    { enabled: false },
  )
}

export const useVendorProfileUpdateMutation = () => {
  const client = useClient()

  return useMutation((payload: VendorProfilePayload) => client(`vendors`, { data: payload, method: 'PUT' }), {
    onSuccess(response) {
      console.log('response', response)
    },
  })
}

export const parseAPIDataToFormData = (vendorProfileData: VendorProfile): VendorProfileDetailsFormData => {
  return {
    primaryContact: vendorProfileData.ownerName,
    secondaryContact: vendorProfileData.secondName,
    businessPhoneNumber: vendorProfileData.businessPhoneNumber,
    secondaryNumber: vendorProfileData.secondPhoneNumber,
    businessNumberExtention: vendorProfileData.businessPhoneNumberExtension,
    secondaryNumberExtenstion: vendorProfileData.secondPhoneNumberExtension,
    primaryEmail: vendorProfileData.businessEmailAddress,
    secondaryEmail: vendorProfileData.secondEmailAddress,
  }
}

export const parseFormDataToAPIData = (
  vendorProfileData: VendorProfile,
  formValues: VendorProfileDetailsFormData,
): VendorProfilePayload => {
  return {
    ...vendorProfileData,
    businessPhoneNumber: formValues.businessPhoneNumber,
    secondPhoneNumber: formValues.secondaryNumber,
    ownerName: formValues.primaryContact,
    secondName: formValues.secondaryContact,
    businessPhoneNumberExtension: formValues.businessNumberExtention,
    secondPhoneNumberExtension: formValues.secondaryNumberExtenstion,
    businessEmailAddress: formValues.primaryEmail,
    secondEmailAddress: formValues.secondaryEmail,
    documents: [],
  }
}

export const useTrades = () => {
  const client = useClient()

  return useQuery<Array<Trade>>('trades', async () => {
    const response = await client(`vendor-skills`, {})

    return response?.data
  })
}

export const useMarkets = () => {
  const client = useClient()

  const { data: markets, ...rest } = useQuery<Array<Market>>('markets', async () => {
    const response = await client(`markets`, {})
    return response?.data
  })

  return {
    markets,
    ...rest,
  }
}

export const parseTradeAPIDataToFormValues = (trades: Trade[], vendorData: VendorProfile): VendorTradeFormValues => {
  return {
    trades: trades.map(trade => ({
      ...trade,
      checked: !!vendorData?.vendorSkills?.find(skill => skill.id === trade.id),
    })),
  }
}

export const parseTradeFormValuesToAPIPayload = (
  formValues: VendorTradeFormValues,
  vendorData: VendorProfile,
): VendorProfilePayload => {
  return {
    ...vendorData,
    vendorSkills: formValues.trades
      .filter(trade => trade.checked)
      .map(trade => {
        const { checked, ...rest } = trade
        return rest
      }),
    documents: [],
  }
}

export const parseMarketAPIDataToFormValues = (
  markets: Market[],
  vendorData: VendorProfile,
): VendorMarketFormValues => {
  return {
    markets: markets.map(market => ({
      ...market,
      checked: !!vendorData?.markets?.find(skill => skill.id === market.id),
    })),
  }
}

export const parseMarketFormValuesToAPIPayload = (
  formValues: VendorMarketFormValues,
  vendorData: VendorProfile,
): VendorProfilePayload => {
  return {
    ...vendorData,
    markets: formValues.markets
      .filter(market => market.checked)
      .map(market => {
        const { checked, ...rest } = market
        return rest
      }),
    documents: [],
  }
}

export const DOCUMENTS_TYPES = {
  COI_GL: { value: 'Certificate Of Insurance - General Liabilities', id: 21 },
  COI_WC: { value: 'Certificate Of Insurance-Worker Comp', id: 20 },
  AGREEMENT_SIGNED_DOCUMENT: { value: 'Signed Agreement', id: 40 },
  AUTH_INSURANCE_EXPIRATION: { value: 'Auto Insurance', id: 22 },
  W9_DOCUMENT: { value: 'W9 DOCUMENT', id: 99 },
}

export const useSaveVendorDetails = () => {
  const client = useClient()
  const toast = useToast()

  return useMutation(
    (licenses: any) => {
      return client('vendors', {
        data: licenses,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Update Vendor Details',
          description: 'Vendor Details have been updated successfully.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      },
    },
  )
}

export const readFileContent = async (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const blob = fileReader.result as string
      resolve(blob.split(',')[1])
    }
    fileReader.onerror = reject
    fileReader.readAsDataURL(file)
  })
}

export const licenseDefaultFormValues = (vendor: VendorProfile): License[] => {
  const licenses: License[] = []
  vendor.licenseDocuments &&
    vendor.licenseDocuments.forEach(license => {
      const licenseObject = {
        licenseType: license.licenseType,
        licenseNumber: license.licenseNumber,
        expiryDate: convertDateTimeFromServer(license.licenseExpirationDate),
        expirationFile: [new File([license.fileObject], license.fileType)],
        downloadableFile: { url: license.s3Url, name: license.fileType },
      }
      licenses.push(licenseObject)
    })

  return licenses
}

export const parseLicenseValues = async (values: any) => {
  const results = await Promise.all(
    values.licenses.map(async (license: any, index: number) => {
      const fileContents = await readFileContent(license.expirationFile[0])
      const doc = {
        licenseExpirationDate: customFormat(license.expiryDate, 'YYYY-MM-DD'),
        licenseNumber: license.licenseNumber,
        licenseType: license.licenseType,
        fileObjectContentType: license.expirationFile[0].type,
        fileType: license.expirationFile[0].name,
        fileObject: fileContents,
      }
      return doc
    }),
  )
  return results
}

export const createVendorPayload = (updatedObj: any, vendor: any) => {
  vendor = _.omit(vendor, 'documents')
  const vendorPayload = {
    ...vendor,
    ...updatedObj,
  }
  return vendorPayload
}

export const documentCardsDefaultValues = (vendor: any) => {
  const documentCards = {
    agreementSignedDate: convertDateTimeFromServer(vendor.agreementSignedDate),
    agreementUrl: vendor.documents.find(
      (d: any) => d.documentTypelabel === DOCUMENTS_TYPES.AGREEMENT_SIGNED_DOCUMENT.value,
    )?.s3Url,
    agreement: null,
    w9DocumentDate: convertDateTimeFromServer(vendor.w9DocumentDate),
    w9Document: null,
    w9DocumentUrl: vendor.documents.find((d: any) => d.documentTypelabel === DOCUMENTS_TYPES.W9_DOCUMENT.value)?.s3Url,
    autoInsuranceExpDate: convertDateTimeFromServer(vendor.autoInsuranceExpirationDate),
    insuranceUrl: vendor.documents.find(
      (d: any) => d.documentTypelabel === DOCUMENTS_TYPES.AUTH_INSURANCE_EXPIRATION.value,
    )?.s3Url,
    insurance: null,
    coiGlExpDate: convertDateTimeFromServer(vendor.coiglExpirationDate),
    coiGlExpFile: null,
    coiGLExpUrl: vendor.documents.find((d: any) => d.documentTypelabel === DOCUMENTS_TYPES.COI_GL.value)?.s3Url,
    coiWcExpDate: convertDateTimeFromServer(vendor.coiWcExpirationDate),
    coiWcExpFile: null,
    coiWcExpUrl: vendor.documents.find((d: any) => d.documentTypelabel === DOCUMENTS_TYPES.COI_WC.value)?.s3Url,
  }
  return documentCards
}

export const parseDocumentCardsValues = async (values: any) => {
  const documentsList: any[] = []
  values.agreement &&
    documentsList.push({
      file: values.agreement,
      type: DOCUMENTS_TYPES.AGREEMENT_SIGNED_DOCUMENT.id,
    })
  values.w9Document &&
    documentsList.push({
      file: values.w9Document,
      type: DOCUMENTS_TYPES.W9_DOCUMENT.id,
    })
  values.insurance &&
    documentsList.push({
      file: values.insurance,
      type: DOCUMENTS_TYPES.AUTH_INSURANCE_EXPIRATION.id,
    })
  values.coiGlExpFile &&
    documentsList.push({
      file: values.coiGlExpFile,
      type: DOCUMENTS_TYPES.COI_GL.id,
    })
  values.coiWcExpFile &&
    documentsList.push({
      file: values.coiWcExpFile,
      type: DOCUMENTS_TYPES.COI_WC.id,
    })

  const results = await Promise.all(
    documentsList.map(async (doc, index) => {
      const fileContents = await readFileContent(doc.file[0])
      const document = {
        documentType: doc.type,
        fileObjectContentType: doc.file[0].type,
        fileType: doc.file[0].name,
        fileObject: fileContents,
      }
      return document
    }),
  )
  return results
}

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
]

export const useSaveSettings = () => {
  const client = useClient()
  const toast = useToast()

  return useMutation(
    (settings: any) => {
      return client('account', {
        data: settings,
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Update Settings',
          description: 'Settings have been updated successfully.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      },
    },
  )
}

export const usePaymentMethods = () => {
  const client = useClient()

  return useQuery('payments', async () => {
    const response: any = await client(`lk_value/payment/options`, {})
    response?.data.map((obj: any) => {
      const temp: any = obj.id
      obj.id = obj.lookupId
      obj.lookupValueId = temp
      obj.name = obj.value
      console.log(obj)
      return obj
    })
    return response?.data
  })
}

export const useSaveLanguage = () => {
  const client = useClient()

  return useMutation(
    (settings: any) => {
      return client('account', {
        data: settings,
      })
    },
    {
      onSuccess() {},
    },
  )
}
