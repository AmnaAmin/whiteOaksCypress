import React, { ReactNode } from 'react'
import { FormErrorMessage, FormControl, FormLabel, Input, Box, InputGroup } from '@chakra-ui/react'
import { UseFormRegister } from 'react-hook-form'

type InputProps = {
  errorMessage: any
  label?: string
  name: string
  className?: string
  placeholder?: string
  required?: boolean
  size?: 'lg' | 'sm'
  register: UseFormRegister<any>
  controlStyle?: any
  elementStyle?: any
  labelStyle?: any
  rules?: any
  disabled?: boolean
  readOnly?: boolean
  onChange?: (e) => void
  onClick?: (e) => void
  icon?: ReactNode
  value?: string
  weight?: number
  testId?: string
  variant?: string
}

export const FormInput = React.forwardRef((props: InputProps, ref) => (
  <FormControl {...props.controlStyle} size={props.size} isInvalid={!!props.errorMessage}>
    <FormLabel
      display="flex"
      color="#2D3748"
      fontWeight={props.weight || 500}
      fontSize={props.size || '14px'}
      {...props.labelStyle}
      htmlFor={props.name}
    >
      {props.icon && (
        <Box color="#718096" fontSize="1.5rem" mr="2">
          {props.icon}
        </Box>
      )}

      {props.label}
    </FormLabel>
    <InputGroup>
      <Input
        color="gray.500"
        fontSize="14px"
        fontWeight={400}
        type="text"
        bg="white"
        data-testid={props.testId}
        size={props.size || 'md'}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        value={props.value}
        {...props.elementStyle}
        {...props.register(props.name, {
          ...props.rules,
          onChange: props.onChange,
        })}
        variant={props.variant}
      />
    </InputGroup>
    <Box minH="20px" mt="5px">
      <FormErrorMessage m="0px">{props.errorMessage}</FormErrorMessage>
    </Box>
  </FormControl>
))
