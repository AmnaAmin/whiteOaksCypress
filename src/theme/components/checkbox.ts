const checkbox = {
  Checkbox: {
    defaultProps: {
      colorScheme: 'brand',
    },
    baseStyle: {
      control: {
        '&[data-focus]': {
          outline: 'none',
          boxShadow: 'none',
        },
      },
    },
    variants: {
      link: props => {
        return {
          label: {
            color: `${props.colorScheme}.300`,
            fontWeight: '500',
            _hover: {
              color: `${props.colorScheme}.500`,
            },
          },
          control: {
            _checked: {
              borderColor: `${props.colorScheme}.300`,
              bg: `${props.colorScheme}.300`,
              _hover: {
                borderColor: `${props.colorScheme}.500`,
                bg: `${props.colorScheme}.500`,
              },
            },
          },
        }
      },

      error: props => {
        return {
          label: {
            color: `red.400`,
            fontWeight: '500',
            _hover: {
              color: `red.500`,
            },
          },
          control: {
            h: '20px',
            w: '20px',
            _checked: {
              borderColor: `${props.colorScheme}.300`,
              bg: `${props.colorScheme}.300`,
              _hover: {
                borderColor: `${props.colorScheme}.400`,
                bg: `${props.colorScheme}.400`,
              },
            },
          },
        }
      },
    },

    sizes: {
      sm: {
        label: {
          fontSize: '12px',
        },
      },
      md: {
        label: {
          fontSize: '14px',
        },
      },
      lg: {
        label: {
          fontSize: '16px',
        },
      },
    },
  },
}

export default checkbox
