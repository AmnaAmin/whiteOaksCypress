import { useClient } from 'utils/auth-context'

import { useMutation } from 'react-query'

export const useWorkOrderUpdateMutation = () => {
  const client = useClient()

  return useMutation(payload => client(`work-orders`, { data: payload, method: 'PUT' }))
}
