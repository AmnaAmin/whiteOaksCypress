import React from 'react'
import {
  Box,
  Divider,
  Heading,
  HStack,
  InputProps,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Flex,
} from '@chakra-ui/react'

interface InputViewProps {
  label: string
  Icon?: JSX.Element
  InputElem?: JSX.Element
  showDivider?: boolean
  controlStyle?: any
}

const InputView = ({ label, Icon, InputElem, showDivider = true, controlStyle = {} }: InputViewProps) => {
  return (
    <Box {...controlStyle} whiteSpace="nowrap">
      <HStack align="flex-start" spacing={5}>
        {Icon && (
          <Box fontSize="1.5rem" color="#718096" bottom="5px">
            {Icon}
          </Box>
        )}
        <Stack>
          <Heading color="gray.600" fontSize="14px" fontWeight={500}>
            {label}
          </Heading>
          <Text minH="22px" fontSize="14px" fontStyle="normal" fontWeight={400} color="gray.500">
            {InputElem}
          </Text>
        </Stack>
      </HStack>
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
