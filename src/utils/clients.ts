import { useQuery } from 'react-query'
import { useClient } from './auth-context'
// import { Clients } from 'types/client.type'

export const useClients = () => {
  const client = useClient()

  return useQuery('client', async () => {
    const response = await client(`clients?page=0&size=10000000&sort=id,asc`, {})

    return response?.data
  })
}

// export const useClients = (projectId?: string) => {
//   const client = useClient()

//   const { data: clientsData, ...rest } = useQuery<Clients>(['clients', projectId], async () => {
//     const response = await client(`clients/${projectId}/client`, {})

//     return response?.data
//   })

//   return {
//     clientsData,
//     ...rest,
//   }
// }


// export const useClients = (clientId?: string) => {
//   const client = useClient()

//   const { data: clientData, ...rest } = useQuery<Clients>(['client', clientId], async () => {
//     const response = await client(`clients/${clientId}/client`, {})

//     return response?.data
//   })
// }

// export const useClients = () => {
//   const client = useClient()

//   return useQuery('client', async () => {
//     const response = await client(`clients`, {})

//     return response?.data
//   })
// }