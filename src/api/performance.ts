import { useToast } from '@chakra-ui/react'
import { Control, useWatch } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ErrorType } from 'types/common.types'
import { PerformanceType } from 'types/performance.type'
import { useClient } from 'utils/auth-context'

export const useRevenuePerformance = () => {
  const client = useClient()

  return useQuery('performance', async () => {
    const response = await client(`fpm-quota-chart/revenue-profit`, {})
    return response?.data
  })
}

export const usePerformance = () => {
  const client = useClient()

  return useQuery('performance-list', async () => {
    const response = await client(`fpm-quota`, {})
    return response?.data
  })
}

export const useFPMDetails = (FPMId: any) => {
  const client = useClient()

  return useQuery('fpm-details', async () => {
    const response = await client(`fpm-quota-info/${FPMId}`, {})
    return response?.data
  })
}

export const ignorePerformance = [
  {
    value: 0,
    label: 'No',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 90,
    label: '90',
  },
  {
    value: -1,
    label: 'Indefinitely',
  },
]

export const badges = [
  { value: 'None', label: 'None' },
  { value: 'Bronze', label: 'Bronze' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Platinum', label: 'Platinum' },
]

export const bonus = [
  { value: 0, label: '0%' },
  { value: 1, label: '1%' },
  { value: 2, label: '2%' },
  { value: 3, label: '3%' },
  { value: 4, label: '4%' },
  { value: 5, label: '5%' },
  { value: 6, label: '6%' },
  { value: 7, label: '7%' },
  { value: 8, label: '8%' },
  { value: 9, label: '9%' },
  { value: 10, label: '10%' },
]

export const useMutatePerformance = (FPMId: number) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (performancePayload: any) => {
      return client(`fpm-quota-info/${FPMId}`, {
        method: 'PUT',
        data: performancePayload,
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Update Performance Details',
          description: 'Performance Details have been updated successfully.',
          status: 'success',
          isClosable: true,
        })
        queryClient.invalidateQueries('performance-list')
        queryClient.invalidateQueries('fpm-details')
      },
      onError(error: ErrorType) {
        toast({
          title: error?.title || 'Something went wrong',
          description: error?.message || 'Something went wrong in performance details update',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const usePerformanceSaveDisabled = (control: Control<PerformanceType>, errors): boolean => {
    const formValues = useWatch({ control })
  
    return (
      !formValues?.newBonus ||
      !formValues?.newTarget ||
      !formValues?.badge ||
      !formValues?.ignoreQuota
    )
  }

  // Performance Graph
  export const MonthOptionTypes = {
    all: 'all',
    lastMonth: 'lastMonth',
    thisMonth: 'thisMonth',
    currentQuarter: 'currentQuarter',
    pastQuarter: 'pastQuarter',
  };
  
 export const MonthOption = [
    { value: MonthOptionTypes.thisMonth, label: 'This Month' },
    { value: MonthOptionTypes.lastMonth, label: 'Last Month' },
    { value: MonthOptionTypes.currentQuarter, label: 'Current Quarter' },
    { value: MonthOptionTypes.pastQuarter, label: 'Past Quarter' },
    { value: MonthOptionTypes.all, label: 'All' },
  ];

  export const Month = [
    { value: MonthOptionTypes.thisMonth, label: 'This Month' },
    { value: MonthOptionTypes.all, label: 'All' },
  ];

