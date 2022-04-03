import { Button, Box, Text, Flex } from '@chakra-ui/react'
import * as React from 'react'
import { CloseIcon } from '@chakra-ui/icons'

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
      // outline="1px solid green"
      as="button"
      display="flex"
      w="100%"
      minW="300px"
      borderWidth="1px"
      borderStyle="solid"
      borderColor={isError ? 'red' : '#ddd'}
      rounded="4"
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
      <Button>{children}</Button>
      <Box flex="1" p="2" position="relative" overflow="hidden">
        {value && (
          <Flex>
            <Text flex="1" textAlign="left" whiteSpace="nowrap" title={value as string}>
              {value}
            </Text>
            <Button
              variant="unstyled"
              size="xs"
              colorScheme="red"
              onClick={onFileClear}
              position="absolute"
              right="0"
              bg="white"
            >
              <CloseIcon w="10px" />
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default ChooseFileField
