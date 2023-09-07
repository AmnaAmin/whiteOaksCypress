import * as XLSX from 'xlsx'
import { APP_LOCAL_DATE_FORMAT_Z } from 'components/layout/constants'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { useCallback } from 'react'
import { reduceArrayToObject } from 'utils'
import { useTableContext } from './table-context'
import { useTranslation } from 'react-i18next'
import Excel from 'exceljs'

export const getFileBlob = ({ columns, data, fileType, fileName }) => {
  const header = columns.map(c => c.exportValue)
  const compatibleData = data.map(row => {
    const obj = {}
    header.forEach((col, index) => {
      obj[col] = row[index]
    })
    return obj
  })

  const wb = XLSX.utils.book_new()
  const ws1 = XLSX.utils.json_to_sheet(compatibleData, {
    header,
  })
  XLSX.utils.book_append_sheet(wb, ws1, 'Projects')
  XLSX.writeFile(wb, `${fileName}.xlsx`)

  // Returning false as downloading of file is already taken care of
  return false
}

export const trimCanvas = canvas => {
  const ctx = canvas.getContext('2d'),
    copy = document.createElement('canvas').getContext('2d'),
    pixels = ctx.getImageData(0, 0, canvas.width, canvas.height),
    l = pixels.data.length
  let i
  const bound = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
  let x, y

  for (i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % canvas.width
      // eslint-disable-next-line no-bitwise
      y = ~~(i / 4 / canvas.width)

      if (bound.top === null) {
        bound.top = y
      }

      if (bound.left === null) {
        bound.left = x
      } else if (x < bound.left) {
        bound.left = x
      }

      if (bound.right === null) {
        bound.right = x
      } else if (bound.right < x) {
        bound.right = x
      }

      if (bound.bottom === null) {
        bound.bottom = y
      } else if (bound.bottom < y) {
        bound.bottom = y
      }
    }
  }

  const trimHeight = bound?.bottom - bound.top,
    trimWidth = bound.right - bound.left,
    trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight)

  if (copy) {
    copy.canvas.width = trimWidth
    copy.canvas.height = trimHeight
    copy.putImageData(trimmed, 0, 0)
  }

  // open new window with trimmed image:
  return copy?.canvas
}

export const dataURLtoFile = (dataUrl, fileName) => {
  const arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}

export const convertImageToDataURL = (src, callback) => {
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = function () {
    const self = this as HTMLImageElement
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.height = self.naturalHeight
    canvas.width = self.naturalWidth
    ctx?.drawImage(self, 0, 0)
    const dataURL = canvas.toDataURL()
    callback(dataURL)
  }
  img.src = src
  if (img.complete || img.complete === undefined) {
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
    img.src = src
  }
}

export const convertDateTimeToServerISO = date => {
  if (!date) return null
  const formatDate = format(new Date(date), APP_LOCAL_DATE_FORMAT_Z)
  return new Date(formatDate).toISOString()
}

export const convertImageUrltoDataURL = url =>
  fetch(url)
    .then(response => response.blob())
    .then(
      blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        }),
    )

/*old export functionality*/
export const useExportToExcel = () => {
  const { t } = useTranslation()
  const { tableInstance } = useTableContext()

  const exportToExcel = useCallback(
    (data: any[], fileName?: string) => {
      const columns = tableInstance?.options?.columns || []
      const columnsNames = columns.map(column => t(column.header as string))

      // Make dictionary object of columns key with accessorKey and value the object of column because
      // we want access the accessorKey value through accessorFn for customize value
      const columnDefWithAccessorKeyAsKey = reduceArrayToObject(columns, 'accessorKey')

      // Here we map all the key values with accessorFn
      const dataMapped = data.map((row: any) => {
        return Object.keys(row).reduce((acc, key) => {
          const columnDef = columnDefWithAccessorKeyAsKey[key]
          const header = columnDef?.header

          const value = columnDef?.accessorFn?.(row) || row[key]

          // If the header is not defined we don't want to export it
          if (!header) return acc

          return {
            ...acc,
            [t(header)]: value,
          }
        }, {})
      })

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(dataMapped, { header: columnsNames })

      XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
      XLSX.writeFile(wb, fileName ?? 'export.csv')
    },
    [tableInstance],
  )

  return exportToExcel
}

export const useSaveToExcel = () => {
  const { t } = useTranslation()
  const { tableInstance } = useTableContext()
  const workbook = new Excel.Workbook()

  const exportToExcel = useCallback(
    async (data: any[], fileName?: string) => {
      try {
        const worksheet = workbook.addWorksheet('Sheet 1')
        // each columns contains header and its mapping key from data
        const columns = tableInstance?.options?.columns || []
        const columnsNames = columns.map((column, index) => {
          var style = {}
          // @ts-ignore
          if (column?.meta?.format === 'currency') {
            style = { numFmt: '"$"#,##0.00;[Red]-"$"#,##0.00' }
          }
          return { header: t(column.header as string), key: t(column.header as string), style }
        })
        worksheet.columns = columnsNames

        const columnDefWithAccessorKeyAsKey = reduceArrayToObject(columns, 'accessorKey')
        const dataMapped = data.map((row: any) => {
          return Object.keys(row).reduce((acc, key) => {
            const columnDef = columnDefWithAccessorKeyAsKey[key]
            const header = columnDef?.header
            const isCurrency = columnDef?.meta?.format === 'currency'
            // row[key] has data from api
            // accessorFn has data formatted to show on the table
            // Making sure if its a currency we set the data coming from api.
            // For all other values if the formatted option is available in accessor fn that will be set, if not backend api data will be set.
            var value = isCurrency ? row[key] : columnDef?.accessorFn?.(row) || row[key]

            if (!!row[key] && columnDef?.meta?.format === 'date') {
              value = new Date(row[key])
            }

            // If the header is not defined we don't want to export it
            if (!header) return acc

            return {
              ...acc,
              [t(header)]: value,
            }
          }, {})
        })

        // loop through data and add each one to worksheet
        dataMapped.forEach(singleData => {
          worksheet.addRow(singleData)
        })

        // write the content using writeBuffer
        const buf = await workbook.xlsx.writeBuffer()

        // download the processed file
        saveAs(new Blob([buf]), `${fileName ?? 'export'}.xlsx`)
      } catch (error) {
        console.error('Error...', error)
      } finally {
        // removing worksheet's instance to create new one
        workbook.removeWorksheet('Sheet 1')
      }
    },
    [tableInstance],
  )

  return exportToExcel
}
