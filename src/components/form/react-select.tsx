import { forwardRef } from 'react'
import { Select as ReactSelect } from 'chakra-react-select'
import { inputBorderLeftStyle, inputFocusStateStyle } from 'theme/common-style'
import { AnyCnameRecord } from 'dns'

const fontSizes = {
  sm: '13px',
  md: '14px',
  lg: '16px',
}

const getFontSize = (state: any) => {
  const size = state?.selectProps?.size

  return fontSizes[size] || size
}
// Custom styles for components which do not have a chakra equivalent
export const chakraStyles = {
  // When disabled, react-select sets the pointer-state to none
  // which prevents the `not-allowed` cursor style from chakra
  // from getting applied to the Control

  container: (provided: AnyCnameRecord) => {
    return {
      ...provided,
      pointerEvents: 'auto',
      // background: '#F7FAFC',
    }
  },
  singleValue: (provider: any) => ({
    ...provider,
    color: '#2D3748',
    fontWeight: '400',
  }),
  menu: (provided: any) => ({
    ...provided,
    boxShadow: 'lg',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'gray.200',
    borderRadius: 'md',
    bg: 'white',
  }),
  menuList: (provided: any, state: any) => {
    const menuHeight = state.selectProps?.selectProps?.menuHeight || ''

    return { ...provided, height: menuHeight }
  },
  option: (provider: any, state: any) => ({
    ...provider,
    fontSize: getFontSize(state),
    bg: state.isSelected ? 'gray.50' : 'white',
    _hover: {
      bg: state.isSelected ? 'gray.50' : 'blue.50',
    },
    color: state.isSelected ? 'gray.800' : '',
  }),
  valueContainer(provided: any, { selectProps: { size } }: any) {
    const px = {
      sm: '12px',
      md: '16px',
      lg: '16px',
    }

    return {
      ...provided,
      padding: `0.125rem ${px[size]}`,
      color: 'gray.500',
    }
  },

  dropdownIndicator: provided => ({
    ...provided,
    backgroundColor: 'transparent',
    '&>svg': {
      color: 'gray.500',
    },
  }),
  control: (provider: any, state) => {
    const { selectProps } = state
    const { isBorderLeft } = selectProps?.selectProps || {}

    const borderLeftStyle = isBorderLeft ? inputBorderLeftStyle : {}

    return {
      ...provider,
      ...borderLeftStyle,
      borderRadius: '6px',
      fontSize: getFontSize(state),
      _focus: inputFocusStateStyle,
      _disabled: {
        opacity: 0.7,
        cursor: 'not-allowed',
        bg: 'gray.100',
      },
    }
  },
  // menuList: () => ({}),
  // option: () => ({}),
  // multiValue: () => ({}),
  // multiValueLabel: () => ({}),
  // group: () => ({}),
}

type SelectProps = any & {
  selectProps: {
    isBorderLeft: boolean
    now: string
  }
}

const Select = forwardRef((props: SelectProps, ref: any) => (
  <ReactSelect
    ref={ref}
    chakraStyles={chakraStyles}
    components={{
      IndicatorSeparator: false,
    }}
    {...props}
  />
))

export { Select as default }
