import { useQuery } from 'react-query'
import { Project } from 'types/project.type'
import { useClient } from 'utils/auth-context'

export const useProjectAward = (projectId?: string) => {
  const client = useClient()
  const { data: projectAwardData, ...rest } = useQuery<Project>(
    ['project', projectId],
    async () => {
      const response = await client(`award-plans/`, {})

      return response?.data
    },
    // { enabled: !!projectId },
  )

  return {
    projectAwardData,
    ...rest,
  }
}
