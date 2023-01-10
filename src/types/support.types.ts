import { SelectOption } from './transaction.type'

export type SupportFormValues = {
  createdBy: string
  createdDate: string
  issueType: SelectOption | null
  severity: SelectOption | null
  title: string
  status: SelectOption
  description: string
  resolution: string
  attachment: File | null
}

export type FileAttachment = {
  newFileName: string
  newFileObject: Blob | null
}

export type SupportsPayload = {
  id?: number
  lkpStatusId: number
  createdBy: string
  createdDate: string
  lkpSupportTypeId: number
  lkpSeverityId: number
  title: string
  description: string
  resolution: string
  s3Url?: string | null
} & FileAttachment
