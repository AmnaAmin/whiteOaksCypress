import React, { useRef, ReactNode } from 'react'
import { Box, Flex, FormErrorMessage, FormControl, FormLabel, InputGroup, Text } from '@chakra-ui/react'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker.css'
import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form'
import { BiDownload } from 'react-icons/bi'
import { Button } from 'components/button/button'

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
          <Flex>
            <BiDownload size="30px" fontSize="16px" />
            <Box
              mt="5px"
              ml="7px"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              fontSize="13px"
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
      <Button
        variant="choose-file"
        rounded="none"
        roundedLeft={5}
        fontSize="14px"
        fontWeight={500}
        color="gray.600"
        size="md"
        ml={0}
        colorScheme="gray"
        w={120}
      >
        {props.children}
      </Button>
    </FileUpload>
    <Box mt="10px" w="290px">
      <Text isTruncated>{downloadableLink(props.downloadableFile)}</Text>
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
    <Box className="form-file-input" rounded={6} w="293px" p={0} border="1px solid #CBD5E0">
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
        <Flex overflow="hidden" bg="#FFFFFF" w={200} roundedRight="6px" alignItems="center">
          {inputRef.current && (
            <Box
              color="#4E87F8"
              fontWeight={500}
              fontStyle="normal"
              fontSize="14px"
              as="span"
              ml="20px"
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
