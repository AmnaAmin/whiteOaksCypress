import { useQuery } from 'react-query'
import { AlertType, ATTRIBUTE_SELECTION_OPTIONS, BEHAVIOUR_SELECTION_OPTIONS, CATEGORY_OPTIONS, NOTIFY_OPTIONS, TYPE_SELECTION_OPTIONS } from 'types/alert.type'
import { useClient } from 'utils/auth-context'

export const useManagedAlert = () => {
  const client = useClient('/alert/api')

  return useQuery<AlertType[]>('GetProjectAlerts', async () => {
    const response = await client(`alert-definitions?cacheBuster=${new Date().valueOf()}`, {})
    console.log('response', response?.data)
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
