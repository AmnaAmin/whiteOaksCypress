import { theme as chakraTheme } from '@chakra-ui/react'

const alert = {
  Alert: {
    baseStyle: props => {
      console.log('props', props)
      return {
        background: 'gray',
      }
    },
    variants: {
      custom: props => {
        return {
          ...chakraTheme.components.Alert.variants.subtle(props),
          container: {
            background: `${props.colorScheme}.50`,
            py: '7px',
          },
        }
      },
    },
  },
}

export default alert
