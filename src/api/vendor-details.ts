import { useToast } from '@chakra-ui/toast'
import _ from 'lodash'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  License,
  Market,
  Trade,
  VendorMarketFormValues,
  VendorProfile,
  VendorProfileDetailsFormData,
  VendorProfilePayload,
  VendorTradeFormValues,
} from 'types/vendor.types'
import { useClient } from 'utils/auth-context'
import { convertDateTimeFromServer, convertDateTimeToServer, customFormat } from 'utils/date-time-utils'

export const licenseTypes = [
  { value: '1', label: 'Electrical' },
  { value: '2', label: 'Plumbing' },
  { value: '3', label: 'General Contractor' },
  { value: '4', label: 'Roofing' },
  { value: '5', label: 'Architecture' },
  { value: '6', label: 'Mechanical' },
]

export const requiredField = {
  detailErrors: [
    'businessEmailAddress',
    'businessPhoneNumber',
    'capacity',
    'city',
    'companyName',
    'ownerName',
    'paymentTerm',
    'state',
    'streetAddress',
    'zipCode',
    'einNumber',
    'ssnNumber',
  ],
  documentErrors: ['w9Document'],
  licenseErrors: ['licenses'],
}
export const useVendorProfile = (vendorId: number) => {
  const client = useClient()

  return useQuery<VendorProfile>(
    'vendorProfile',
    async () => {
      const response = await client(`vendors/${vendorId}`, {})
      return response?.data
    },
    { enabled: !!vendorId },
  )
}

