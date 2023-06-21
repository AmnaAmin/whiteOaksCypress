import { theme as chakraTheme } from '@chakra-ui/react'

const label = {
  FormLabel: {
    baseStyle: {
      ...chakraTheme.components.FormLabel.baseStyle,
      color: 'gray.600',
    },
    variants: {
      'bold-label': {
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '28px',
        color: 'gray.700',
      },
      'strong-label': {
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '28px',
        color: 'gray.700',
      },
      'light-label': {
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '20px',
        color: 'gray.600',
      },
      'clickable-label': {
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '28px',
        color: 'brand.300',
        cursor: 'pointer',
      },
    },
    sizes: {
      sm: {
        fontSize: '13px',
      },
      md: {
        fontSize: '14px',
      },
      lg: {
        fontSize: '16px',
      },
    },
  },
}

export default label
