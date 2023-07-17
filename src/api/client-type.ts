import { useToast } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/table-core'
import { PROJECT_TYPE } from 'features/project-type/project-type.i18n'
import { t } from 'i18next'
import orderBy from 'lodash/orderBy'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
export const CLIENT_TYPE_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${PROJECT_TYPE}.type`,
    accessorKey: 'value',
  },
  {
    header: `${PROJECT_TYPE}.createdBy`,
    accessorKey: 'createdBy',
  },
  {
    header: `${PROJECT_TYPE}.createdDate`,
    accessorKey: 'createdDate',
    accessorFn(cellInfo) {
      return datePickerFormat(cellInfo.createdDate)
    },
    cell: (row: any) => {
      const value = row?.row.original?.createdDate
      return value ? dateFormat(value) : '- - -'
    },
    meta: { format: 'date' },
  },
  {
    header: `${PROJECT_TYPE}.modifiedBy`,
    accessorKey: 'modifiedBy',
  },
  {
    header: `${PROJECT_TYPE}.modifiedDate`,
    accessorKey: 'modifiedDate',
    accessorFn(cellInfo) {
      return datePickerFormat(cellInfo.modifiedDate)
    },
    cell: (row: any) => {
      const value = row?.row.original?.modifiedDate
      return value ? dateFormat(value) : '- - -'
    },
    meta: { format: 'date' },
  },
]

export const useClientType = () => {
  const client = useClient()

  return useQuery('clientType', async () => {
    const response = await client(`client-types`, {})

    return orderBy(response?.data || [], ['id'], ['desc'])
  })
}

export const useClientTypeEditMutation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (ClientTypeEditDetails: any) => {
      return client('client-types', {
        data: ClientTypeEditDetails,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Update Client Type',
          description: `Client Type has been Updated successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('clientType')
      },

      onError(error: any) {
        toast({
          title: 'Client Type',
          description: (error.title as string) ?? 'Unable to save Client Type.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useClientTypeMutation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (ClientTypeDetails: any) => {
      return client('client-types', {
        data: ClientTypeDetails,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'New Client Type',
          description: `New Client Type has been created successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('clientType')
      },

      onError(error: any) {
        toast({
          title: 'Client Type',
          description: (error.title as string) ?? 'Unable to save Client Type.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const textCheckForType = (projectTypeDetails, clientType) => {
  if (projectTypeDetails && clientType) return t(`${PROJECT_TYPE}.editClientType`)
  if (projectTypeDetails && !clientType) return t(`${PROJECT_TYPE}.editProjectType`)
  if (!projectTypeDetails && clientType) return t(`${PROJECT_TYPE}.newClientType`)
  if (!projectTypeDetails && !clientType) return t(`${PROJECT_TYPE}.newProjectType`)
}
