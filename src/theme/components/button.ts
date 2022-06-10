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
        return {
          ...chakraTheme.components.Button.variants.outline(props),
          borderColor: `${props.colorScheme}.300`,
          color: `${props.colorScheme}.300`,
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
          color: `${props.colorScheme}.300`,
          _focus: {
            outline: 'none',
          },
          _hover: {
            bg: `${props.colorScheme}.50`,
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
      'choose-file': props => {
        return {
          ...chakraTheme.components.Button.variants.outline(props),
          borderWidth: '0 1px 0 0',
          color: `${props.colorScheme}.500`,
          bg: `${props.colorScheme}.100`,
          _hover: {
            color: `${props.colorScheme}.600`,
            bg: `${props.colorScheme}.200`,
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
        fontSize: '12px',
      },
      md: {
        minW: '84px',
        h: '40px',
        fontSize: '14px',
      },
      lg: {
        minW: '107px',
        h: '48px',
        fontSize: '16px',
      },
    },
  },
}

export default ButtonVariants
