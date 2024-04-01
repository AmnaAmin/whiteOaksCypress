import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { CreatableSelect } from 'components/form/react-select'

import { STATUS } from 'features/common/status'
import { Controller, UseFormReturn, useWatch } from 'react-hook-form'
import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClient } from 'utils/auth-context'
import { MdOutlineCancel } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { BiDownload, BiUpload, BiXCircle } from 'react-icons/bi'
import { WORK_ORDER } from '../workOrder.i18n'
import { dateFormat } from 'utils/date-time-utils'
import autoTable from 'jspdf-autotable'
import { currencyFormatter, validateAmountDigits } from 'utils/string-formatters'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import round from 'lodash/round'
import { isValidAndNonEmpty } from 'utils'
import { CgPlayListRemove } from 'react-icons/cg'
import { CustomCheckBox } from './assigned-items'
import { readFileContent } from 'api/vendor-details'
import { completePercentage } from './work-order-edit-tab'
import { completePercentageValues, newObjectFormatting } from 'api/work-order'
import { useLocation, usePaymentGroupVals } from 'api/location'
import { addImages } from 'utils/file-utils'
import { onChangeCheckbox, onChangeHeaderCheckbox } from './utils'
import { WORK_ORDER_AMOUNT_ROUND } from 'features/vendor/vendor-work-order/work-order.constants'

const swoPrefix = '/smartwo/api'

export const columnsCannotFilter = [
  'assigned',
  'location',
  'paymentGroup',
  'completePercentage',
  'isCompleted',
  'isVerified',
  'images',
  'checkbox',
]

export type LineItems = {
  id?: number | string | null
  completePercentage?: completePercentage | any // place "any" here type because completePercentage vary in lineItems payload
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
  location?: any
  paymentGroup?: any
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
  if (formValues?.cancel?.value === 35) {
    return workOrderAssignedItems
  }

  /* checking which  smart work order items existed in workOrder but now are not present in the form. They have to unassigned*/
  const formAssignedItemsIds = formValues?.assignedItems?.map(s => s.id)
  const deletedItems = [...workOrderAssignedItems?.filter(items => !formAssignedItemsIds?.includes(items.id))]
  return deletedItems
}

