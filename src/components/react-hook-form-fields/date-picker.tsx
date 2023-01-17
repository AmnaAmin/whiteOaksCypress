import React, { LegacyRef } from 'react'
import { Input, FormErrorMessage, FormControl, FormLabel, InputGroup, Box, InputRightElement } from '@chakra-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, Control } from 'react-hook-form'
import { getFormattedDate } from 'utils/date-time-utils'
import { BiCalendar } from 'react-icons/bi'

type DatePickerProps = {
  disabled?: boolean
  elementStyle?: any
  errorMessage: any
  label?: string
  name: string
  control?: any | Control // need to fix
  className?: string
  rules?: any
  size?: 'lg' | 'sm'
  style?: any
  isRequired?: boolean
  defaultValue?: Date | string | null
  placeholder?: string
  onChange?: (e) => void
  testId?: string
  errorBoxheight?: any
}

export const FormDatePicker = React.forwardRef((props: DatePickerProps, ref) => (
  <FormControl {...props.style} size={props.size || 'lg'} isInvalid={!!props.errorMessage}>
    <FormLabel htmlFor={props.name} fontSize={props.size || 'sm'} color="#2D3748" fontWeight={500}>
      {props.label}
    </FormLabel>
    <Controller
      control={props.control}
      name={props.name}
      rules={props.rules}
      render={({ field: { onChange, onBlur, value, ...rest }, fieldState }) => {
        return (
          <>
            <DatePicker
              style={props.style}
              selected={value ? new Date(value) : new Date()}
              value={value || ''}
              onBlur={onBlur}
              onChange={val => {
                const format = getFormattedDate(val)
                onChange(format)
                if (props.onChange) props.onChange(val)
              }}
              placeholderText={props.placeholder}
              customInput={
                <DatePickerInput
                  disable={props.disabled}
                  variant={props.isRequired}
                  testId={props.testId}
                  size={props.size || 'lg'}
                  style={props.elementStyle}
                />
              }
            />
            <Box>
              <FormErrorMessage position="absolute" mt="3px">
                {fieldState.error?.message}
              </FormErrorMessage>
            </Box>
          </>
        )
      }}
    />
  </FormControl>
))

export const DatePickerInput = React.forwardRef((props: any | boolean, ref: LegacyRef<HTMLInputElement>) => (
  <InputGroup zIndex={0}>
    <Input
      {...props.style}
      bg="white"
      size="md"
      color="#718096"
      cursor="pointer"
      onChange={props.onChange}
      onClick={props.onClick}
      placeholder={props.placeholder}
      value={props.value}
      type="text"
      ref={ref}
      data-testid={props.testId}
      disabled={props.disable}
      variant={props.variant ? 'required-field' : 'outline'}
    />

    <InputRightElement className="InputLeft" pointerEvents="none">
      <Box color="gray.400" fontSize="14px">
        <BiCalendar size={20} color="#A0AEC0" />
      </Box>
    </InputRightElement>
  </InputGroup>
))
