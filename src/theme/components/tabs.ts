import { theme as chakraTheme } from '@chakra-ui/react'

const tabsVariants = {
  Tabs: {
    variants: {
      enclosed: props => {
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
              borderBottomColor: `${props.colorScheme}.300`,
              bg: `${props.colorScheme}.300`,
              color: 'white',
              fontWeight: 600,
              _hover: {
                borderBottomColor: `${props.colorScheme}.500`,
                bg: `${props.colorScheme}.400`,
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
