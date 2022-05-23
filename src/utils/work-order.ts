import { useClient } from 'utils/auth-context'
import { useMutation, useQueryClient } from 'react-query'
import { useToast } from '@chakra-ui/toast'
import { useParams } from 'react-router-dom'

export const useUpdateWorkOrderMutation = () => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { projectId } = useParams<'projectId'>()

  return useMutation(
    payload => {
      return client('work-orders', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])
        toast({
          title: 'Work Order',
          description: 'Work Order has been saved successfully.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      },
      onError(error: any) {
        toast({
          title: 'Work Order',
          description: (error.title as string) ?? 'Unable to save workorder.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      },
    },
  )
}
