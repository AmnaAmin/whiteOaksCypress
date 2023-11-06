import { useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { INVOICE_STATUS_OPTIONS, InvoicingType } from 'types/invoice.types'
import { useClient } from 'utils/auth-context'
import { dateFormat, dateISOFormatWithZeroTime, datePickerFormat } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/string-formatters'
import autoTable from 'jspdf-autotable'
import { addImages } from 'utils/file-utils'
import numeral from 'numeral'
import { TransactionTypeValues } from 'types/transaction.type'
import { addDays } from 'date-fns'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { readFileContent } from './vendor-details'
import { Project } from 'types/project.type'

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
export const useFetchInvoiceDetails = ({ invoiceId }: { invoiceId: string | number | undefined | null }) => {
  const client = useClient()
  const { data: invoiceDetails, ...rest } = useQuery<InvoicingType>(
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

export const mapFormValuesToPayload = async ({ projectData, invoice, values, account, invoiceAmount }) => {
  let attachmentDTO = await readFileContent(values?.attachments)
  if (attachmentDTO) {
    attachmentDTO = {
      documentType: 1029,
      fileObjectContentType: values?.attachments?.type,
      fileType: values?.attachments.name,
      fileObject: attachmentDTO,
    }
  }
  // Only save received items once invoice will be PAID (Remaining Payment 0), else it will be dynamically calculated from current transactions.
  const lineItems = [
    ...values.finalSowLineItems,
    ...(parseFloat(values.remainingPayment) === 0 ? values.receivedLineItems : []),
  ]
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
    invoiceLineItems: [...lineItems]?.map(item => {
      return {
        id: item.id,
        transactionId: item?.type === 'finalSowLineItems' ? item.transactionId : null,
        name: item.name,
        type: item.type,
        description: item.description,
        amount: item.amount,
        createdDate: item.createdDate,
      }
    }),
    woaExpectedPay: values.woaExpectedPayDate,
    invoiceNumber: values.invoiceNumber,
    invoiceDate: values.invoiceDate,
    paymentReceived: values.paymentReceivedDate,
    changeOrderId: invoice ? invoice?.changeOrderId : null,
    documents: attachmentDTO ? [attachmentDTO] : [],
    //only save sowAmount once invoice is going for PAID (Remaining Payment 0), else it will be same as current projects sowAmount.
    sowAmount: parseFloat(values.remainingPayment) === 0 ? projectData?.sowNewAmount : null,
    remainingPayment: !invoice ? invoiceAmount : values.remainingPayment,
  }
  return payload
}
export const useTotalAmount = ({ invoiced, received }) => {
  const totalAmount = invoiced?.reduce((result, item) => {
    if (item.amount) {
      return result + Number(item.amount)
    } else {
      return result
    }
  }, 0)
  const totalReceived = received?.reduce((result, item) => {
    if (item.amount) {
      return result + Number(item.amount)
    } else {
      return result
    }
  }, 0)

  return {
    formattedAmount: numeral(totalAmount).format('$0,0.00'),
    invoiced: totalAmount,
    formattedReceived: numeral(totalReceived).format('$0,0.00'),
    received: totalReceived,
  }
}
export const isReceivedTransaction = transaction => {
  const compatibleType =
    transaction.status === 'APPROVED' &&
    [TransactionTypeValues.deductible, TransactionTypeValues.depreciation, TransactionTypeValues.invoice].includes(
      transaction.transactionType,
    )

  return !transaction.parentWorkOrderId && compatibleType
}
const isAddedInFinalSow = transaction => {
  const compatibleType =
    transaction.transactionType === TransactionTypeValues.carrierFee ||
    transaction.transactionType === TransactionTypeValues.legalFee ||
    transaction.transactionType === TransactionTypeValues.changeOrder ||
    transaction.transactionType === TransactionTypeValues.originalSOW
  return (
    transaction.status === 'APPROVED' && !transaction.parentWorkOrderId && compatibleType && !transaction.invoiceNumber
  )
}

export const invoiceDefaultValues = ({ invoice, projectData, invoiceCount, clientSelected, transactions }) => {
  const invoiceInitials = getInvoiceInitials(projectData, invoiceCount)
  const invoicedDate = new Date()
  const utcDate = new Date(invoicedDate.getUTCFullYear(), invoicedDate.getUTCMonth(), invoicedDate.getUTCDate())
  const paymentTerm = Number(clientSelected?.paymentTerm) ?? 0
  const woaExpectedDate = addDays(utcDate, paymentTerm)
  let received = [] as any
  let finalSowLineItems = [] as any
  if (transactions?.length) {
    transactions.forEach(t => {
      if (isReceivedTransaction(t)) {
        received.push({
          id: null,
          transactionId: t.id,
          checked: false,
          name: t.name,
          type: 'receivedLineItems',
          description: t.transactionTypeLabel,
          amount: Math.abs(t.transactionTotal),
          createdDate: datePickerFormat(t.modifiedDate),
        })
      }
    })
  }
  if (!invoice) {
    if (transactions?.length) {
      transactions.forEach(t => {
        if (isAddedInFinalSow(t)) {
          finalSowLineItems.push({
            id: null,
            transactionId: t.id,
            checked: false,
            name: t.name,
            type: 'finalSowLineItems',
            description: t.transactionTypeLabel,
            amount: t.transactionTotal,
            createdDate: datePickerFormat(t.modifiedDate),
          })
        }
      })
    }
  }

  return {
    invoiceNumber: invoice?.invoiceNumber ?? invoiceInitials,
    invoiceDate: datePickerFormat(invoice?.invoiceDate ?? invoicedDate),
    paymentTerm: PAYMENT_TERMS_OPTIONS?.find(p => p.value === (invoice?.paymentTerm ?? clientSelected?.paymentTerm)),
    woaExpectedPayDate: datePickerFormat(invoice?.woaExpectedPay ?? woaExpectedDate),
    finalSowLineItems: !invoice
      ? finalSowLineItems
      : invoice?.invoiceLineItems?.filter(t => t.type === 'finalSowLineItems'),
    // fetch saved received items once invoice is PAID, else it will be dynamically calculated from current transactions.
    receivedLineItems:
      invoice?.status === 'PAID' ? invoice?.invoiceLineItems?.filter(t => t.type === 'receivedLineItems') : received,
    status: INVOICE_STATUS_OPTIONS?.find(o => o.value === invoice?.status) ?? INVOICE_STATUS_OPTIONS[0],
    paymentReceivedDate: datePickerFormat(invoice?.paymentReceived),
    attachments: undefined,
    sowAmount: invoice?.sowAmount,
    remainingPayment: invoice ? Number(invoice?.remainingPayment)?.toFixed(2) ?? 0 : null,
    payment: invoice ? (Number(invoice?.invoiceAmount) - Number(invoice?.remainingPayment))?.toFixed(2) : null,
  }
}

export const createInvoicePdf = async ({ doc, invoiceVals, address, projectData, sowAmt, received }) => {
  let sowAmount = sowAmt ?? (projectData?.sowNewAmount?.toString() as string)

  let finalSowLineItems = invoiceVals?.invoiceLineItems?.filter(t => t.type === 'finalSowLineItems')
  let receivedLineItems = invoiceVals?.invoiceLineItems?.filter(t => t.type === 'receivedLineItems')

  finalSowLineItems = finalSowLineItems?.length > 0 ? finalSowLineItems : [{ type: '', description: '', amount: 0 }]
  receivedLineItems = receivedLineItems?.length > 0 ? receivedLineItems : [{ type: '', description: '', amount: 0 }]

  let receivedTotal
  if (receivedLineItems.length > 1) {
    receivedTotal = receivedLineItems?.map(p => p?.amount).reduce((prev, curr) => Number(prev) + Number(curr), 0)
  } else {
    receivedTotal = receivedLineItems?.[0]?.amount
  }

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
        pm: projectData?.projectManager,
        address: projectData?.streetAddress,
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

  doc.setFont(summaryFont, 'bold')
  doc.text('Receivable', startx, 140)

  autoTable(doc, {
    startY: y2 + 85,
    headStyles: { fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.1 },
    theme: 'grid',
    bodyStyles: { lineColor: '#000000', minCellHeight: 15 },
    body: [
      ...receivedLineItems.map(ai => {
        return {
          type: ai.name,
          description: ai.description,
          date: ai.createdDate,
          amount: ai.amount ? currencyFormatter(ai.amount) : 0,
        }
      }),
    ],
    columnStyles: {
      type: { cellWidth: 40 },
      description: { cellWidth: 50 },
      date: { cellWidth: 30 },
      amount: { cellWidth: 30 },
    },
    columns: [
      { header: 'Type', dataKey: 'type' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Amount', dataKey: 'amount' },
    ],
  })

  const baseFont = 'times'
  let tableEndsY = (doc as any).lastAutoTable.finalY /* last row Y of auto table */
  doc.setFontSize(12).setFont(baseFont, 'normal')
  doc.internal.pageSize.getHeight()
  doc.setDrawColor(0, 0, 0)

  let invoiceHeadingYSize = tableEndsY + 25

  let finalSow
  if (finalSowLineItems.length > 1) {
    finalSow = finalSowLineItems?.map(p => p?.amount).reduce((prev, curr) => Number(prev) + Number(curr), 0)
  } else {
    finalSow = finalSowLineItems?.[0]?.amount
  }

  const summaryInfo = [
    {
      title: 'SOW Amount:',
      value: currencyFormatter(sowAmount),
    },
    {
      title: 'Amount Received:',
      value: currencyFormatter(receivedTotal),
    },
    {
      title: 'Remaining AR:',
      value: currencyFormatter(Number(sowAmount) - received),
    },
    {
      title: 'Invoice Amount:',
      value: currencyFormatter(finalSow),
    },
  ]

  doc.setFont(summaryFont, 'bold')
  doc.text('Invoice', startx, invoiceHeadingYSize)

  autoTable(doc, {
    startY: tableEndsY + 30,
    headStyles: { fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.1 },
    theme: 'grid',
    bodyStyles: { lineColor: '#000000', minCellHeight: 15 },
    body: [
      ...finalSowLineItems.map(ai => {
        return {
          type: ai.name,
          description: ai.description,
          date: ai.createdDate,
          amount: ai.amount ? currencyFormatter(ai.amount) : 0,
        }
      }),
    ],
    columnStyles: {
      type: { cellWidth: 40 },
      description: { cellWidth: 50 },
      date: { cellWidth: 30 },
      amount: { cellWidth: 30 },
    },
    columns: [
      { header: 'Type', dataKey: 'type' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Date', dataKey: 'date' },
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
    tableEndsY = 20
  }
  const rectLL = 30
  const rectWW = 10

  summaryInfo.forEach(sum => {
    let rectDD = 'D'
    // if (sum.title === 'Balance Due') {
    doc.setFillColor(211)
    rectDD = 'FD'
    // }
    doc.rect(rectXX, rectYY, rectLL, rectWW, rectDD)
    doc.setFont(baseFont, 'bold')
    doc.text(sum.title, summaryXX - 9, rectYY + 6)
    doc.setFont(baseFont, 'normal')
    doc.text(sum.value, summaryXX + 28, rectYY + 6)
    rectYY = rectYY + 10
  })

  doc.setFont(summaryFont, 'bold')
  doc.text('Thank you for your bussiness!', startx, 280)

  doc.setFontSize(10)
  doc.setFont(basicFont, 'normal')
  return doc
}

export const getInvoiceInitials = (projectData?: Project, revisedIndex?: number) => {
  return (
    projectData?.clientName?.split(' ')?.[0] +
    '-' +
    projectData?.market?.slice(0, 3) +
    '-' +
    projectData?.streetAddress?.split(' ').join('')?.slice(0, 7) +
    (revisedIndex && revisedIndex > 0 ? `-R${String(revisedIndex).padStart(2, '0')}` : '')
  )
}
