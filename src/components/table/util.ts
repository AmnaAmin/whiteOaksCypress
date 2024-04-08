import * as XLSX from 'xlsx'
import { APP_LOCAL_DATE_FORMAT_Z } from 'components/layout/constants'
import { format } from 'date-fns'

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
  XLSX.writeFile(wb, `${fileName}.csv`)

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

export function getNextMonthFirstDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const nextMonthYear = month === 11 ? year + 1 : year;
  const nextMonth = (month + 1) % 12;

  const nextMonthFirstDate = new Date(nextMonthYear, nextMonth, 2);

  return nextMonthFirstDate.toISOString().substring(0, 10);
}
