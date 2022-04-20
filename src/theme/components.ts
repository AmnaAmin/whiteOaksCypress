import { theme as chakraTheme } from '@chakra-ui/react'

export const components = {
  Tabs: {
    variants: {
      filled: props => {
        return {
          // @ts-ignore
          ...chakraTheme.components.Tabs.variants.enclosed(props),
          tab: {
            roundedTopEnd: '4px',
            roundedTopStart: '4px',
            _hover: {
              bg: `gray.100`,
            },
            _selected: {
              bg: `${props.colorScheme}.400`,
              color: 'white',
              fontWeight: 600,
            },
          },
        }
      },
    },
  },
  Button: {
    variants: {
      solid: props => {
        return {
          ...chakraTheme.components.Button.variants.solid(props),
          bg: `${props.colorScheme}.400`,
          color: 'white',
          _hover: {
            bg: `${props.colorScheme}.500`,
          },
          _focus: {
            outline: 'none',
          },
        }
      },
    },
  },
}
