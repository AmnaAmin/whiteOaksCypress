import { CloseIcon } from '@chakra-ui/icons'
import { Divider, Flex, Text } from '@chakra-ui/react'
import FileIcon from 'icons/file-icon'
import numeral from 'numeral'
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { BiImport } from 'react-icons/bi'

const getFileSize = byte => {
  const sizeInMB = Number(byte / 1000000)
  return numeral(sizeInMB).format('0,0.00')
}

export default function FileDragDrop({ onUpload, ...fieldProps }) {
  const [files, setFiles] = useState<any>([])

  const handleDrop = acceptedFiles => {
    setFiles([...files, ...acceptedFiles.map(file => file)])
    const documents = [...files, ...acceptedFiles.map(file => file)] //formatDocuments(acceptedFiles);
    onUpload(documents)
  }

  const handleDelete = index => {
    files.splice(index, 1)
    setFiles([...files])
    onUpload([...files])
  }

  return (
    <Flex width="100%" direction="column" gap="30px" mt={4}>
      <Dropzone onDrop={handleDrop} {...fieldProps}>
        {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open }) => {
          const additionalClass = isDragAccept ? 'accept' : isDragReject ? 'reject' : ''

          return (
            <Flex
              alignItems="center"
              justifyContent="center"
              {...getRootProps({
                className: `${additionalClass}`,
              })}
              style={{
                width: '100%',
                height: '115px',
                border: '2px dashed #A0AEC0',
                borderRadius: '15px',
                backgroundColor: '#F7FAFC',
              }}
              onClick={e => e.stopPropagation()}
            >
              <input {...getInputProps()} />
              <Flex
                direction="column"
                gap="10px"
                alignItems="center"
                style={{
                  fontSize: '14px',
                  lineHeight: '24px',
                  fontWeight: 'bold',
                  color: '#4A5568',
                }}
              >
                <BiImport style={{ width: '24px', height: '24px', color: '#718096' }} />
                {isDragActive ? (
                  <Text as="span">Drop Here</Text>
                ) : (
                  <>
                    <Text as="span">Drag & Drop</Text>
                    <Text as="span" color="#718096">
                      Or{' '}
                      <Text as="span" onClick={open} color="#4E87F8" cursor="pointer">
                        Choose
                      </Text>{' '}
                      your files.
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>
          )
        }}
      </Dropzone>
      <UploadedFiles files={files} setFiles={setFiles} handleDelete={handleDelete} />
    </Flex>
  )
}

function UploadedFiles({ files, setFiles, handleDelete }) {
  if (files?.length > 0) {
    return (
      <Flex direction="column" gap="20px" maxH={'200px'} overflowY={'scroll'}>
        <Flex alignItems="center">
          <Text width="150px" color="#4A5568" fontSize="14px" fontWeight="500" lineHeight="20px">
            Uploaded Files
          </Text>
          <Divider
            orientation="horizontal"
            style={{
              height: '1px',
              backgroundColor: '#CBD5E0',
            }}
          />
        </Flex>
        <Flex direction="column" gap="8px">
          {files.map((file, index) => (
            <Flex
              key={`${file.name}-${index}`}
              alignItems="center"
              justifyContent="space-between"
              style={{
                backgroundColor: '#F7FAFE',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                maxWidth: '342px',
                maxHeight: '35px',
                padding: '5px 10px',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '24px',
                color: '#718096',
              }}
            >
              <Flex gap="10px" alignItems="center">
                <FileIcon />
                <Text
                  as="span"
                  noOfLines={[1]}
                  style={{
                    wordBreak: 'break-all',
                    width: '150px',
                  }}
                >
                  {file.name}
                </Text>
              </Flex>
              <Text as="span">{getFileSize(file.size)} MB</Text>
              <CloseIcon
                cursor="pointer"
                width="7.42px"
                height="7.42px"
                color="#4A5568"
                onClick={() => {
                  handleDelete(index)
                }}
              />
            </Flex>
          ))}
        </Flex>
      </Flex>
    )
  }
  return null
}
