export type Clients = {
  id?: number
  companyName?: string
  contact?: string
  phoneNumber?: string
  emailAddress?: string
  accountPayableContact?: string
  accountPayablePhoneNumber?: string
  accountPayableEmailAddress?: string
  dateCreated?: string
  dateUpdated?: string
  streetAddress?: string
  city?: string
  state?: any
  zipCode?: string
  invoiceEmailAddress?: string
  contacts?: Contact[]
  accountPayableContactInfos?: Contact[]
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
  markets?: Market[]
  paymentAch?: boolean
  paymentCheck?: boolean
  paymentCreditCard?: boolean
  paymentWired?: boolean
}

export type Market = {
  createdBy: string
  createdDate: string | null
  id: number
  metropolitanServiceArea: string
  modifiedBy: string
  modifiedDate: string | null
  stateId: number
  stateName: string
  checked?: boolean
  lienDueIn?: number
}

export type Contact = {
  id: number
  contact: string
  emailAddress: string
  phoneNumber: string
  phoneNumberExtension: string
  market: string
  createdBy: string
  createdDate: string | null
  modifiedBy: string | null
  modifiedDate: string | null
  comments?: string
  city?: string
}

export type Carrier = {
  id: number
  name: string
  emailAddress: string
  phoneNumber: string
}

export type ClientFormValues = {
  id?: number
  companyName?: string
  contact?: string
  phoneNumber?: string
  emailAddress?: string
  accountPayableContact?: string
  accountPayablePhoneNumber?: string
  accountPayableEmailAddress?: string
  dateCreated?: string
  dateUpdated?: string
  streetAddress?: string
  city?: string
  state?: any
  zipCode?: string
  invoiceEmailAddress?: string
  contacts?: Contact[]
  accountPayableContactInfos?: Contact[]
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
  paymentTerm?: any
  markets?: Market[]
  comments?: string
  paymentMethod?: string
  paymentAch?: boolean
  paymentCheck?: boolean
  paymentCreditCard?: boolean
  paymentWired?: boolean
  carrier?: Carrier[]
}
