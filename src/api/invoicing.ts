import { useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { InvoicingType } from 'types/invoice.types'
import { useClient } from 'utils/auth-context'
import { dateFormat, dateISOFormatWithZeroTime } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'
import autoTable from 'jspdf-autotable'
import { addImages } from 'utils/file-utils'

export const useFetchInvoices = ({ projectId }: { projectId: string | number | undefined }) => {
  const client = useClient()
  const { data: invoices, ...rest } = useQuery<Array<InvoicingType>>(
    ['invoices', projectId],
    async () => {
      const response = await client(`project-invoices?projectId.equals=${projectId}&sort=modifiedDate,asc`, {})

      return response?.data ? response?.data : []
    },
    { enabled: !!projectId && projectId !== 'undefined' },
  )

  return {
    invoices: invoices?.length ? invoices : [],
    ...rest,
  }
}
export const useFetchInvoiceDetails = ({ invoiceId }: { invoiceId: string | number | undefined }) => {
  const client = useClient()
  const { data: invoiceDetails, ...rest } = useQuery<Array<InvoicingType>>(
    ['invoice-details', invoiceId],
    async () => {
      const response = await client(`project-invoices/${invoiceId}`, {})

      return response?.data ? response?.data : []
    },
    { enabled: !!invoiceId && invoiceId !== 'undefined' },
  )

  return {
    invoiceDetails,
    ...rest,
  }
}

export const useCreateInvoiceMutation = ({ projId }) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { projectId } = useParams<'projectId'>() || projId

  return useMutation(
    (payload: any) => {
      return client('project-invoices', {
        data: payload,
        method: 'POST',
      })
    },
    {
      onSuccess(res) {
        queryClient.invalidateQueries(['invoices', projectId])
        queryClient.invalidateQueries(['transactions', projectId])
      },
      onError(error: any) {
        let description = error.title ?? 'Unable to save Invoice.'

        toast({
          title: 'Invoice',
          description,
          position: 'top-left',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useUpdateInvoiceMutation = ({ projId }) => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { projectId } = useParams<'projectId'>() || projId

  return useMutation(
    (payload: any) => {
      return client('project-invoices', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess(res) {
        queryClient.invalidateQueries(['invoices', projectId])
        queryClient.invalidateQueries(['transactions', projectId])
      },
      onError(error: any) {
        let description = error.title ?? 'Unable to save Invoice.'

        toast({
          title: 'Invoice',
          description,
          position: 'top-left',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const mapFormValuesToPayload = ({ projectData, invoice, values, account, invoiceAmount }) => {
  const payload = {
    id: invoice ? invoice?.id : null,
    paymentTerm: values.paymentTerm?.value,
    projectId: projectData?.id,
    status: invoice ? values.status?.value : null,
    createdBy: invoice ? invoice.createdBy : account?.email,
    createdDate: invoice ? invoice?.createdDate : dateISOFormatWithZeroTime(new Date()),
    modifiedDate: dateISOFormatWithZeroTime(new Date()),
    modifiedBy: account?.email,
    invoiceAmount: invoiceAmount,
    invoiceLineItems: [...values.finalSowLineItems, ...values.receivedLineItems]?.map(item => {
      return {
        id: item.id,
        transactionId: item.transactionId,
        name: item.name,
        type: item.type,
        description: item.description,
        amount: item.amount,
      }
    }),
    woaExpectedPay: values.woaExpectedPayDate,
    invoiceNumber: values.invoiceNumber,
    invoiceDate: values.invoiceDate,
    paymentReceived: values.paymentReceivedDate,
    changeOrderId: invoice ? invoice?.changeOrderId : null,
    document: null as any,
  }
  return payload
}

export const createInvoicePdf = async ({ doc, invoiceVals, address, projectData }) => {
  let finalSowLineItems = invoiceVals?.invoiceLineItems?.filter(t => t.type === 'finalSowLineItems')
  let receivedLineItems = invoiceVals?.invoiceLineItems?.filter(t => t.type === 'receivedLineItems')
  finalSowLineItems = finalSowLineItems?.length > 0 ? finalSowLineItems : [{ type: '', description: '', amount: 0 }]
  receivedLineItems = receivedLineItems?.length > 0 ? receivedLineItems : [{ type: '', description: '', amount: 0 }]

  const workOrderInfo = [
    { label: 'Date:', value: dateFormat(invoiceVals?.invoiceDate) ?? '' },
    { label: 'Invoice #:', value: invoiceVals?.invoiceNumber ?? '' },
  ]
  const basicFont = undefined
  const summaryFont = 'Times-Roman'
  const heading = 'INVOICE'
  const startx = 15
  const x1 = 130
  let y1 = 20
  doc.setFontSize(36)
  doc.setFont(basicFont, 'bold')
  doc.text(heading, x1 - 15, y1 + 5)
  var img = new Image()
  img.src = 'wo-logo-tree.png'
  const images = await addImages(['wo-logo-tree.png'])
  doc.addImage(images[0], 'png', 15, 5, 35, 35)

  doc.setFontSize(11)
  doc.setFont(summaryFont, 'bold')
  doc.text(`${address?.companyName}`, startx, 55)
  doc.setFont(summaryFont, 'normal')
  doc.text(`${address?.streetAddress}` ?? '', startx, 60)
  doc.text(address?.city + ' ' + address?.state + ' , ' + address?.zipCode, startx, 65)
  doc.setFont(summaryFont, 'normal')

  const x2 = 110
  let y2 = 50

  workOrderInfo.forEach(inv => {
    doc.setFont(summaryFont, 'bold')
    doc.text(inv.label, x2 + 5, y2 + 5)
    doc.setFont(summaryFont, 'normal')
    doc.text(
      inv.label === 'Start Date:' || inv.label === 'Expected Completion:' ? dateFormat(inv.value) || '' : inv.value,
      x2 + 30,
      y2 + 5,
    )
    y2 = y2 + 5
  })

  doc.setFont(summaryFont, 'bold')
  doc.text('To:', x2 + 5, y2 + 20)
  doc.setFont(summaryFont, 'normal')

  doc.setFont(summaryFont, 'normal')
  doc.text('Accounts Payable', x2 + 30, y2 + 20)

  doc.setFont(summaryFont, 'normal')
  doc.text(projectData?.clientName ?? '', x2 + 30, y2 + 24)

  autoTable(doc, {
    startY: y2 + 35,
    headStyles: { fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.1 },
    theme: 'grid',
    bodyStyles: { lineColor: '#000000', minCellHeight: 15 },
    body: [
      {
        pm: projectData.projectManager,
        address: projectData.streetAddress,
        paymentTerm: invoiceVals?.paymentTerm,
        dueDate: dateFormat(invoiceVals?.woaExpectedPay),
      },
    ],
    columnStyles: {
      pm: { cellWidth: 30 },
      address: { cellWidth: 40 },
      paymentTerm: { cellWidth: 50 },
      dueDate: { cellWidth: 30 },
    },
    columns: [
      { header: 'PM', dataKey: 'pm' },
      { header: 'Property Address', dataKey: 'address' },
      { header: 'Payment Term', dataKey: 'paymentTerm' },
      { header: 'Due Date', dataKey: 'dueDate' },
    ],
  })

  autoTable(doc, {
    startY: y2 + 75,
    headStyles: { fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.1 },
    theme: 'grid',
    bodyStyles: { lineColor: '#000000', minCellHeight: 15 },
    body: [
      ...finalSowLineItems.map(ai => {
        return {
          type: ai.name,
          description: ai.description,
          amount: ai.amount ? currencyFormatter(ai.amount) : 0,
        }
      }),
    ],
    columnStyles: {
      type: { cellWidth: 40 },
      description: { cellWidth: 50 },
      amount: { cellWidth: 60 },
    },
    columns: [
      { header: 'Type', dataKey: 'type' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Amount', dataKey: 'amount' },
    ],
  })

  const baseFont = 'times'
  const tableEndsY = (doc as any).lastAutoTable.finalY /* last row Y of auto table */
  const summaryX = doc.internal.pageSize.getWidth() - 102 /* Starting x point of invoice summary  */
  doc.setFontSize(12).setFont(baseFont, 'normal')
  doc.internal.pageSize.getHeight()
  doc.setDrawColor(0, 0, 0)
  let rectX = summaryX + 26
  let rectY = tableEndsY
  if (doc.internal.pageSize.getHeight() - tableEndsY < 30) {
    doc.addPage()
    rectY = 20
  }
  const rectL = 30
  const rectW = 10

  let finalSow
  if (finalSowLineItems.length > 1) {
    finalSow = finalSowLineItems?.map(p => p?.amount).reduce((prev, curr) => Number(prev) + Number(curr), 0)
  } else {
    finalSow = finalSowLineItems?.[0]?.amount
  }

  const summaryInfo = [
    {
      title: 'Total',
      value: currencyFormatter(finalSow),
    },
  ]

  summaryInfo.forEach(sum => {
    let rectD = 'D'
    // if (sum.title === 'Balance Due') {
    doc.setFillColor(211)
    rectD = 'FD'
    // }
    doc.rect(rectX, rectY, rectL, rectW, rectD)
    doc.setFont(baseFont, 'bold')
    doc.text(sum.title, summaryX - 5, rectY + 6)
    doc.setFont(baseFont, 'normal')
    doc.text(sum.value, summaryX + 28, rectY + 6)
    rectY = rectY + 10
  })

  autoTable(doc, {
    startY: tableEndsY + 20,
    headStyles: { fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.1 },
    theme: 'grid',
    bodyStyles: { lineColor: '#000000', minCellHeight: 15 },
    body: [
      ...receivedLineItems.map(ai => {
        return {
          type: ai.name,
          description: ai.description,
          amount: ai.amount ? currencyFormatter(ai.amount) : 0,
        }
      }),
    ],
    columnStyles: {
      type: { cellWidth: 40 },
      description: { cellWidth: 50 },
      amount: { cellWidth: 60 },
    },
    columns: [
      { header: 'Type', dataKey: 'type' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Amount', dataKey: 'amount' },
    ],
  })

  // Summary
  const summaryXX = doc.internal.pageSize.getWidth() - 102 /* Starting x point of invoice summary  */
  const tableEndsY2 = (doc as any).lastAutoTable.finalY
  doc.setFontSize(12).setFont(baseFont, 'normal')
  doc.internal.pageSize.getHeight()
  doc.setDrawColor(0, 0, 0)
  let rectXX = summaryXX + 26
  let rectYY = tableEndsY2
  if (doc.internal.pageSize.getHeight() - tableEndsY2 < 30) {
    doc.addPage()
    rectY = 20
  }
  const rectLL = 30
  const rectWW = 10

  let receivedTotal
  if (receivedLineItems.length > 1) {
    receivedTotal = receivedLineItems?.map(p => p?.amount).reduce((prev, curr) => Number(prev) + Number(curr), 0)
  } else {
    receivedTotal = receivedLineItems?.[0]?.amount
  }

  const summaryInfo1 = [
    {
      title: 'Total',
      value: currencyFormatter(receivedTotal),
    },
    {
      title: 'Invoice Amount',
      value: currencyFormatter(finalSow - receivedTotal),
    },
  ]

  summaryInfo1.forEach(sum => {
    let rectDD = 'D'
    // if (sum.title === 'Balance Due') {
    doc.setFillColor(211)
    rectDD = 'FD'
    // }
    doc.rect(rectXX, rectYY, rectLL, rectWW, rectDD)
    doc.setFont(baseFont, 'bold')
    doc.text(sum.title, summaryXX - 5, rectYY + 6)
    doc.setFont(baseFont, 'normal')
    doc.text(sum.value, summaryXX + 28, rectYY + 6)
    rectYY = rectYY + 10
  })

  doc.setFont(summaryFont, 'bold')
  doc.text('Thank you for your bussiness!', startx, 270)

  doc.setFontSize(10)
  doc.setFont(basicFont, 'normal')
  return doc
}
