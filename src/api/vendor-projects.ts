import { useClient } from 'utils/auth-context'
import { Document } from 'types/vendor.types'
import { useToast } from '@chakra-ui/toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import autoTable from 'jspdf-autotable'
import { dateFormat } from 'utils/date-time-utils'
import { currencyFormatter, truncateWithEllipsisInCenter } from 'utils/string-formatters'
import { Project } from 'types/project.type'
import { useMemo } from 'react'
import { SelectOption } from 'types/transaction.type'

export const useUploadDocument = () => {
  const { projectId } = useParams<'projectId'>()
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (docs: Document) => {
      return client('documents', {
        data: docs,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['documents', projectId])
        queryClient.invalidateQueries(['GetProjectWorkOrders', projectId])
        toast({
          title: 'Upload New Document',
          description: 'New document has been uploaded successfully.',
          status: 'success',
          isClosable: true,
        })
      },
      onError(error) {
        toast({
          title: 'Upload New Document',
          description: 'Error occured during uploading new document',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useDocuments = ({ projectId }: { projectId: string | number | undefined }) => {
  const client = useClient()

  const { data: documents, ...rest } = useQuery<Array<Document>>(
    ['documents', projectId],
    async () => {
      const response = await client(`documents?projectId.equals=${projectId}&sort=modifiedDate,asc`, {})

      return response?.data ? response?.data : []
    },
    { enabled: !!projectId },
  )

  return {
    documents,
    ...rest,
  }
}

export const useDocumentTypes = () => {
  const client = useClient()

  return useQuery('documentTypes', async () => {
    const response = await client(`lk_value/lookupType/4`, {})

    return response?.data
  })
}

export const documentScore = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
]

export const documentStatus = [
  { value: 12, label: 'Active' },
  { value: 13, label: 'Inactive' },
  { value: 15, label: 'Expired' },
  { value: 14, label: 'Do Not Use' },
]

export const useDocumentStatusSelectOptions = vendorProfileData => {
  return useMemo(() => {
    if (!vendorProfileData) return []

    const documentStatusId = vendorProfileData?.status

    if (!documentStatusId) return []

    const selectOptionWithDisableEnabled = documentStatus.map((selectOption: SelectOption) => {
      const optionValue = selectOption?.value
      if (documentStatusId === 15 && optionValue === 12) {
        return {
          ...selectOption,
          label: `${selectOption?.label} (All docs must be verified.)`,
          isDisabled: true,
        }
      }
      if (documentStatusId === 15 && optionValue === 13) {
        return {
          ...selectOption,
          label: `${selectOption?.label} (All docs must be verified.)`,
          isDisabled: true,
        }
      }
      return selectOption
    })
    return selectOptionWithDisableEnabled
  }, [vendorProfileData])
}

export const documentTerm = [
  { value: 24, label: '7' },
  { value: 25, label: '10' },
  { value: 56, label: '14' },
  { value: 57, label: '20' },
  { value: 39, label: '30' },
]

export const portalAccess = [
  { value: true, label: 'Enable' },
  { value: false, label: 'Disable' },
]
export const useVendorAddress = projectId => {
  const client = useClient()

  return useQuery(['vendorAddress', projectId], async () => {
    const response = await client(`view-vendors/v1?id.equals=${projectId}`, {})
    return response?.data
  })
}

export const createInvoice = (doc, workOrder, projectData: Project, items, summary, vendorAddress) => {
  const baseFont = 'times'

  const woAddress = {
    companyName: 'WhiteOaks Aligned, LLC',
    streetAddress: 'Four 14th Street #601',
    city: 'Hoboken',
    state: 'NJ',
    zipCode: '07030',
  }

  // Vendor
  const rightMarginX = 15
  // Might be needed
  //doc.internal.pageSize.getWidth() - 80 /* starting point of right margin text */

  // Heading
  doc.setFontSize(22).setFont(baseFont, 'normal')
  doc.text('INVOICE #', rightMarginX, 20, { charSpace: 0 })
  doc.text(workOrder?.invoiceNumber.slice(2, 8), rightMarginX + 40, 20)

  // PO Number
  doc.setFontSize(12).setFont(baseFont, 'bold')
  doc.text('PO Number:', rightMarginX, 35)
  doc.setFontSize(12).setFont(baseFont, 'normal')
  doc.text(workOrder?.propertyAddress, rightMarginX + 25, 35)

  // From Vendor Address
  doc.text('From:', rightMarginX, 60)
  doc.setFontSize(12).setFont(baseFont, 'bold')
  doc.text(truncateWithEllipsisInCenter(workOrder?.companyName), rightMarginX, 65)
  doc.setFontSize(12).setFont(baseFont, 'normal')
  doc.text(vendorAddress[0]?.streetAddress, rightMarginX, 70)
  doc.text(vendorAddress[0]?.city + ', ' + vendorAddress[0]?.state + ' ' + vendorAddress[0]?.zipCode, rightMarginX, 75)

  // To Address
  doc.setFontSize(12).setFont(baseFont, 'normal')
  doc.text('Bill To:', rightMarginX + 65, 60)
  doc.setFontSize(12).setFont(baseFont, 'bold')
  doc.text(woAddress?.companyName, rightMarginX + 65, 65)
  doc.setFontSize(12).setFont(baseFont, 'normal')
  doc.text(woAddress?.streetAddress, rightMarginX + 65, 70)
  doc.text(woAddress?.city + ', ' + woAddress?.state + ' ' + woAddress?.zipCode, rightMarginX + 65, 75)

  // Dates
  doc.setFont(baseFont, 'bold')
  doc.text('Invoice Date', rightMarginX + 135, 60)
  doc.text('Due Date', rightMarginX + 135, 65)
  doc.setFont(baseFont, 'normal')
  doc.text(
    workOrder.dateInvoiceSubmitted ? dateFormat(workOrder?.dateInvoiceSubmitted) : 'mm/dd/yyyy',
    rightMarginX + 160,
    60,
  )
  doc.text(workOrder.paymentTermDate ? dateFormat(workOrder?.paymentTermDate) : 'mm/dd/yyyy', rightMarginX + 160, 65)

  // Table
  autoTable(doc, {
    startY: 80,
    headStyles: { fillColor: '#D3D3D3', textColor: '#000000', font: baseFont },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,

    body: [
      ...items.map(ai => {
        return {
          item: ai.id,
          description: ai.name,
          amount: currencyFormatter(ai.transactionTotal),
        }
      }),
    ],
    columns: [
      { header: 'Item', dataKey: 'item' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Total', dataKey: 'amount' },
    ],
    theme: 'grid',
    bodyStyles: { minCellHeight: 10, font: baseFont, lineColor: 'black', textColor: 'black' },
    columnStyles: {
      0: { cellWidth: 35, lineColor: 'black' },
      1: { lineColor: 'black' },
      2: { cellWidth: 35, lineColor: 'black' },
    },
  })

  // Summary
  const tableEndsY = (doc as any).lastAutoTable.finalY /* last row Y of auto table */
  const summaryX = doc.internal.pageSize.getWidth() - 70 /* Starting x point of invoice summary  */
  doc.setFontSize(12).setFont(baseFont, 'normal')
  doc.internal.pageSize.getHeight()
  doc.setDrawColor(0, 0, 0)
  let rectX = summaryX - 10
  let rectY = tableEndsY
  if (doc.internal.pageSize.getHeight() - tableEndsY < 30) {
    doc.addPage()
    rectY = 20
  }
  const rectL = 86 - 20
  const rectW = 10
  const summaryInfo = [
    { title: 'Subtotal', value: currencyFormatter(summary.subTotal) },
    { title: 'Amount Paid', value: currencyFormatter(Math.abs(summary.amountPaid)) },
    { title: 'Balance Due', value: currencyFormatter(summary.subTotal - Math.abs(summary.amountPaid)) },
  ]
  // hide first rect as per new format
  // doc.rect(14, rectY, 96, 30, 'D')
  summaryInfo.forEach(sum => {
    let rectD = 'D'
    if (sum.title === 'Balance Due') {
      doc.setFillColor(211)
      rectD = 'FD'
    }
    doc.rect(rectX, rectY, rectL, rectW, rectD)
    doc.setFont(baseFont, 'bold')
    doc.text(sum.title, summaryX - 5, rectY + 6)
    doc.setFont(baseFont, 'normal')
    doc.text(sum.value, summaryX + 35, rectY + 6)
    rectY = rectY + 10
  })
  return doc
}

export const paymentsTerms = [
  { value: '7', label: '7' },
  { value: '10', label: '10' },
  { value: '14', label: '14' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
]
