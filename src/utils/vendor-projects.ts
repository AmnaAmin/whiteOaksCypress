import { useClient } from 'utils/auth-context'
import { Document } from 'types/vendor.types'
import { useToast } from '@chakra-ui/toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import autoTable from 'jspdf-autotable'
import { dateFormat } from 'utils/date-time-utils'
import { currencyFormatter, truncateWithEllipsis } from 'utils/stringFormatters'
import { ProjectType } from 'types/project.type'

export const useUploadDocument = () => {
  const { projectId } = useParams<'projectId'>()
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (doc: Document) => {
      return client('documents', {
        data: doc,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['documents', projectId])

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
  { value: 14, label: 'DoNotUse' },
]

export const documentTerm = [
  { value: 24, label: '7' },
  { value: 25, label: '10' },
  { value: 56, label: '14' },
  { value: 57, label: '20' },
  { value: 39, label: '30' },
]

export const createInvoice = (doc, workOrder, projectData: ProjectType, items, summary) => {
  const baseFont = 'times'
  const woAddress = {
    companyName: 'WhiteOaks Aligned, LLC',
    streetAddress: '4 14th Street #601',
    city: 'Hoboken',
    state: 'NJ',
    zipCode: '07030',
  }

  // Vendor
  const rightMarginX = doc.internal.pageSize.getWidth() - 80 /* starting point of right margin text */
  doc.setFontSize(12).setFont(baseFont)
  doc.text('Vendor', 15, 20)
  doc.text(workOrder?.companyName, 15, 25)

  // Heading
  doc.setFontSize(22).setFont(baseFont, 'bold')
  doc.text('INVOICE', rightMarginX, 20, { charSpace: 3 })

  //Address
  doc.setFontSize(12).setFont(baseFont, 'normal')
  doc.text(woAddress?.companyName, 15, 45)
  doc.text(woAddress?.streetAddress, 15, 50)
  doc.text(woAddress?.city + ', ' + woAddress?.state + ' ' + woAddress?.zipCode, 15, 55)

  // Specifications
  doc.setFont(baseFont, 'bold')
  doc.text('Invoice #', rightMarginX, 45)
  doc.text('P.O. #', rightMarginX, 55)
  doc.text('Invoice Date', rightMarginX, 65)
  doc.text('Due Date', rightMarginX, 75)

  doc.setFont(baseFont, 'normal')
  doc.text(workOrder?.invoiceNumber, rightMarginX + 35, 45)
  doc.text(truncateWithEllipsis(workOrder?.propertyAddress, 15), rightMarginX + 35, 55)
  doc.text(
    workOrder.dateInvoiceSubmitted ? dateFormat(workOrder?.dateInvoiceSubmitted) : 'mm/dd/yyyy',
    rightMarginX + 35,
    65,
  )
  doc.text(workOrder.paymentTermDate ? dateFormat(workOrder?.paymentTermDate) : 'mm/dd/yyyy', rightMarginX + 35, 75)

  // Table
  autoTable(doc, {
    startY: 85,
    headStyles: { fillColor: '#D3D3D3', textColor: '#000000' },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
    body: [
      ...items.map(ai => {
        return {
          item: ai.id,
          description: ai.name,
          amount: ai.changeOrderAmount,
        }
      }),
    ],
    columns: [
      { header: 'Item', dataKey: 'item' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Total', dataKey: 'amount' },
    ],
    theme: 'plain',
    bodyStyles: { minCellHeight: 15 },
  })

  // Summary
  const tableEndsY = (doc as any).lastAutoTable.finalY /* last row Y of auto table */
  const summaryX = doc.internal.pageSize.getWidth() - 90 /* Starting x point of invoice summary  */
  doc.internal.pageSize.getHeight()
  doc.setDrawColor(0)
  let rectX = summaryX - 10
  let rectY = tableEndsY
  if (doc.internal.pageSize.getHeight() - tableEndsY < 30) {
    doc.addPage()
    rectY = 20
  }
  const rectL = 86
  const rectW = 10
  const summaryInfo = [
    { title: 'Subtotal', value: currencyFormatter(summary.subTotal) },
    { title: 'Amount Paid', value: currencyFormatter(Math.abs(summary.amountPaid)) },
    { title: 'Balance Due', value: currencyFormatter(summary.subTotal + summary.amountPaid) },
  ]
  doc.rect(14, rectY, 96, 30, 'D')
  summaryInfo.forEach(sum => {
    let rectD = 'D'
    if (sum.title === 'Balance Due') {
      doc.setFillColor(211)
      rectD = 'FD'
    }
    doc.rect(rectX, rectY, rectL, rectW, rectD)
    doc.setFont(baseFont, 'bold')
    doc.text(sum.title, summaryX, rectY + 6)
    doc.setFont(baseFont, 'normal')
    doc.text(sum.value, summaryX + 40, rectY + 6)
    rectY = rectY + 10
  })
  return doc
}

export const paymentsTerms = [
  { value: 24, label: '20' },
  { value: 25, label: '30' },
]
