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
import { SelectOption, TransactionTypeValues } from 'types/transaction.type'
import { addDays } from 'date-fns'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { readFileContent } from './vendor-details'
import { Project } from 'types/project.type'
import { Document } from 'types/vendor.types'
import { useCallback } from 'react'
import jsPDF from 'jspdf'
import { DOCUMENT_TYPES } from 'constants/documents.constants'
import { orderBy } from 'lodash'

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
        queryClient.invalidateQueries(['projectFinancialOverview', projectId])
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['project', projectId?.toString()])
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

  // function updateInvoiceNumberByRevision(invoiceNo: string): string {
  //   const revisionPattern = new RegExp(/(\d+)-R(\d+)$/)
  //   const matchResult = revisionPattern.exec(invoiceNo)

  //   if (matchResult) {
  //     const newRevision = parseInt(matchResult[2]) + 1
  //     return invoiceNo.replace(revisionPattern, `$1-R${newRevision}`)
  //   } else {
  //     // If no match at the end, add '-R1' to the end
  //     return `${invoiceNo}-R1`
  //   }
  // }
  // function compareInvoiceLineItems(payloadLineItems: [], invoiceDetailsLineItems: []) {
  //   if (payloadLineItems.length !== invoiceDetailsLineItems.length) {
  //     return false
  //   }

  //   for (let i = 0; i < payloadLineItems.length; i++) {
  //     const payloadItemKeys = Object.keys(payloadLineItems[i])

  //     for (const key of payloadItemKeys) {
  //       if (payloadLineItems[i][key] !== invoiceDetailsLineItems[i][key]) {
  //         return false
  //       }
  //     }
  //   }
  //   return true
  // }

  return useMutation(
    async (payload: any) => {
      // const responseInvoiceDetails = await client(`project-invoices/${payload.id}`, {})
      // const invoiceDetails = responseInvoiceDetails?.data as InvoicingType
      // let isInvoiceChanged = false
      // if (payload.paymentTerm !== invoiceDetails.paymentTerm) {
      //   console.log('Invoice name changed reason: payment term')
      //   isInvoiceChanged = true
      // }
      // if (payload.invoiceDate !== invoiceDetails.invoiceDate) {
      //   console.log('Invoice name changed reason: invoice date')
      //   isInvoiceChanged = true
      // }

      // if (
      //   !compareInvoiceLineItems(
      //     payload.invoiceLineItems?.filter(l => l.type === 'finalSowLineItems'),
      //     invoiceDetails.invoiceLineItems,
      //   )
      // ) {
      //   console.log('Invoice name changed reason: invoice line items')
      //   isInvoiceChanged = true
      // }

      // if (isInvoiceChanged) {
      //   const pattern = /-(\d+)(?:-R(\d+))?$/
      //   const currInvoiceNumber = payload.invoiceNumber
      //   const match = currInvoiceNumber.match(pattern)
      //   if (match) {
      //     payload.invoiceNumber = updateInvoiceNumberByRevision(currInvoiceNumber)
      //   }
      // }
      return client('project-invoices', {
        data: payload,
        method: 'PUT',
      })
    },
    {
      onSuccess(res) {
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['invoices', projectId])
        queryClient.invalidateQueries(['transactions', projectId])
        queryClient.invalidateQueries(['projectFinancialOverview', projectId])
        queryClient.invalidateQueries(['project', projectId])
        queryClient.invalidateQueries(['project', projectId?.toString()])
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
    invoiceNumber: values.invoiceNumber?.trim(),
    invoiceDate: values.invoiceDate,
    paymentReceived: values.paymentReceivedDate,
    changeOrderId: invoice ? invoice?.changeOrderId : null,
    documents: attachmentDTO ? [attachmentDTO] : [],
    paymentSource: values?.paymentSource?.map(e => {
      return { lookupValueId: e.value, lookupValueValue: e.title }
    }),
    //only save sowAmount once invoice is going for PAID (Remaining Payment 0), else it will be same as current projects sowAmount.
    sowAmount: parseFloat(values.remainingPayment) === 0 ? projectData?.sowNewAmount : null,
    remainingPayment: !invoice ? invoiceAmount : values.remainingPayment,
    payment: values.payment ?? 0,
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
    [TransactionTypeValues.deductible, TransactionTypeValues.depreciation, TransactionTypeValues.payment].includes(
      transaction.transactionType,
    )

  return !transaction.parentWorkOrderId && compatibleType
}
const isAddedInFinalSow = transaction => {
  const isInvoiceCancelled = t => {
    if (t.invoiceStatus === 'CANCELLED') return true

    return false
  }

  const compatibleType =
    transaction.transactionType === TransactionTypeValues.carrierFee ||
    transaction.transactionType === TransactionTypeValues.legalFee ||
    transaction.transactionType === TransactionTypeValues.changeOrder ||
    transaction.transactionType === TransactionTypeValues.originalSOW
  return (
    transaction.status === 'APPROVED' &&
    !transaction.parentWorkOrderId &&
    compatibleType &&
    (!transaction.invoiceNumber || isInvoiceCancelled(transaction))
  )
}

export const invoiceDefaultValues = ({
  invoice,
  projectData,
  invoiceCount,
  clientSelected,
  transactions,
  invoiceNumber,
  paymentSource,
}) => {
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
    invoiceNumber: invoice?.invoiceNumber ?? invoiceNumber,
    invoiceDate: datePickerFormat(invoice?.invoiceDate ?? invoicedDate),
    paymentTerm: PAYMENT_TERMS_OPTIONS?.find(p => p.value === (invoice?.paymentTerm ?? clientSelected?.paymentTerm)),
    woaExpectedPayDate: datePickerFormat(invoice?.woaExpectedPay ?? woaExpectedDate),
    finalSowLineItems: !invoice
      ? finalSowLineItems
      : invoice?.invoiceLineItems?.filter(t => t.type === 'finalSowLineItems'),
    // fetch saved received items once invoice is PAID, else it will be dynamically calculated from current transactions.
    receivedLineItems: received,
    status: INVOICE_STATUS_OPTIONS?.find(o => o.value === invoice?.status) ?? INVOICE_STATUS_OPTIONS[0],
    paymentReceivedDate: datePickerFormat(invoice?.paymentReceived),
    attachments: undefined,
    sowAmount: invoice?.sowAmount,
    remainingPayment: invoice ? Number(invoice?.remainingPayment)?.toFixed(2) ?? 0 : null,
    payment: Number(0)?.toFixed(2),
    paymentSource: invoice?.paymentSource?.map(e => {
      return { value: e.lookupValueId, label: e.lookupValueValue }
    })
  }
}

