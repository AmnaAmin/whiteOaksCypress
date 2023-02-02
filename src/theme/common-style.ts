import { InputProps } from '@chakra-ui/input'
import { css } from '@emotion/react'
// import calendarPNG from 'assets/calendar-icon.png'

export const disabledInputStyle = {
  bg: 'gray.200',
  borderColor: 'gray.400',
  color: 'blackAlpha.600',
  cursor: 'not-allowed',
  opacity: 0.5,
}

export const inputFocusStateStyle = {
  _focus: {
    borderColor: 'none',
    boxShadow: 'none',
  },
}

export const requiredInputFocusStateStyle = {
  _focus: {
    borderColor: 'none',
    boxShadow: 'none',
  },
}

export const inputBorderLeftStyle: InputProps = {
  borderLeftWidth: '2.5px',
  borderLeftStyle: 'solid',
  borderLeftColor: '#345EA6',
  _hover: {
    borderLeftColor: 'brand.300',
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

export const exportBtnIcon = {
  height: '14px',
  width: '14px',
  left: '17px',
  top: '11px',
  borderRadius: '0px',
  fontSize: '18px',
}

/* background: url(${calendarPNG}) no-repeat; */
export const calendarIcon = css`
  ::-webkit-calendar-picker-indicator {
    /* background-size: contain; */
    /* width: 12px;
    height: 12px; */
    color: '#ddd';
  }
`
export const boxShadow = {
  boxShadow: ' 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
}
