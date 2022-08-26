import trimCanvas from 'trim-canvas'
import { DocumentPayload } from 'types/project-details.types'

export const downloadFileOnly = doc => {
  fetch(doc.s3Url)
    .then(res => res.blob())
    .then(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = doc.fileType
      a.click()
      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blob as any)
      }, 100)
    })
}

export const downloadFile = url => {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.download = url.split('/').pop()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const imgUtility = {
  generateTextToImage(canvasRef, value) {
    const context = canvasRef?.current?.getContext('2d')

    if (!context || !canvasRef.current) return
    canvasRef.current.width = 1000
    canvasRef.current.height = 64

    context.clearRect(0, 0, canvasRef?.current?.width ?? 0, canvasRef?.current?.height ?? 0)
    context.font = 'italic 500 14px Inter'
    context.textAlign = 'start'
    context.fillText(value, 10, 50)
    const trimContext = trimCanvas(canvasRef.current)

    const uri = trimContext?.toDataURL('image/png')
    return uri
  },
}

// get blob from File object
export const getBlobFromFile = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = error => {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}

// extract the fileObject, fileObjectContentType, fileType from File
export const convertFileToBlob = async (file: File) => {
  const fileObject = await getBlobFromFile(file)
  const fileObjectContentType = file.type
  const fileType = file.name

  return { fileObject, fileObjectContentType, fileType }
}

// make file uploadable
export const createDocumentPayload = (file: File, documentType = 42): Promise<DocumentPayload> => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    let filetype = 'text/plain'

    if (file.type !== '') filetype = file.type

    reader.addEventListener('load', (event: any) => {
      console.log('File', file.type)

      res({
        fileType: file.name,
        fileObject: event?.target?.result?.split(',')[1],
        fileObjectContentType: filetype,
        documentType,
      })
    })

    reader.readAsDataURL(file)
  })
}
