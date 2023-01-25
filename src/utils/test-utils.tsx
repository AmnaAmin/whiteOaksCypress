import React from 'react'
import {
  render,
  RenderOptions,
  waitForElementToBeRemoved,
  screen,
  fireEvent,
  getByText,
  findByText,
} from '@testing-library/react'

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

export const tick = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

/**
 * React select need this hack to open the select first then click on one of options
 */
const keyDownEvent = {
  key: 'ArrowDown',
}

export async function selectOption(container: HTMLElement, optionText: string, selectedText = 'Select') {
  const placeholder = getByText(container, selectedText)
  fireEvent.keyDown(placeholder, keyDownEvent)
  await findByText(container, optionText)
  fireEvent.click(getByText(container, optionText))
}
export const waitForLoadingToFinishLabelOnly = () =>
  waitForElementToBeRemoved(() => [...screen.queryAllByLabelText(/loading/i)], {
    timeout: 30000,
  })

export const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(() => [...screen.queryAllByLabelText(/loading/i), ...screen.queryAllByText(/Loading/i)], {
    timeout: 30000,
  })
export const waitForProgressBarToFinish = () =>
  waitForElementToBeRemoved(
    () => [...screen.queryAllByRole(/progressbar/i), ...screen.queryAllByRole(/progressbar/i)],
    {
      timeout: 30000,
    },
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
