import { useToast } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/table-core'
import { PROJECT_TYPE } from 'features/project-type/project-type.i18n'
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

  const { data: clientTypes, ...rest } = useQuery('clientType', async () => {
    const response = await client(`client-types?page=&size=&sort=id,desc`, {})

    return response?.data
  })

  const clientTypesSelectOptions =
    clientTypes?.map(client => ({
      value: client.id,
      label: client.value,
    })) || []

  return {
    clientTypesSelectOptions,
    data: clientTypes,
    ...rest,
  }
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

export const useClientTypeDelMutation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (ClientTypeDetails: any) => {
      return client(`client-types/${ClientTypeDetails?.id}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Delete Client Type',
          description: `Client Type has been deleted successfully.`,
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
          description: (error.title as string) ?? 'Unable to delete Client Type.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}
