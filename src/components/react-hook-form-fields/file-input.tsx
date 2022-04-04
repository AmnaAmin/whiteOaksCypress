import React, { useRef, ReactNode } from 'react'
import { Box, Flex, FormErrorMessage, FormControl, FormLabel, InputGroup } from '@chakra-ui/react'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker.css'
import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form'
import { BiDownload } from 'react-icons/bi'

type FileInputProps = {
  errorMessage: any
  label?: string
  name: string
  className?: string
  rules?: any
  size?: 'lg' | 'sm'
  style?: any
  defaultValue?: Date
  accept?: string
  register: UseFormRegister<any>
  children: ReactNode
  isRequired?: boolean
  downloadableFile?: { name: string; url: string }
  id?: any
  testId?: string
}

const validateFiles = (value: FileList) => {
  if (!value || (value && value.length < 1)) {
    return 'File is required'
  }
  return true
}

export const downloadableLink = (downloadableFile: any) => {
  return (
    <>
      {downloadableFile && downloadableFile.url && (
        <a href={downloadableFile.url} download style={{ color: '#4E87F8' }}>
          <Flex pt="10px">
            <BiDownload fontSize="16px" />
            <Box
              ml="7px"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              fontSize="14px"
              fontWeight={500}
            >
              {downloadableFile.name}
            </Box>
          </Flex>
        </a>
      )}
    </>
  )
}

export const FormFileInput = React.forwardRef((props: FileInputProps, ref) => (
  <FormControl {...props.style} size={props.size || 'lg'} isInvalid={!!props.errorMessage}>
    <FormLabel fontSize={props.size || 'lg'} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
      {props.label}
    </FormLabel>
    <FileUpload
      accept={props.accept}
      testId={props.testId}
      register={props.register(
        props.name,
        props.isRequired
          ? {
              validate: validateFiles,
            }
          : {},
      )}
    >
      {props.children}
    </FileUpload>
    <Box h={7}>
      {downloadableLink(props.downloadableFile)}
      <FormErrorMessage m="0px">{props.errorMessage}</FormErrorMessage>
    </Box>
  </FormControl>
))

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
  children?: ReactNode
  value?: any
  testId?: string
}

const FileUpload = (props: FileUploadProps) => {
  const { register, accept, multiple, children } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void
  }

  const handleClick = () => inputRef.current?.click()

  return (
    <Box className="form-file-input" rounded={6} h="40px" p={0} width="293px" border="2px solid #CBD5E0">
      <InputGroup onClick={handleClick}>
        <input
          type={'file'}
          multiple={multiple || false}
          hidden
          accept={accept}
          {...rest}
          ref={e => {
            ref(e)
            inputRef.current = e
          }}
          data-testid={props.testId}
        />
        {children}
        <Flex overflow="hidden" w={200} bg="#FFFFFF" roundedRight="6px">
          {inputRef.current && (
            <Box
              color="#4E87F8"
              fontWeight={500}
              fontStyle="normal"
              fontSize="14px"
              as="span"
              ml="20px"
              mt="7px"
              mr={5}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {inputRef.current.files && inputRef.current.files[0] && inputRef.current.files[0].name}
            </Box>
          )}
        </Flex>
      </InputGroup>
    </Box>
  )
}
