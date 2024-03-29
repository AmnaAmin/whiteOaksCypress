export type VendorSkill = {
  id: number
  skill: string
  createdBy: string
  createdDate: string
  modifiedBy: string
  modifiedDate: string
  workOrders: null
  services?: string
}

export type VendorMarket = {
  id: number
  code: string
  metropolitanServiceArea: string
  createdBy: string
  createdDate: string
  modifiedBy: string
  modifiedDate: string
  properties: string | null
  state: {
    id: number
    name: string
    region: string
    code: string
    createdBy: string
    createdDate: string
    modifiedBy: string
    modifiedDate: string
  }
}

export type Vendor = {
  id: number
  companyName: string
  capacity: number
  score: number
  statusLabel: string
  status: number
  ownerName: string
  einNumber: string
  secondName: string
  secondEmailAddress: string
  secondPhoneNumber: string
  secondPhoneNumberExtension: string
  businessEmailAddress: string
  businessPhoneNumber: string
  businessPhoneNumberExtension: string
  coiglExpirationDate: string | string | null
  coiWcExpirationDate: string | null
  autoInsuranceExpirationDate: string | null
  agreementSignedDate: string | null
  vendorAgreementSigned: boolean
  bankVoidedCheckStatus: string | boolean | undefined
  bankVoidedCheckDate: string | null | undefined
  voidedCheckUrl: string | null
  isSsn: false
  ssnNumber: string | null
  otherInsuranceExpirationDate: string | null
  streetAddress: string
  city: string
  state: string
  zipCode: string
  createdBy: string
  createdDate: string
  w9DocumentDate: string
  modifiedBy: string
  modifiedDate: string
  vendorMetrics: string | null
  changeOrders: string | null
  workOrders: string | null
  users: string | null
  documents: any[] | null
  vendorSkills: VendorSkill[]
  paymentOptions: any[]
  markets: VendorMarket[]
  projects: any[]
  paymentTerm: number
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type VendorProfile = Override<
  Vendor,
  {
    licenseDocuments: LicenseDocument[]
    markets: Market[]
    vendorSkills: Trade[]
  }
>

export type VendorProjectType = {
  projectId: string | number
  projectType: string | null | undefined
  status: string | null | undefined
  streetAddress: string | null | undefined
  workOrderExpectedCompletionDate: string | null | undefined
  childChangeOrders: [any]
}

export type VendorProfilePayload = {
  id: number
  companyName: string
  status: number
  einNumber: string
  secondEmailAddress: string
  secondPhoneNumber: string
  secondName: string | null
  statusLabel: string
  ownerName: string
  primaryContact?: string | null
  businessEmailAddress: string
  businessPhoneNumber: string
  coiglExpirationDate: string | null
  coiWcExpirationDate: string | null
  autoInsuranceExpirationDate: string | null
  vendorAgreementSigned: boolean
  otherInsuranceExpirationDate: string | null
  agreementSignedDate: string | null
  capacity: number
  score: number
  streetAddress: string
  city: string
  state: string
  paymentTerm?: number
  zipCode: string
  createdBy: string
  createdDate: string | null
  modifiedBy: string
  modifiedDate: string | null
  ssnNumber: string | null
  w9DocumentDate: string | null
  isSsn: boolean
  businessPhoneNumberExtension: string
  secondPhoneNumberExtension: string
  licenseDocuments: LicenseDocument[]
  vendorSkills: Trade[]
  markets: Array<Market>
  projects: any[]
  paymentOptions: any[]
  documents: {
    id?: number
    fileType: string
    fileObjectContentType: string
    documentType: number
    fileObject: string
  }[]
  coiGLStatus?: string | boolean
  coiWCStatus?: string | boolean
  agreementSignedStatus?: string | boolean
  autoInsuranceStatus?: string | boolean
  w9Status?: string | boolean
  enableVendorPortal?: boolean
  bankAddress?: string
  bankCity?: string
  bankEmail?: string
  bankName?: string
  bankPhoneNumber?: string
  bankState?: string
  bankZipCode?: string
  bankPrimaryContact?: string
  bankChecking?: boolean
  bankSaving?: boolean
  bankVoidedCheckDate?: string | null
  bankVoidedCheckStatus?: string | null | boolean
  bankDateSignature?: string | null | Date
  bankRoutingNo?: number | string | null
  bankAccountingNo?: number | string | null
}

export type LicenseDocument = {
  id: number
  licenseType: number
  licenseNumber: string
  licenseExpirationDate: string
  fileObject: string
  createdDate: string
  s3Url: string
  vendor: Vendor[]
  fileType: string
}

export type License = {
  licenseType?: any
  licenseNumber?: string
  expiryDate?: null | string
  expirationFile?: File | null
  downloadableFile?: any
}
export type LicenseFormValues = {
  licenses?: License[]
}

export type VendorEntity = Vendor & {
  licenseDocuments: LicenseDocument[]
}

export type Document = {
  id?: number
  deleted?: boolean
  documentType: number
  fileObject: string
  fileObjectContentType: string
  fileType: string
  path?: string
  projectId?: number
  vendorId?: number
  s3Url?: string
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
  vendorName?: string
  workOrderName?: string
  workOrderId?: number
  projectInvoiceId?: number
  invoiceName?: string | null
}

type Select = {
  label: string
  value: any
}

export type VendorProfileDetailsFormData = {
  primaryContact: string
  secondaryContact: string
  businessPhoneNumber: string
  businessNumberExtention: string
  secondaryNumber: string
  secondaryNumberExtenstion: string
  businessPhoneNumberExtension?: string
  secondPhoneNumber?: string
  secondPhoneNumberExtension?: string
  primaryEmail: string
  businessEmailAddress?: string
  secondaryEmail: string
  secondEmailAddress?: string
  ownerName?: string
  secondName?: string
  companyName?: string
  score?: Select
  status?: Select
  streetAddress?: string
  state?: Select
  city?: string
  zipCode?: string
  capacity?: null | number
  paymentTerm?: Select
  agreementSignedDate?: Date
  autoInsuranceExpDate?: Date
  coiGlExpDate?: Date
  coiWcExpDate?: Date
  trades?: any[]
  markets?: any[]
  coiGLExpCheckBox?: boolean
  CoiWcExpCheckbox?: boolean
  agreementSignCheckBox?: boolean
  autoInsuranceCheckBox?: boolean
  W9DocumentCheckBox?: boolean
  enableVendorPortal?: Select
  readOnly?: boolean
}

export type VendorTrade = {
  id: number
  metropolitanServiceArea: string
  createdBy: string
  createdDate: string | null
  modifiedBy: string
  modifiedDate: string | null
  stateId: number
  stateName: string
}

export type Trade = {
  createdBy: string
  createdDate: string | null
  id: number
  modifiedBy: string
  modifiedDate: string | null
  skill: string
  active: boolean
}
export type VendorAccountsFormValues = {
  einNumber?: string
  ssnNumber?: string
  creditCard?: boolean
  ach?: boolean
  check?: boolean
  businessPhoneNumber: string
  businessNumberExtention: string
  businessPhoneNumberExtension?: string
  businessEmailAddress: string
  ownerName?: string
  companyName?: string
  streetAddress?: string
  state?: Select
  city?: string
  zipCode?: string
  bankName?: string
  bankPrimaryContact?: string
  bankEmail?: string
  bankPhoneNumber: string
  bankAddress?: string
  bankCity?: string
  bankState?: string
  bankZipCode?: string
  bankRoutingNo?: string
  bankAccountingNo?: string
  bankChecking?: boolean
  bankSaving?: boolean
  voidedCheckFile?: File
  bankVoidedCheckDate?: string | null
  bankVoidedCheckStatus?: boolean | string | null
  ownersSignature: any
  bankDateSignature: string | Date | null
}
type TradeFormValues = {
  trade: Trade
  checked: boolean
  id?: string
}

export type VendorTradeFormValues = {
  trades: TradeFormValues[]
}

export type Market = {
  active: boolean
  services?: string
  abbreviation?: string
  createdBy: string
  createdDate: string | null
  id: number
  metropolitanServiceArea: string
  modifiedBy: string
  modifiedDate: string
  stateId: number
  stateName: string
  skill: string
  lienDueIn: number
}

type MarketFormValues = {
  market: Market
  checked: boolean
  id?: string
}

export type VendorMarketFormValues = {
  markets: MarketFormValues[]
}

export type DocumentsCardFormValues = {
  agreementSignedDate?: string | Date | null
  agreementUrl?: string
  agreement?: File | null
  w9DocumentDate?: string | Date | null
  w9Document?: File | null
  autoInsuranceExpDate?: string | Date | null
  insuranceUrl?: string
  insurance?: File | null
  coiGlExpDate?: string | Date | null
  coiGlExpFile?: File | null
  coiGLExpUrl?: string
  coiWcExpDate?: string | Date | null
  coiWcExpFile?: File | null
  coiWcExpUrl?: string
  w9DocumentUrl?: string
}

export type settings = {
  firstName: string
  lastName: string
  fileObject: string
  fileObjectContentType: string
  fileType: string
  path?: string
  vendorId?: number
  s3Url?: string
  email: string
  language?: any
}

export type SettingsValues = {
  firstName?: string
  lastName?: string
  email?: string
  language?: any
  profilePicture?: any
  address?: string
  city?: string
  state?: any
  zipCode?: string
  phoneNo?: string
  stateId?: number
}

export type Vendors = {
  id: number
  statusLabel: string
  companyName: string
  region: string
  state: string
  createdDate: string
  coiglExpirationDate: string
  coiWcExpirationDate: string
  einNumber: string
  capacity: number
  availableCapacity: number
  skills: string
  market: string
  businessEmailAddress: string
  businessPhoneNumber: string
}

export const preventNumber = e => {
  let keyCode = e.keyCode ? e.keyCode : e.which
  //  to prevent the special characters and Numbers
  if (
    (keyCode > 47 && keyCode < 58) ||
    keyCode === 36 ||
    keyCode === 34 ||
    keyCode === 35 ||
    keyCode === 37 ||
    keyCode === 38 ||
    keyCode === 39 ||
    keyCode === 40 ||
    keyCode === 41 ||
    keyCode === 42 ||
    keyCode === 43 ||
    keyCode === 44 ||
    keyCode === 45 ||
    keyCode === 46 ||
    keyCode === 47 ||
    keyCode === 64 ||
    keyCode === 94 ||
    keyCode === 63
  ) {
    e.preventDefault()
  }
}
