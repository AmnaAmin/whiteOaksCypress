import { forwardRef } from 'react'
import { Select as ReactSelect, CreatableSelect as RSCreatableSelect } from 'chakra-react-select'
import { inputBorderLeftStyle, inputFocusStateStyle } from 'theme/common-style'
import { AnyCnameRecord } from 'dns'
import { Text, Flex } from '@chakra-ui/react'
import { List } from 'react-virtualized'

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

  container: (provided: AnyCnameRecord, { width }: { width: string }) => {
    return {
      ...provided,
      pointerEvents: 'auto',
      // background: '#F7FAFC',
      width: width,
    }
  },

  placeholder: provider => ({
    ...provider,
    fontSize: '14px',
    color: 'gray.600',
    fontWeight: 400,
  }),

  singleValue: (provider: any) => ({
    ...provider,
    color: 'gray.600',
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
    margin: '2px',
  }),
  menuList: (provided: any, state: any) => {
    const menuHeight = state.selectProps?.selectProps?.menuHeight || ''

    return { ...provided, height: menuHeight }
  },
  option: (provider: any, state: any) => {
    const {
      selectProps: { styleOption },
    } = state
    return {
      ...provider,
      fontSize: getFontSize(state),
      bg: state.isSelected ? 'gray.50' : 'white',
      _hover: {
        bg: state.isSelected ? 'gray.50' : 'blue.50',
      },
      color: state.isSelected ? 'gray.800' : '',
      display: state.data?.isHidden ? 'none' : 'block',
      padding: '10px',
      whiteSpace: 'nowrap',
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      ...styleOption,
    }
  },
  valueContainer(provided: any, { selectProps: { size } }: any) {
    const px = {
      sm: '12px',
      md: '16px',
      lg: '16px',
    }

    return {
      ...provided,
      padding: `0.125rem ${px[size]}`,
      color: 'gray.600',
    }
  },

  dropdownIndicator: provided => ({
    ...provided,
    backgroundColor: 'transparent',
    '&>svg': {
      color: 'gray.600',
    },
  }),
  control: (provider: any, state) => {
    const { selectProps } = state
    const { isBorderLeft, widthAssign } = selectProps?.selectProps || {}

    const borderLeftStyle = isBorderLeft ? inputBorderLeftStyle : {}
    const assignItemsWidth = widthAssign ? widthAssign : '100%'
    return {
      ...provider,
      ...borderLeftStyle,
      width: assignItemsWidth,
      borderRadius: '6px',
      fontSize: getFontSize(state),
      _focus: inputFocusStateStyle,
      _disabled: {
        opacity: 0.7,
        pointerEvents: 'none',
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
    widthAssign?: string
    now: string
  }
}

const Select = forwardRef((props: SelectProps, ref: any) => {
  const optionsMapped =
    props?.options?.map(option => ({
      ...option,
      title: option?.label,
    })) || []

  return (
    <ReactSelect
      ref={ref}
      chakraStyles={chakraStyles}
      {...props}
      classNamePrefix={props?.classNamePrefix || 'react-select'}
      loadingMessage={() => 'Loading'}
      isLoading={props?.loadingCheck}
      components={{
        IndicatorSeparator: false,
        SingleValue: option => {
          return (
            <Flex title={option.children as string} position="absolute">
              <Text isTruncated whiteSpace="nowrap" maxW="148px">
                {option.children}
              </Text>
            </Flex>
          )
        },
      }}
      options={optionsMapped}
      placeholder={'Select'}
    />
  )
})

const MenuList: React.FC<any> = props => {
  const { children } = props
  const menuHeight = props?.selectProps?.selectProps?.menuHeight
  const menuWidth = props?.selectProps?.selectProps?.menuWidth

  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    style, // Style object to be applied to row (to position it)
  }) {
    return (
      <div key={key} style={style} title={children[index]?.props?.label ?? ''}>
        {children[index]}
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#fff',
        zIndex: 999,
        maxWidth: '250px',
      }}
    >
      <List
        width={menuWidth||223}
        height={menuHeight ?? 220}
        rowCount={children.length}
        rowHeight={40}
        rowRenderer={rowRenderer}
        scrollToIndex={0}
      />
    </div>
  )
}

const handleMinusNumberInput = e => {
  if (e?.nativeEvent?.code === 'Minus') {
    e?.preventDefault()
  }
}

export const CreatableSelect = forwardRef((props: SelectProps, ref: any) => (
  <RSCreatableSelect
    {...props}
    ref={ref}
    classNamePrefix={props?.classNamePrefix || 'react-select'}
    chakraStyles={chakraStyles}
    placeholder="Select"
    components={{
      IndicatorSeparator: false,
      MenuList,
    }}
    onKeyDown={handleMinusNumberInput}
  />
))

export { Select as default }