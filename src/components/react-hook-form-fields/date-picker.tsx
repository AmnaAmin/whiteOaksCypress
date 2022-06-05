import React, { LegacyRef } from 'react'
import {
  Input,
  FormErrorMessage,
  FormControl,
  FormLabel,
  InputGroup,
  Box,
  Portal,
  InputRightElement,
} from '@chakra-ui/react'
import { AiOutlineCalendar } from 'react-icons/ai'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, Control } from 'react-hook-form'
import { getFormattedDate } from 'utils/date-time-utils'

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
const CalendarContainer = ({ children }) => {
  return <Portal>{children}</Portal>
}

export const FormDatePicker = React.forwardRef((props: DatePickerProps, ref) => (
  <FormControl {...props.style} size={props.size || 'lg'} isInvalid={!!props.errorMessage}>
    <FormLabel htmlFor={props.name} fontSize={props.size || 'sm'} color="#4A5568" fontWeight={500}>
      {props.label}
    </FormLabel>
    <Controller
      control={props.control}
      name={props.name}
      rules={props.rules}
      render={({ field: { onChange, onBlur, value, ...rest }, fieldState }) => (
        <>
          <DatePicker
            style={props.style}
            popperContainer={CalendarContainer}
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
            <FormErrorMessage position="absolute" m="0px">
              {fieldState.error?.message}
            </FormErrorMessage>
          </Box>
        </>
      )}
    />
  </FormControl>
))

const DatePickerInput = React.forwardRef((props: any | boolean, ref: LegacyRef<HTMLInputElement>) => (
  <InputGroup>
    <Input
      {...props.style}
      bg="white"
      size="md"
      color="#718096"
      onChange={props.onChange}
      onClick={props.onClick}
      placeholder={props.placeholder}
      value={props.value}
      type="text"
      ref={ref}
      data-testid={props.testId}
      disabled={props.disable}
      variant={props.variant ? 'reguired-field' : 'outline'}
    />

    <InputRightElement className="InputLeft" pointerEvents="none" zIndex={1}>
      <Box color="gray.400" fontSize="14px">
        <AiOutlineCalendar size={20} cursor="pointer" color="#A0AEC0" />
      </Box>
    </InputRightElement>
  </InputGroup>
))
