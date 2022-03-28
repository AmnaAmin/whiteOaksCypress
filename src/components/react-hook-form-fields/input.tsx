import React, { ReactNode } from 'react'
import { FormErrorMessage, FormControl, FormLabel, Input, Box, InputRightElement, InputGroup } from '@chakra-ui/react'
import { UseFormRegister } from 'react-hook-form'

type InputProps = {
  errorMessage: any
  label?: string
  name: string
  className?: string
  placeholder: string
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
}

export const FormInput = React.forwardRef((props: InputProps, ref) => (
  <FormControl {...props.controlStyle} size={props.size} isInvalid={!!props.errorMessage}>
    <FormLabel
      fontWeight={props.weight || 700}
      fontSize={props.size || '16px'}
      {...props.labelStyle}
      htmlFor={props.name}
    >
      {props.label}
    </FormLabel>
    <InputGroup>
      {props.icon && (
        <InputRightElement right="10px" w="auto" className="InputLeft">
          <Box color="gray.400">{props.icon}</Box>
        </InputRightElement>
      )}
      <Input
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
      />
    </InputGroup>
    <Box minH="20px" mt="3px">
      <FormErrorMessage m="0px">{props.errorMessage}</FormErrorMessage>
    </Box>
  </FormControl>
))
