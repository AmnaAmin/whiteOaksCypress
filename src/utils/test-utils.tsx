import React from 'react'
import { render, RenderOptions, waitForElementToBeRemoved, screen } from '@testing-library/react'

import { QueryClient, QueryClientProvider } from 'react-query'
import { Providers } from 'providers'

const queryClient = new QueryClient()
export const ReactQueryProviderWrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

export const AllTheProviders: React.FC = ({ children }) => {
  return <Providers>{children}</Providers>
}

type CustomRenderOptions = RenderOptions & {
  route?: string
}

export const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [...screen.queryAllByLabelText(/loading/i), ...screen.queryAllByText(/Loading.../i)],
    { timeout: 10000 },
  )

const customRender = async (ui, options: CustomRenderOptions) => {
  const { route = '/' } = options

  window.history.pushState({}, '', route)

  const returnValue = render(ui, { wrapper: AllTheProviders, ...options })

  await waitForLoadingToFinish()

  return returnValue
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
