import React from 'react'
import { Box, useCheckbox, CheckboxProps, BoxProps } from '@chakra-ui/react'

export const CheckboxButton: React.FC<CheckboxProps> = props => {
  const { getInputProps, getCheckboxProps } = useCheckbox(props)

  const checkboxInput = getInputProps()
  const checkbox = getCheckboxProps() as BoxProps

  return (
    <Box as="label">
      <input {...checkboxInput} data-testid={props['data-testid']} />
      <Box
        {...checkbox}
        className="checkboxButton"
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        bg="gray.100"
        fontcolor="gray.600"
        fontSize="14px"
        color="gray.500"
        _checked={{
          bg: 'green.200',
          color: 'gray.600',
        }}
        pl="2"
        pr="2"
      >
        {props.children}
      </Box>
    </Box>
  )
}
