import { theme as chakraTheme } from '@chakra-ui/react'

const ButtonVariants = {
  Button: {
    baseStyle: {
      ...chakraTheme.components.Button.baseStyle,
      _focus: {
        outline: 'none',
      },
    },
    variants: {
      solid: props => {
        // const style = buttonSize(props.size)

        return {
          ...chakraTheme.components.Button.variants.solid(props),
          bg: `${props.colorScheme}.300`,
          color: 'white',
          _hover: {
            bg: `${props.colorScheme}.500`,
          },
        }
      },
      outline: props => {
        // const style = buttonSize(props.size)

        return {
          ...chakraTheme.components.Button.variants.outline(props),
          // ...style,
          borderColor: `${props.colorScheme}.400`,
          color: `${props.colorScheme}.400`,
          _hover: {
            bg: `${props.colorScheme}.50`,
          },
          _focus: {
            outline: 'none',
          },
        }
      },
      ghost: props => {
        return {
          ...chakraTheme.components.Button.variants.ghost(props),
          color: `${props.colorScheme}.400`,
          _focus: {
            outline: 'none',
          },
          _hover: {
            bg: `${props.colorScheme}.50`,
          },
        }
      },
    },

    sizes: {
      xs: {
        minW: '55px',
        h: '24px',
      },
      sm: {
        minW: '70px',
        h: '32px',
      },
      md: {
        minW: '84px',
        h: '40px',
      },
      lg: {
        minW: '107px',
        h: '48px',
      },
    },
  },
}

export default ButtonVariants