export const useFPMProfile = (FpmId: number) => {
  const client = useClient()

  return useQuery(
    'vendorProfile',
    async () => {
      const response = await client(`fpm-quota-info/${FpmId}`, {})
      return response?.data
    },
    { enabled: !!FpmId },
  )
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

export const useCreateVendorMutation = () => {
  const client = useClient()
  const { t } = useTranslation()
  const toast = useToast()
  const queryClient = useQueryClient()
  return useMutation((payload: any) => client(`vendors`, { data: payload, method: 'POST' }), {
    onSuccess() {
      queryClient.invalidateQueries('vendor')
      queryClient.invalidateQueries('vendorsCards')
      toast({
        title: 'Create Vendor',
        description: t('createVendorSuccess'),
        status: 'success',
        isClosable: true,
      })
    },
    onError(error: any) {
      toast({
        title: 'Create Vendor',
        description: (error.title as string) ?? 'Unable to create project.',
        status: 'error',
        isClosable: true,
      })
    },
  })
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

export const parseVendorFormDataToAPIData = (
  formValues: VendorProfileDetailsFormData,
  paymentsMethods,
  vendorProfileData?: VendorProfile,
): VendorProfilePayload => {
  return {
    ...vendorProfileData!,
    ownerName: formValues.ownerName!,
    secondName: formValues.secondName!,
    businessPhoneNumber: formValues.businessPhoneNumber,
    businessPhoneNumberExtension: formValues.businessPhoneNumberExtension!,
    secondPhoneNumber: formValues.secondPhoneNumber!,
    secondPhoneNumberExtension: formValues.secondPhoneNumberExtension!,
    businessEmailAddress: formValues.businessEmailAddress!,
    companyName: formValues.companyName!,
    streetAddress: formValues.streetAddress!,
    city: formValues.city!,
    zipCode: formValues.zipCode!,
    capacity: formValues.capacity!,
    einNumber: formValues.einNumber!,
    ssnNumber: formValues.ssnNumber!,
    secondEmailAddress: formValues.secondEmailAddress!,
    score: formValues.score?.value,
    status: formValues.status?.value,
    state: formValues.state?.value,
    isSsn: false,
    paymentTerm: formValues.paymentTerm?.value,
    documents: [],
    vendorSkills: vendorProfileData?.vendorSkills || [],
    markets: vendorProfileData?.markets || [],
    licenseDocuments: vendorProfileData?.licenseDocuments || [],
    paymentOptions: paymentsMethods.filter(payment => formValues[payment.name]),
  }
}

export const parseCreateVendorFormToAPIData = async (
  formValues,
  paymentsMethods,
  vendorProfileData?: VendorProfile,
) => {
  const profilePayload = parseVendorFormDataToAPIData(formValues, paymentsMethods, vendorProfileData)
  const documentsPayload = await parseDocumentCardsValues(formValues)
  const updatedObject = prepareVendorDocumentObject(documentsPayload, formValues)
  const licensePayload = await parseLicenseValues(formValues, vendorProfileData?.licenseDocuments)
  const tradePayload = parseTradeFormValuesToAPIPayload(formValues, vendorProfileData!)
  const marketsPayload = parseMarketFormValuesToAPIPayload(formValues, vendorProfileData!)
  return {
    ...profilePayload,
    licenseDocuments: licensePayload,
    ...tradePayload,
    ...marketsPayload,
    ...updatedObject,
  }
}

export const parseVendorAPIDataToFormData = (vendorProfileData): VendorProfileDetailsFormData => {
  return {
    ...vendorProfileData,
    ...vendorProfileData.paymentOptions.reduce((a, payment) => ({ ...a, [payment.name]: true }), {}),
    ...documentCardsDefaultValues(vendorProfileData),
    licenses: licenseDefaultFormValues(vendorProfileData),
    trades: [],
    markets: [],
  }
}

export const useTrades = () => {
  const client = useClient()

  return useQuery<Array<Trade>>('trades', async () => {
    const response = await client(`vendor-skills`, {})

    return response?.data
  })
}

export const useVendorSkillsMutation = () => {
  const client = useClient()
  const toast = useToast()

  return useMutation(
    (payload: any) => {
      return client('vendor-skills', {
        data: payload,
        method: payload?.method,
      })
    },
    {
      onError(error: any) {
        toast({
          title: 'Note',
          description: (error.title as string) ?? 'Vendor Skill Operation Failed.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}
export const useMarketsMutation = () => {
  const client = useClient()
  const toast = useToast()

  return useMutation(
    (payload: any) => {
      return client('markets', {
        data: payload,
        method: payload?.method,
      })
    },
    {
      onError(error: any) {
        toast({
          title: 'Note',
          description: (error.title as string) ?? 'Markets Operation Failed.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
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
      trade,
      checked: !!vendorData?.vendorSkills?.find(skill => skill.id === trade.id),
    })),
  }
}

export const parseTradeFormValuesToAPIPayload = (
  formValues,
  vendorData: VendorProfile | {},
): Partial<VendorProfilePayload> => {
  return {
    ...vendorData,
    vendorSkills: formValues.trades
      .map(trade => ({ ...trade.trade, checked: trade.checked }))
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
      market,
      checked: !!vendorData?.markets?.find(skill => skill.id === market.id),
    })),
  }
}

export const parseMarketFormValuesToAPIPayload = (
  formValues,
  vendorData: VendorProfile | {},
): Partial<VendorProfilePayload> => {
  return {
    ...vendorData,
    markets: formValues.markets
      .map(market => ({ ...market.market, checked: market.checked }))
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
  W9_DOCUMENT: { value: 'W9 Document', id: 99 },
}

export const useSaveVendorDetails = (name: string) => {
  const client = useClient()
  const toast = useToast()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: any) => {
      return client('vendors', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries('vendorProfile')
        queryClient.invalidateQueries('vendor')
        queryClient.invalidateQueries('vendorsCards')
        toast({
          title: t(`update${name}`),
          description: t(`update${name}Success`),
          status: 'success',
          isClosable: true,
        })
      },
      onError(error: any) {
        toast({
          title: t(`update${name}`),
          description: (error.title as string) ?? 'Unable to update vendor.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const readFileContent = async (file: File) => {
  if (!file) return Promise.resolve(null)

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
        id: license.id,
        licenseType: license.licenseType,
        licenseNumber: license.licenseNumber,
        expiryDate: convertDateTimeFromServer(license.licenseExpirationDate),
        expirationFile: null,
        downloadableFile: { url: license.s3Url, name: license.fileType },
      }
      licenses.push(licenseObject)
    })

  return licenses
}

export const parseLicenseValues = async (values: any, licensesDocuments: any) => {
  const results = await Promise.all(
    values.licenses.map(async (license: any, index: number) => {
      let existingLicense = licensesDocuments?.find(l => l.id === license.id)
      let doc = {}
      let fileContents
      if (existingLicense) {
        if (license.expirationFile) {
          fileContents = await readFileContent(license.expirationFile)
          doc = {
            fileObjectContentType: license.expirationFile?.type,
            fileType: license.expirationFile?.name,
            fileObject: fileContents,
          }
        }
        doc = {
          ...existingLicense,
          ...doc,
          licenseNumber: license.licenseNumber,
          licenseType: license.licenseType,
          licenseExpirationDate: customFormat(license.expiryDate, 'yyyy-MM-dd'),
        }
      } else {
        fileContents = await readFileContent(license.expirationFile)
        doc = {
          licenseExpirationDate: customFormat(license.expiryDate, 'yyyy-MM-dd'),
          licenseNumber: license.licenseNumber,
          licenseType: license.licenseType,
          fileObjectContentType: license?.expirationFile?.type,
          fileType: license.expirationFile.name,
          fileObject: fileContents,
        }
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

export const prepareVendorDocumentObject = (vendorProfilePayload, formData) => {
  return {
    documents: vendorProfilePayload,
    agreementSignedDate: convertDateTimeToServer(formData.agreementSignedDate!),
    autoInsuranceExpirationDate: convertDateTimeToServer(formData.autoInsuranceExpDate!),
    coiglExpirationDate: convertDateTimeToServer(formData.coiGlExpDate!),
    coiWcExpirationDate: convertDateTimeToServer(formData.coiWcExpDate!),
  }
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
      const fileContents = await readFileContent(doc.file)
      const document = {
        documentType: doc.type,
        fileObjectContentType: doc.file.type,
        fileType: doc.file.name,
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

export const useVendorNext = ({ control, documents }: { control: any; documents?: any }) => {
  const [ein, ssn, ...detailfields] = useWatch({
    control,
    name: [
      'einNumber',
      'ssnNumber',
      'businessEmailAddress',
      'businessPhoneNumber',
      'capacity',
      'city',
      'companyName',
      'ownerName',
      'paymentTerm',
      'state',
      'streetAddress',
      'zipCode',
    ],
  })
  const documentFields = useWatch({
    control,
    name: ['w9Document'],
  })
  const licenseField = useWatch({
    control,
    name: ['licenses'],
  })
  const licensesArray = licenseField?.length > 0 ? licenseField[0] : []
  return {
    disableDetailsNext: detailfields.some(n => !n) || !(ein || ssn),
    disableDocumentsNext: !(documentFields[0] || documents?.w9DocumentUrl),
    disableLicenseNext: licensesArray?.some(l => l.licenseNumber === '' || l.licenseType === '' || !l.expiryDate),
  }
}
