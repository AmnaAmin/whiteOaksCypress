import { useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'

export const useClients = () => {
  const client = useClient()

  return useQuery('client', async () => {
    const response = await client(`clients?page=0&size=10000000&sort=id,asc`, {})

    return response?.data
  })
}

export const useNotes = ({ clientId }: { clientId: number | undefined }) => {
  const client = useClient()

  const { data: notes, ...rest } = useQuery<Array<Document>>(['notes', clientId], async () => {
    const response = await client(`notes?clientId.equals=${clientId}&sort=modifiedDate,asc`, {})
    return response?.data
  })

  return {
    notes,
    ...rest,
  }
}
