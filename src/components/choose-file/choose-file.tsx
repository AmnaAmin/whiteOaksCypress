import { Button, Box, Text, Flex, Spacer } from '@chakra-ui/react'
import * as React from 'react'
import { BiUpload } from 'react-icons/bi'

type ChooseFileProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onClear?: () => void
  isError?: boolean
  testId?: string
  isRequired?: boolean
  acceptedFiles?: string
  inputStyle?: any
  uploadIconStyle?: any
  textContStyle?: any
}

const ChooseFileField: React.FC<ChooseFileProps> = ({
  children,
  value,
  testId,
  onClear,
  isError,
  isRequired,
  acceptedFiles,
  inputStyle,
  uploadIconStyle,
  textContStyle,
  ...inputProps
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const onFileChange = event => {
    const file = event.currentTarget.files?.[0]
    inputProps?.onChange?.(file)
    event.target.value = null
  }

  const onFileClear = event => {
    event.stopPropagation()
    onClear?.()
  }

  let leftBorder = '2px solid #345EA6'

  if (isRequired) {
    leftBorder = '2px solid #345EA6'
  }

  if (isError) {
    leftBorder = '2px solid red.400'
  }

  return (
    <Box
      cursor="pointer"
      w="100%"
      minW="215px"
      h="40px"
      borderWidth="1px"
      {...inputStyle}
      borderStyle="solid"
      borderColor={isError ? 'red' : '#E2E8F0'}
      rounded="6"
      onClick={onFileClear}
      bg="white"
      borderLeft={isRequired ? leftBorder : ''}
      _hover={{
        borderColor: 'gray.300',
        borderLeft: isRequired ? leftBorder : '',
        ...inputStyle,
      }}
      className="fileUploader"
    >
      <input
        {...inputProps}
        ref={inputRef}
        type="file"
        style={{ display: 'none', color: 'red' }}
        onChange={onFileChange}
        data-testid={testId}
        accept={acceptedFiles}
      />
      <Button
        type="button"
        variant="ghost"
        size="xl"
        onClick={() => inputRef?.current?.click()}
        _active={{ bg: 'none' }}
        _hover={{ bg: 'none' }}
        flex="1"
        position="relative"
        overflow="hidden"
        sx={{
          '@media only screen and (max-width: 480px)': {
            width: '100% !important',
          },
        }}
      >
        {value && (
          <Flex
            rounded="6px"
            alignItems="center"
            height="40px"
            sx={{
              '@media only screen and (max-width: 480px)': {
                width: '100% !important',
              },
            }}
          >
            <Text
              whiteSpace="nowrap"
              title={value as string}
              color={isError ? 'red' : '#345EA6'}
              fontSize="14px"
              fontWeight={400}
              fontStyle={'normal'}
              marginLeft="12px"
              isTruncated
              w="173px"
              textAlign="start"
              sx={{
                '@media only screen and (max-width: 480px)': {
                  position: 'relative',
                  left: '0',
                  width: '170px',
                },
              }}
              {...(textContStyle && textContStyle ? { ...textContStyle } : {})}
            >
              {value}
            </Text>
            <Spacer />
            <Button
              type="button"
              variant="link"
              size="xl"
              colorScheme={isError ? 'red' : 'darkPrimary'}
              bg="white"
              {...(uploadIconStyle && uploadIconStyle ? { ...uploadIconStyle } : {})}
              sx={{
                '@media only screen and (max-width: 480px)': {
                  position: 'relative',
                  right: '12px',
                },
              }}
            >
              <BiUpload />
            </Button>
          </Flex>
        )}
      </Button>
    </Box>
  )
}

export default ChooseFileField
