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
      outLinePrimary: props => {
        return {
          label: {
            color: 'gray.700',

            fontWeight: '500',

            _hover: {
              color: 'gray.800',
            },
          },

          control: {
            _checked: {
              borderColor: '#345EA6',
              color: '#345EA6',
              bg: `transparent`,

              _hover: {
                borderColor: `#345EA6`,
                color: '#345EA6',
                bg: `transparent`,
              },
            },
          },
        }
      },
      outLineGreen: props => {
        return {
          label: {
            color: 'gray.600',

            fontWeight: '500',

            _hover: {
              color: 'gray.800',
            },
          },

          control: {
            _checked: {
              borderColor: 'green.400',
              color: 'green.400',
              bg: `transparent`,

              _hover: {
                borderColor: `green.400`,
                color: 'green.400',
                bg: `transparent`,
              },
            },
          },
        }
      },
      normal: props => {
        return {
          label: {
            color: 'gray.600',

            fontWeight: '500',

            _hover: {
              color: 'gray.800',
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
