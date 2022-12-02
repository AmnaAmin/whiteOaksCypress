import { useClient } from 'utils/auth-context'
import { useMutation, useQuery } from 'react-query'
import { FileAttachment, SupportFormValues, SupportsPayload } from 'types/support.types'
import { dateISOFormat, getFormattedDate } from 'utils/date-time-utils'
import { useToast } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const ISSUE_TYPE_OPTIONS = [
  {
    value: 4,
    label: 'Bug',
  },
  {
    value: 5,
    label: 'Feature Request',
  },
]
export const SEVERITY_OPTIONS = [
  {
    value: 1,
    label: 'Major',
  },
  {
    value: 2,
    label: 'Low',
  },
  {
    value: 3,
    label: 'Medium',
  },
]
export const STATUS_OPTIONS = [
  {
    value: 66,
    label: 'New',
  },
  {
    value: 67,
    label: 'Work In Progress',
  },
  {
    value: 69,
    label: 'Resolved',
  },
  {
    value: 70,
    label: 'Rejected',
  },
]
export const SUPPORT_LIST = 'SUPPORT_LIST'
export const useSupport = () => {
  const client = useClient()
  return useQuery(SUPPORT_LIST, async () => {
    const response = await client(`project_type`, {})
    return response?.data
  })
}

export const getSupportFormDefaultValues = (email: string): SupportFormValues => {
  return {
    createdBy: email,
    createdDate: getFormattedDate(new Date()),
    severity: null,
    issueType: null,
    title: '',
    status: STATUS_OPTIONS[0],
    description: '',
    resolution: '',
    attachment: null,
  }
}

export const parseSupportFormValuesToAPIPayload = (
  formValues: SupportFormValues,
  attachment: FileAttachment,
): SupportsPayload => {
  return {
    ...attachment,
    lkpStatusId: formValues.status?.value,
    lkpSeverityId: formValues.severity?.value,
    createdBy: formValues.createdBy,
    createdDate: dateISOFormat(formValues.createdDate) as string,
    lkpSupportTypeId: formValues.issueType?.value,
    title: formValues.title,
    description: formValues.description,
    resolution: formValues.resolution,
  }
}

export const useCreateTicketMutation = () => {
  const client = useClient()
  const toast = useToast()
  const { t } = useTranslation()

  return useMutation(
    (payload: SupportsPayload) => {
      return client('supports', { data: payload })
    },
    {
      onSuccess: () => {
        toast({
          title: t('createTicketTitle'),
          description: t('createTicketSuccessMessage'),
          status: 'success',
          isClosable: true,
        })
      },
      onError: (error: Error) => {
        toast({
          title: t('createTicketTitle'),
          description: error.message,
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}
