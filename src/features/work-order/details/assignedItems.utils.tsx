import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { STATUS } from 'features/common/status'
import { Controller, UseFormReturn, useWatch } from 'react-hook-form'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import { MdOutlineCancel } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { BiDownload, BiUpload, BiXCircle } from 'react-icons/bi'
import { WORK_ORDER } from '../workOrder.i18n'
import { dateFormat } from 'utils/date-time-utils'
import autoTable from 'jspdf-autotable'
import { currencyFormatter } from 'utils/string-formatters'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import round from 'lodash/round'
import { isValidAndNonEmpty } from 'utils'
import { CgPlayListRemove } from 'react-icons/cg'
import { CustomCheckBox } from './assigned-items'
import { readFileContent } from 'api/vendor-details'

const swoPrefix = '/smartwo/api'

export type LineItems = {
  id?: number | string | null
  sku: string
  productName: string
  details?: string
  description?: string
  price?: string | number | null
  unitPrice?: string | number | null
  quantity: number | string | null
  totalPrice?: string | number | null
  isAssigned?: boolean
  projectId?: string | number | null
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
  smartLineItemId?: string | number | null
  source?: string
  isVerified?: boolean
  isCompleted?: boolean
  action?: string
  document?: any
  vendorAmount?: number | null
  profit?: number | null
  location?: string | null
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

export type selectedCell = { id: string; value: string }

export const getRemovedItems = (formValues, workOrderAssignedItems) => {
  /* checking which  smart work order items existed in workOrder but now are not present in the form. They have to unassigned*/
  const formAssignedItemsIds = formValues?.assignedItems?.map(s => s.id)
  const deletedItems = [...workOrderAssignedItems?.filter(items => !formAssignedItemsIds?.includes(items.id))]
  return deletedItems
}

export const getUnAssignedItems = (formValues, workOrderAssignedItems) => {
  /* checking which  smart work order items existed in workOrder but now are not present in the form. They have to unassigned*/
  const formAssignedItemsIds = formValues?.assignedItems?.map(s => s.smartLineItemId)
  const unAssignedItems = [
    ...workOrderAssignedItems?.filter(
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
        `line-items?isAssigned.equals=false&projectId.equals=${swoProjectId}&size=5000&sort=sortOrder,asc&page=0`,
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
      const response = await client(`projects/projectId/` + projectId, {})

      if (!response?.data || (response?.data && response?.data?.status === 'COMPLETED')) {
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
    swoProject,
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
  amount = Number(amount)
  percentage = Number(!percentage || percentage === '' ? 0 : percentage)
  return round(amount - amount * (percentage / 100), 2)
}

export const calculateProfit = (clientAmount, vendorAmount) => {
  if (clientAmount === 0 && vendorAmount === 0) return 0
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
    price: !item.unitPrice || item.unitPrice === '' ? '0' : item.unitPrice,
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
  selectedCell: selectedCell | null | undefined
  setSelectedCell: (e) => void
  allowEdit?: boolean
  autoFocus?: boolean
  setIsFocus?: (val) => void
  maxLength?: number
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
    autoFocus,
    setIsFocus,
    maxLength,
  } = props
  const { getValues, setValue, control } = formControl
  const values = getValues()
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (selectedCell?.id === index + '-' + fieldName) {
      inputRef?.current?.focus()
    }
  }, [selectedCell])

  const remainingItemsWatch = useWatch({ name: fieldArray, control })

  return (
    <>
      {values?.[fieldArray]?.length > 0 && (
        <>
          {selectedCell?.id !== index + '-' + fieldName ? (
            <Box
              minH={'20px'}
              minW={'100px'}
              cursor={allowEdit ? 'pointer' : 'default'}
              overflow="hidden"
              textOverflow={'ellipsis'}
              whiteSpace="nowrap"
              data-testid={`cell-` + index + '-' + fieldName}
              onClick={() => {
                if (allowEdit) {
                  setSelectedCell({ id: index + '-' + fieldName, value: remainingItemsWatch[index]?.[fieldName] })
                  setIsFocus?.(true)
                }
              }}
            >
              {valueFormatter && isValidAndNonEmpty(remainingItemsWatch[index]?.[fieldName])
                ? valueFormatter(remainingItemsWatch[index]?.[fieldName])
                : remainingItemsWatch[index]?.[fieldName]}
            </Box>
          ) : (
            <FormControl>
              <Controller
                control={control}
                name={`${fieldArray}.${index}.${fieldName}`}
                render={({ field, fieldState }) => (
                  <Input
                    maxLength={maxLength}
                    minW={'80px'}
                    data-testid={`editableField-` + index + '-' + fieldName}
                    key={[fieldName] + '.' + [index]}
                    size="sm"
                    type={inputType}
                    ref={inputRef}
                    value={field.value}
                    autoFocus={autoFocus}
                    onChange={e => {
                      field.onChange(e.target.value)
                      if (setUpdatedItems && updatedItems && !updatedItems?.includes(values?.[fieldArray][index]?.id)) {
                        setUpdatedItems([...updatedItems, values?.[fieldArray][index]?.id])
                      }
                      onChange?.(e, index)
                    }}
                    onBlur={e => {
                      setIsFocus?.(false)
                      setSelectedCell(null)
                      if (e.target.value === '') {
                        setValue(`${fieldArray}.${index}.${fieldName}`, selectedCell?.value)
                        onChange?.({ target: { value: selectedCell?.value } }, index)
                      }
                    }}
                    onFocus={() => {
                      setIsFocus?.(true)
                    }}
                  ></Input>
                )}
              ></Controller>
            </FormControl>
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
  autoFocus?: boolean
  setIsFocus?: (val) => void
  rules?: any
  maxLength?: number
}
export const InputField = (props: InputFieldType) => {
  const {
    index,
    fieldName,
    formControl,
    fieldArray,
    onChange: handleChange,
    inputType = 'text',
    autoFocus,
    setIsFocus,
    rules,
    maxLength,
  } = props
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
          rules={rules}
          render={({ field, fieldState }) => (
            <Input
              maxLength={maxLength}
              key={[fieldName] + '.' + [index]}
              size="sm"
              type={inputType}
              value={field.value}
              autoFocus={autoFocus}
              onChange={e => {
                field.onChange(e.target.value)
                handleChange?.(e, index)
              }}
              onBlur={e => {
                setIsFocus?.(false)
              }}
              onFocus={() => {
                setIsFocus?.(true)
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
      isChecked={selectedItems?.map(s => s.id)?.includes(row?.id)}
      onChange={e => {
        if (e.currentTarget?.checked) {
          if (!selectedItems?.map(s => s.id).includes(row?.id)) {
            setSelectedItems([...selectedItems, row])
          }
        } else {
          setSelectedItems([...selectedItems.filter(s => s.id !== row?.id)])
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
            <Text as="span" maxW="100px" isTruncated title="something">
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
  const workOrderInfo = [
    { label: 'Start Date:', value: workOrder?.workOrderStartDate ?? '' },
    { label: 'Expected Completion:', value: workOrder?.workOrderExpectedCompletionDate ?? '' },
    { label: 'Lock Box Code:', value: projectData?.lockBoxCode ?? '' },
    { label: 'Gate Code:', value: projectData?.gateCode ?? '' },
  ]
  /* commenting because of unclear requirements 
  const totalAward = assignedItems?.reduce(
    (partialSum, a) => partialSum + Number(a?.price ?? 0) * Number(a?.quantity ?? 0),
    0,
  ) */
  const basicFont = undefined
  const summaryFont = 'Times-Roman'
  const heading = 'Work Order # ' + workOrder?.id
  const startx = 15
  doc.setFontSize(16)
  doc.setFont(basicFont, 'bold')
  doc.text(heading, startx, 20)
  var img = new Image()
  img.src = '/vendorportal/wo-logo.png'
  img.onload = function () {
    doc.addImage(img, 'png', 160, 5, 35, 35)

    doc.setFontSize(11)
    doc.setFont(summaryFont, 'bold')
    doc.text('Property Address:', startx, 55)
    doc.setFont(summaryFont, 'normal')
    doc.text(projectData?.streetAddress ?? '', startx, 60)
    doc.text(projectData?.market + ' ' + projectData?.state + ' , ' + projectData?.zipCode, startx, 65)

    doc.setFont(summaryFont, 'bold')
    const centerTextX = 75
    doc.text('FPM:', centerTextX, 55)
    doc.setFont(summaryFont, 'normal')
    doc.text(projectData?.projectManager ?? '', centerTextX + 15, 55)
    doc.setFont(summaryFont, 'bold')
    doc.text('Contact:', centerTextX, 60)
    doc.setFont(summaryFont, 'normal')
    doc.text(projectData?.projectManagerPhoneNumber ?? '', centerTextX + 15, 60)

    const x = 130
    let y = 50

    workOrderInfo.forEach(inv => {
      doc.setFont(summaryFont, 'bold')
      doc.text(inv.label, x + 5, y + 5)
      doc.setFont(summaryFont, 'normal')
      doc.text(
        inv.label === 'Start Date:' || inv.label === 'Expected Completion:' ? dateFormat(inv.value) || '' : inv.value,
        x + 45,
        y + 5,
      )
      y = y + 5
    })

    doc.setFont(summaryFont, 'bold')
    doc.text('Work Type:', startx, y + 20)
    doc.setFont(summaryFont, 'normal')
    doc.text(workOrder?.skillName ?? '', startx + 30, y + 20)
    doc.setFont(summaryFont, 'bold')
    doc.text('Sub Contractor:', startx, y + 25)
    doc.setFont(summaryFont, 'normal')
    doc.text(workOrder.companyName ?? '', startx + 30, y + 25)
    doc.setFont(summaryFont, 'bold')
    doc.text('Total:', x + 5, y + 25)
    doc.setFont(summaryFont, 'normal')
    doc.text(currencyFormatter(workOrder?.finalInvoiceAmount ?? 0), x + 45, y + 25)

    autoTable(doc, {
      startY: y + 35,
      headStyles: { fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.1 },
      theme: 'grid',
      bodyStyles: { lineColor: '#000000', minCellHeight: 15 },
      body: [
        ...assignedItems.map(ai => {
          return {
            id: ai.id,
            location: ai.location,
            sku: ai.sku,
            productName: ai.productName,
            description: ai.description,
            quantity: ai.quantity,
          }
        }),
      ],
      columnStyles: {
        location: { cellWidth: 30 },
        sku: { cellWidth: 30 },
        productName: { cellWidth: 40 },
        description: { cellWidth: 50 },
        quantity: { cellWidth: 30 },
      },
      columns: [
        { header: 'Location', dataKey: 'location' },
        { header: 'SKU', dataKey: 'sku' },
        { header: 'Product Name', dataKey: 'productName' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Quantity', dataKey: 'quantity' },
      ],
    })
    doc.setFontSize(10)
    doc.setFont(basicFont, 'normal')
    doc.save('Assigned Line Items.pdf')
  }
}

// !workOrder is a check for new work order modal.
// In case of edit, workorder will be a non-nullable object.
// In case of new work order, it will be null

export const useColumnsShowDecision = ({ workOrder }) => {
  const { isVendor } = useUserRolesSelector()
  const showEditablePrices = !isVendor && !workOrder // Price is editable for non-vendor on new work order modal
  const showReadOnlyPrices = !isVendor && workOrder //price is readonly for vendor and will only show if showPricing is true. Currrently price is also readonly for non-vendor in edit work modal.
  const showVendorPrice = isVendor && workOrder.showPricing
  const showVerification = !isVendor && workOrder
  return {
    showSelect: !isVendor && !workOrder,
    showEditablePrices,
    showReadOnlyPrices,
    showStatus: !!workOrder,
    showImages: !!workOrder,
    showVerification,
    showVendorPrice,
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

const requiredStyle = {
  color: 'red.500',
  fontWeight: 800,
  fontSize: '18px',
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

const setColumnsByConditions = (columns, workOrder, isVendor) => {
  if (workOrder) {
    columns = columns.filter(c => !['assigned'].includes(c.accessorKey))
    if (isVendor) {
      if (workOrder.showPricing) {
        columns = columns.filter(
          c => !['price', 'profit', 'clientAmount', 'vendorAmount', 'isVerified'].includes(c.accessorKey),
        )
      } else {
        columns = columns.filter(c => !['price', 'profit', 'clientAmount', 'isVerified'].includes(c.accessorKey))
      }
    }
  } else {
    columns = columns.filter(c => !['isCompleted', 'isVerified', 'images'].includes(c.accessorKey))
  }
  return columns
}

export const useGetLineItemsColumn = ({
  unassignedItems,
  setUnAssignedItems,
  formControl,
  allowEdit,
  assignedItemsArray,
  workOrder,
}) => {
  const [selectedCell, setSelectedCell] = useState<selectedCell | null>(null)
  const { t } = useTranslation()
  const { fields: assignedItems, remove: removeAssigned } = assignedItemsArray
  const { setValue, getValues, watch, control } = formControl
  const values = getValues()
  const watchFieldArray = watch('assignedItems')
  const { isVendor } = useUserRolesSelector()
  const { statusEnabled, verificationEnabled } = useFieldEnableDecision({ workOrder })
  const controlledAssignedItems = assignedItems.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })

  const handleItemQtyChange = useCallback(
    (e, index) => {
      const price = Number(controlledAssignedItems?.[index]?.price ?? 0)
      const profit = Number(controlledAssignedItems?.[index]?.profit ?? 0)
      const newQuantity = Number(e.target.value)
      const vendorAmount = calculateVendorAmount(price * newQuantity, profit)
      setValue(`assignedItems.${index}.clientAmount`, price * newQuantity)
      setValue(`assignedItems.${index}.vendorAmount`, vendorAmount)
    },
    [controlledAssignedItems],
  )
  const handleItemPriceChange = useCallback(
    (e, index) => {
      const newPrice = Number(e.target.value ?? 0)
      const profit = Number(controlledAssignedItems?.[index]?.profit ?? 0)
      const quantity = Number(controlledAssignedItems?.[index]?.quantity ?? 0)
      const vendorAmount = calculateVendorAmount(newPrice * quantity, profit)
      setValue(`assignedItems.${index}.clientAmount`, newPrice * quantity)
      setValue(`assignedItems.${index}.vendorAmount`, vendorAmount)
    },
    [controlledAssignedItems],
  )

  const handleItemProfitChange = useCallback(
    (e, index) => {
      const newProfit = e.target.value ?? 0
      const clientAmount = Number(controlledAssignedItems?.[index]?.clientAmount ?? 0)
      const vendorAmount = calculateVendorAmount(clientAmount, newProfit)
      setValue(`assignedItems.${index}.vendorAmount`, vendorAmount)
    },
    [controlledAssignedItems],
  )

  const handleItemVendorAmountChange = useCallback(
    (e, index) => {
      const vendorAmount = e.target.value ?? 0
      const clientAmount = Number(controlledAssignedItems?.[index]?.clientAmount ?? 0)
      const profit = calculateProfit(clientAmount, vendorAmount)
      setValue(`assignedItems.${index}.profit`, profit)
    },
    [controlledAssignedItems],
  )

  const onFileChange = async file => {
    const fileContents = await readFileContent(file)
    const documentFile = {
      fileObjectContentType: file?.type,
      fileType: file?.name,
      fileObject: fileContents ?? '',
      documentType: 39,
    }
    return documentFile
  }

  const downloadDocument = (link, text) => {
    return (
      <a href={link} target="_blank" rel="noreferrer" download style={{ marginTop: '5px', color: '#4E87F8' }}>
        <HStack>
          <Icon as={BiDownload} size="sm" />
          <Text fontSize="12px" fontStyle="normal" maxW="100px" isTruncated>
            {text}
          </Text>
        </HStack>
      </a>
    )
  }

  let columns = [
    {
      header: () => {
        return (
          <Icon
            as={CgPlayListRemove}
            boxSize={7}
            color="brand.300"
            title="UnAssign All"
            onClick={() => {
              if (setUnAssignedItems && unassignedItems) {
                setUnAssignedItems([
                  ...values.assignedItems?.map(i => {
                    return mapToRemainingItems(i)
                  }),
                  ...unassignedItems,
                ])
                removeAssigned()
              }
            }}
            cursor="pointer"
          ></Icon>
        )
      },
      size: 80,
      enableSorting: false,
      accessorKey: 'assigned',
      cell: ({ row }) => {
        const index = row?.index
        return (
          <Box paddingLeft={'6px'}>
            <Icon
              as={BiXCircle}
              boxSize={5}
              color="brand.300"
              onClick={() => {
                if (setUnAssignedItems && unassignedItems) {
                  setUnAssignedItems([{ ...mapToRemainingItems(values?.assignedItems[index]) }, ...unassignedItems])
                  removeAssigned(index)
                }
              }}
              cursor="pointer"
            ></Icon>
          </Box>
        )
      },
    },
    {
      header: `${WORK_ORDER}.location`,
      accessorKey: 'location',
      cell: ({ row }) => {
        const index = row?.index
        return (
          <Box>
            <EditableField
              index={index}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              fieldName="location"
              fieldArray="assignedItems"
              formControl={formControl}
              inputType="text"
              allowEdit={allowEdit}
            />
          </Box>
        )
      },
    },
    {
      header: `${WORK_ORDER}.sku`,
      accessorKey: 'sku',
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <Box>
            <EditableField
              index={index}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              fieldName="sku"
              fieldArray="assignedItems"
              formControl={formControl}
              inputType="text"
              allowEdit={allowEdit}
            />
          </Box>
        )
      },
    },
    {
      header: `${WORK_ORDER}.productName`,
      accessorKey: 'productName',
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <Box>
            <EditableField
              index={index}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              fieldName="productName"
              fieldArray="assignedItems"
              formControl={formControl}
              inputType="text"
              allowEdit={allowEdit}
            />
          </Box>
        )
      },
      size: 200,
    },
    {
      header: () => {
        return (
          <>
            {!isVendor && !workOrder && (
              <Box as="span" sx={requiredStyle}>
                *
              </Box>
            )}
            {t(`${WORK_ORDER}.details`)}
          </>
        )
      },
      accessorKey: 'description',
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <Box>
            <EditableField
              index={index}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              fieldName="description"
              fieldArray="assignedItems"
              formControl={formControl}
              inputType="text"
              allowEdit={allowEdit}
            />
          </Box>
        )
      },
      size: 250,
    },
    {
      header: () => {
        return (
          <>
            {!isVendor && !workOrder && (
              <Box as="span" sx={requiredStyle}>
                *
              </Box>
            )}
            {t(`${WORK_ORDER}.quantity`)}
          </>
        )
      },
      size: 100,
      accessorKey: 'quantity',
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <Box>
            <EditableField
              index={index}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              fieldName="quantity"
              fieldArray="assignedItems"
              formControl={formControl}
              inputType="text"
              allowEdit={allowEdit}
              onChange={e => {
                handleItemQtyChange(e, index)
              }}
            />
          </Box>
        )
      },
    },
    {
      header: () => {
        return (
          <>
            {!isVendor && !workOrder && (
              <Box as="span" sx={requiredStyle}>
                *
              </Box>
            )}
            {t(`${WORK_ORDER}.price`)}
          </>
        )
      },
      size: 100,
      accessorKey: 'price',
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <Box>
            <EditableField
              index={index}
              fieldName="price"
              formControl={formControl}
              inputType="number"
              fieldArray="assignedItems"
              valueFormatter={currencyFormatter}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              allowEdit={allowEdit}
              onChange={e => {
                handleItemPriceChange(e, index)
              }}
            />
          </Box>
        )
      },
    },
    {
      header: `${WORK_ORDER}.clientAmount`,
      accessorKey: 'clientAmount',
      size: 150,
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <EditableField
            index={index}
            fieldName="clientAmount"
            formControl={formControl}
            inputType="number"
            fieldArray="assignedItems"
            valueFormatter={currencyFormatter}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            allowEdit={false}
          ></EditableField>
        )
      },
    },
    {
      header: `${WORK_ORDER}.profit`,
      accessorKey: 'profit',
      size: 100,
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <Box>
            <EditableField
              index={index}
              fieldName="profit"
              formControl={formControl}
              inputType="number"
              fieldArray="assignedItems"
              valueFormatter={val => {
                if (val !== null && val !== '') return val + '%'
                else return val
              }}
              onChange={e => {
                handleItemProfitChange(e, index)
              }}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              allowEdit={allowEdit}
            />
          </Box>
        )
      },
    },
    {
      header: () => {
        if (!isVendor) {
          return <>{t(`${WORK_ORDER}.vendorAmount`)}</>
        } else {
          return <>{t(`${WORK_ORDER}.amount`)}</>
        }
      },
      accessorKey: 'vendorAmount',
      size: 160,
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <Box>
            <EditableField
              index={index}
              fieldName="vendorAmount"
              formControl={formControl}
              inputType="number"
              fieldArray="assignedItems"
              valueFormatter={currencyFormatter}
              onChange={e => {
                handleItemVendorAmountChange(e, index)
              }}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              allowEdit={allowEdit}
            />
          </Box>
        )
      },
    },
    {
      header: `${WORK_ORDER}.status`,
      accessorKey: 'isCompleted',
      enableSorting: false,
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <HStack justifyContent={'center'} h="50px">
            <Controller
              control={control}
              name={`assignedItems.${index}.isCompleted`}
              render={({ field, fieldState }) => (
                <CustomCheckBox
                  text="Completed"
                  isChecked={field.value}
                  disabled={!statusEnabled}
                  onChange={e => {
                    if (!e.target.checked) {
                      setValue(`assignedItems.${index}.isVerified`, false)
                    }
                    field.onChange(e.currentTarget.checked)
                  }}
                ></CustomCheckBox>
              )}
            ></Controller>
          </HStack>
        )
      },
    },
    {
      header: `${WORK_ORDER}.images`,
      accessorKey: 'images',
      enableSorting: false,
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <Controller
            name={`assignedItems.${index}.uploadedDoc`}
            control={control}
            render={({ field, fieldState }) => {
              return (
                <VStack gap="1px">
                  <Box>
                    <UploadImage
                      label={`upload`}
                      value={field?.value?.fileType}
                      onChange={async (file: any) => {
                        const document = await onFileChange(file)
                        field.onChange(document)
                      }}
                      onClear={() => setValue(field.name, null)}
                    ></UploadImage>
                  </Box>

                  {assignedItems[index]?.document?.s3Url && (
                    <Box>
                      {downloadDocument(
                        values.assignedItems[index]?.document?.s3Url,
                        values.assignedItems[index]?.document?.fileType,
                      )}
                    </Box>
                  )}
                </VStack>
              )
            }}
          />
        )
      },
    },
    {
      header: `${WORK_ORDER}.verification`,
      accessorKey: 'isVerified',
      enableSorting: false,
      cell: cellInfo => {
        const index = cellInfo?.row?.index
        return (
          <HStack justifyContent={'center'} h="50px">
            <Controller
              control={control}
              name={`assignedItems.${index}.isVerified`}
              render={({ field, fieldState }) => (
                <CustomCheckBox
                  text="Verified"
                  disabled={!(values.assignedItems?.[index]?.isCompleted && verificationEnabled)}
                  isChecked={field.value}
                  onChange={e => {
                    field.onChange(e.currentTarget.checked)
                  }}
                ></CustomCheckBox>
              )}
            ></Controller>
          </HStack>
        )
      },
    },
  ]
  columns = setColumnsByConditions(columns, workOrder, isVendor)
  return columns
}
