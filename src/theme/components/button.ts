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
          fontWeight: 500,
          fontSize: '14px',
          color: 'white',
          _hover: {
            bg: `${props.colorScheme}.500`,
          },
        }
      },
      outline: props => {
        return {
          ...chakraTheme.components.Button.variants.outline(props),
          borderColor: props.borderColor ? props.borderColor : `${props.colorScheme}.300`,
          color: `${props.colorScheme}.300`,
          fontWeight: 500,
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
          _disabled: {
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
      'clear-filter': props => {
        return {
          ...chakraTheme.components.Button.variants.ghost(props),
          bg: 'none',
          color: '#4E87F8',
          _hover: { bg: 'none' },
          _focus: { border: 'none' },
          fontSize: '16px',
          fontStyle: 'inter',
          fontWeight: 600,
          alignContent: 'right',
          pl: 1,
          pt: 2,
        }
      },
      pill: props => {
        return {
          ...chakraTheme.components.Button.variants.ghost(props),
          _hover: { bg: '#4E87F8', color: 'white', border: 'none' },
          _focus: { border: 'none' },
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 500,
          alignContent: 'right',
          rounded: 20,
        }
      },
      unClickable: props => {
        return {
          ...chakraTheme.components.Button.variants.outline(props),
          borderColor: `${props.colorScheme}.300`,
          color: `${props.colorScheme}.300`,
          _hover: {
            bg: 'none',
          },
          _focus: {
            bg: 'none',
          },
          _active: {
            bg: 'none',
          },
          cursor: 'auto',
        }
      },
      green: props => {
        return {
          ...chakraTheme.components.Button.variants.ghost(props),
          background: 'green.100',
          color: `${props.colorScheme}.500`,
          cursor: 'auto',
          fontWeight: '500',
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
