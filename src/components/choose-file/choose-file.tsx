import { Button, Box, Text, Flex } from '@chakra-ui/react'
import * as React from 'react'
import { BiUpload } from 'react-icons/bi'

type ChooseFileProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onClear?: () => void
  isError?: boolean
  testId?: string
}

const ChooseFileField: React.FC<ChooseFileProps> = ({ children, value, testId, onClear, isError, ...inputProps }) => {
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
      cursor="pointer"
      w="100%"
      minW="215px"
      h="40px"
      borderWidth="1px"
      borderStyle="solid"
      borderColor={isError ? 'red' : '#E2E8F0'}
      rounded="6"
      onClick={() => inputRef?.current?.click()}
      bg="white"
      _hover={{
        borderColor: 'gray.300',
      }}
    >
      <input
        {...inputProps}
        ref={inputRef}
        type="file"
        style={{ display: 'none', color: 'red' }}
        onChange={onFileChange}
        data-testid={testId}
      />
      <Box flex="1" position="relative" overflow="hidden">
        {value && (
          <Flex rounded="6px" alignItems="center" height="40px">
            <Text
              whiteSpace="nowrap"
              title={value as string}
              color={isError ? 'red' : '#4E87F8'}
              fontSize="14px"
              fontWeight={400}
              fontStyle={'normal'}
              marginLeft={3}
              isTruncated
              w="170px"
              textAlign="start"
            >
              {value}
            </Text>
            <Button
              type="button"
              variant="link"
              size="xl"
              colorScheme={isError ? 'red' : 'brand'}
              onClick={onFileClear}
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
