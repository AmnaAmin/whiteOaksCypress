import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from 'utils/auth-context'
import { ReactQueryDevtools } from 'react-query/devtools'
import { theme } from 'theme/theme'
import { Global } from '@emotion/react'
import { GlobalStyles } from 'theme/global-css'
import { I18nextProvider } from 'react-i18next'
import i18n from 'translation/i18n'
import { registerServiceWorker } from './integrations/firebase/register-sw'

let queryConfig = {}

if (process.env.NODE_ENV === 'test') {
  queryConfig = {
    defaultOptions: {
      queries: {
        useErrorBoundary: false,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 0,
      },
    },
  }
} else {
  queryConfig = {
    defaultOptions: {
      queries: {
        useErrorBoundary: false,
        refetchOnWindowFocus: false,
        retry(failureCount: number, error: any) {
          if (error.status === 404) return false
          else if (failureCount < 2) return true
          else return false
        },
      },
    },
  }
}

export const Providers: React.FC = ({ children }) => {
  const queryClient = new QueryClient(queryConfig)
  registerServiceWorker()
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Global styles={GlobalStyles} />
          {/* @ts-ignore */}
          <AuthProvider>{children}</AuthProvider>
        </ChakraProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </I18nextProvider>
  )
}
