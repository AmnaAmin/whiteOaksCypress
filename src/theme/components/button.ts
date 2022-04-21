import { theme as chakraTheme } from '@chakra-ui/react'

const buttonSize = size => {
  return size === 'lg'
    ? {
        fontSize: '16px',
        h: '40px',
        px: '15px',
        fontWeight: '600',
      }
    : {
        fontWeight: '500',
      }
}

const ButtonVariants = {
  Button: {
    variants: {
      solid: props => {
        const style = buttonSize(props.size)

        return {
          ...chakraTheme.components.Button.variants.solid(props),
          ...style,
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
        const style = buttonSize(props.size)
        return {
          ...chakraTheme.components.Button.variants.outline(props),
          ...style,
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
        const style = buttonSize(props.size)
        return {
          ...chakraTheme.components.Button.variants.ghost(props),
          ...style,
          color: `${props.colorScheme}.400`,
          _hover: {
            bg: `${props.colorScheme}.50`,
          },
          _focus: {
            outline: 'none',
          },
        }
      },
    },
  },
}

export default ButtonVariants
