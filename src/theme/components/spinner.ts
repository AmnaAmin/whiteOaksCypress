const spinner = {
  Spinner: {
    defaultProps: {
      colorScheme: 'brand',
    },
    baseStyle: props => ({
      color: `${props.colorScheme}.300`,
      borderBottomColor: 'gray.200',
      borderLeftColor: 'gray.200',
    }),
  },
}

export default spinner
