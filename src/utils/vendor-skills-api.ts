import { useToast } from '@chakra-ui/react'
import { useMutation, useQuery } from 'react-query'
import { useClient } from './auth-context'

export const useVendorSkills = () => {
  const client = useClient()

  return useQuery('vendorSkills', async () => {
    const response = await client(`vendor-skills?page=0&size=10000000&sort=id,asc&cacheBuster=1661098459721`, {})

    return response?.data
  })
}

// export const useNewVendorSkills = props => {
//   const client = useClient()

//   return useQuery('vendorSkills', async () => {
//     const response = await client(`vendor-skills`, { Method: 'POST', Payload: props.data })

//     return response?.data
//   })
// }
export const useVendorSkillsMutation = () => {
  const client = useClient()
  const toast = useToast()
  //   const queryClient = useQueryClient()
  // const { projectId } = useParams<'projectId'>()

  return useMutation(
    payload => {
      return client('vendor-skills', {
        data: payload,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        //   queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])

        toast({
          title: 'Vendor Skills',
          description: 'Vendor skills created successfully',
          status: 'success',
          isClosable: true,
        })
      },
      onError(error: any) {
        toast({
          title: 'Vendor Skills',
          description: (error.title as string) ?? 'Unable to create Vendor Skills.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}
