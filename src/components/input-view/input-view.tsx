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
  Icon,
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
      {showDivider && <Divider orientation="horizontal" pt={5} />}
    </Box>
  )
}

export const ReadOnlyInput: React.FC<InputProps & { label: string; testId?: string; icon?: React.ElementType }> = ({
  label,
  name,
  testId,
  icon,
  ...inputProps
}) => {
  return (
    <HStack alignItems="start" spacing="15px">
      <Icon as={icon} boxSize={6} color="gray.500" />
      <Box>
        <FormControl top="1px">
          <FormLabel htmlFor={name} color="gray.600" fontSize="14px" marginBottom="0.5" whiteSpace="nowrap">
            {label}
          </FormLabel>

          <Input
            {...inputProps}
            id={name}
            name={name}
            data-testid={testId}
            variant="unstyled"
            disabled
            color="gray.500"
            fontSize="14px"
          />
        </FormControl>
      </Box>
    </HStack>
  )
}

export default InputView
