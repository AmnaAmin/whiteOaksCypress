import { useQuery } from 'react-query'
import { ProjectAlertType } from 'types/project.type'
import { useClient } from 'utils/auth-context'

export const useManagedAlert = () => {
  const client = useClient('/alert/api')

  return useQuery<ProjectAlertType[]>('GetProjectAlerts', async () => {
    const response = await client(`alert-definitions?cacheBuster=${new Date().valueOf()}`, {})
    console.log('response', response?.data)
    return response?.data
  })
}
