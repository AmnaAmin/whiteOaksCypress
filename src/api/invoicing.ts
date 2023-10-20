import { useQuery } from 'react-query'
import { InvoicingType } from 'types/invoice.types'
import { useClient } from 'utils/auth-context'

export const useFetchInvoices = ({ projectId }: { projectId: string | number | undefined }) => {
  const client = useClient()

  const { data: invoices, ...rest } = useQuery<Array<InvoicingType>>(
    ['invoices', projectId],
    async () => {
      const response = await client(`project-invoices?projectId.equals=${projectId}&sort=modifiedDate,asc`, {})

      return response?.data ? response?.data : []
    },
    { enabled: !!projectId },
  )

  return {
    invoices: invoices?.length ? invoices : [],
    ...rest,
  }
}
