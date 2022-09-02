import { Box, Checkbox, FormControl, FormErrorMessage, Input, useToast } from '@chakra-ui/react'
import { STATUS } from 'features/common/status'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
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
  action?: string
}

export type SWOProject = {
  id: number | string
  projectId: number | string
  textractJobId: string
  status: string
  documentUrl: string
  createdBy: string
  createdDate: string
  modifiedBy: string
  modifiedDate: string
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
      const response = await client(
        `line-items?isAssigned.equals=false&projectId.equals=${swoProjectId}&size=5000&sort=id,asc&page=0`,
        {},
      )

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
  const [refetchInterval, setRefetchInterval] = useState(15000)

  const { data: swoProject, ...rest } = useQuery<any>(
    ['fetchProjectId', projectId],
    async () => {
      const response = await client(`projects?projectId.equals=` + projectId, {})
      if (response?.data?.length > 0 && response?.data[0]?.status === 'COMPLETED') setRefetchInterval(0)
      return response?.data
    },
    {
      enabled: !!projectId,
      refetchInterval: refetchInterval,
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
  const queryClient = useQueryClient()

  return useMutation(
    (lineItems: any) => {
      return client(`line-items/list?projectId.equals=${swoProjectId}`, {
        data: lineItems,
        method: 'PUT',
      })
    },
    {
      onSuccess(res: any) {
        queryClient.invalidateQueries(['remainingItems', swoProjectId])
        if (showToast) {
          toast({
            title: 'Line Items Assignment',
            description: 'Line Items updated successfully.',
            status: 'success',
            isClosable: true,
          })
        }
      },
      onError(error: any) {
        toast({
          title: 'Assigned Line Items',
          description: (error.title as string) ?? 'Unable to update line items.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useCreateLineItem = ({ swoProject, showToast }) => {
  const client = useClient(swoPrefix)
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (lineItems: any) => {
      return client(`line-items/${swoProject?.textractJobId}`, {
        data: lineItems,
        method: 'POST',
      })
    },
    {
      onSuccess(res: any) {
        queryClient.invalidateQueries(['remainingItems', swoProject])
        if (showToast) {
          toast({
            title: 'Line Items Assignment',
            description: 'Line Items updated successfully.',
            status: 'success',
            isClosable: true,
          })
        }
      },
      onError(error: any) {
        toast({
          title: 'Assigned Line Items',
          description: (error.title as string) ?? 'Unable to update line items.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useDeleteLineItems = swoProjectId => {
  const client = useClient(swoPrefix)
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: { itemIds: string }) => {
      return client('line-items?ids=' + payload.itemIds, {
        method: 'DELETE',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['remainingItems', swoProjectId])
        toast({
          title: 'Assigned Items',
          description: 'Item Deleted Successfully',
          status: 'success',
          isClosable: true,
        })
      },
      onError(error: any) {
        toast({
          title: 'Assigned Items',
          description: 'Unable to delete Line Items',
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

export const useAllowLineItemsAssignment = ({ workOrder, swoProject }) => {
  const activePastDue = [STATUS.Active, STATUS.PastDue].includes(workOrder?.statusLabel?.toLocaleLowerCase() as STATUS)
  const isAssignmentAllowed = (!workOrder || activePastDue) && swoProject?.status?.toUpperCase() === 'COMPLETED'
  return { isAssignmentAllowed }
}

export const PriceInput = props => {
  return <Input {...props} variant="outline" size="sm" />
}

type EditableCellType = {
  valueFormatter?: any
  index: number
  fieldName: string
  formControl: any
  inputType?: string
  fieldArray: string
  updatedItems?: number[]
  setUpdatedItems?: (items) => void
}

export const EditableField = (props: EditableCellType) => {
  const [selectedCell, setSelectedCell] = useState('')
  const { index, fieldName, formControl, inputType, valueFormatter, fieldArray, updatedItems, setUpdatedItems } = props
  const { getValues, setValue } = formControl
  const values = getValues()
  return (
    <>
      {values?.[fieldArray]?.length > 0 && (
        <>
          {selectedCell !== index + '-' + fieldName ? (
            <Box
              minW={'100px'}
              minH={'20px'}
              cursor={'pointer'}
              onClick={() => {
                setSelectedCell(index + '-' + fieldName)
              }}
            >
              {valueFormatter
                ? valueFormatter(values?.[fieldArray][index]?.[fieldName])
                : values?.[fieldArray][index]?.[fieldName]}
            </Box>
          ) : (
            <Input
              size="sm"
              id="sku"
              type={inputType ?? 'text'}
              defaultValue={values?.[fieldArray][index]?.[fieldName]}
              onChange={e => {
                if (setUpdatedItems && updatedItems && !updatedItems?.includes(values?.[fieldArray][index]?.id)) {
                  setUpdatedItems([...updatedItems, values?.[fieldArray][index]?.id])
                }
                if (e.target.value === '') {
                  setSelectedCell('')
                }
              }}
              onBlurCapture={e => {
                setValue(`${fieldArray}.${index}.${fieldName}`, e.target.value)
                setSelectedCell('')
              }}
            />
          )}
        </>
      )}
    </>
  )
}

type InputFieldType = {
  index: number
  fieldName: string
  formControl: any
  inputType?: string
  fieldArray: string
}
export const InputField = (props: InputFieldType) => {
  const { index, fieldName, formControl, inputType, fieldArray } = props
  const {
    formState: { errors },
    register,
  } = formControl
  return (
    <>
      <FormControl isInvalid={errors?.[fieldArray] && !!errors?.[fieldArray][index]?.[fieldName]?.message}>
        <Input
          size="sm"
          id="now"
          type={inputType ?? 'text'}
          {...register(`${fieldArray}.${index}.${fieldName}`, { required: 'This is required' })}
        />
        {errors?.remainingItems && (
          <FormErrorMessage>{errors?.[fieldArray][index]?.[fieldName]?.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  )
}

export const SelectCheckBox = ({ selectedItems, setSelectedItems, row }) => {
  return (
    <Checkbox
      isChecked={selectedItems?.map(s => s.id).includes(row.id)}
      onChange={e => {
        if (e.currentTarget?.checked) {
          if (!selectedItems?.map(s => s.id).includes(row.id)) {
            setSelectedItems([...selectedItems, row])
          }
        } else {
          setSelectedItems([...selectedItems.filter(s => s.id !== row.id)])
        }
      }}
    />
  )
}
