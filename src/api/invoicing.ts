import { useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { InvoicingType } from 'types/invoice.types'
import { useClient } from 'utils/auth-context'
import { dateISOFormatWithZeroTime } from 'utils/date-time-utils'

export const useFetchInvoices = ({ projectId }: { projectId: string | number | undefined }) => {
  const client = useClient()
  const { data: invoices, ...rest } = useQuery<Array<InvoicingType>>(
    ['invoices', projectId],
    async () => {
      const response = await client(`project-invoices?projectId.equals=${projectId}&sort=modifiedDate,asc`, {})

      return response?.data ? response?.data : []
    },
    { enabled: !!projectId && projectId !== 'undefined' },
  )

  return {
    invoices: invoices?.length ? invoices : [],
    ...rest,
  }
}

export const useCreateInvoiceMutation = ({ projId }) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { projectId } = useParams<'projectId'>() || projId

  return useMutation(
    (payload: any) => {
      return client('project-invoices', {
        data: payload,
        method: 'POST',
      })
    },
    {
      onSuccess(res) {
        queryClient.invalidateQueries(['invoices', projectId])
        queryClient.invalidateQueries(['transactions', projectId])
      },
      onError(error: any) {
        let description = error.title ?? 'Unable to save Invoice.'

        toast({
          title: 'Invoice',
          description,
          position: 'top-left',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useUpdateInvoiceMutation = ({ projId }) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { projectId } = useParams<'projectId'>() || projId

  return useMutation(
    (payload: any) => {
      return client('project-invoices', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess(res) {
        queryClient.invalidateQueries(['invoices', projectId])
        queryClient.invalidateQueries(['transactions', projectId])
      },
      onError(error: any) {
        let description = error.title ?? 'Unable to save Invoice.'

        toast({
          title: 'Invoice',
          description,
          position: 'top-left',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const mapFormValuesToPayload = ({ projectData, invoice, values, account, invoiceAmount }) => {
  const payload = {
    id: invoice ? invoice?.id : null,
    paymentTerm: values.paymentTerm?.value,
    projectId: projectData?.id,
    status: invoice ? values.status?.value : null,
    createdBy: invoice ? invoice.createdBy : account?.email,
    createdDate: invoice ? invoice?.createdDate : dateISOFormatWithZeroTime(new Date()),
    modifiedDate: dateISOFormatWithZeroTime(new Date()),
    modifiedBy: account?.email,
    invoiceAmount: invoiceAmount,
    invoiceLineItems: [...values.finalSowLineItems, ...values.receivedLineItems]?.map(item => {
      return {
        id: item.id,
        transactionId: item.transactionId,
        name: item.name,
        type: item.type,
        description: item.description,
        amount: item.amount,
      }
    }),
    woaExpectedPayDate: values.woaExpectedPayDate,
    invoiceNumber: values.invoiceNumber,
    invoiceDate: values.invoiceDate,
    paymentReceivedDate: values.paymentReceivedDate,
    changeOrderId: invoice ? invoice?.changeOrderId : null,
  }

  return payload
}
