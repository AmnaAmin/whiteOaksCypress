import { useToast } from '@chakra-ui/react'
import { STATUS } from 'features/projects/status'
import { useMutation, useQuery } from 'react-query'
import { ProjectWorkOrderType } from 'types/project.type'
import { useClient } from 'utils/auth-context'

const swoPrefix = '/smartwo/api'

export type LineItems = {
  id: number | string | null
  sku: string
  productName: string
  details: string
  description: string
  price?: string | number | null
  unitPrice: string | number | null
  quantity: number | string | null
  totalPrice: string | number | null
  isAssigned?: boolean
  projectId: string | number | null
  createdBy: string
  createdDate: string
  modifiedBy: string
  modifiedDate: string
  smartLineItemId?: string | number | null
  source?: string
  isVerified?: boolean
  isCompleted?: boolean
}

export const getRemovedItems = (formValues, workOrder) => {
  /* checking which  smart work order items existed in workOrder but now are not present in the form. They have to unassigned*/
  const formAssignedItemsIds = formValues?.assignedItems?.map(s => s.id)
  const deletedItems = [...workOrder?.assignedItems?.filter(items => !formAssignedItemsIds?.includes(items.id))]
  return deletedItems
}

export const getUnAssignedItems = (formValues, workOrder) => {
  /* checking which  smart work order items existed in workOrder but now are not present in the form. They have to unassigned*/
  const formAssignedItemsIds = formValues?.assignedItems?.map(s => s.smartLineItemId)
  const unAssignedItems = [
    ...workOrder?.assignedItems?.filter(
      items => !!items.smartLineItemId && !formAssignedItemsIds?.includes(items.smartLineItemId),
    ),
  ]
  return unAssignedItems
}

export const useRemainingLineItems = (swoProjectId?: string) => {
  const client = useClient(swoPrefix)

  const { data: remainingItems, ...rest } = useQuery<any>(
    ['remainingItems', swoProjectId],
    async () => {
      const response = await client(`line-items?isAssigned.equals=false&projectId.equals=${swoProjectId}`, {})

      return response?.data
    },
    {
      enabled: !!swoProjectId,
    },
  )

  return {
    remainingItems,
    ...rest,
  }
}

export const useFetchProjectId = (projectId?: string | number | null) => {
  const client = useClient(swoPrefix)

  const { data: swoProject, ...rest } = useQuery<any>(
    ['fetchProjectId', projectId],
    async () => {
      const response = await client(`projects?projectId.equals=` + projectId, {})

      return response?.data
    },
    {
      enabled: !!projectId,
    },
  )

  return {
    swoProject: swoProject?.length > 0 ? swoProject[0] : null,
    ...rest,
  }
}

type AssignArgumentType = {
  swoProjectId: string | number | null
  showToast?: boolean
}

export const useAssignLineItems = (props: AssignArgumentType) => {
  const { swoProjectId, showToast } = props
  const client = useClient(swoPrefix)
  const toast = useToast()

  return useMutation(
    (lineItems: any) => {
      return client(`line-items/list?projectId.equals=${swoProjectId}`, {
        data: lineItems,
        method: 'PUT',
      })
    },
    {
      onSuccess(res: any) {
        if (showToast) {
          toast({
            title: 'Line Items Assignment',
            description: 'Line Items Assignment updated successfully.',
            status: 'success',
            isClosable: true,
          })
        }
      },
      onError(error: any) {
        toast({
          title: 'Assigned Line Items',
          description: (error.title as string) ?? 'Unable to update line items assignment.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useDeleteLineIds = () => {
  const client = useClient()
  const toast = useToast()

  return useMutation(
    (payload: { deletedIds: string }) => {
      return client('work-orders/line-items?ids=' + payload.deletedIds, {
        method: 'DELETE',
      })
    },
    {
      onSuccess() {},
      onError(error: any) {
        toast({
          title: 'Work Order',
          description: 'Unable to delete Line Items',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useAllowLineItemsAssignment = (workOrder: ProjectWorkOrderType) => {
  const activePastDue = [STATUS.Active, STATUS.PastDue].includes(workOrder?.statusLabel?.toLocaleLowerCase() as STATUS)
  const isAssignmentAllowed = !workOrder || activePastDue
  return { isAssignmentAllowed }
}
