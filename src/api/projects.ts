import { Project, ProjectWorkOrderType, ProjectFinancialOverview } from 'types/project.type'
import { useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'
import numeral from 'numeral'
import { orderBy } from 'lodash'
import { usePaginationQuery } from 'api/index'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'

export const PROJECTS_QUERY_KEY = 'projects'
export const useProjects = (filterQueryString?: string, page?: number, size: number = 0) => {
  const queryKey = [PROJECTS_QUERY_KEY, filterQueryString]
  // change this logic based on access control requirements
  const hidePaidProjects = useRoleBasedPermissions()?.permissions?.includes('PROJECT.PAID.HIDE')
  const fpmRestrictedProjects = 'projectStatusId.notIn=41,72,109' // paid -> 41 , ClientPAid -> 72 , Overpayment -> 109
  const endpoint = hidePaidProjects
    ? `v1/projects?${fpmRestrictedProjects}&${filterQueryString || ''}`
    : `v1/projects?${filterQueryString || ''}`

  const { data, ...rest } = usePaginationQuery<Array<Project>>(queryKey, endpoint, size || 10, { enabled: size > 0 })

  return {
    // making a duplicate parameter for now as BE will change its name later on
    projects: data?.data?.map(e => ({ ...e, latestNoteAddedDate: e.latestNoteAddedTime })),
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
    ...rest,
  }
}

export const ALL_PROJECTS_QUERY_KEY = 'all_projects'
export const useGetAllProjects = (filterQueryString: string) => {
  const client = useClient()
  // change this logic based on access control requirements
  const { isFPM } = useUserRolesSelector()
  const fpmRestrictedProjects = 'projectStatusId.notIn=41,72,109' // paid -> 41 , ClientPAid -> 72 , Overpayment -> 109
  const endpoint = isFPM
    ? `v1/projects?${fpmRestrictedProjects}&${filterQueryString || ''}`
    : `v1/projects?${filterQueryString || ''}`

  const { data, ...rest } = useQuery<Array<Project>>(
    ALL_PROJECTS_QUERY_KEY,
    async () => {
      const response = await client(endpoint, {})

      return response?.data
    },
    {
      enabled: false,
    },
  )

  return {
    allProjects: data,
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

    return orderBy(
      response?.data,
      [
        item => {
          const createdDate = new Date(item.createdDate)
          return createdDate
        },
      ],
      ['asc'],
    )
  })
}

export const useWeekDayProjectsDue = (id?: string) => {
  const client = useClient()
  return useQuery(['weekDayFilters', id], async () => {
    const response = await client(`projects-due-this-week/${id ?? ''}`, {})
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
  const [vendorPaymentPercentage] = restProjectFinancialOverviews

  const sowRevisedChangeOrderAmount =
    (firstFinancialRecord?.changeOrder || 0) + (firstFinancialRecord?.coAdjustment || 0)
  const sowRevisedAmount = (firstFinancialRecord?.originalAmount || 0) + (firstFinancialRecord?.noCoAdjustment || 0)
  const finalSOWAmount =
    sowRevisedAmount +
    sowRevisedChangeOrderAmount +
    (firstFinancialRecord?.carrierFee || 0) +
    (firstFinancialRecord?.legalFee || 0)
  const originalSOWAmount =
    (firstFinancialRecord?.originalAmount || 0) +
    (firstFinancialRecord?.changeOrder || 0) +
    (firstFinancialRecord?.adjustment || 0)

  const projectExpenses = -1 * ((firstFinancialRecord?.shipFee || 0) + (firstFinancialRecord?.permitFee || 0))

  const { vendorAccountPayable, projectTotalCost, materialCost, vendorPayment } = restProjectFinancialOverviews?.reduce(
    (final, curr) => {
      return {
        vendorAccountPayable: final.vendorAccountPayable + (curr?.accountPayable || 0),
        projectTotalCost: final.projectTotalCost + (curr?.workOrderNewAmount || 0),
        materialCost: final.materialCost + (curr?.material || 0),
        vendorPayment: final.vendorPayment + (curr?.vendorPayment || 0),
      }
    },
    { vendorAccountPayable: 0, projectTotalCost: 0, materialCost: 0, vendorPayment: 0 },
  ) || { vendorAccountPayable: 0, projectTotalCost: 0, materialCost: 0, vendorPayment: 0 }

  const finalProjectTotalCost = projectTotalCost + projectExpenses

  const profitMargin = originalSOWAmount === 0 ? 0 : (finalSOWAmount - finalProjectTotalCost) / finalSOWAmount

  return {
    finalSOWAmount: numeral(finalSOWAmount).format('$0,0.00'),
    accountPayable: numeral(vendorAccountPayable).format('$0,0.00'),
    projectTotalCost: numeral(finalProjectTotalCost).format('$0,0.00'),
    revenue: numeral(finalSOWAmount).format('$0,0.00'),
    profits: numeral(finalSOWAmount - finalProjectTotalCost).format('$0,0.00'),
    profitMargin: numeral(profitMargin).format('0.00%'),
    material: numeral(materialCost).format('$0,0.00'),
    vendorPayment: numeral(vendorPayment).format('$0,0.00'),
    projectTotalCostNumber: finalProjectTotalCost,
    financialOveriewTableData:
      [firstFinancialRecord]?.map(fo => ({
        ...fo,
        revisedSOWAmount: (fo?.originalAmount || 0) + (fo?.noCoAdjustment || 0),
        revisedChangeOrderAmount: (fo?.changeOrder || 0) + (fo?.coAdjustment || 0),
        finalSOWAmount: fo?.newAmount || 0,
        accountReceivable:
          (fo?.newAmount || 0) +
          (fo?.draw || 0) -
          ((fo?.partialPayment || 0) + (fo?.deductible || 0) + (fo?.depreciation || 0)),
      })) || [],
    workOrderFinancialOverviews: restProjectFinancialOverviews,
    vendorPaymentPercentage,
    ...rest,
  }
}

export const SELECTED_CARD_MAP_URL = {
  active: 'status.equals=34',
  completed: 'status.equals=36',
  pastDue: 'status.equals=114',
  invoiced: 'status.equals=110',
  declined: 'status.equals=111',
}

export const VENDOR_WORK_ORDER_QUERY_KEY = 'workorder_projects'
type VendorWorkOrder = Array<any>

const getVendorWorkOrderQueryString = (filterQueryString: string) => {
  let queryString = filterQueryString
  if (filterQueryString?.search('&sort=workOrderExpectedCompletionDate') < 0) {
    queryString = queryString + `&sort=expectedPaymentDate,asc`
  }
  return queryString
}

export const useWorkOrders = (queryString: string, pageSize: number) => {
  const apiQueryString = getVendorWorkOrderQueryString(queryString)

  const { data, ...rest } = usePaginationQuery<VendorWorkOrder>(
    [VENDOR_WORK_ORDER_QUERY_KEY, apiQueryString],
    `vendor/workorders?${apiQueryString}&status.notEquals=35`,
    pageSize,
  )

  return {
    workOrderData: data?.data,
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
    ...rest,
  }
}

export const ALL_WORK_ORDER_QUERY_KEY = 'all_workOrders'
export const useGetAllWorkOrders = (filterQueryString: string) => {
  const client = useClient()

  const { data, ...rest } = useQuery<Array<Project>>(
    ALL_PROJECTS_QUERY_KEY,
    async () => {
      const response = await client(`vendor/workorders?${filterQueryString}&status.notEquals=35`, {})

      return response?.data
    },
    {
      enabled: false,
    },
  )

  return {
    allProjects: data,
    ...rest,
  }
}
