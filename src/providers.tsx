import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from 'utils/auth-context'
import { ReactQueryDevtools } from 'react-query/devtools'
import { theme } from 'theme/theme'

const queryConfig = {
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

export const Providers: React.FC = ({ children }) => {
  const queryClient = new QueryClient(queryConfig)
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        {/* @ts-ignore */}
        <AuthProvider>{children}</AuthProvider>
      </ChakraProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
