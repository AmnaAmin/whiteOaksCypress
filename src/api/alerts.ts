import { useToast } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  AlertType,
  behaviorOptionsForNumber,
  behaviorOptionsForString,
  CATEGORY_OPTIONS,
  clientAttributes,
  CONDTION,
  customBehaviorOptions,
  NOTIFY_OPTIONS,
  projectAttributes,
  projectStatus,
  quotaAttributes,
  transactionAttributes,
  transactionStatus,
  TYPE_SELECTION_OPTIONS,
  vendorAttributes,
  vendorStatus,
  workOrderAttributes,
  workOrderStatus,
} from 'types/alert.type'
import { useClient } from 'utils/auth-context'

export const useManagedAlert = () => {
  const client = useClient('/alert/api')

  return useQuery<AlertType[]>('alert-details', async () => {
    const response = await client(`alert-definitions?cacheBuster=${new Date().valueOf()}`, {})
    return response?.data
  })
}
export const getAttributeOptions = option => {
  let attributeOptions = [] as any
  switch (option) {
    case 'Project': {
      attributeOptions = projectAttributes
      break
    }
    case 'Vendor': {
      attributeOptions = vendorAttributes
      break
    }
    case 'Quota': {
      attributeOptions = quotaAttributes
      break
    }
    case 'Work Order': {
      attributeOptions = workOrderAttributes
      break
    }
    case 'Transaction': {
      attributeOptions = transactionAttributes
      break
    }
    case 'Client': {
      attributeOptions = clientAttributes
      break
    }
  }
  return attributeOptions
}

export const getBehaviorOptions = option => {
  let behaviorOptions = [] as any
  switch (option) {
    case 'string': {
      behaviorOptions = behaviorOptionsForString
      break
    }
    case 'number': {
      behaviorOptions = behaviorOptionsForNumber
      break
    }
    case 'custom': {
      behaviorOptions = customBehaviorOptions
      break
    }
  }
  return behaviorOptions
}

export const getCustomOptions = ({ type, attribute }) => {
  let customOptions = [] as any
  switch (type) {
    case 'Transaction': {
      if (attribute === 'Status') {
        return transactionStatus
      }
      break
    }
    case 'Vendor': {
      if (attribute === 'Status') {
        return vendorStatus
      }
      break
    }
    case 'Work Order': {
      if (attribute === 'Status') {
        return workOrderStatus
      }
      break
    }
    case 'Project': {
      if (attribute === 'Status') {
        return projectStatus
      }
      break
    }
  }
  return customOptions
}

export const alertDetailsDefaultValues = ({ selectedAlert }) => {
  const categoryValue = CATEGORY_OPTIONS?.find(c => c?.label === selectedAlert?.category)
  const notifyValue = NOTIFY_OPTIONS?.find(n => n?.value === selectedAlert?.notify) ?? NOTIFY_OPTIONS[0]
  const typeSelectionValue = TYPE_SELECTION_OPTIONS?.find(t => t?.label === selectedAlert?.typeSelection)
  const attributeSelections = getAttributeOptions(typeSelectionValue?.label)
  const attributeSelectionValue = attributeSelections?.find(a => a?.label === selectedAlert?.attributeSelection)
  const behaviorSelections = getBehaviorOptions(attributeSelectionValue?.type)
  const behaviourSelectionValue = behaviorSelections?.find(b => b?.label === selectedAlert?.behaviourSelection)
  const customSelections = getCustomOptions({
    type: typeSelectionValue?.label,
    attribute: attributeSelectionValue?.label,
  })
  const customSelectionValue =
    behaviourSelectionValue?.label === 'Equal To'
      ? customSelections?.find(b => b?.value === Number(selectedAlert?.customAttributeSelection))
      : selectedAlert?.customAttributeSelection
  const conditionSelection = CONDTION[0]?.label
  const defaultValues = {
    ...selectedAlert,
    category: categoryValue,
    notify: notifyValue,
    typeSelection: typeSelectionValue,
    attributeSelection: attributeSelectionValue,
    behaviourSelection: behaviourSelectionValue,
    customAttributeSelection: customSelectionValue,
    conditionSelection,
  }
  return defaultValues
}

