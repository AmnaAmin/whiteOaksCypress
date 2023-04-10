import { extendTheme, theme as chakraTheme } from '@chakra-ui/react'
import tabs from './components/tabs'
import button from './components/button'
import modal from './components/modal'
import input from './components/input'
import textArea from './components/textarea'
import alert from './components/alert'
import checkbox from './components/checkbox'
import label from './components/label'
import spinner from './components/spinner'
import table from './components/table'
import divider from './components/divider'

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
    body: 'Poppins',
    heading: 'Poppins',
    // body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
    // heading: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
  },

  gray: {
    400: '#A0AEC0',
    500: '#718096',
    700: '#2D3748',
  },
  blue: {
    500: '#3182CE',
    600: '#2B6CB0',
  },
  colors: {
    gray: {
      200: '#E2E8F0',
      300: '#CBD5E0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
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
      // 300: '#4e87f8',
      300: '#345EA6',
      400: '#2569f5',
      // 500: '#0f50dc',
      500: '#022c7c',
      600: '#073eac',
      700: '#022c7c',
      800: '#001b4d',
      900: '#00091f',
    },
    darkPrimary: {
      50: '#e1eeff',
      100: '#b2cdff',
      200: '#83acfb',
      300: '#345EA6',
      400: '#22375B',
      500: '#022c7c',
    },
    green: {
      100: '#E7F8EC',
      300: '#38B2AC',
      500: '#38A169',
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
    darkBlue: {
      50: '#e1eeff',
      100: '#b2cdff',
      200: '#83acfb',
      300: '#22375B',
    },
    PrimaryCheckBox: {
      50: '#345EA6',
      100: '#345EA6',
      200: '#345EA6',
      300: '#345EA6',
      400: '#345EA6',
      500: '#345EA6',
      600: '#345EA6',
      700: '#345EA6',
      800: '#345EA6',
      900: '#345EA6',
    },
    bgGlobal: {
      50: '#F2F3F4',
    },
  },
  components: {
    ...tabs,
    ...button,
    ...modal,
    ...input,
    ...textArea,
    ...alert,
    ...checkbox,
    ...label,
    ...spinner,
    ...table,
    ...divider,
  },
})
