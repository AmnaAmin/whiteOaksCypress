import { useClient, useSmartWOClient } from 'utils/auth-context'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import { useToast } from '@chakra-ui/toast'
import { useParams } from 'react-router-dom'
import { convertDateTimeFromServer, dateISOFormat, datePickerFormat } from 'utils/date-time-utils'
import autoTable from 'jspdf-autotable'
import { ProjectWorkOrder } from 'types/transaction.type'
import { STATUS } from 'features/projects/status'
import { currencyFormatter } from './stringFormatters'

export const useUpdateWorkOrderMutation = (hideToast?: boolean) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { projectId } = useParams<'projectId'>()

  return useMutation(
    payload => {
      return client('work-orders', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['documents', projectId])
        queryClient.invalidateQueries('accountPayable')
        if (!hideToast) {
          toast({
            title: 'Work Order',
            description: 'Work Order has been saved successfully.',
            status: 'success',
            isClosable: true,
          })
        }
      },
      onError(error: any) {
        toast({
          title: 'Work Order',
          description: (error.title as string) ?? 'Unable to save workorder.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useCreateWorkOrderMutation = () => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { projectId } = useParams<'projectId'>()

  return useMutation(
    payload => {
      return client('work-orders', {
        data: payload,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])

        toast({
          title: 'Work Order',
          description: 'Work Order created successfully',
          status: 'success',
          isClosable: true,
        })
      },
      onError(error: any) {
        toast({
          title: 'Work Order',
          description: (error.title as string) ?? 'Unable to create workorder.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useNoteMutation = projectId => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: any) => {
      return client('notes', {
        data: payload,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['notes', projectId])
        toast({
          title: 'Note',
          description: 'Note has been saved successfully.',
          status: 'success',
          isClosable: true,
        })
      },
      onError(error: any) {
        toast({
          title: 'Note',
          description: (error.title as string) ?? 'Unable to save note.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useNotes = ({ workOrderId }: { workOrderId: number | undefined }) => {
  const client = useClient()

  const { data: notes, ...rest } = useQuery<Array<Document>>(['notes', workOrderId], async () => {
    const response = await client(`notes?workOrderId.equals=${workOrderId}&sort=modifiedDate,asc`, {})
    return response?.data
  })

  return {
    notes,
    ...rest,
  }
}

/* WorkOrder Invoice */
export const createInvoicePdf = (doc, workOrder, projectData, assignedItems) => {
  const invoiceInfo = [
    { label: 'Property Address:', value: workOrder.propertyAddress },
    { label: 'Start Date:', value: workOrder.workOrderStartDate },
    { label: 'Completion Date:', value: workOrder.workOrderDateCompleted },
    { label: 'Lock Box Code:', value: projectData.lockBoxCode },
  ]

  const basicFont = undefined
  const heading = 'Work Order'
  doc.setFontSize(16)
  doc.setFont(basicFont as any, 'bold')
  const xHeading = (doc.internal.pageSize.getWidth() - doc.getTextWidth(heading)) / 2
  doc.text(heading, xHeading, 20)
  doc.setFontSize(10)
  doc.setFont(basicFont as any, 'normal')
  let x = 15
  let y = 25
  const length = 115
  const width = 10
  invoiceInfo.forEach(inv => {
    doc.rect(x, y, length, width, 'D')
    doc.text(inv.label, x + 5, y + 7)
    doc.text(
      inv.label === 'Start Date:' || inv.label === 'Completion Date:'
        ? convertDateTimeFromServer(inv.value)
        : inv.value,
      x + 45,
      y + 7,
    )
    y = y + 10
  })
  doc.rect(x + length, 25, 65, width, 'D')
  doc.text('Square Feet:', x + length + 5, 30)
  doc.rect(x + length, 35, 65, width, 'D')
  doc.text('Work Type:', x + length + 5, 40)
  doc.text(workOrder.skillName, x + length + 30, 40)

  doc.rect(x, y + 15, length, width, 'D')
  doc.text('Sub Contractor:', x + 5, y + 22)
  doc.rect(x + length, y + 15, 65, width, 'D')
  doc.text('Total:', x + length + 5, y + 22)

  autoTable(doc, {
    startY: y + 40,
    headStyles: { fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.1 },
    theme: 'grid',
    bodyStyles: { lineColor: '#000000', minCellHeight: 15 },
    body: [
      ...assignedItems.map(ai => {
        return {
          location: ai.location,
          id: ai.id,
          description: ai.description,
          quantity: ai.quantity,
        }
      }),
    ],
    columnStyles: {
      location: { cellWidth: 70 },
      id: { cellWidth: 20 },
      description: { cellWidth: 70 },
      quantity: { cellWidth: 20 },
    },
    columns: [
      { header: 'Location', dataKey: 'location' },
      { header: 'SKU', dataKey: 'id' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Quantity', dataKey: 'quantity' },
    ],
  })
  doc.setFontSize(10)
  doc.setFont(basicFont as any, 'normal')
  const tableEndsY = (doc as any).lastAutoTable.finalY
  const summaryX = doc.internal.pageSize.getWidth() - 90 /* Starting x point of invoice summary  */
  doc.setDrawColor(0, 0, 0)
  doc.rect(summaryX - 5, tableEndsY, 79, 10, 'D')
  doc.text('Total Award:', summaryX, tableEndsY + 7)
  return doc
}

/* WorkOrder Payments */
export const useFieldEnableDecision = (workOrder?: ProjectWorkOrder) => {
  const defaultStatus = false
  const completedState = [STATUS.Completed].includes(workOrder?.statusLabel?.toLocaleLowerCase() as STATUS)
  const invoicedState = [STATUS.Invoiced].includes(workOrder?.statusLabel?.toLocaleLowerCase() as STATUS)
  return {
    dateInvoiceSubmittedEnabled: defaultStatus || invoicedState,
    paymentTermEnabled: defaultStatus || invoicedState,
    paymentTermDateEnabled: defaultStatus,
    expectedPaymentDateEnabled: defaultStatus || completedState || invoicedState,
    datePaymentProcessedEnabled: defaultStatus || completedState,
    datePaidEnabled: defaultStatus || completedState || invoicedState,
    clientApprovedAmountEnabled: defaultStatus,
    clientOriginalApprovedAmountEnabled: defaultStatus,
    finalInvoiceAmountEnabled: defaultStatus,
  }
}

export const parsePaymentValuesToPayload = formValues => {
  return {
    dateInvoiceSubmitted: dateISOFormat(formValues?.dateInvoiceSubmitted),
    paymentTerm: formValues?.paymenTerm?.value,
    paymentTermDate: dateISOFormat(formValues?.paymentTermDate),
    expectedPaymentDate: dateISOFormat(formValues?.expectedPaymentDate),
    datePaymentProcessed: dateISOFormat(formValues?.datePaymentProcessed),
    datePaid: dateISOFormat(formValues?.datePaid),
  }
}

export const defaultValuesPayment = (workOrder, paymentsTerms) => {
  const defaultValues = {
    dateInvoiceSubmitted: datePickerFormat(workOrder?.dateInvoiceSubmitted),
    paymentTerm: workOrder?.paymentTerm
      ? paymentsTerms.find(p => p.value === workOrder?.paymentTerm)
      : paymentsTerms.find(p => p.value === '20'),
    paymentTermDate: datePickerFormat(workOrder?.paymentTermDate),
    expectedPaymentDate: datePickerFormat(workOrder?.expectedPaymentDate),
    datePaymentProcessed: datePickerFormat(workOrder?.datePaymentProcessed),
    datePaid: datePickerFormat(workOrder?.datePaid),
    clientApprovedAmount: currencyFormatter(workOrder?.clientApprovedAmount),
    clientOriginalApprovedAmount: currencyFormatter(workOrder?.clientOriginalApprovedAmount),
    finalInvoiceAmount: currencyFormatter(workOrder?.finalInvoiceAmount),
  }
  return defaultValues
}

/* WorkOrder Details */

export const parseWODetailValuesToPayload = formValues => {
  return {
    workOrderStartDate: dateISOFormat(formValues?.workOrderStartDate),
    workOrderDateCompleted: dateISOFormat(formValues?.workOrderDateCompleted),
    workOrderExpectedCompletionDate: dateISOFormat(formValues?.workOrderExpectedCompletionDate),
  }
}

export const defaultValuesWODetails = workOrder => {
  const defaultValues = {
    workOrderStartDate: datePickerFormat(workOrder?.workOrderStartDate),
    workOrderDateCompleted: datePickerFormat(workOrder?.workOrderDateCompleted),
    workOrderExpectedCompletionDate: datePickerFormat(workOrder?.workOrderExpectedCompletionDate),
    assignedItems:
      workOrder?.assignedItems?.length > 0
        ? workOrder?.assignedItems
        : [
            {
              sku: '123',
              productName: 'Product A',
              details: 'Solid product',
              quantity: 12,
              price: '123',
              status: true,
              images: null,
              verification: true,
            },
          ],
  }
  return defaultValues
}

/* WorkOrder LienWaiver */

export const defaultValuesLienWaiver = lienWaiverData => {
  const defaultValues = {
    claimantName: lienWaiverData?.claimantName,
    customerName: lienWaiverData?.customerName,
    propertyAddress: lienWaiverData?.propertyAddress,
    owner: lienWaiverData?.owner,
    makerOfCheck: lienWaiverData?.makerOfCheck,
    finalInvoiceAmount: lienWaiverData?.finalInvoiceAmount,
    checkPayableTo: lienWaiverData?.claimantName,
    claimantsSignature: lienWaiverData?.claimantsSignature,
    claimantTitle: lienWaiverData?.claimantTitle,
    dateOfSignature: lienWaiverData?.dateOfSignature,
    lienWaiverAccepted: !lienWaiverData?.lienWaiverAccepted,
  }
  return defaultValues
}
/* New Work Order */

export const parseNewWoValuesToPayload = (formValues, projectId) => {
  const selectedCapacity = 1
  const arr = [] as any
  return {
    workOrderStartDate: dateISOFormat(formValues.workOrderStartDate),
    workOrderExpectedCompletionDate: dateISOFormat(formValues.workOrderExpectedCompletionDate),
    invoiceAmount: formValues.invoiceAmount,
    clientApprovedAmount: formValues.clientApprovedAmount,
    percentage: formValues.percentage,
    vendorId: formValues.vendorId?.value,
    vendorSkillId: formValues.vendorSkillId?.value,
    // new work-order have hardcoded capacity
    capacity: selectedCapacity,
    documents: arr,
    status: 34,
    projectId: projectId,
  }
}

export const useRmainingLineItems = (projectId?: string) => {
  const client = useSmartWOClient()

  const { data: remainingItems, ...rest } = useQuery<any>(
    ['remainingItems', projectId],
    async () => {
      const response = await client(`unassigned_lineitem/${projectId}`, {})

      return response?.data
    },
    {
      enabled: !!projectId,
    },
  )

  return {
    remainingItems,
    ...rest,
  }
}

export const useAssignLineItems = projectId => {
  const client = useSmartWOClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (lineIds: any) => {
      return client(`lineitem_link_update/${lineIds}`, {
        data: lineIds,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['documents', projectId])
        queryClient.invalidateQueries('accountPayable')
        toast({
          title: 'Assigned Line Items',
          description: 'Assigned Line Items have  been linked successfully.',
          status: 'success',
          isClosable: true,
        })
      },
      onError(error: any) {
        toast({
          title: 'Assigned Line Items',
          description: (error.title as string) ?? 'Unable to assign line items.',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}
