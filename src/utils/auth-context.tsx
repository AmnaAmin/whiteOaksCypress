import * as React from 'react'
import { useQueryClient } from 'react-query'
import * as auth from './auth-api'
import { client } from './api-client'
import { useAsync } from './hooks'
import { getToken, removeToken, setToken } from './storage.utils'
import { Account } from 'types/account.types'
import { PageLoader } from 'components/page-level-loader'
import { Box } from '@chakra-ui/react'

type AuthState = {
  user: Account
  token: string
} | null

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

  const { data, isLoading, isIdle, run, setData, isError, isSuccess } = useAsync({})

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
    console.log('logout called')
    queryCache.clear()
    setData(null)
    removeToken()
    return auth.logout()
  }, [setData, queryCache])

  const value = React.useMemo(() => ({ data, login, logout, register, token }), [login, logout, register, token, data])

  if (isLoading || isIdle) {
    return <PageLoader />
  }

  if (isError) {
    return <Box>Error Ocurred during app bootstrapping</Box>
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }

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
    (endpoint, config) => client(`${apiPrefix}/${endpoint}`, { ...config, token: authToken }),
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
