import { useToast } from '@chakra-ui/react'
import { useMutation, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'

export const MARKET_KEY = 'markets'

export const useDeleteMarket = () => {
  const queryClient = useQueryClient()
  const client = useClient()
  const toast = useToast()

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await client(`markets/${payload?.id}`, {
        data: payload,
        method: 'DELETE',
      })
      return response
    },
    onSuccess: (resp: any) => {
      console.log(resp)

      queryClient.invalidateQueries(MARKET_KEY)

      toast({
        title: `Delete Market`,
        description: `Market have been Deleted Successfully.`,
        status: 'success',
        isClosable: true,
        position: 'top-left',
      })
    },
    onError: (error: any) => {
      console.log(error)
    },
  })
}
