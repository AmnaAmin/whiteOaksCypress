import { theme as chakraTheme } from '@chakra-ui/react'
import { inputFocusStateStyle } from 'theme/common-style'

const textArea = {
  Textarea: {
    variants: {
      outline: props => {
        return {
          // @ts-ignore
          ...chakraTheme.components.Textarea.variants.outline(props),
          borderRadius: '6px',
          _focus: inputFocusStateStyle,
        }
      },
    },
  },
}

export default textArea
