import { useQuery } from 'react-query'
import { ProjectAward } from 'types/project.type'
import { useClient } from 'utils/auth-context'

export const useProjectAward = (largeWorkOrder?: boolean) => {
  const client = useClient()
  const { data: projectAwardData, ...rest } = useQuery<Array<ProjectAward>>(
    ['projectAward', largeWorkOrder],
    async () => {
      const largeWoEndPoints = 'award-plans?largeWo.equals=true'
      const response = await client(largeWorkOrder ? largeWoEndPoints : `award-plans/`, {})

      return response?.data
    },
    // { enabled: !!projectId },
  )

  return {
    projectAwardData,
    ...rest,
  }
}