export const useFetchUserAlerts = (projectId?) => {
  const client = useClient('/alert/api')
  const url = !projectId ? 'alert-histories' : `alert-histories/project/${projectId}`
  const { data: alerts, ...rest } = useQuery<AlertType[]>('GetProjectAlerts', async () => {
    const response = await client(url, {})

    return response?.data
  })
  return {
    data: alerts,
    ...rest,
  }
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

export const useResolveAlerts = () => {
  const client = useClient('/alert/api')
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (selectedAlerts: (number | string | undefined)[]) => {
      return client('alert-histories-resolve', {
        data: selectedAlerts,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Triggered Alerts',
          description: 'Alerts have been resolved',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })

        queryClient.invalidateQueries('GetProjectAlerts')
      },
      onError(error: any) {
        toast({
          title: 'Triggered Alerts',
          description: (error.title as string) ?? 'Unable to resolve alerts.',
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

export const useFieldRelatedDecisions = control => {
  const watchTitle = useWatch({ control, name: 'title' })
  const watchCategory = useWatch({ control, name: 'category' })
  const watchTypeSelection = useWatch({ control, name: 'typeSelection' })
  const watchAttributeSelection = useWatch({ control, name: 'attributeSelection' })
  const watchBehaviorSelection = useWatch({ control, name: 'behaviourSelection' })
  const watchCustomAttributeSelection = useWatch({ control, name: 'customAttributeSelection' })
  const showCustomSelect = watchAttributeSelection?.type === 'custom' && watchBehaviorSelection?.label === 'Equal To'
  const showCustomInput = ['Greater Than', 'Less Than'].includes(watchBehaviorSelection?.label as string)
  const disableNext =
    !watchTitle ||
    !watchCategory ||
    !watchTypeSelection ||
    !watchAttributeSelection ||
    !watchBehaviorSelection ||
    ((showCustomSelect || showCustomInput) && !watchCustomAttributeSelection)
  return { disableNext, showCustomSelect, showCustomInput }
}

export const useCreateMessageContentAndQuery = control => {
  const watchTypeSelection = useWatch({ control, name: 'typeSelection' })
  const watchAttributeSelection = useWatch({ control, name: 'attributeSelection' })
  const watchBehaviorSelection = useWatch({ control, name: 'behaviourSelection' })
  const watchCustomAttributeSelection = useWatch({ control, name: 'customAttributeSelection' })
  const isChange = watchBehaviorSelection?.label === 'Change'
  const isNumberBehavior = ['Greater Than', 'Less Than'].includes(watchBehaviorSelection?.label as string)
  const isCustomValue = watchAttributeSelection?.type === 'custom' && watchBehaviorSelection?.label === 'Equal To'

  const behaviourMap: { [x in string] } = {
    Change: '=',
    'Equal to': '=',
    'Greater Than': '>',
    'Less Than': '<',
  }

  const messageContent = useMemo(() => {
    const typeAndAttribute = 'When ' + watchTypeSelection?.label + ' ' + watchAttributeSelection?.label + ' '
    var behavior = ''
    if (isChange) {
      behavior = 'changes from old value to any new value.'
    } else if (isNumberBehavior) {
      behavior = 'is ' + watchBehaviorSelection?.label?.toLowerCase() + ' ' + watchCustomAttributeSelection + '.'
    } else if (isCustomValue) {
      behavior = 'equals to ' + (watchCustomAttributeSelection?.label ?? watchCustomAttributeSelection) + '.'
    }
    return typeAndAttribute + behavior
  }, [
    watchTypeSelection,
    watchAttributeSelection,
    watchBehaviorSelection,
    watchCustomAttributeSelection,
    isChange,
    isNumberBehavior,
    isCustomValue,
  ])

  const alertQuery = useMemo(() => {
    let query = ''
    const alias = watchTypeSelection?.label?.charAt(0)?.toLowerCase()
    query =
      'select count(*) from ' +
      watchTypeSelection?.label +
      ' ' +
      alias +
      ' where ' +
      alias +
      '.' +
      watchAttributeSelection?.value +
      ' ' +
      behaviourMap[watchBehaviorSelection?.label] +
      ':parameter'

    return query
  }, [watchTypeSelection, watchBehaviorSelection, watchAttributeSelection])
  return { messageContent, alertRuleQuery: alertQuery }
}
