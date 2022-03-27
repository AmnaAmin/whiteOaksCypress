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
}

export const FormInput = React.forwardRef((props: InputProps, ref) => (
  <FormControl {...props.controlStyle} size={props.size} isInvalid={!!props.errorMessage} w="215px">
    <FormLabel
      fontWeight={props.weight || 500}
      fontSize={props.size || '14px'}
      color="#4A5568"
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
        fontWeight={400}
        color="#718096"
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
