import { extendTheme, theme as chakraTheme } from '@chakra-ui/react'
import tabs from './components/tabs'
import button from './components/button'
import modal from './components/modal'

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#F2F3F4',
      },
    },
  },

  fonts: {
    ...chakraTheme.fonts,
    body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
    heading: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
  },
  gray: {
    400: '#A0AEC0',
    500: '#718096',
  },
  blue: {
    500: '#3182CE',
    600: '#2B6CB0',
  },
  colors: {
    gray: {
      200: '#E2E8F0',
      500: '#718096',
      600: '#4A5568',
      700: '2D3748',
      800: '#1A202C',
    },
    lightGray: {
      200: '#E2E8F0',
      500: '#E2E8F0',
      600: '#E2E8F0',
      700: '#E2E8F0',
      800: '#E2E8F0',
    },
    rose: {
      50: '#ffe4ed',
      100: '#fbb9c8',
      200: '#f28da4',
      300: '#ec607f',
      400: '#e5345b',
      500: '#E11D48',
      600: '#9f1233',
      700: '#730b23',
      800: '#470415',
      900: '#1e0006',
    },
    brand: {
      50: '#e1eeff',
      100: '#b2cdff',
      200: '#83acfb',
      300: '#538bf8',
      400: '#2569f5',
      500: '#0f50dc',
      600: '#073eac',
      700: '#022c7c',
      800: '#001b4d',
      900: '#00091f',
    },
    barColor: {
      50: '#4E87F8',
      100: '#4E87F8',
      200: '#4E87F8',
      300: '#4E87F8',
      400: '#4E87F8',
      500: '#4E87F8',
      600: '#4E87F8',
      700: '#4E87F8',
      800: '#4E87F8',
      900: '#4E87F8',
    },
    button: {
      50: '#e1f1ff',
      100: '#b2d2ff',
      200: '#83b0fb',
      300: '#538bf8',
      400: '#2577f5',
      500: '#0f6bdc',
      600: '#075fac',
      700: '#024d7c',
      800: '#00354d',
      900: '#00161f',
    },
    strengthColor: {
      50: '#FC8181',
      100: '#FC8181',
      200: '#FC8181',
      300: '#FC8181',
      400: '#FC8181',
      500: '#FC8181',
      600: '#FC8181',
      700: '#FC8181',
      800: '#FC8181',
      900: '#FC8181',
    },
    CustomPrimaryColor: {
      50: '#4E87F8',
      100: '#4E87F8',
      200: '#4E87F8',
      300: '#4E87F8',
      400: '#4E87F8',
      500: '#4E87F8',
      600: '#4E87F8',
      700: '#4E87F8',
      800: '#4E87F8',
      900: '#4E87F8',
    },
  },
  components: {
    ...tabs,
    ...button,
    ...modal,
  },
})
