import { Button, Box, Text, Flex } from '@chakra-ui/react'
import * as React from 'react'
import { BiUpload } from 'react-icons/bi'

type ChooseFileProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onClear?: () => void
  isError: boolean
}

const ChooseFileField: React.FC<ChooseFileProps> = ({ children, value, onClear, isError, ...inputProps }) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const onFileChange = event => {
    const file = event.currentTarget.files?.[0]
    inputProps?.onChange?.(file)
  }

  const onFileClear = event => {
    event.stopPropagation()

    onClear?.()
  }

  return (
    <Box
      as="button"
      w="100%"
      minW="215px"
      borderWidth="1px"
      borderStyle="solid"
      borderColor={isError ? 'red' : '#ddd'}
      rounded="6"
      onClick={() => inputRef?.current?.click()}
      bg="white"
      _hover={{
        borderColor: 'gray.400',
      }}
    >
      <input
        {...inputProps}
        ref={inputRef}
        type="file"
        style={{ display: 'none', color: 'red' }}
        onChange={onFileChange}
      />
      <Box flex="1" position="relative" overflow="hidden" height="40px">
        {value && (
          <Flex alignItems="center">
            <Text
              whiteSpace="nowrap"
              title={value as string}
              isTruncated
              color={isError ? 'red' : '#4E87F8'}
              fontSize="14px"
              p={2}
              marginLeft={2}
            >
              {value}
            </Text>
            <Button
              variant="link"
              size="xl"
              colorScheme={isError ? 'red' : 'blue'}
              onClick={onFileClear}
              position="absolute"
              right="5"
              bg="white"
            >
              <BiUpload />
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default ChooseFileField
