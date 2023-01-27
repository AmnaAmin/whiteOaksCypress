import { useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AlertType, ATTRIBUTE_SELECTION_OPTIONS, BEHAVIOUR_SELECTION_OPTIONS, CATEGORY_OPTIONS, NOTIFY_OPTIONS, TYPE_SELECTION_OPTIONS } from 'types/alert.type'
import { useClient } from 'utils/auth-context'

export const useManagedAlert = () => {
  const client = useClient('/alert/api')

  return useQuery<AlertType[]>('alert-details', async () => {
    const response = await client(`alert-definitions?cacheBuster=${new Date().valueOf()}`, {})
    return response?.data
  })
}

export const alertDetailsDefaultValues = ({ selectedAlert }) => {
  const categoryValue = CATEGORY_OPTIONS?.find(c => c?.label === selectedAlert?.category)
  const notifyValue = NOTIFY_OPTIONS?.find(n => n?.value === selectedAlert?.notify)
  const typeSelectionValue = TYPE_SELECTION_OPTIONS?.find(t => t?.label === selectedAlert?.typeSelection)
  const attributeSelectionValue = ATTRIBUTE_SELECTION_OPTIONS?.find(a => a?.label === selectedAlert?.attributeSelection)
  const behaviourSelectionValue = BEHAVIOUR_SELECTION_OPTIONS?.find(b => b?.label === selectedAlert?.behaviourSelection)

  const defaultValues = {
    ...selectedAlert,
    category: categoryValue,
    notify: notifyValue,
    typeSelection: typeSelectionValue,
    attributeSelection: attributeSelectionValue,
    behaviourSelection: behaviourSelectionValue,
  }
  return defaultValues
}


export const useUpdateAlertDetails = () => {
    const client = useClient('/alert/api')
    const queryClient = useQueryClient()
    const toast = useToast()
  
    return useMutation(
      (alertDetails: any) => {
        return client('alert-definitions', {
          data: alertDetails,
          method: 'PUT',
        })
      },
      {
        onSuccess() {
          toast({
            title: 'Alert Details Updated',
            description: 'Alert Details have been updated successfully',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
          queryClient.invalidateQueries('alert-details')
        },
  
        onError(error: any) {
          toast({
            title: 'Alert Details',
            description: (error.title as string) ?? 'Unable to update alert details.',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        },
      },
    )
  }
  
  export const useSaveAlertDetails = () => {
    const client = useClient('/alert/api')
    const queryClient = useQueryClient()
    const toast = useToast()
  
    return useMutation(
      (alertDetails: any) => {
        return client('alert-definitions', {
          data: alertDetails,
          method: 'POST',
        })
      },
      {
        onSuccess() {
          toast({
            title: 'Alert Details Saved',
            description: 'Alert Details have been saved successfully',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
          queryClient.invalidateQueries('alert-details')
        },
  
        onError(error: any) {
          toast({
            title: 'Alert Details',
            description: (error.title as string) ?? 'Unable to save alert details.',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        },
      },
    )
  }
  