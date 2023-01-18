/*eslint-disable */
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useClient } from 'utils/auth-context'

export const useVendorRegister = () => {
  const client = useClient()

  const toast = useToast()

  const registerApiUrl = 'api/vendor/user/register'

  const navigate = useNavigate()

  return useMutation(
    (payload: any) => {
      return axios.post(registerApiUrl, payload)
    },
    {
      onSuccess: () => {
        navigate('/login')
        toast({
          title: 'Registered Successfully.',
          position: 'top-left',
          status: 'success',
        })
      },
      onError: (error: any) => {
        toast.closeAll()

        toast({
          title: `Error. ${error.response.data.title}`,
          position: 'top-left',
          status: 'error',
        })
      },
    },
  )
}
