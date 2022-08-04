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
  state?: number
  zipCode?: string
  invoiceEmailAddress?: string
  contacts?: Contact[]
  accountPayableContactInfos?: Contact[]
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
  markets?: Market[]
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
}
