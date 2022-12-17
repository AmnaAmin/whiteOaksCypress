import React from 'react'
import {
  Box,
  Divider,
  Heading,
  InputProps,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Flex,
  HStack,
  Icon,
} from '@chakra-ui/react'

interface InputViewProps {
  label: string
  Icon?: React.ElementType
  InputElem?: JSX.Element | string
  showDivider?: boolean
  controlStyle?: any
}

const InputView = ({ Icon: Icons, label, InputElem, showDivider = true, controlStyle = {} }: InputViewProps) => {
  return (
    <Box {...controlStyle}>
      <Stack>
        <HStack>
          {Icons && (
            <Box color={'#4A5568'}>
              <Icon fontSize={22} as={Icons} />
            </Box>
          )}
          <Heading color="gray.600" fontSize="14px" fontWeight={500} {...controlStyle} isTruncated title={label}>
            <Text color={'#2D3748'}>{label}</Text>
          </Heading>
        </HStack>
        <Text
          minH="22px"
          fontSize="14px"
          fontStyle="normal"
          fontWeight={400}
          color="gray.600"
          {...controlStyle}
          isTruncated
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
        <Text
          noOfLines={1}
          title={inputProps.value as string}
          color="gray.600"
          fontSize="14px"
          fontStyle="normal"
          fontWeight="400"
        >
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
            isTruncated
          />
        </Text>
      </FormControl>
    </Flex>
  )
}

export default InputView
