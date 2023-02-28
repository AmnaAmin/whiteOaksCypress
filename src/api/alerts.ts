import { useToast } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useWatch } from 'react-hook-form'
import _ from 'lodash'
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
import { useNavigate } from 'react-router-dom'
import { useFetchWorkOrder } from 'api/work-order'
import { useVendorEntity } from 'api/vendor-dashboard'
import { useClientEntity } from 'api/clients'
import { useFetchFPMEntity } from 'api/vendor-details'

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
  const categoryValue =
    CATEGORY_OPTIONS?.find(c => c?.label?.toLocaleLowerCase() === selectedAlert?.category?.toLocaleLowerCase()) ??
    CATEGORY_OPTIONS[1]
  const notifyValue = NOTIFY_OPTIONS?.find(n => n?.value === selectedAlert?.notify) ?? NOTIFY_OPTIONS[0]
  const typeSelectionValue = TYPE_SELECTION_OPTIONS?.find(
    t => t?.label?.toLocaleLowerCase() === selectedAlert?.typeSelection?.toLocaleLowerCase(),
  )
  const attributeSelections = getAttributeOptions(typeSelectionValue?.label)
  const attributeSelectionValue = attributeSelections?.find(
    a => a?.label?.toLocaleLowerCase() === selectedAlert?.attributeSelection?.toLocaleLowerCase(),
  )
  const behaviorSelections = getBehaviorOptions(attributeSelectionValue?.type)
  const behaviourSelectionValue = behaviorSelections?.find(
    b => b?.label?.toLocaleLowerCase() === selectedAlert?.behaviourSelection?.toLocaleLowerCase(),
  )
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

export const useFetchUserAlerts = (projectId?, accountLogin?) => {
  const client = useClient('/alert/api')
  const url = !projectId ? 'alert-histories' : `alert-histories/project/${projectId}`
  const { data: alerts, ...rest } = useQuery<AlertType[]>('GetProjectAlerts', async () => {
    const response = await client(url, {})
    return response?.data
  })
  const notifications = _.orderBy(
    alerts?.filter(a => a.login === accountLogin),
    [
      alert => {
        return alert?.webSockectRead
      },
      alert => {
        const createdDate = new Date(alert?.dateCreated as string)
        return createdDate
      },
    ],
    ['asc', 'desc'],
  )

  return {
    data: alerts,
    notifications,
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

export const useResolveAlerts = (hideToast?) => {
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
        if (!hideToast) {
          toast({
            title: 'Triggered Alerts',
            description: 'Alerts have been resolved',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        }

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

export const useUpdateAlert = (hideToast?) => {
  const client = useClient('/alert/api')
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    updatedAlert => {
      return client('alert-histories', {
        data: updatedAlert,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        if (!hideToast) {
          toast({
            title: 'Alerts',
            description: 'Alert has been updated.',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        }

        queryClient.invalidateQueries('GetProjectAlerts')
      },
      onError(error: any) {
        toast({
          title: 'Alerts',
          description: (error.title as string) ?? 'Unable to update alert.',
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

export const useHandleNavigation = selectedAlert => {
  const navigate = useNavigate()
  const [workOrderId, setWorkOrderId] = useState(undefined)
  const [vendorId, setVendorId] = useState(undefined)
  const [clientId, setClientId] = useState(undefined)
  const [fpmId, setFpmId] = useState(undefined)

  const { workOrderDetails: workOrder, isFetching: isFetchingWO } = useFetchWorkOrder({
    workOrderId: workOrderId,
  })
  const { data: vendor, isFetching: isFetchingVendor } = useVendorEntity(vendorId)
  const { data: client, isFetching: isFetchingClient } = useClientEntity(clientId)
  const { data: fpm, isFetching: isFetchingFpm } = useFetchFPMEntity(fpmId)

  useEffect(() => {
    if (workOrder?.id) {
      navigate(`/project-details/${workOrder.projectId}`, { state: { workOrder } })
    }
  }, [workOrder])

  useEffect(() => {
    if (vendor?.id) {
      navigate(`/vendors`, { state: { vendor } })
    }
  }, [vendor])

  useEffect(() => {
    if (client?.id) {
      navigate(`/clients`, { state: { client } })
    }
  }, [client])

  useEffect(() => {
    if (fpm?.[0]?.userId) {
      navigate(`/performance`, { state: { fpm } })
    }
  }, [fpm])

  useEffect(() => {
    switch (selectedAlert?.triggeredType) {
      case 'Project': {
        navigate(`/project-details/${selectedAlert?.triggeredId}`)
        break
      }
      case 'WorkOrder':
        if (workOrder?.id !== Number(selectedAlert?.triggeredId)) {
          setWorkOrderId(selectedAlert?.triggeredId)
        } else {
          navigate(`/project-details/${workOrder.projectId}`, { state: { workOrder } })
        }

        break
      case 'Vendor': {
        if (vendor?.id !== Number(selectedAlert?.triggeredId)) {
          setVendorId(selectedAlert?.triggeredId)
        } else {
          navigate(`/vendors`, { state: { vendor } })
        }
        break
      }
      case 'Client': {
        if (client?.id !== Number(selectedAlert?.triggeredId)) {
          setClientId(selectedAlert?.triggeredId)
        } else {
          navigate(`/clients`, { state: { client } })
        }
        break
      }
      case 'Performance': {
        if (fpm?.[0]?.userId !== Number(selectedAlert?.triggeredId)) {
          setFpmId(selectedAlert?.triggeredId)
        } else {
          navigate(`/performance`, { state: { fpm } })
        }
        break
      }
    }
  }, [selectedAlert])

  return {
    isLoading: isFetchingVendor || isFetchingClient || isFetchingWO || isFetchingFpm,
  }
}
