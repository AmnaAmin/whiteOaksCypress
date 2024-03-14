import * as React from 'react'
import { useQueryClient } from 'react-query'
import * as auth from './auth-api'
import { client } from './api-client'
import { useAsync } from './hooks'
import { getToken, removeToken, setToken } from './storage.utils'
import { Account } from 'types/account.types'
import { ViewLoader } from 'components/page-level-loader'
import { Box } from '@chakra-ui/layout'
import { useToast } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'

type AuthState = {
  user: Account
  token: string
} | null

type LoginPayload = {
  email: string
  password: string
}

export const useLogin = () => {
  const { setData } = useAsync({})

  return useMutation({
    mutationFn: async (loginPayload: LoginPayload) => {
      const authLogin = await auth.login(loginPayload)
      const accountResponse = await client('/api/account', { token: authLogin.id_token })
      setToken(authLogin.id_token)

      setData({ user: accountResponse?.data?.user, token: authLogin.id_token })

      return { accountResponse, signatureValid: authLogin.agreement_valid }
    },
    // onSuccess: () => {
    //   navigate(0)
    // },
  })
}

async function bootstrapAppData() {
  let state: AuthState = null
  const token = getToken()
  if (token) {
    const response = await client('/api/account', { token })
    state = { user: response?.data, token }
  }

  return state
}

export type LoginProps = { email: string; password: string }

export interface AuthContextProps {
  login?: (user: LoginProps) => Promise<void>
  logout?: () => Promise<void>
  updateAccount?: (user: Account) => void
  register?: (payload: any) => Promise<void>
  data?: { user: Account; token: string }
}

const AuthContext = React.createContext<AuthContextProps>({})
AuthContext.displayName = 'AuthContext'
interface AuthProviderProps {
  children: JSX.Element
}
function AuthProvider(props: AuthProviderProps) {
  const token = getToken()
  const toast = useToast()
  const { t } = useTranslation()

  const { data, isLoading, isIdle, run, setData } = useAsync({})

  const { queryCache }: any = useQueryClient()

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData()
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    form => {
      return auth
        .login(form)
        .then(async ({ id_token }) => {
          const response = await client('/api/account', { token: id_token })
          setToken(id_token)
          return { user: response?.data, token: id_token }
        })
        .then(({ user, token }) => {
          setData({ user, token })
        })
        .catch(error => {
          const err = JSON.parse(error)

          toast({
            title: err?.title || 'Error',
            description: err?.message ? t(err?.message) : 'Something went wrong',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        })
    },
    [setData],
  )

  const updateAccount = React.useCallback(
    user => {
      setData({ user, token })
    },
    [setData],
  )

  const register = React.useCallback(
    form => {
      return auth
        .register(form)
        .then(user => {
          return client('/api/account', { token: user.id_token })
        })
        .then(user => {
          setData(user)
        })
    },
    [setData],
  )

  const logout = React.useCallback(() => {
    queryCache.clear()
    setData(null)
    removeToken()
    return auth.logout()
  }, [setData, queryCache])

  const value = React.useMemo(
    () => ({ data, login, logout, register, token, updateAccount }),
    [login, logout, register, token, data, updateAccount],
  )

  if (isLoading || isIdle) {
    return (
      <Box h="100vh" w="100vw">
        <ViewLoader />
      </Box>
    )
  }

  // if (isError) {
  //   return <Box>Error Ocurred during app bootstrapping</Box>
  // }

  // if (isSuccess) {
  return <AuthContext.Provider value={value} {...props} />
  // }

  // throw new Error(`Unhandled status: ${status}`);
}

function useAuth(): AuthContextProps {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient(apiPrefix = '/api') {
  const authToken = getToken()
  return React.useCallback(
    (endpoint, config, customURL="") => client(`${apiPrefix}/${endpoint}`, { ...config, token: authToken }, customURL),
    [authToken, apiPrefix],
  )
}

function useReminderClient() {
  const { data } = useAuth()
  const token = data?.token
  return React.useCallback(
    (endpoint, config) => client(`/services/reminder/api/${endpoint}`, { ...config, token }),
    [token],
  )
}

export { AuthProvider, useAuth, useClient, useReminderClient }