export const getUnAssignedItems = (formValues, workOrderAssignedItems) => {
  /* check if work order is being cancelled we should unassign all line items */
  if (formValues?.cancel?.value === 35 && formValues.assignedItems?.length > 0) {
    return formValues.assignedItems?.map(a => {
      return { ...a, location: a?.location?.label }
    })
  }
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
      const response = await client(`projects/projectId/` + projectId + `?portal=C`, {})

      if (!response?.data || (response?.data && ['COMPLETED', 'FAILED'].includes(response?.data?.status))) {
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

  const isAssignmentAllowed =
    (!workOrder || !workOrder?.visibleToVendor) && ['COMPLETED', 'FAILED'].includes(swoProject?.status?.toUpperCase())
  return { isAssignmentAllowed }
}

export const calculateVendorAmount = (amount, percentage) => {
  amount = Number(amount)
  percentage = Number(!percentage || percentage === '' ? 0 : percentage)
  return round(amount - amount * (percentage / 100), WORK_ORDER_AMOUNT_ROUND)
}

export const calculateProfit = (clientAmount, vendorAmount) => {
  if (clientAmount === 0 || isNaN(clientAmount)) return 0;
  if (clientAmount === 0 && vendorAmount === 0) return 0
  return round(((clientAmount - vendorAmount) / clientAmount) * 100, WORK_ORDER_AMOUNT_ROUND)
}
/* map to remaining when user unassigns using Unassign Line Item action */

export const mapToRemainingItems = item => {
  return {
    ...item,
    id: item.smartLineItemId ? item.smartLineItemId : item.id,
    unitPrice: item?.price,
    totalPrice: Number(item?.price) * Number(item?.quantity),
    location: item?.location?.label,
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
    paymentGroup: item?.paymentGroup?.label,
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
  onValueChange?: (e, index) => void
  selectedCell: selectedCell | null | undefined
  setSelectedCell: (e) => void
  allowEdit?: boolean
  maxLength?: number
  rules?: any
  errorSetFunc?: any
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
    rules,
    errorSetFunc,
    maxLength,
  } = props
  const {
    getValues,
    setValue,
    control,
    clearErrors,
    setError,
    trigger,
    formState: { errors },
  } = formControl
  const values = getValues()
  const remainingItemsWatch = useWatch({ name: fieldArray, control })

  return (
    <>
      {values?.[fieldArray]?.length > 0 && (
        <>
          {selectedCell?.id !== index + '-' + fieldName ? (
            <Box
              pl="3px"
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
                }
              }}
            >
              {valueFormatter && isValidAndNonEmpty(remainingItemsWatch[index]?.[fieldName])
                ? valueFormatter(remainingItemsWatch[index]?.[fieldName])
                : isValidAndNonEmpty(remainingItemsWatch[index]?.[fieldName])
                ? remainingItemsWatch[index]?.[fieldName]
                : '- - -'}
            </Box>
          ) : (
            <FormControl isInvalid={!!errors?.[`${fieldArray}`]?.[index]?.[`${fieldName}`]}>
              <Controller
                control={control}
                name={`${fieldArray}.${index}.${fieldName}`}
                rules={{ ...rules }}
                render={({ field, fieldState }) => (
                  <Input
                    maxLength={maxLength}
                    minW={'80px'}
                    data-testid={`editableField-` + index + '-' + fieldName}
                    key={[fieldName] + '.' + [index]}
                    size="sm"
                    type={inputType}
                    value={field.value}
                    onChange={e => {
                      field.onChange(e.target.value)
                      if (setUpdatedItems && updatedItems && !updatedItems?.includes(values?.[fieldArray][index]?.id)) {
                        setUpdatedItems([...updatedItems, values?.[fieldArray][index]?.id])
                      }
                      onChange?.(e, index)
                      // Custom validation
                      errorSetFunc?.(e, setError, clearErrors)
                      if (!errorSetFunc) {
                      trigger([`${fieldArray}.${index}.${fieldName}`])
                      }
                    }}
                    onBlur={e => {
                      setSelectedCell(null)
                      if (e.target.value === '') {
                        setValue(`${fieldArray}.${index}.${fieldName}`, selectedCell?.value)
                        onChange?.({ target: { value: selectedCell?.value } }, index)
                      }
                    }}
                  ></Input>
                )}
              ></Controller>
              {!!errors?.[`${fieldArray}`]?.[index]?.[`${fieldName}`] && (
                <FormErrorMessage data-testid={`${fieldArray}-${index}-${fieldName}`} >{errors?.[`${fieldArray}`]?.[index]?.[`${fieldName}`]?.message}</FormErrorMessage>
              )}
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
          render={({ field }) => (
            <Input
              maxLength={maxLength}
              key={[fieldName] + '.' + [index]}
              data-testid={`input-` + index + '-' + fieldName}
              size="sm"
              type={inputType}
              value={field.value}
              onChange={e => {
                field.onChange(e.target.value)
                handleChange?.(e, index)
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

export const SelectCheckBox = ({ selectedItems, setSelectedItems, row, index }) => {
  return (
    <Checkbox
      data-testid={`check-` + index}
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

export const UploadImage: React.FC<{ label; onClear; onChange; value; testId }> = ({
  label,
  onChange,
  onClear,
  value,
  testId,
}) => {
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
          ml={1}
          minW={'auto'}
          size="sm"
          data-testid={testId}
          onClick={() => inputRef?.current?.click()}
          colorScheme="darkPrimary"
          variant="outline"
          leftIcon={<BiUpload color="brand.300" />}
          display="flex"
        >
          {t(`${WORK_ORDER}.${label}`)}
        </Button>
      ) : (
        <Box color="brand.300" border="1px solid #345EA6" borderRadius="4px" fontSize="14px">
          <HStack spacing="5px" h="31px" padding="10px" align="center">
            <Text as="span" maxW="70px" isTruncated title="something">
              {value}
            </Text>
            <MdOutlineCancel color="brand.300" cursor="pointer" onClick={onFileClear} />
          </HStack>
        </Box>
      )}
    </Box>
  )
}

export const createInvoicePdf = async ({ doc, workOrder, projectData, assignedItems, hideAward }) => {
  const workOrderInfo = [
    { label: 'Start Date:', value: workOrder?.workOrderStartDate ?? '' },
    { label: 'Expected Completion:', value: workOrder?.workOrderExpectedCompletionDate ?? '' },
    { label: 'Lock Box Code:', value: projectData?.lockBoxCode ?? '' },
    { label: 'Gate Code:', value: projectData?.gateCode ?? '' },
  ]

  const basicFont = undefined
  const summaryFont = 'Times-Roman'
  const heading = 'Work Order # ' + workOrder?.id
  const startx = 15
  doc.setFontSize(16)
  doc.setFont(basicFont, 'bold')
  doc.text(heading, startx, 20)
  var img = new Image()
  img.src = 'wo-logo-tree.png'
  const images = await addImages(['wo-logo-tree.png'])
  doc.addImage(images[0], 'png', 160, 5, 35, 35)
  doc.setFontSize(11)
  doc.setFont(summaryFont, 'bold')
  doc.text('Property Address:', startx, 55)
  doc.setFont(summaryFont, 'normal')
  doc.text(projectData?.streetAddress ?? '', startx, 60)
  doc.text(projectData?.city + ' ' + projectData?.state + ' , ' + projectData?.zipCode, startx, 65)

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
  const totalAward = assignedItems?.reduce((partialSum, a) => partialSum + Number(a?.vendorAmount ?? 0), 0)

  doc.setFont(summaryFont, 'bold')
  doc.text('Work Type:', startx, y + 20)
  doc.setFont(summaryFont, 'normal')
  doc.text(workOrder?.skillName ?? workOrder?.vendorSkillName ?? '', startx + 30, y + 20)
  doc.setFont(summaryFont, 'bold')
  doc.text('Sub Contractor:', startx, y + 25)
  doc.setFont(summaryFont, 'normal')
  doc.text(workOrder?.companyName ?? workOrder?.vendorName ?? '', startx + 30, y + 25)
  doc.setFont(summaryFont, 'bold')
  doc.text('Total:', x + 5, y + 25)
  doc.setFont(summaryFont, 'normal')
  doc.text(currencyFormatter(totalAward ?? 0), x + 45, y + 25)

  autoTable(doc, {
    startY: y + 35,
    headStyles: { fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.1 },
    theme: 'grid',
    bodyStyles: { lineColor: '#000000', minCellHeight: 15 },
    body: [
      ...assignedItems?.map(ai => {
        return {
          id: ai.id,
          location: ai.location?.label || ai.location,
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
  return doc
  // doc.save(`${workOrder?.id}_${workOrder?.companyName}_${workOrder?.propertyAddress}.pdf`)
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
    showAssignVendor: !isVendor,
    showMarkAllIsVerified: !isVendor && workOrder,
    showMarkAllIsCompleted: !!workOrder,
    showVerification: !!workOrder,
  }
}

const requiredStyle = {
  color: 'red.500',
  fontWeight: 800,
  fontSize: '18px',
}

export const useFieldEnableDecision = ({ workOrder, lineItems }) => {
  const formattedStatus = workOrder?.statusLabel?.toLocaleLowerCase()
  const statusEnabled = [STATUS.Active, STATUS.PastDue].includes(formattedStatus as STATUS)
  const verificationEnabled =
    [STATUS.Active, STATUS.PastDue].includes(formattedStatus as STATUS) && lineItems?.some(l => l.isCompleted)

  return {
    statusEnabled: statusEnabled,
    verificationEnabled: verificationEnabled,
  }
}

const setColumnsByConditions = (columns, workOrder, isVendor) => {
  if (workOrder) {
    if (workOrder?.visibleToVendor) {
      columns = columns.filter(c => !['assigned'].includes(c.accessorKey))
    }

    if (isVendor) {
      if (workOrder.showPricing) {
        columns = columns.filter(
          c => !['price', 'assigned', 'profit', 'clientAmount', 'isVerified', 'paymentGroup'].includes(c.accessorKey),
        )
      } else {
        columns = columns.filter(
          c =>
            !['price', 'profit', 'assigned', 'clientAmount', 'vendorAmount', 'isVerified', 'paymentGroup'].includes(
              c.accessorKey,
            ),
        )
      }
    }
  } else {
    columns = columns.filter(
      c => !['isCompleted', 'isVerified', 'images', 'completePercentage'].includes(c.accessorKey),
    )
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
  clientName,
  isServiceSkill = false

}) => {
  const [selectedCell, setSelectedCell] = useState<selectedCell | null>(null)
  const [clrState, setClrState] = useState<boolean>(false)
  const { t } = useTranslation()
  const { fields: assignedItems, remove: removeAssigned } = assignedItemsArray
  const { setValue, getValues, watch, control, setError, clearErrors } = formControl
  const values = getValues()
  const watchFieldArray = watch('assignedItems')
  const { isVendor } = useUserRolesSelector()
  const { locationSelectOptions } = useLocation()
  const { paymentGroupValsOptions } = usePaymentGroupVals()
  const { statusEnabled, verificationEnabled } = useFieldEnableDecision({ workOrder, lineItems: watchFieldArray })
  const controlledAssignedItems = assignedItems.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })
  const { isAdmin } = useUserRolesSelector()

  //update this check as %completion came in two form i.e completePercentage & completePercentage.value
  const markAllCompleted =
    controlledAssignedItems?.length > 0 &&
    controlledAssignedItems.every(
      l => l.isCompleted && (l?.completePercentage.value === 100 || l?.completePercentage === 100),
    )

  const allVerified =
    controlledAssignedItems?.length > 0 && controlledAssignedItems?.every(l => l.isCompleted && l.isVerified)

  const handleItemQtyChange = useCallback(
    (e, index) => {
      const price = Number(controlledAssignedItems?.[index]?.price ?? 0)
      const profit = Number(controlledAssignedItems?.[index]?.profit ?? 0)
      const newQuantity = Math.abs(Number(e.target.value))
      const vendorAmount = calculateVendorAmount(price * newQuantity, profit)
      setValue(`assignedItems.${index}.clientAmount`, price * newQuantity)
      setValue(`assignedItems.${index}.vendorAmount`, vendorAmount)
    },
    [controlledAssignedItems],
  )
  const handleItemPriceChange = useCallback(
    (e, index) => {
      
      const newPrice = Number(e.target.value ?? 0)
      console.log("🚀 ~ newPrice:", newPrice)
      const profit = Number(controlledAssignedItems?.[index]?.profit ?? 0)
      console.log("🚀 ~ profit:", profit)
      const quantity = Number(controlledAssignedItems?.[index]?.quantity ?? 0)
      const vendorAmount = calculateVendorAmount(newPrice * quantity, profit)
      console.log("🚀 ~ vendorAmount:", vendorAmount)
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
      if ( ! isServiceSkill )
        setValue(`assignedItems.${index}.vendorAmount`, vendorAmount)
    },
    [controlledAssignedItems],
  )

  useEffect(() => {
    //if the service skill is yes don't calculate the profit or vendor amount https://devtek.atlassian.net/browse/PSWOA-10564
    if ( isServiceSkill ) return;
    //  set by default value of profit% 45 line lineitem table with condition that
    // if item.profit exist then add it otherwise on newly line items added put profit 45% as ask
    values.assignedItems?.forEach((item, index) => {
      setValue(`assignedItems.${index}.profit`, item.profit ?? 45)
      setValue(`assignedItems.${index}.vendorAmount`, calculateVendorAmount(item.clientAmount, item.profit ?? 45))
    })
  }, [values.assignedItems])

  const handleItemVendorAmountChange = useCallback(
    (e, index) => {
      const vendorAmount = e.target.value ?? 0
      console.log("🚀 ~ vendorAmount:", vendorAmount)
      const clientAmount = Number(controlledAssignedItems?.[index]?.clientAmount ?? 0)
      console.log("🚀 ~ clientAmount:", clientAmount)
      const profit = calculateProfit(clientAmount, Number(vendorAmount))
      console.log("🚀 ~ profit:", profit)
      setValue(`assignedItems.${index}.profit`, profit)
    },
    [controlledAssignedItems],
  )

  const handleDropdownValue = v => [{ value: v, label: `${v?.toString()}%` }]

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

  const downloadDocument = (link, text, testId) => {
    return (
      <a href={link} target="_blank" rel="noreferrer" download style={{ marginTop: '5px', color: '#4E87F8' }}>
        <HStack>
          <Icon as={BiDownload} size="sm" />
          <Text data-testid={testId} fontSize="12px" fontStyle="normal" maxW="70px" isTruncated>
            {text}
          </Text>
        </HStack>
      </a>
    )
  }

  //this will execute on change of %completion dropdown
  const onChangeFn = (option?: any, index?: any) => {
    const watchIsCompleted = watch(`assignedItems.${index}.isCompleted`)
    //this check will checks if value of %completion is 100% then mark that checkbox true
    if (option?.value === 100) setValue(`assignedItems.${index}.isCompleted`, true)
    else setValue(`assignedItems.${index}.isCompleted`, false)

    // this check will execute for all users other than admin to setError if value is less then 100%
    // of %completion & check box of line item is checked, else it will clearError and color of %completion column
    if (!isAdmin && option?.value !== 100 && watchIsCompleted) {
      // below useState is for handle color of %completion column
      setClrState(true)
      setError(`assignedItems.${index}.completePercentage`, {
        type: 'custom',
        message: t('PercentageCompletionMsg'),
      })
    } else {
      setClrState(false)
      clearErrors(`assignedItems.${index}.completePercentage`)
    }
  }

  let columns = useMemo(() => {
    return [
      {
        header: () => {
          return (
            <Icon
              as={CgPlayListRemove}
              boxSize={7}
              color="brand.300"
              data-testid={'unassign-all'}
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
                data-testid={'unassign-' + index}
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
        size: 250,
        cell: ({ row }) => {
          const index = row?.index
          const {
            formState: { errors },
            control,
          } = formControl

          return (
            <Box>
              <FormControl isInvalid={!!errors.assignedItems?.[index]?.location} zIndex={9999 + 1} width="220px">
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name={`assignedItems.${index}.location`}
                  render={({ field }) => {
                    return (
                      <>
                        <CreatableSelectForTable
                        classNamePrefix={'locationAssignedItems'}
                          index={index}
                          field={field}
                          key={'assignedItems.' + [index]}
                          id={`assignedItems.${index}.location`}
                          options={locationSelectOptions}
                          newObjectFormatting={null}
                          isDisabled={isVendor}
                          valueFormatter={null}
                          style={{ height: 115 }}
                        />
                      </>
                    )
                  }}
                />
              </FormControl>
            </Box>
          )
        },
      },
      {
        header: `${WORK_ORDER}.paymentGroup`,
        accessorKey: 'paymentGroup',
        size: 250,
        cell: ({ row }) => {
          const index = row?.index
          const {
            formState: { errors },
            control,
          } = formControl

          return (
            <Box>
              <FormControl isInvalid={!!errors.assignedItems?.[index]?.paymentGroup} zIndex={9999 + 1} width="220px">
                <Controller
                  control={control}
                  name={`assignedItems.${index}.paymentGroup`}
                  render={({ field }) => {
                    return (
                      <>
                        <CreatableSelectForTable
                        classNamePrefix={'paymentGroupAssignedItems'}
                          index={index}
                          field={field}
                          key={'assignedItems.' + [index]}
                          id={`assignedItems.${index}.paymentGroup`}
                          options={paymentGroupValsOptions}
                          newObjectFormatting={null}
                          isDisabled={isVendor}
                          valueFormatter={null}
                          style={{ height: 115 }}
                        />
                      </>
                    )
                  }}
                />
              </FormControl>
            </Box>
          )
        },
      },
      {
        header: `${WORK_ORDER}.sku`,
        accessorKey: 'sku',
        accessorFn: cellInfo => {
          return cellInfo.sku ? cellInfo.sku?.toString() : '- - -'
        },
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
                maxLength={256}
                rules={{ maxLength: { value: 256, message: 'Please use 255 characters only.' } }}
                errorSetFunc={(e, setError, clearErrors) => {
                  const inputValue = e.target.value
                  if (inputValue.length === 256) {
                    setError(`${'assignedItems'}.${index}.${'sku'}`, {
                      type: 'maxLength',
                      message: (
                        <div>
                          <span>Please use 255</span>
                          <br />
                          <span>characters only.</span>
                        </div>
                      ) as any,
                    })
                  } else {
                    clearErrors(`${'assignedItems'}.${index}.${'sku'}`)
                  }
                }}
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
        accessorFn: cellInfo => {
          return cellInfo.productName ? cellInfo.productName?.toString() : '- - -'
        },
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
                maxLength={1025}
                rules={{ maxLength: { value: 1025, message: 'Please use 1024 characters only.' } }}
                errorSetFunc={(e, setError, clearErrors) => {
                  const inputValue = e.target.value
                  if (inputValue.length === 1025) {
                    setError(`${'assignedItems'}.${index}.${'productName'}`, {
                      type: 'maxLength',
                      message: (
                        <div>
                          <span>Please use 1024</span>
                          <br />
                          <span>characters only.</span>
                        </div>
                      ) as any,
                    })
                  } else {
                    clearErrors(`${'assignedItems'}.${index}.${'productName'}`)
                  }
                }}
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
        accessorFn: cellInfo => {
          return cellInfo.description ? cellInfo.description?.toString() : '- - -'
        },
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
                maxLength={1025}
                rules={{ maxLength: { value: 1025, message: 'Please use 1024 characters only.' } }}
                errorSetFunc={(e, setError, clearErrors) => {
                  const inputValue = e.target.value
                  if (inputValue.length === 1025) {
                    setError(`${'assignedItems'}.${index}.${'description'}`, {
                      type: 'maxLength',
                      message: (
                        <div>
                          <span>Please use 1024</span>
                          <br />
                          <span>characters only.</span>
                        </div>
                      ) as any,
                    })
                  } else {
                    clearErrors(`${'assignedItems'}.${index}.${'description'}`)
                  }
                }}
              />
            </Box>
          )
        },
        size: 250,
      },

      {
        header: () => (
          <span style={{ marginLeft: '30px', color: clrState ? 'red' : '' }}>
            {' '}
            {t(`${WORK_ORDER}.completePercentage`)}
          </span>
        ),
        accessorKey: 'completePercentage',
        size: 200,
        cell: ({ row }) => {
          const index = row?.index
          const {
            formState: { errors },
            control,
          } = formControl

          return (
            <Box pos="relative">
              {index !== 0 && (
                <Box
                  w="50px"
                  pos="absolute"
                  left="-10px"
                  top="10px"
                  _hover={{
                    '.delete-row-icon': { visibility: 'visible' },
                  }}
                >
                  <Icon
                    as={BiXCircle}
                    boxSize={5}
                    data-testid={'unassign-' + index}
                    color="brand.300"
                    visibility="hidden"
                    className="delete-row-icon"
                    onClick={() => {
                      removeAssigned(index)
                    }}
                    cursor="pointer"
                  ></Icon>
                </Box>
              )}
              <FormControl
                ml="27px"
                isInvalid={!!errors.assignedItems?.[index]?.completePercentage}
                zIndex={9999 + 1}
                width="100px"
              >
                <Controller
                  control={control}
                  // rules={{ required: true }}
                  name={`assignedItems.${index}.completePercentage`}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <CreatableSelectForTable
                        classNamePrefix={'completePercentageAssignedItems'}
                          index={index}
                          options={completePercentageValues}
                          field={field}
                          key={'assignedItems.' + [index]}
                          valueFormatter={typeof field.value === 'number' ? handleDropdownValue : null}
                          id={`assignedItems.${index}.completePercentage`}
                          isDisabled={isVendor}
                          newObjectFormatting={newObjectFormatting}
                          onChangeFn={onChangeFn}
                          style={{ height: 115, width: 100 }}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )
                  }}
                />
              </FormControl>
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
              {t(`${WORK_ORDER}.quantity`)}
            </>
          )
        },
        size: 100,
        accessorKey: 'quantity',
        accessorFn: cellInfo => {
          return cellInfo.quantity ? cellInfo.quantity?.toString() : '- - -'
        },
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
                inputType="number"
                allowEdit={allowEdit}
                rules={{
                  validate: {
                    matchPattern: (v: any) => {
                      return validateAmountDigits(v)
                    
                    },
                  },
                }}
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
        accessorFn(cellInfo: any) {
          return cellInfo.price?.toString()
        },
        filterFn: 'includesString',
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
                rules={{
                  validate: {
                    matchPattern: (v: any) => {
                      return validateAmountDigits(v)
                    
                    },
                  },
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
        accessorFn(cellInfo: any) {
          return cellInfo.clientAmount?.toString()
        },
        filterFn: 'includesString',
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
        accessorFn(cellInfo: any) {
          return cellInfo.profit?.toString()
        },
        cell: cellInfo => {
          const index = cellInfo?.row?.index
          return (
            <Box>
             
              { ! isServiceSkill ? <EditableField
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
              /> : '---' }
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
        accessorFn(cellInfo: any) {
          return cellInfo.vendorAmount?.toString()
        },
        filterFn: 'includesString',
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
                  ! isServiceSkill && handleItemVendorAmountChange(e, index)
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
        // header: `${WORK_ORDER}.complete`,
        accessorKey: 'isCompleted',
        enableSorting: false,
        header: () => {
          return (
            <>
              <Checkbox
                ml="8px"
                borderColor="#3A5EA6"
                data-testid="complete_checkbox"
                disabled={!statusEnabled}
                onChange={e => {
                  onChangeHeaderCheckbox(controlledAssignedItems, e, formControl, isAdmin, setClrState)
                }}
                isChecked={markAllCompleted}
              ></Checkbox>
              {t(`${WORK_ORDER}.complete`)}
            </>
          )
        },
        cell: cellInfo => {
          const {
            formState: { errors },
            control,
          } = formControl
          const index = cellInfo?.row?.index
          return (
            <HStack justifyContent={'center'} h="28px">
              <FormControl isInvalid={!!errors.assignedItems?.[index]?.isCompleted}>
                <Controller
                  control={control}
                  name={`assignedItems.${index}.isCompleted`}
                  render={({ field, fieldState }) => (
                    <>
                      <CustomCheckBox
                        testid={`isCompleted-` + index}
                        // text="Completed"
                        isChecked={field.value}
                        disabled={!statusEnabled}
                        onChange={e => {
                          onChangeCheckbox(e, isAdmin, formControl, field, index)
                        }}
                      ></CustomCheckBox>
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                ></Controller>
              </FormControl>
            </HStack>
          )
        },
      },
      {
        accessorKey: 'isVerified',
        enableSorting: false,
        header: () => {
          return (
            <>
              <Checkbox
                borderColor="#3A5EA6"
                data-testid="verified_checkbox"
                onChange={e => {
                  assignedItems.forEach((item, index) => {
                    if (controlledAssignedItems?.[index]?.isCompleted) {
                      setValue(`assignedItems.${index}.isVerified`, e.currentTarget.checked)
                    }
                  })
                }}
                disabled={!verificationEnabled}
                isChecked={allVerified}
              ></Checkbox>
              {t(`${WORK_ORDER}.verification`)}
            </>
          )
        },
        cell: cellInfo => {
          const index = cellInfo?.row?.index
          return (
            <HStack justifyContent={'center'} h="50px">
              <Controller
                control={control}
                name={`assignedItems.${index}.isVerified`}
                render={({ field, fieldState }) => (
                  <CustomCheckBox
                    disabled={!(values.assignedItems?.[index]?.isCompleted && verificationEnabled)}
                    isChecked={field.value}
                    testid={`isVerified-` + index}
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
                  <VStack alignItems="start">
                    <Box py="12px">
                      <UploadImage
                        testId={'upload-' + index}
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
                          'uploaded-' + index,
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
    ]
  }, [
    selectedCell,
    setSelectedCell,
    clrState,
    unassignedItems,
    setUnAssignedItems,
    verificationEnabled,
    statusEnabled,
    markAllCompleted,
    allVerified,
    controlledAssignedItems?.length,
    locationSelectOptions?.length,
    paymentGroupValsOptions?.length,
    isServiceSkill
  ])
  columns = setColumnsByConditions(columns, workOrder, isVendor)
  return columns
}

type CreatebleSelectType = {
  field: any
  id: string
  key: string
  isDisabled: boolean
  valueFormatter: any
  options: any
  newObjectFormatting: any
  style?: any
  index: number
  onChangeFn?: any
  classNamePrefix? : any
}

export const CreatableSelectForTable = ({
  field,
  id,
  key,
  isDisabled,
  valueFormatter,
  options,
  newObjectFormatting,
  style,
  index,
  onChangeFn,
  classNamePrefix,
  
}: CreatebleSelectType) => {
  const defaultOption = { label: 'Select', value: 'select', isDisabled: true }
  return (
    <CreatableSelect
      {...field}
      id={id}
      options={options?.length === 0 ? [defaultOption] : options}
      size="md"
      value={valueFormatter ? valueFormatter(field.value) : field.value}
      isDisabled={isDisabled}
      selectProps={{ widthAssign: '100%', menuHeight: style?.height, menuWidth: style?.width }}
      onChange={option => {
        // this above component is resusable, for avoiding the issue its handle here
        // as if we have prop for onChangeFn then only it will execute
        if (onChangeFn) onChangeFn(option, index)
        if (option?.__isNew__ && !!newObjectFormatting) {
          field.onChange(newObjectFormatting(option))
        } else {
          field.onChange(option)
        }
      }}
      styles={{
        menuPortal: base => ({ ...base, zIndex: 99999, position: 'fixed' }),
      }}
      key={key}
      menuPosition="fixed"
      menuPortalTarget={document.body}
      menuShouldScrollIntoView={false}
      isSearchable={true}
      placeholder={'Select'}
      components={{
        IndicatorSeparator: null,
        SingleValue: option => {
          return (
            <Flex title={option.children as string} position="absolute" cursor="default !important">
              <Text isTruncated whiteSpace="nowrap" maxW="148px" fontSize="12px">
                {option.children}
              </Text>
            </Flex>
          )
        },
      }}
    />
  )
}
