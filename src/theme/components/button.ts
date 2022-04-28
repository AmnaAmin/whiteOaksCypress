import { theme as chakraTheme } from '@chakra-ui/react'

const ButtonVariants = {
  Button: {
    variants: {
      solid: props => {
        return {
          ...chakraTheme.components.Button.variants.solid(props),
          bg: `${props.colorScheme}.300`,
          color: 'white',
          _hover: {
            bg: `${props.colorScheme}.500`,
          },
          _focus: {
            outline: 'none',
          },
        }
      },
      outline: props => {
        return {
          ...chakraTheme.components.Button.variants.outline(props),
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
          _hover: {
            bg: `${props.colorScheme}.50`,
          },
          _focus: {
            outline: 'none',
          },
        }
      },
      link: props => {
        return {
          ...chakraTheme.components.Button.variants.link(props),
          color: `${props.colorScheme}.300`,
          _hover: {
            color: `${props.colorScheme}.500`,
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
