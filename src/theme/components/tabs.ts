import { theme as chakraTheme } from '@chakra-ui/react'

const tabsVariants = {
  Tabs: {
    variants: {
      enclosed: props => {
        return {
          // @ts-ignore
          ...chakraTheme.components.Tabs.variants.enclosed(props),
          tab: {
            bg: '#EBF8FF',
            borderColor: '#CBD5E0',
            fontWeight: 500,
            fontSize: '14px',
            color: '#4A5568',
            _selected: {
              borderTopColor: `${props.colorScheme}.300`,
              borderTopWidth: '3px',
              borderLeftColor: '#CBD5E0',
              borderRightColor: '#CBD5E0',
              bg: 'white',
              color: `${props.colorScheme}.300`,
              fontWeight: 500,
              fontSize: '14px',
            },
            _disabled: {
              cursor: 'not-allowed',
              _hover: {
                bg: `transparent`,
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
            fontSize: '14px',
            _hover: {
              bg: `${props.colorScheme}.50`,
            },
            color: 'gray.500',
            _selected: {
              borderBottomColor: `${props.colorScheme}.300`,
              color: `${props.colorScheme}.300`,
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
