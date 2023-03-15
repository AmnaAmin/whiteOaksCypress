import { useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import orderBy from 'lodash/orderBy'

export const useProjectType = () => {
  const client = useClient()

  return useQuery('projectType', async () => {
    const response = await client(`project_type`, {})

    return orderBy(response?.data || [], ['id'], ['desc'])
  })
}

export const useProjectTypeMutation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (ProjectTypeDetails: any) => {
      return client('project_type', {
        data: ProjectTypeDetails,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'New Project Type',
          description: `New Project Type has been created successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('projectType')
      },

      onError(error: any) {
        toast({
          title: 'Project Type',
          description: (error.title as string) ?? 'Unable to save Project Type.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useProjectTypeEditMutation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (ProjectTypeEditDetails: any) => {
      return client('project_type', {
        data: ProjectTypeEditDetails,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Update Project Type',
          description: `Project Type has been Updated successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('projectType')
      },

      onError(error: any) {
        toast({
          title: 'Project Type',
          description: (error.title as string) ?? 'Unable to save Project Type.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useProjTypeDelMutation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (ProjectTypeDetails: any) => {
      return client(`project_type/${ProjectTypeDetails?.id}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Delete Project Type',
          description: `Project Type has been deleted successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('projectType')
      },

      onError(error: any) {
        toast({
          title: 'Delete Project Type',
          description: (error.title as string) ?? 'Unable to Delete Project Type.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}