export const createInvoicePdf = async ({
  doc,
  invoiceVals,
  address,
  projectData,
  sowAmt,
  received,
  receivedLineItems,
  paymentSourceOptions = [],
}) => {
  let sowAmount = sowAmt ?? (projectData?.sowNewAmount?.toString() as string)
  let finalSowLineItems = invoiceVals?.invoiceLineItems?.filter(t => t.type === 'finalSowLineItems')

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
  const paymentSourceLables = paymentSourceOptions?.map((option: SelectOption) => option.label).join(', ')
  doc.setFont(summaryFont, 'bold');
  doc.text('Payment Source:', startx, 85);
  doc.setFont(summaryFont, 'normal');
  doc.text(paymentSourceLables ?? '', startx + 30, 85);
  doc.setFont(summaryFont, 'bold');
  doc.text('To:', x2 + 5, y2 + 25);
  doc.setFont(summaryFont, 'normal');
  doc.text('Accounts Payable', x2 + 30, y2 + 25);
  doc.setFont(summaryFont, 'normal');
  doc.text(projectData?.clientName ?? '', x2 + 30, y2 + 29);
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
          date: dateFormat(ai.createdDate),
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
          date: dateFormat(ai.createdDate),
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
  if (doc.internal.pageSize.getHeight() - tableEndsY2 < 60) {
    doc.addPage()
    rectYY = 20
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
  doc.text('Thank you for your bussiness!', startx, rectYY - 5)

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

export const useUpdateInvoicingDocument = () => {
  const client = useClient()

  return useMutation(async (payload: Document) => {
    let documentsData = await client('documents?projectId.equals=' + payload?.projectId, {})
    let documents = documentsData?.data
    if (documents) {
      documents = documents?.filter(
        (d: Document) =>
          d?.projectInvoiceId === payload?.projectInvoiceId && d?.documentType === DOCUMENT_TYPES.INVOICE,
      )
      documents = orderBy(
        documents,
        [
          item => {
            const modifiedDate = new Date(item?.modifiedDate)
            return modifiedDate
          },
        ],
        ['desc'],
      )
    }
    if (documents && Array.isArray(documents)) {
      payload.id = documents?.[0]?.id
    }

    return client('documents', {
      data: payload,
      method: 'PUT',
    })
  })
}

export const useInvoiceModalClossed = () => {
  const client = useClient()
  const toast = useToast()
  return useMutation(async (invoiceNumber: string) => {
    return await client('invoice-cancelled/' + invoiceNumber, { method: 'PUT' })
  }, {
    onError(error: any) {
      let description = error.title ?? 'Unable to Invalidate Invoice Number.'

      toast({
        title: 'Invoice',
        description,
        position: 'top-left',
        status: 'error',
        isClosable: true,
      })
    }
  })
}

export const useFetchInvoiceDetail = (projectId: string, selectedInvoice: string | number | null | undefined) => {
  const client = useClient()
  const { data: invoiceDetail, ...rest } = useQuery(
    ['invoicesDetail', projectId],
    async () => {
      const response = await client(`project/${projectId}/invoiceNo`, {})
      return response
    },
    {
      enabled: !!projectId && projectId !== 'undefined' && !selectedInvoice,
    },
  )
  return {
    invoiceDetail,
    ...rest,
  }
}

export const useGenerateInvoicePDF = () => {
  const client = useClient()

  return useCallback(async (invoiceId, woAddress, payload) => {
    const transactionsResponse = await client(
      `change-orders/v1?projectId=${payload.projectId}&sort=modifiedDate,asc`,
      {},
    )
    const projectResponse = await client(`projects/${payload.projectId}?cacheBuster=${new Date().valueOf()}`, {})
    const invoiceResponse = await client(`project-invoices/${invoiceId}`, {})
    const invoice = invoiceResponse?.data
    const transactions = transactionsResponse?.data
    const projectData = projectResponse?.data

    let received = [] as any
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

    const totalReceived = received?.reduce((result, item) => {
      if (item.amount) {
        return result + Number(item.amount)
      } else {
        return result
      }
    }, 0)

    let form = new jsPDF()
    form = await createInvoicePdf({
      doc: form,
      invoiceVals: payload,
      address: woAddress,
      projectData,
      sowAmt: invoice?.sowAmount,
      received: totalReceived,
      receivedLineItems: received,
      paymentSourceOptions: invoice?.paymentSource?.map(e => {
        return { value: e.lookupValueId, label: e.lookupValueValue }
      })
    })
    const pdfUri = form.output('datauristring')
    return {
      documentType: 42,
      projectId: projectData?.id,
      fileObject: pdfUri.split(',')[1],
      fileObjectContentType: 'application/pdf',
      fileType: 'Invoice.pdf',
      projectInvoiceId: invoice?.id,

    }
  }, [])
}
