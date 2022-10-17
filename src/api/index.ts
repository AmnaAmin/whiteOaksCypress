import { useToast } from '@chakra-ui/react'
import { useQuery, UseQueryResult } from 'react-query'
import { useClient } from 'utils/auth-context'

export function usePaginationQuery<TData>(
  queryKey,
  endpoint,
  size: number,
  options?: any,
): UseQueryResult<{ data: TData | undefined; totalCount: number }> {
  const toast = useToast()
  const client = useClient()

  return useQuery<{ data: TData | undefined; totalCount: number }>(
    queryKey,
    async () => {
      const response = await client(endpoint, {})
      const total = response?.headers?.get('X-Total-Count') || 0

      return { data: response?.data, totalCount: size ? Math.ceil(Number(total) / size) : 0 }
    },
    {
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error?.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
      ...options,
    },
  )
}
