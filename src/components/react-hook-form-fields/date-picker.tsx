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
  defaultValue?: Date
  placeholder?: string
  onChange?: (e) => void
  testId?: string
}
const CalendarContainer = ({ children }) => {
  return <Portal>{children}</Portal>
}

export const FormDatePicker = React.forwardRef((props: DatePickerProps, ref) => (
  <FormControl {...props.style} size={props.size || 'lg'}>
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
            selected={new Date(value)}
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
                testId={props.testId}
                size={props.size || 'lg'}
                style={props.elementStyle}
              />
            }
          />
          <Box minH="20px" mt="3px">
            <FormErrorMessage m="0px">{fieldState.error?.message}</FormErrorMessage>
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
    />

    <InputRightElement className="InputLeft" pointerEvents="none" zIndex={1}>
      <Box color="gray.400" fontSize="14px">
        <AiOutlineCalendar size={20} cursor="pointer" color="#A0AEC0" />
      </Box>
    </InputRightElement>
  </InputGroup>
))
