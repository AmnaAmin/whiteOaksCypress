import { useClient } from 'utils/auth-context'
import { Document } from 'types/vendor.types'
import { useToast } from '@chakra-ui/toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import autoTable from 'jspdf-autotable'
import { dateFormat } from 'utils/date-time-utils'
import { truncateWithEllipsis } from 'utils/stringFormatters'
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

export const useDocuments = ({ projectId }: { projectId: string | undefined }) => {
  const client = useClient()

  const { data: documents, ...rest } = useQuery<Array<Document>>(['documents', projectId], async () => {
    const response = await client(`documents?projectId.equals=${projectId}&sort=modifiedDate,asc`, {})
    return response?.data
  })

  return {
    documents,
    ...rest,
  }
}

export const documentTypes = [
  { value: 24, label: 'Permit' },
  { value: 25, label: 'Warranty' },
  { value: 56, label: 'Drawings' },
  { value: 57, label: 'NOC' },
  { value: 39, label: 'Original SOW' },
  { value: 58, label: 'Other' },
  { value: 19, label: 'Photos' },
  { value: 18, label: 'Reciept' },
  { value: 17, label: 'Change Order' },
]

export const documentScore = [
  { value: 24, label: '1' },
  { value: 25, label: '2' },
  { value: 56, label: '3' },
  { value: 57, label: '4' },
  { value: 39, label: '5' },
]

export const documentStatus = [
  { value: 24, label: 'Active' },
  { value: 25, label: 'Inactive' },
  { value: 56, label: 'Expired' },
  { value: 57, label: 'DoNotUse' },
]

export const documentTerm = [
  { value: 24, label: '7' },
  { value: 25, label: '10' },
  { value: 56, label: '14' },
  { value: 57, label: '20' },
  { value: 39, label: '30' },
]

export const createInvoice = (doc, workOrder, projectData: ProjectType, items) => {
  const baseFont = 'arial'
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
  doc.save('a4.pdf')

  doc.setFont(baseFont, 'normal')
  doc.text(workOrder?.invoiceNumber, rightMarginX + 35, 45)
  doc.text(truncateWithEllipsis(workOrder?.propertyAddress, 15), rightMarginX + 35, 55)
  doc.text(
    workOrder.dateInvoiceSubmitted ? dateFormat(workOrder?.dateInvoiceSubmitted) : 'mm/dd/yyyy',
    rightMarginX + 35,
    65,
  )
  doc.text(
    workOrder.expectedPaymentDate ? dateFormat(workOrder?.expectedPaymentDate) : 'mm/dd/yyyy',
    rightMarginX + 35,
    75,
  )

  // Table
  autoTable(doc, {
    startY: 85,
    alternateRowStyles: { fillColor: '#FFFFFF' },
    headStyles: { fillColor: '#F7FAFC', textColor: '#4A5568', lineColor: [0, 0, 0] },
    body: [
      ...items.map(ai => {
        return {
          item: ai.item,
          description: ai.description,
          unitPrice: ai.unitPrice,
          quantity: ai.quantity,
          amount: ai.amount,
        }
      }),
    ],
    columns: [
      { header: 'Item', dataKey: 'item' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Unit Price', dataKey: 'unitPrice' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'Amount', dataKey: 'amount' },
    ],
    theme: 'grid',
    bodyStyles: { lineColor: '#B2F5EA', minCellHeight: 15 },
  })

  // Summary
  const tableEndsY = (doc as any).lastAutoTable.finalY /* last row Y of auto table */
  const summaryX = doc.internal.pageSize.getWidth() - 90 /* Starting x point of invoice summary  */
  doc.setFont(baseFont, 'normal')
  doc.text('Subtotal:', summaryX, tableEndsY + 10)
  doc.text('Total:', summaryX, tableEndsY + 20)
  doc.text('Amount Paid:', summaryX, tableEndsY + 30)
  doc.text('Balance Due:', summaryX, tableEndsY + 40)
  doc.text('$0.00', summaryX + 40, tableEndsY + 10)
  doc.text('$0.00', summaryX + 40, tableEndsY + 20)
  doc.text('$0.00', summaryX + 40, tableEndsY + 30)
  doc.text('$0.00', summaryX + 40, tableEndsY + 40)
  return doc
}

export const paymentsTerms = [
  { value: 24, label: '20' },
  { value: 25, label: '30' },
]
