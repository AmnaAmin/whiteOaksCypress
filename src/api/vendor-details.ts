import { useToast } from '@chakra-ui/toast'
import _ from 'lodash'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import orderBy from 'lodash/orderBy'
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
import {
  datePickerFormat,
  dateISOFormat,
  dateFormat,
  dateISOFormatWithZeroTime,
  dateFormatNew,
} from 'utils/date-time-utils'
import { usePaginationQuery } from 'api'
import { VENDOR_MANAGER } from 'features/vendor-manager/vendor-manager.i18n'
import { t } from 'i18next'
import { getNextMonthFirstDate } from 'components/table/util'

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
      return response?.data;
    },
    { enabled: !!vendorId },
  )
}

export const useFPMProfile = (FpmId: number | undefined) => {
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
        position: 'top-left',
      })
    },
    onError(error: any) {
      toast({
        title: 'Create Vendor',
        description: (error.title as string) ?? 'Unable to create project.',
        status: 'error',
        isClosable: true,
        position: 'top-left',
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

export const PaymentMethods = [
  { key: 107, value: 'check' },
  { key: 106, value: 'ach' },
  { key: 105, value: 'creditCard' },
]

export const AccountingType = [
  { key: 'bankChecking', value: 'Checking' },
  { key: 'bankSaving', value: 'Saving' },
]

export const parseVendorFormDataToAPIData = (
  formValues: VendorProfileDetailsFormData,
  vendorProfileData?: VendorProfile,
  paymentMethods?: any
): VendorProfilePayload => {
  let selectedPaymentMethods = [] as any
  PaymentMethods?.forEach(pm => {
    if (formValues[pm.value]) {
      selectedPaymentMethods.push(pm.key)
    }
  })
  return {
    ...vendorProfileData!,
    ownerName: formValues.ownerName!,
    primaryContact: formValues.primaryContact,
    secondName: formValues.secondName!,
    businessPhoneNumber: formValues.businessPhoneNumber,
    businessPhoneNumberExtension: formValues.businessPhoneNumberExtension!,
    secondPhoneNumber: formValues.secondPhoneNumber!,
    secondPhoneNumberExtension: formValues.secondPhoneNumberExtension!,
    businessEmailAddress: formValues.businessEmailAddress!,
    companyName: formValues.companyName!,
    streetAddress: formValues.streetAddress!,
    city: formValues.city!,
    paymentOptions: paymentMethods.filter(payment => selectedPaymentMethods.includes(payment?.lookupValueId)),
    zipCode: formValues.zipCode!,
    capacity: formValues.capacity!,
    //secondEmailAddress: formValues.secondEmailAddress!,
    score: formValues.score?.value,
    status: formValues.status?.value,
    state: formValues.state?.value,
    //paymentTerm: formValues.paymentTerm?.value,
    documents: [],
    vendorSkills: vendorProfileData?.vendorSkills || [],
    markets: vendorProfileData?.markets || [],
    licenseDocuments: vendorProfileData?.licenseDocuments || [],
    enableVendorPortal: formValues.enableVendorPortal?.value,
  }
}

export const parseAccountsFormDataToAPIData = async (
  formValues,
  paymentsMethods,
  vendorProfileData?: VendorProfile,
): Promise<VendorProfilePayload> => {
  let selectedPaymentMethods = [] as any
  PaymentMethods?.forEach(pm => {
    if (formValues[pm.value]) {
      selectedPaymentMethods.push(pm.key)
    }
  })
  let documents = [] as any[]
  if (formValues?.voidedCheckFile) {
    const voidedCheckFile = await readFileContent(formValues?.voidedCheckFile)
    documents.push({
      documentType: DOCUMENTS_TYPES.VOIDED_CHECK?.id,
      fileObjectContentType: formValues?.voidedCheckFile.type,
      fileType: formValues?.voidedCheckFile.name,
      fileObject: voidedCheckFile,
    })
  }
  if (formValues?.ownersSignature?.fileObject) {
    documents.push(formValues?.ownersSignature)
  }

  return {
    ...vendorProfileData!,
    ownerName: formValues.ownerName!,
    businessPhoneNumber: formValues.businessPhoneNumber,
    businessPhoneNumberExtension: formValues.businessPhoneNumberExtension!,
    businessEmailAddress: formValues.businessEmailAddress!,
    companyName: formValues.companyName!,
    streetAddress: formValues.streetAddress!,
    city: formValues.city!,
    zipCode: formValues.zipCode!,
    state: formValues.state?.value,
    isSsn: false,
    documents,
    paymentOptions: paymentsMethods.filter(payment => selectedPaymentMethods.includes(payment?.lookupValueId)),
    bankAddress: formValues?.bankAddress,
    bankCity: formValues?.bankCity,
    bankEmail: formValues?.bankEmail,
    bankName: formValues?.bankName,
    bankPhoneNumber: formValues?.bankPhoneNumber,
    bankState: formValues?.bankState?.value,
    bankZipCode: formValues?.bankZipCode,
    bankPrimaryContact: formValues?.bankPrimaryContact,
    bankChecking: formValues?.bankChecking,
    bankSaving: formValues?.bankSaving,
    bankVoidedCheckDate: formValues?.bankVoidedCheckDate,
    bankVoidedCheckStatus: formValues?.bankVoidedCheckStatus ? 'VERIFIED' : null,
    bankDateSignature: dateISOFormatWithZeroTime(formValues?.bankDateSignature),
    bankRoutingNo: formValues?.bankRoutingNo,
    bankAccountingNo: formValues?.bankAccountingNo,
    einNumber: formValues?.einNumber,
    ssnNumber: formValues?.ssnNumber,
    monthlySubscriptionFee: formValues?.monthlySubscriptionFee,
    oneTimeSetupFee: formValues?.oneTimeSetupFee,
    billingDate: dateISOFormatWithZeroTime(formValues?.billingDate),
    isSubscriptionOn: formValues?.isSubscriptionOn === "on" ? true : false,
  }
}

export const parseCreateVendorFormToAPIData = async (
  formValues,
  paymentsMethods,
  vendorProfileData?: VendorProfile,
) => {
  const profilePayload = parseVendorFormDataToAPIData(formValues, vendorProfileData, paymentsMethods)
  const documentsPayload = await parseDocumentCardsValues(formValues)
  const updatedObject = await prepareVendorDocumentObject(documentsPayload, formValues)
  const licensePayload = await parseLicenseValues(formValues, vendorProfileData?.licenseDocuments)
  const tradePayload = parseTradeFormValuesToAPIPayload(formValues, vendorProfileData!)
  const marketsPayload = parseMarketFormValuesToAPIPayload(formValues, vendorProfileData!)
  const accountsPayload = await parseAccountsFormDataToAPIData(formValues, paymentsMethods, vendorProfileData!)
  return {
    ...profilePayload,
    ...accountsPayload,
    licenseDocuments: licensePayload,
    ...tradePayload,
    ...marketsPayload,
    ...updatedObject,
  }
}

export const parseVendorAPIDataToFormData = (vendorProfileData): VendorProfileDetailsFormData => {
  return {
    ...vendorProfileData,
    ...documentCardsDefaultValues(vendorProfileData),
    licenses: licenseDefaultFormValues(vendorProfileData),
    billingDate: getNextMonthFirstDate(),
    trades: [],
    markets: [],
  }
}

export const useTrades = () => {
  const client = useClient()

  return useQuery<Array<Trade>>('trades', async () => {
    const response = await client('vendor-skills?isActive.in=true', {})
    return orderBy(response?.data || [], ['skill'], ['asc'])
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
          position: 'top-left',
        })
      },
    },
  )
}

