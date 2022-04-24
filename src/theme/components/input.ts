import { theme as chakraTheme } from '@chakra-ui/react'
import { inputBorderLeftStyle, inputFocusStateStyle } from 'theme/common-style'

const input = {
  Input: {
    variants: {
      outline: props => {
        return {
          ...chakraTheme.components.Input.variants.outline(props),
          field: {
            borderRadius: '6px',
            color: 'gray.500',
            bg: 'white',
            _focus: inputFocusStateStyle,
          },
        }
      },
      'outline-with-left-border': props => {
        return {
          field: {
            ...chakraTheme.components.Input.variants.outline(props).field,
            ...inputBorderLeftStyle,
            borderRadius: '6px',
            color: 'gray.500',
            bg: 'white',
            _focus: inputFocusStateStyle,
          },
        }
      },
    },
  },
}

export default input
