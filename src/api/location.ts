import { useToast } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/table-core'
import { LOCATION } from 'features/location/location.i18n'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
export const LOCATION_TYPE_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${LOCATION}.location`,
    accessorKey: 'value',
  },
  {
    header: `${LOCATION}.createdBy`,
    accessorKey: 'createdBy',
  },
  {
    header: `${LOCATION}.createdDate`,
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
    header: `${LOCATION}.modifiedBy`,
    accessorKey: 'lastModifiedBy',
  },
  {
    header: `${LOCATION}.modifiedDate`,
    accessorKey: 'lastModifiedDate',
    accessorFn(cellInfo) {
      return datePickerFormat(cellInfo.lastModifiedDate)
    },
    cell: (row: any) => {
      const value = row?.row.original?.lastModifiedDate
      return value ? dateFormat(value) : '- - -'
    },
    meta: { format: 'date' },
  },
]

export const useLocation = () => {
  const client = useClient()

  const { data: locations, ...rest } = useQuery('location', async () => {
    const response = await client(`locations?page=&size=&sort=id,desc`, {})

    return response?.data
  })

  // Sort the locations alphabetically by name
  const sortedLocations = locations?.sort((a, b) => a.value.localeCompare(b.value))

  const locationSelectOptions =
    sortedLocations?.map(loc => ({
      value: loc.id,
      label: loc.value,
    })) || []

  return {
    locationSelectOptions,
    data: sortedLocations,
    ...rest,
  }
}

export const usePaymentGroupVals = () => {
  const client = useClient()

  const { data: paymentGroupVals, ...rest } = useQuery('paymentGroup', async () => {
    const response = await client(`lk_value/lookupType/23`, {})

    return response?.data
  })

  const paymentGroupValsOptions =
    paymentGroupVals?.map(payGrp => ({
      value: payGrp.id,
      label: payGrp.value,
    })) || []

  return {
    paymentGroupValsOptions,
    ...rest,
  }
}

export const useUpdateLocation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (location: any) => {
      return client('location', {
        data: location,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Update Location',
          description: `Location has been updated successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('location')
      },

      onError(error: any) {
        toast({
          title: 'Location',
          description: (error.title as string) ?? 'Unable to save location.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useCreateLocation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (location: any) => {
      return client('location', {
        data: location,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'New Location',
          description: `New location has been created successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('location')
      },

      onError(error: any) {
        toast({
          title: 'Location',
          description: (error.title as string) ?? 'Unable to save location.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useDeleteLocation = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (location: any) => {
      return client(`location/${location?.id}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Delete Location',
          description: `Location has been deleted successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('location')
      },

      onError(error: any) {
        toast({
          title: 'Delete Location',
          description: (error.title as string) ?? 'Unable to delete location.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}
