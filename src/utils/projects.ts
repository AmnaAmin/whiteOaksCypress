import { Project, ProjectWorkOrderType, ProjectAlertType, ProjectFinancialOverview } from 'types/project.type'
import { useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'
import numeral from 'numeral'

const PROJECTS_QUERY_KEY = 'projects'
export const useProjects = () => {
  const client = useClient()

  const { data, ...rest } = useQuery<Array<Project>>(PROJECTS_QUERY_KEY, async () => {
    const response = await client(`projects?page=0&size=10000000&sort=id,asc`, {})

    return response?.data
  })

  return {
    projects: data,
    ...rest,
  }
}

export const useProject = (projectId?: string) => {
  const client = useClient()

  const { data: projectData, ...rest } = useQuery<Project>(['project', projectId], async () => {
    const response = await client(`projects/${projectId}/vendor`, {})

    return response?.data
  })

  return {
    projectData,
    ...rest,
  }
}

export const useProjectWorkOrders = projectId => {
  const client = useClient()

  return useQuery<ProjectWorkOrderType[]>(['GetProjectWorkOrders', projectId], async () => {
    const response = await client(`project/${projectId}/workorders`, {})

    return response?.data
  })
}

export const useProjectAlerts = (projectId, login) => {
  const client = useClient('/alert/api')

  return useQuery<ProjectAlertType[]>('GetProjectAlerts', async () => {
    const response = await client(`alert-histories/project/${projectId}`, {})

    return response?.data.filter(alert => alert.login === login)
  })
}

export const useWeekDayProjectsDue = () => {
  const client = useClient()

  return useQuery('weekDayFilters', async () => {
    const response = await client(`projects-due-this-week`, {})

    return response?.data
  })
}

export const useProjectNotes = ({ projectId }: { projectId: number | undefined }) => {
  const client = useClient()

  const { data: notes, ...rest } = useQuery<Array<Document>>(['notes', projectId], async () => {
    const response = await client(`notes?projectId.equals=${projectId}`, {})
    return response?.data
  })

  return {
    notes,
    ...rest,
  }
}

export const useProjectTypes = () => {
  const client = useClient()

  return useQuery('projectTypes', async () => {
    const response = await client(`project_type?page=&size=&sort=value,asc`, {})

    return response?.data
  })
}

export const PROJECT_FINANCIAL_OVERVIEW_API_KEY = 'projectFinancialOverview'

export const useGetProjectFinancialOverview = (projectId?: string) => {
  const client = useClient()

  const { data: projectFinacialOverview, ...rest } = useQuery<ProjectFinancialOverview[]>(
    [PROJECT_FINANCIAL_OVERVIEW_API_KEY, projectId],
    async () => {
      const response = await client(`project/${projectId}/financialOverview`, {})
      return response?.data
    },
    {
      enabled: projectId !== undefined,
    },
  )

  const [firstFinancialRecord, ...restProjectFinancialOverviews] = projectFinacialOverview || []

  const sowRevisedChangeOrderAmount =
    (firstFinancialRecord?.changeOrder || 0) + (firstFinancialRecord?.coAdjustment || 0)
  const sowRevisedAmount = (firstFinancialRecord?.originalAmount || 0) + (firstFinancialRecord?.noCoAdjustment || 0)
  const finalSOWAmount = sowRevisedAmount + sowRevisedChangeOrderAmount
  const originalSOWAmount =
    (firstFinancialRecord?.originalAmount || 0) +
    (firstFinancialRecord?.changeOrder || 0) +
    (firstFinancialRecord?.adjustment || 0)

  const { vendorAccountPayable, projectTotalCost } = restProjectFinancialOverviews?.reduce(
    (final, curr) => {
      return {
        vendorAccountPayable:
          final.vendorAccountPayable +
          (curr.workOrderOriginalAmount || 0) +
          (curr.changeOrder || 0) +
          (curr.adjustment || 0) +
          (curr.draw || 0) +
          (curr.material || 0),
        projectTotalCost:
          final.projectTotalCost +
          (curr.workOrderOriginalAmount || 0) +
          (curr.changeOrder || 0) +
          (curr.adjustment || 0),
      }
    },
    { vendorAccountPayable: 0, projectTotalCost: 0 },
  ) || { vendorAccountPayable: 0, projectTotalCost: 0 }

  const profitMargin = originalSOWAmount === 0 ? 0 : (originalSOWAmount - projectTotalCost) / originalSOWAmount

  return {
    finalSOWAmount: numeral(finalSOWAmount).format('$0,0.00'),
    accountPayable: numeral(vendorAccountPayable).format('$0,0.00'),
    projectTotalCost: numeral(projectTotalCost).format('$0,0.00'),
    revenue: numeral(finalSOWAmount).format('$0,0.00'),
    profits: numeral(finalSOWAmount - projectTotalCost).format('$0,0.00'),
    profitMargin: numeral(profitMargin).format('0.00%'),
    financialOveriewTableData:
      [firstFinancialRecord]?.map(fo => ({
        ...fo,
        revisedSOWAmount: (fo?.originalAmount || 0) + (fo?.noCoAdjustment || 0),
        revisedChangeOrderAmount: (fo?.changeOrder || 0) + (fo?.coAdjustment || 0),
        finalSOWAmount: fo?.newAmount || 0,
        accountReceivable: (fo?.newAmount || 0) + (fo?.draw || 0) - (fo?.partialPayment || 0),
      })) || [],
    ...rest,
  }
}
