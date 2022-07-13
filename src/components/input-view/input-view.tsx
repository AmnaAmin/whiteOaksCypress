import React from 'react'
import { Box, Divider, Heading, InputProps, Stack, Text, FormControl, FormLabel, Input, Flex } from '@chakra-ui/react'

interface InputViewProps {
  label: string
  Icon?: JSX.Element
  InputElem?: JSX.Element
  showDivider?: boolean
  controlStyle?: any
}

const InputView = ({ label, InputElem, showDivider = true, controlStyle = {} }: InputViewProps) => {
  return (
    <Box {...controlStyle} pt={6}>
      <Stack>
        <Heading color="gray.600" fontSize="14px" fontWeight={500} {...controlStyle} isTruncated title={label}>
          {label}
        </Heading>
        <Text
          minH="22px"
          fontSize="14px"
          fontStyle="normal"
          fontWeight={400}
          color="gray.500"
          {...controlStyle}
          isTruncated
          title={InputElem}
        >
          {InputElem}
        </Text>
      </Stack>

      {showDivider && <Divider orientation="horizontal" pt={2} />}
    </Box>
  )
}

export const ReadOnlyInput: React.FC<InputProps & { label: string; testId?: string; Icon?: React.ElementType }> = ({
  label,
  name,
  testId,
  Icon,
  ...inputProps
}) => {
  return (
    <Flex>
      <Box my="1" mr="4">
        {Icon && <Icon fontSize="18px" color="#718096" />}
      </Box>
      <FormControl>
        <FormLabel htmlFor={name} color="gray.600" fontSize="14px" marginBottom="0.5" whiteSpace="nowrap">
          {label}
        </FormLabel>
        <Input
          {...inputProps}
          whiteSpace="nowrap"
          id={name}
          name={name}
          data-testid={testId}
          variant="unstyled"
          disabled
          color="gray.500"
          fontSize="14px"
        />
      </FormControl>
    </Flex>
  )
}

export default InputView
