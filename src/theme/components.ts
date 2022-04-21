import { theme as chakraTheme } from '@chakra-ui/react'

export const components = {
  Tabs: {
    variants: {
      ...chakraTheme.components.Tabs.variants,
      custom: props => {
        return {
          // @ts-ignore
          ...chakraTheme.components.Tabs.variants['soft-rounded'](props),
          bg: props.colorScheme,
          _selected: {
            bg: 'red',
          },
        }
      },
    },
  },
}
