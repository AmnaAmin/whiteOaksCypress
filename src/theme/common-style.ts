import { InputProps } from '@chakra-ui/input'
import { css } from '@emotion/react'

export const disabledInputStyle = {
  bg: 'gray.200',
  borderColor: 'gray.400',
  color: 'blackAlpha.600',
  cursor: 'not-allowed',
  opacity: 0.5,
}

export const inputFocusStateStyle = {
  _focus: {
    borderColor: '#4E87F8',
    boxShadow: '0 0 0 1px #4E87F8',
  },
}

export const inputBorderLeftStyle: InputProps = {
  borderLeftWidth: '2px',
  borderLeftStyle: 'solid',
  borderLeftColor: 'brand.300',
  _hover: {
    borderLeftColor: 'brand.500',
  },
}

export const countInCircle = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  color: '#4E87F8',
  backgroundColor: 'white',
  display: 'flex',
  border: '1px solid',
  justifyContent: 'center',
}

export const calendarIcon = css`
  ::-webkit-calendar-picker-indicator {
    background: url('https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/calendar-16.png')
      center/80% no-repeat;
    color: '#ddd';
  }
`