export const useVendorSkillDelete = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation(
    (vendorSkill: any) => {
      return client(`vendor-skills/${vendorSkill?.id}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess() {
        toast({
          title: t(`${VENDOR_MANAGER}.deleteToastTitle`),
          description: t(`${VENDOR_MANAGER}.deleteSuccessMessage`),
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('projectType')
      },

      onError(error: any) {
        toast({
          title: t(`${VENDOR_MANAGER}.deleteToastTitle`),
          description: (error.title as string) ?? t(`${VENDOR_MANAGER}.deleteFailureMessage`),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
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
          position: 'top-left',
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
  VOIDED_CHECK: { value: 'Voided Check', id: 1025 },
  OWNERS_SIGNATURE: { value: 'Owner Signature', id: 1026 },
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
          position: 'top-left',
        })
      },
      onError(error: any) {
        if (error?.violations) {
          const violations = error?.violations[0];
          const errorMessage = violations?.field + " " + violations?.message;
          toast({
            title: t(`update${name}`),
            description: (errorMessage as string) ?? 'Unable to update vendor.',
            status: 'error',
            isClosable: true,
            position: 'top-left',
          })
        } else {
          toast({
            title: t(`update${name}`),
            description: (error.title as string) ?? 'Unable to update vendor.',
            status: 'error',
            isClosable: true,
            position: 'top-left',
          })
        }
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
        expiryDate: datePickerFormat(license.licenseExpirationDate),
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
          // licenseExpirationDate: customFormat(license.expiryDate, 'yyyy-MM-dd'),
          licenseExpirationDate: dateISOFormat(license.expiryDate),
          status: values[`licenseCheckbox${index}`] ? 'VERIFIED' : existingLicense.status,
        }
      } else {
        fileContents = await readFileContent(license.expirationFile)
        doc = {
          // licenseExpirationDate: customFormat(license.expiryDate, 'yyyy-MM-dd'),
          licenseExpirationDate: dateISOFormat(license.expiryDate),
          licenseNumber: license.licenseNumber,
          licenseType: license.licenseType,
          fileObjectContentType: license?.expirationFile?.type,
          fileType: license.expirationFile.name,
          fileObject: fileContents,
          status: values[`licenseCheckbox${index}`] ? 'VERIFIED' : 'UNVERIFIED',
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
    agreementSignedDate: datePickerFormat(vendor.agreementSignedDate),
    agreementUrl: vendor?.documents?.find(
      (d: any) => d.documentTypelabel === DOCUMENTS_TYPES.AGREEMENT_SIGNED_DOCUMENT.value,
    )?.s3Url,
    agreement: null,
    w9DocumentDate: datePickerFormat(vendor.w9DocumentDate),
    w9Document: null,
    w9DocumentUrl: vendor?.documents?.find((d: any) => d.documentTypelabel === DOCUMENTS_TYPES.W9_DOCUMENT.value)
      ?.s3Url,
    autoInsuranceExpDate: datePickerFormat(vendor.autoInsuranceExpirationDate),
    insuranceUrl: vendor?.documents?.find(
      (d: any) => d.documentTypelabel === DOCUMENTS_TYPES.AUTH_INSURANCE_EXPIRATION.value,
    )?.s3Url,
    insurance: null,
    coiGlExpDate: datePickerFormat(vendor.coiglExpirationDate),
    coiGlExpFile: null,
    coiGLExpUrl: vendor?.documents?.find((d: any) => d.documentTypelabel === DOCUMENTS_TYPES.COI_GL.value)?.s3Url,
    coiWcExpDate: datePickerFormat(vendor.coiWcExpirationDate),
    coiWcExpFile: null,
    coiWcExpUrl: vendor?.documents?.find((d: any) => d.documentTypelabel === DOCUMENTS_TYPES.COI_WC.value)?.s3Url,
    bankVoidedCheckDate: datePickerFormat(vendor.bankVoidedCheckDate),
    voidedCheckFile: null,
    voidedCheckUrl: vendor?.documents?.find((d: any) => d.documentTypelabel === DOCUMENTS_TYPES.VOIDED_CHECK.value)
      ?.s3Url,
    bankDateSignature: dateFormat(vendor?.bankDateSignature),
    ownersSignature: vendor?.documents?.find((d: any) => d.documentTypelabel === DOCUMENTS_TYPES.OWNERS_SIGNATURE.value)
      ?.s3Url,
  }
  return documentCards
}
export const accountsDefaultValues = (vendor: any) => {
  const accounts = {}
  return accounts
}

export const prepareVendorDocumentObject = async (vendorProfilePayload, formData) => {
  /* console.log( formData.coiGLExpCheckBox  ? "VERIFIED" : ( formData as any ).coiGLStatus );
  console.log( formData.CoiWcExpCheckbox  ? "VERIFIED" : ( formData as any ).coiWCStatus );
  console.log( formData.agreementSignCheckBox  ? "VERIFIED" : ( formData as any ).agreementSignedStatus );
  console.log( formData.autoInsuranceCheckBox  ?   "VERIFIED" : ( formData as any ).autoInsuranceStatus );
  console.log( formData.W9DocumentCheckBox ? "VERIFIED" : ( formData as any ).w9Status );*/
  return {
    documents: vendorProfilePayload,
    agreementSignedDate: formData.agreementSignedDate!,
    autoInsuranceExpirationDate: dateISOFormat(formData.autoInsuranceExpDate!),
    coiglExpirationDate: dateISOFormat(formData.coiGlExpDate!),
    coiWcExpirationDate: dateISOFormat(formData.coiWcExpDate!),
    coiGLStatus: formData.coiGLExpCheckBox ? 'VERIFIED' : (formData as any).coiGLStatus,
    coiWCStatus: formData.CoiWcExpCheckbox ? 'VERIFIED' : (formData as any).coiWCStatus,
    agreementSignedStatus: formData.agreementSignCheckBox ? 'VERIFIED' : (formData as any).agreementSignedStatus,
    autoInsuranceStatus: formData.autoInsuranceCheckBox ? 'VERIFIED' : (formData as any).autoInsuranceStatus,
    w9Status: formData.W9DocumentCheckBox ? 'VERIFIED' : (formData as any).w9Status,
    w9DocumentDate: dateISOFormat(formData.w9DocumentDate),
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
  values.voidedCheckFile &&
    documentsList.push({
      file: values.voidedCheckFile,
      type: DOCUMENTS_TYPES.VOIDED_CHECK?.id,
    })

  let results = await Promise.all(
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
  if (values?.ownersSignature?.fileObject) {
    results.push(values?.ownersSignature)
  }
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
          position: 'top-left',
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
  const [...detailfields] = useWatch({
    control,
    name: ['city', 'companyName', 'state', 'streetAddress', 'zipCode', 'businessEmailAddress', 'ownerName', 'capacity', 'einNumber', 'ssnNumber', 'ach', 'creditCard', 'check'],
  })

  // Check if any field in detailfields array has only whitespace
  const hasWhitespaceOnly = detailfields.some(n => typeof n === 'string' && n.trim() === '')

  const businessPhoneNumber = useWatch({ name: 'businessPhoneNumber', control })
  const capacity = useWatch({ name: 'capacity', control })
  const documentFields = useWatch({
    control,
    name: ['w9Document'],
  })
  const licenseField = useWatch({
    control,
    name: ['licenses'],
  })
  const licensesArray = licenseField?.length > 0 ? licenseField[0] : []
  const isBusinessPhNo = businessPhoneNumber?.replace(/\D+/g, '').length! === 10

  const ein = useWatch({ name: 'einNumber', control });
  const ssn = useWatch({ name: 'ssnNumber', control });

  const ach = useWatch({ name: 'ach', control })
  const creditCard = useWatch({ name: 'creditCard', control })
  const check = useWatch({ name: 'check', control })

  const isCapacity = capacity <= 500

  const isEinOrSSN = ein || ssn;
  const isAchOrCheckOrCC = ach || check || creditCard;

  return {
    disableDetailsNext: hasWhitespaceOnly || !isBusinessPhNo || !isCapacity || !isEinOrSSN || !isAchOrCheckOrCC,

    disableDocumentsNext: !(documentFields[0] || documents?.w9DocumentUrl),

    disableLicenseNext: licensesArray?.some(
      l =>
        l.licenseNumber === '' ||
        l.licenseType === '' ||
        !l.expiryDate ||
        l.expiryDate.trim() === '' ||
        l.licenseNumber.trim() === '',
    ),
  }
}

//vendor projects

export const useVendorWorkOrders = (queryString: string, pageSize: number) => {
  const { data, ...rest } = usePaginationQuery(
    ['VendorProjects', queryString],
    `vendor/workorders/v1?${queryString}`,
    pageSize,
  )

  return {
    vendorProjects: data?.data,
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
    ...rest,
  }
}

export const useFetchAllVendorWorkOrders = queryString => {
  const client = useClient()

  const { data: vendorProjects, ...rest } = useQuery(
    ['AllVendorProjects'],
    async () => {
      const response = await client(`vendor/workorders/v1?${queryString}`, {})

      return response?.data
    },
    {
      enabled: false,
    },
  )

  return {
    vendorProjects,
    ...rest,
  }
}

//vendor projects

export const useFetchVendorWorkOrders = (vendorId: string | number | undefined) => {
  const client = useClient()

  const { data: vendorProjects, ...rest } = useQuery(
    ['VendorProjects'],
    async () => {
      const response = await client(`vendor/${vendorId}/workorders`, {})

      return response?.data
    },
    {
      enabled: !!vendorId,
    },
  )

  return {
    vendorProjects,
    ...rest,
  }
}

export const createACHForm = (form, values, signatureDimention, signature) => {
  const basicFont = undefined
  const heading = 'Vendor ACH Form'
  const vendorDetailsHeading = 'Vendor Automated Request Form'
  const bankInformationHeading = 'Bank Information'
  const disclaimer = 'Please attach copy of VOIDED CHECK with company information.'
  const note1 = 'Signature above authorizes White Oaks Aligned, LLC to make direct deposit payments'
  const note2 = 'into the account listed above.'
  const footer = '4 14th Street * Suite 601 * Hoboken, NJ 07030 *** 128 E. Hargett St * Suite 204 * Raleigh, NC 27601'
  const startx = 15
  const centerX1 = (form.internal.pageSize.getWidth() - form.getTextWidth(vendorDetailsHeading)) / 2
  const centerX2 = (form.internal.pageSize.getWidth() - form.getTextWidth(bankInformationHeading)) / 2

  const wrapText = (text: string, maxWidth: number): string[] => {
    const words: string[] = text.split(' ')
    const lines: string[] = []
    let currentLine: string = words[0]

    for (let i = 1; i < words.length; i++) {
      const testLine: string = currentLine + ' ' + words[i]
      const width: number = form.getTextWidth(testLine)
      if (width <= maxWidth) {
        currentLine = testLine
      } else {
        lines.push(currentLine)
        currentLine = words[i]
      }
    }
    lines.push(currentLine)
    return lines
  }

  var img = new Image()
  img.src = 'wo-logo-tree.png'
  img.onload = function () {
    form.addImage(img, 'png', 160, 5, 35, 35)
    form.setFontSize(16)
    form.setFont(basicFont, 'bold')
    form.text(heading, startx, 40)
    form.setDrawColor(128, 0, 0)
    form.setLineWidth(1)
    form.line(10, 45, 200, 45)
    form.text(vendorDetailsHeading, centerX1, 55)
    form.setFontSize(12)
    form.setFont(basicFont, 'normal')
    var vendorInfoYStart = 65
    const lineHeight = 8

    const VendorInfo = [
      { label: 'Company Name:', value: values?.companyName ?? '' },
      { label: 'Primary Contact:', value: values?.primaryContact ?? '' },
      { label: `Owner's Name:`, value: values?.ownerName ?? '' },
      {
        label: 'Address:',
        value:
          (values?.streetAddress ?? '') +
          ' ' +
          (values?.city ?? '') +
          ' ' +
          (values?.state ?? '') +
          ' , ' +
          (values?.zipCode ?? ''),
      },
      { label: 'Telephone:', value: values?.businessPhoneNumber ?? '' },
      { label: 'Email Address:', value: values?.businessEmailAddress ?? '' },
    ]

    VendorInfo.forEach(info => {
      const labelLines = wrapText(info.label, 40)
      const valueLines = wrapText(info.value, 100)

      for (let i = 0; i < Math.max(labelLines.length, valueLines.length); i++) {
        if (i < labelLines.length) {
          form.text(labelLines[i], startx, vendorInfoYStart + i * lineHeight)
        }
        if (i < valueLines.length) {
          form.text(valueLines[i], startx + 45, vendorInfoYStart + i * lineHeight)
        }
      }

      vendorInfoYStart += Math.max(labelLines.length, valueLines.length) * lineHeight
    })
    form.setFont(basicFont, 'bold')
    form.setFontSize(16)
    form.text(bankInformationHeading, centerX2, vendorInfoYStart + 10)
    form.setFontSize(12)
    form.setFont(basicFont, 'normal')
    var bankInfoYStart = vendorInfoYStart + 20

    const BankInfo = [
      { label: 'Bank Name:', value: values?.bankName ?? '' },
      { label: 'Bank Primary Contact:', value: values?.bankPrimaryContact ?? '' },
      {
        label: `Address:`,
        value: values?.bankAddress + ' ' + values?.bankCity + ' ' + values?.bankState + ' , ' + values?.bankZipCode,
      },
      { label: 'Telephone:', value: values?.bankPhoneNumber ?? '' },
      { label: 'Email Address:', value: values?.bankEmail ?? '' },
      { label: 'Routing Number:', value: values?.bankRoutingNo ?? '' },
      { label: 'Account Number:', value: values?.bankAccountingNo ?? '' },
      {
        label: 'Account Type:',
        value:
          (values?.bankChecking ? 'Checking' : '') +
          (values?.bankChecking && values?.bankSaving ? ',' : '') +
          (values?.bankSaving ? 'Saving' : ''),
      },
    ]

    BankInfo.forEach(info => {
      if (info.label === 'Account Number:') {
        vendorInfoYStart = vendorInfoYStart + 8
        return
      }

      form.text(info.label, startx, bankInfoYStart + 5)

      if (info.label === 'Bank Primary Contact:' || info.label === 'Address:') {
        const textLines = wrapText(info.value, 100)
        for (let i = 0; i < textLines.length; i++) {
          form.text(textLines[i], startx + 45, bankInfoYStart + 5 + i * lineHeight)
        }
      } else {
        form.text(info.value, startx + 45, bankInfoYStart + 5)
      }

      if (info.label === 'Routing Number:') {
        form.text('Account Number:', startx + 100, bankInfoYStart + 5)
        form.text(values?.bankAccountingNo ?? '', startx + 135, bankInfoYStart + 5)
      }

      bankInfoYStart =
        bankInfoYStart +
        (info.label === 'Bank Primary Contact:' || info.label === 'Address:'
          ? lineHeight * Math.max(1, wrapText(info.value, 100).length)
          : 8)
    })

    var signatureYStart = bankInfoYStart + 15
    form.setFillColor(253, 255, 50)
    form.rect(startx + 14, signatureYStart - 5, 125, 8, 'F')
    form.text(disclaimer, startx + 15, signatureYStart)
    form.setFont(basicFont, 'bold')
    form.text(`Owner's Signature`, startx, signatureYStart + 15)
    form.setFont(basicFont, 'normal')
    form.addImage(
      signature,
      'png',
      startx + 45,
      signatureYStart + 12,
      signatureDimention.width / 4,
      signatureDimention.height / 4,
    )
    form.setFont(basicFont, 'bold')
    form.text(`Date`, startx + 100, signatureYStart + 15)
    form.setFont(basicFont, 'normal')
    form.text(
      values?.bankDateSignature ? dateFormatNew(values?.bankDateSignature) : '',
      startx + 120,
      signatureYStart + 15,
    )

    form.text(note1, startx, signatureYStart + 30)
    form.text(note2, startx, signatureYStart + 35)
    form.setTextColor(211, 211, 211)
    form.setFontSize(10)
    form.text(footer, startx + 15, signatureYStart + 75)

    form.save('Vendor ACH Form')
  }
}
