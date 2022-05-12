import { Global } from '@emotion/react'
import { theme } from '../src/theme/theme'
import { GlobalStyles } from '../src/theme/global-css'
import { ChakraProvider } from '@chakra-ui/react'
import 'focus-visible/dist/focus-visible'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'grey',
        value: '#eee',
      },
      {
        name: 'white',
        value: '#fff',
      },
      {
        name: 'dark',
        value: 'darkGray',
      },
    ],
  },
  chakra: {
    theme: theme,
  },
}

export const decorators = [
  Story => (
    <ChakraProvider theme={theme}>
      <Global styles={GlobalStyles} />
      <div style={{ padding: '80px 15px 15px' }}>
        <Story />
      </div>
    </ChakraProvider>
  ),
]
