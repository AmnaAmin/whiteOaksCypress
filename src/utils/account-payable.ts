import { useQuery } from 'react-query'
import { PayableTypes } from 'types/payable.types'
import { useClient } from './auth-context'

export const useAccountPayable = () => {
  const client = useClient()

  return useQuery<PayableTypes[]>('GetAccountPayable', async () => {
    const response = await client(`all_workorders`, {})
    console.log('Payable data', response?.data)

    return response?.data
  })
}
