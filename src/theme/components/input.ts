import { theme as chakraTheme } from '@chakra-ui/react'
import { inputBorderLeftStyle, inputFocusStateStyle, requiredInputFocusStateStyle } from 'theme/common-style'

const inputDisableStyle = {
  bg: 'gray.100',
  borderColor: 'gray.200',
  color: 'gray.400',
  opacity: 0.8,
}
const input = {
  Input: {
    variants: {
      outline: props => {
        return {
          ...chakraTheme.components.Input.variants.outline(props),
          field: {
            borderRadius: '6px',
            color: 'gray.600',
            bg: 'white',
            _focus: inputFocusStateStyle,
            _disabled: inputDisableStyle,
          },
        }
      },
      'required-field': props => {
        return {
          field: {
            ...chakraTheme.components.Input.variants.outline(props).field,
            ...inputBorderLeftStyle,
            borderRadius: '6px',
            color: 'gray.600',
            bg: 'white',
            _focus: requiredInputFocusStateStyle,
            _disabled: {
              ...inputDisableStyle,
              ...inputBorderLeftStyle,
            },
          },
        }
      },
    },
    sizes: {
      sm: {
        field: {
          fontSize: '13px !important',
        },
      },
      md: {
        field: {
          fontSize: '14px !important',
        },
      },
      lg: {
        field: {
          fontSize: '16px !important',
        },
      },
    },
  },
}

export default input
