import { theme } from '../src/theme/theme'

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
