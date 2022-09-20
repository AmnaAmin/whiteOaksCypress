import { Box, Button, Checkbox, FormControl, FormErrorMessage, HStack, Input, Text, useToast } from '@chakra-ui/react'
import { STATUS } from 'features/common/status'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useState, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import { MdOutlineCancel } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { BiUpload } from 'react-icons/bi'
import { WORK_ORDER } from '../workOrder.i18n'
import { dateFormat } from 'utils/date-time-utils'
import autoTable from 'jspdf-autotable'
import { currencyFormatter } from 'utils/string-formatters'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import round from 'lodash/round'

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
  document?: any
  vendorAmount?: number | null
  profit?: number | null
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

export const useRemainingLineItems = (swoProjectId?: string | number | null) => {
  const client = useClient(swoPrefix)

  const { data: remainingItems, ...rest } = useQuery<any>(
    ['remainingItems', swoProjectId],
    async () => {
      const response = await client(
        `line-items?isAssigned.equals=false&projectId.equals=${swoProjectId}&size=5000&sort=modifiedDate,desc&page=0`,
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

      if (!response?.data[0] || (response?.data?.length > 0 && response?.data[0]?.status === 'COMPLETED')) {
        setRefetchInterval(0)
      }
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
  refetchLineItems?: boolean
}

export const useAssignLineItems = (props: AssignArgumentType) => {
  const { swoProjectId, showToast, refetchLineItems } = props
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
        if (refetchLineItems) {
          queryClient.invalidateQueries(['remainingItems', swoProjectId])
        }
        if (showToast) {
          toast({
            title: 'Line Items Assignment',
            description: 'Line Items updated successfully.',
            status: 'success',
            isClosable: true,
            position: 'top-left',
          })
        }
      },
      onError(error: any) {
        toast({
          title: 'Assigned Line Items',
          description: (error.title as string) ?? 'Unable to update line items.',
          status: 'error',
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

type CreateArgumentType = {
  swoProject: SWOProject
  showToast?: boolean
  refetchLineItems?: boolean
}

export const useCreateLineItem = (props: CreateArgumentType) => {
  const { swoProject, showToast, refetchLineItems } = props
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
        if (refetchLineItems) {
          queryClient.invalidateQueries(['remainingItems', swoProject.id])
        }
        if (showToast) {
          toast({
            title: 'Line Items Assignment',
            description: 'Line Items updated successfully.',
            status: 'success',
            isClosable: true,
            position: 'top-left',
          })
        }
      },
      onError(error: any) {
        toast({
          title: 'Assigned Line Items',
          description: (error.title as string) ?? 'Unable to update line items.',
          status: 'error',
          isClosable: true,
          position: 'top-left',
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
          position: 'top-left',
        })
      },
      onError(error: any) {
        toast({
          title: 'Assigned Items',
          description: 'Unable to delete Line Items',
          status: 'error',
          isClosable: true,
          position: 'top-left',
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
          position: 'top-left',
        })
      },
    },
  )
}

export const useAllowLineItemsAssignment = ({ workOrder, swoProject }) => {
  // commenting this out but this condition will be used in upcoming stories.
  //const activePastDue = [STATUS.Active, STATUS.PastDue].includes(workOrder?.statusLabel?.toLocaleLowerCase() as STATUS)
  const isAssignmentAllowed = !workOrder && swoProject?.status?.toUpperCase() === 'COMPLETED'
  return { isAssignmentAllowed }
}

export const calculateVendorAmount = (amount, percentage) => {
  return round(amount - amount * (percentage / 100), 2)
}

export const calculateProfit = (clientAmount, vendorAmount) => {
  return round(((clientAmount - vendorAmount) / clientAmount) * 100, 2)
}
/* map to remaining when user unassigns using Unassign Line Item action */

export const mapToRemainingItems = item => {
  return {
    ...item,
    unitPrice: item?.price,
    totalPrice: Number(item?.price) * Number(item?.quantity),
  }
}

/* map to assigned items when user assigns using save on remaining items modal */

export const mapToLineItems = (item, watchPercentage?) => {
  const amount = item.unitPrice * item.quantity
  const percentage = watchPercentage
  return {
    ...item,
    isVerified: false,
    isCompleted: false,
    price: item.unitPrice,
    document: null,
    profit: percentage,
    clientAmount: amount,
    vendorAmount: calculateVendorAmount(amount, percentage),
  }
}

/* mapping when line item in unassigned and saved. Any changes made to line item will also be saved in swo */
export const mapToUnAssignItem = item => {
  return {
    ...item,
    unitPrice: item?.price,
    id: item.smartLineItemId,
    isAssigned: false,
    totalPrice: Number(item?.price) * Number(item?.quantity),
  }
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
  onChange?: (e, index) => void
  selectedCell: string
  setSelectedCell: (e) => void
  allowEdit?: boolean
}

export const EditableField = (props: EditableCellType) => {
  const {
    index,
    fieldName,
    formControl,
    inputType,
    valueFormatter,
    fieldArray,
    updatedItems,
    setUpdatedItems,
    onChange,
    selectedCell,
    setSelectedCell,
    allowEdit,
  } = props
  const { getValues, setValue } = formControl
  const values = getValues()
  return (
    <>
      {values?.[fieldArray]?.length > 0 && (
        <>
          {selectedCell !== index + '-' + fieldName ? (
            <Box
              minH={'20px'}
              cursor={'pointer'}
              onClick={() => {
                if (allowEdit) {
                  setSelectedCell(index + '-' + fieldName)
                }
              }}
            >
              {valueFormatter
                ? valueFormatter(values?.[fieldArray][index]?.[fieldName])
                : values?.[fieldArray][index]?.[fieldName]}
            </Box>
          ) : (
            <Input
              key={fieldName + '.' + index}
              size="sm"
              id="sku"
              type={inputType ?? 'text'}
              defaultValue={values?.[fieldArray][index]?.[fieldName]}
              onChange={e => {
                if (setUpdatedItems && updatedItems && !updatedItems?.includes(values?.[fieldArray][index]?.id)) {
                  setUpdatedItems([...updatedItems, values?.[fieldArray][index]?.id])
                }
              }}
              onBlur={e => {
                if (e.target.value !== '') setValue(`${fieldArray}.${index}.${fieldName}`, e.target.value)
                setSelectedCell('')

                if (onChange) {
                  onChange(e, index)
                }
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
  formControl: UseFormReturn<any>
  fieldArray: string
  inputType?: string
  onChange?: (e, index) => void
}
export const InputField = (props: InputFieldType) => {
  const { index, fieldName, formControl, fieldArray, onChange: handleChange, inputType = 'text' } = props
  const {
    formState: { errors },
    control,
  } = formControl
  return (
    <>
      <FormControl isInvalid={errors?.[fieldArray] && !!errors?.[fieldArray][index]?.[fieldName]?.message}>
        <Controller
          control={control}
          name={`${fieldArray}.${index}.${fieldName}`}
          rules={{ required: 'This is required' }}
          render={({ field, fieldState }) => (
            <Input
              key={[fieldName] + '.' + [index]}
              size="sm"
              type={inputType}
              value={field.value}
              onChange={e => {
                field.onChange(e.target.value)
              }}
              onBlur={e => {
                if (handleChange) handleChange(e, index)
              }}
            ></Input>
          )}
        ></Controller>
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

export const UploadImage: React.FC<{ label; onClear; onChange; value }> = ({ label, onChange, onClear, value }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const onFileChange = event => {
    const file = event.currentTarget.files?.[0]
    onChange?.(file)
    event.target.value = null
  }

  const onFileClear = event => {
    event.stopPropagation()
    onClear?.()
  }

  return (
    <Box>
      <input ref={inputRef} type="file" style={{ display: 'none', color: 'red' }} onChange={onFileChange} />
      {!value ? (
        <Button
          minW={'auto'}
          size="sm"
          onClick={() => inputRef?.current?.click()}
          colorScheme="brand"
          variant="outline"
          leftIcon={<BiUpload color="#4E87F8" />}
          display="flex"
        >
          {t(`${WORK_ORDER}.${label}`)}
        </Button>
      ) : (
        <Box color="barColor.100" border="1px solid #4E87F8" borderRadius="4px" fontSize="14px">
          <HStack spacing="5px" h="31px" padding="10px" align="center">
            <Text as="span" maxW="120px" isTruncated title="something">
              {value}
            </Text>
            <MdOutlineCancel cursor="pointer" onClick={onFileClear} />
          </HStack>
        </Box>
      )}
    </Box>
  )
}

export const createInvoicePdf = ({ doc, workOrder, projectData, assignedItems, hideAward }) => {
  const invoiceInfo = [
    { label: 'Property Address:', value: workOrder?.propertyAddress },
    { label: 'Start Date:', value: workOrder?.workOrderStartDate },
    { label: 'Completion Date:', value: workOrder?.workOrderDateCompleted },
    { label: 'Lock Box Code:', value: projectData?.lockBoxCode },
  ]
  const totalAward = assignedItems?.reduce(
    (partialSum, a) => partialSum + Number(a?.price ?? 0) * Number(a?.quantity ?? 0),
    0,
  )
  const basicFont = undefined
  const heading = 'Work Order'
  doc.setFontSize(16)
  doc.setFont(basicFont, 'bold')
  const xHeading = (doc.internal.pageSize.getWidth() - doc.getTextWidth(heading)) / 2
  doc.text(heading, xHeading, 35)
  var img = new Image()
  img.src = '/vendorportal/wo-logo.png'
  img.onload = function () {
    doc.addImage(img, 'png', 160, 5, 35, 35)
    doc.setFontSize(10)
    doc.setFont(basicFont, 'normal')
    const x = 15
    let y = 50
    const length = 115
    const width = 10
    invoiceInfo.forEach(inv => {
      doc.rect(x, y, length, width, 'D')
      doc.text(inv.label, x + 5, y + 7)
      doc.text(
        inv.label === 'Start Date:' || inv.label === 'Completion Date:' ? dateFormat(inv.value) || '' : inv.value,
        x + 45,
        y + 7,
      )
      y = y + 10
    })
    doc.rect(x + length, 50, 65, width, 'D')
    doc.text('Square Feet:', x + length + 5, 55)
    doc.rect(x + length, 60, 65, width, 'D')
    doc.text('Work Type:', x + length + 5, 65)
    doc.text(workOrder.skillName, x + length + 30, 65)

    doc.rect(x, y + 15, length, width, 'D')
    doc.text('Sub Contractor: ' + workOrder.companyName, x + 5, y + 22)
    doc.rect(x + length, y + 15, 65, width, 'D')
    doc.text('Total: ' + currencyFormatter(workOrder?.finalInvoiceAmount), x + length + 5, y + 22)

    autoTable(doc, {
      startY: y + 40,
      headStyles: { fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.1 },
      theme: 'grid',
      bodyStyles: { lineColor: '#000000', minCellHeight: 15 },
      body: [
        ...assignedItems.map(ai => {
          return {
            id: ai.id,
            sku: ai.sku,
            description: ai.description,
            quantity: ai.quantity,
          }
        }),
      ],
      columnStyles: {
        sku: { cellWidth: 40 },
        description: { cellWidth: 100 },
        quantity: { cellWidth: 40 },
      },
      columns: [
        { header: 'SKU', dataKey: 'sku' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Quantity', dataKey: 'quantity' },
      ],
    })
    doc.setFontSize(10)
    doc.setFont(basicFont, 'normal')
    const tableEndsY = doc.lastAutoTable.finalY
    const summaryX = doc.internal.pageSize.getWidth() - 90 /* Starting x point of invoice summary  */
    if (!hideAward) {
      doc.setDrawColor(0, 0, 0)
      doc.rect(summaryX - 5, tableEndsY, 79, 10, 'D')
      doc.text('Total Award: ' + currencyFormatter(totalAward), summaryX, tableEndsY + 7)
    }
    doc.save('Assigned Line Items.pdf')
  }
}

// !workOrder is a check for new work order modal.
// In case of edit, workorder will be a non-nullable object.
// In case of new work order, it will be null

export const useColumnsShowDecision = ({ workOrder }) => {
  const { isVendor } = useUserRolesSelector()
  const showEditablePrice = !isVendor && !workOrder // Price is editable for non-vendor on new work order modal
  const showReadOnlyPrice = (isVendor && !!workOrder?.showPricing) || (!isVendor && workOrder) //price is readonly for vendor and will only show if showPricing is true. Currrently price is also readonly for non-vendor in edit work modal.
  const showVerification = !isVendor && workOrder
  return {
    showSelect: !isVendor && !workOrder,
    showEditablePrice: showEditablePrice,
    showReadOnlyPrice: showReadOnlyPrice,
    showStatus: !!workOrder,
    showImages: !!workOrder,
    showVerification: showVerification,
  }
}

export const useActionsShowDecision = ({ workOrder }) => {
  const { isVendor } = useUserRolesSelector()

  return {
    showPriceCheckBox: !isVendor,
    showMarkAllIsVerified: !isVendor && workOrder,
    showMarkAllIsComplete: isVendor,
    showVerification: !!workOrder,
  }
}

export const useFieldEnableDecision = ({ workOrder }) => {
  const formattedStatus = workOrder?.statusLabel?.toLocaleLowerCase()
  const statusEnabled = [STATUS.Active, STATUS.PastDue].includes(formattedStatus as STATUS)
  const verificationEnabled = [STATUS.Active, STATUS.PastDue].includes(formattedStatus as STATUS)

  return {
    statusEnabled: statusEnabled,
    verificationEnabled: verificationEnabled,
  }
}
