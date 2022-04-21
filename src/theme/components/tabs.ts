import { theme as chakraTheme } from '@chakra-ui/react'

const tabsVariants = {
  Tabs: {
    variants: {
      filled: props => {
        return {
          // @ts-ignore
          ...chakraTheme.components.Tabs.variants.enclosed(props),
          tab: {
            roundedTopEnd: '6px',
            roundedTopStart: '6px',
            _hover: {
              bg: `${props.colorScheme}.50`,
            },
            _selected: {
              bg: `${props.colorScheme}.300`,
              color: 'white',
              fontWeight: 600,
              _hover: {
                bg: `${props.colorScheme}.500`,
              },
            },
          },
        }
      },
      line: props => {
        return {
          // @ts-ignore
          ...chakraTheme.components.Tabs.variants.line(props),
          tab: {
            roundedTopEnd: '6px',
            roundedTopStart: '6px',
            _hover: {
              bg: `${props.colorScheme}.50`,
            },
            _selected: {
              borderBottomColor: `${props.colorScheme}.300`,
              _hover: {
                bg: `${props.colorScheme}.50`,
              },
            },
          },
        }
      },
    },
  },
}

export default tabsVariants
