import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { renderHook } from '@testing-library/react-hooks'
import { useProjects } from '../projects'

const queryClient = new QueryClient()
const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

describe('Project api functions', () => {
  it('Projects API should return data', async () => {
    const { result, waitFor } = renderHook(() => useProjects(), { wrapper })

    await waitFor(() => {
      return expect(result?.current?.projects?.[0].id).toEqual(2951)
    })
  })
})
