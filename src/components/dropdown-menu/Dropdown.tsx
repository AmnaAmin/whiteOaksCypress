import React, { cloneElement, forwardRef } from 'react'
import ReactSelect, { components as selectComponents } from 'react-select'
import AsyncReactSelect from 'react-select/async'
import CreatableReactSelect from 'react-select/creatable'
import {
  Flex,
  Tag,
  TagCloseButton,
  TagLabel,
  CloseButton,
  Box,
  Portal,
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
  useTheme,
  useColorModeValue,
  useFormControl,
} from '@chakra-ui/react'

// Taken from the @chakra-ui/icons package to prevent needing it as a dependency
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/icons/src/ChevronDown.tsx
// const ChevronDown = createIcon({
//   displayName: "ChevronDownIcon",
//   d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
// });

// Custom styles for components which do not have a chakra equivalent
const chakraStyles = {
  // When disabled, react-select sets the pointer-state to none
  // which prevents the `not-allowed` cursor style from chakra
  // from getting applied to the Control
  container: provided => ({
    ...provided,
    pointerEvents: 'auto',
    background: '#F7FAFC',
    borderRadius: '4px',
  }),

  singleValue: provided => ({
    ...provided,
    color: 'gray.600',
    fontSize: '16px',
    fontWeight: 400,
  }),

  dropdownIndicator: provided => ({
    ...provided,
    svg: {
      fill: '#2D3748',
    },
  }),

  input: provided => ({
    ...provided,
    color: 'inherit',
    lineHeight: 1,
    width: '100%',
    border: 'none',
  }),
  menu: provided => ({
    ...provided,
    boxShadow: 'none',
  }),
  valueContainer(provided: any, { selectProps: { size } }: any) {
    const px = {
      sm: '0.75rem',
      md: '1rem',
      lg: '1rem',
    }

    return {
      ...provided,
      padding: `0.125rem ${px[size]}`,
    }
  },
  loadingMessage(provided, { selectProps: { size } }) {
    const fontSizes = {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
    }

    const paddings = {
      sm: '6px 9px',
      md: '8px 12px',
      lg: '10px 15px',
    }

    return {
      ...provided,
      fontSize: fontSizes[size],
      padding: paddings[size],
    }
  },
  // Add the chakra style for when a TagCloseButton has focus
  multiValueRemove: (provided, { isFocused, selectProps: { multiValueRemoveFocusStyle } }) =>
    isFocused ? multiValueRemoveFocusStyle : {},
  control: () => ({}),
  menuList: () => ({}),
  option: () => ({}),
  multiValue: () => ({}),
  multiValueLabel: () => ({}),
  group: () => ({}),
}

const chakraComponents = {
  // Control components
  Control({ children, innerRef, innerProps, isDisabled, isFocused, selectProps: { size, isInvalid } }) {
    const inputStyles = useMultiStyleConfig('Input', { size })

    const heights = {
      sm: 8,
      md: 10,
      lg: 12,
    }

    return (
      <StylesProvider value={inputStyles}>
        <Flex
          ref={innerRef}
          sx={{
            ...inputStyles.field,
            bg: '#FFFFFF',
            border: 'none',
            p: 0,
            overflow: 'hidden',
            h: 'auto',

            minH: heights[size],
          }}
          {...innerProps}
          data-focus={isFocused ? true : undefined}
          data-invalid={isInvalid ? true : undefined}
          data-disabled={isDisabled ? true : undefined}
        >
          {children}
        </Flex>
      </StylesProvider>
    )
  },
  MultiValueContainer: ({ children, innerRef, innerProps, data, selectProps }) => (
    <Tag
      ref={innerRef}
      {...innerProps}
      m="0.125rem"
      // react-select Fixed Options example: https://react-select.com/home#fixed-options
      variant={data.isFixed ? 'solid' : 'subtle'}
      colorScheme={data.colorScheme || selectProps.colorScheme}
      size={selectProps.size}
    >
      {children}
    </Tag>
  ),
  MultiValueLabel: ({ children, innerRef, innerProps }) => (
    <TagLabel ref={innerRef} {...innerProps}>
      {children}
    </TagLabel>
  ),
  MultiValueRemove({ children, innerRef, innerProps, data: { isFixed } }) {
    if (isFixed) {
      return null
    }

    return (
      <TagCloseButton ref={innerRef} {...innerProps} tabIndex={-1}>
        {children}
      </TagCloseButton>
    )
  },
  IndicatorSeparator: ({ innerProps }) => null,
  ClearIndicator: ({ innerProps, selectProps: { size } }) => (
    <CloseButton {...innerProps} size={size} mx={2} tabIndex={-1} />
  ),

  // Menu components
  MenuPortal: ({ children }) => <Portal>{children}</Portal>,
  Menu({ children, ...props }: any) {
    const menuStyles = useMultiStyleConfig('Menu', { minWidth: '100%' })

    return (
      <selectComponents.Menu {...props}>
        <StylesProvider value={menuStyles}>{children}</StylesProvider>
      </selectComponents.Menu>
    )
  },
  MenuList({ innerRef, children, maxHeight, selectProps: { size } }) {
    const { list } = useStyles()
    const chakraTheme = useTheme()

    const borderRadii = {
      sm: chakraTheme.radii.sm,
      md: chakraTheme.radii.md,
      lg: chakraTheme.radii.md,
    }

    return (
      <Box
        sx={{
          ...list,
          // maxH: `${maxHeight}px`,
          h: '100px',
          minW: '100%',
          bg: '#FFFFFF',
          overflowY: 'auto',
          borderRadius: borderRadii[size],
        }}
        ref={innerRef}
      >
        {children}
      </Box>
    )
  },
  GroupHeading({ innerProps, children }) {
    const { groupTitle } = useStyles()
    return (
      <Box sx={groupTitle} {...innerProps}>
        {children}
      </Box>
    )
  },
  Option({ innerRef, innerProps, children, isFocused, isDisabled, selectProps: { size } }) {
    const { item } = useStyles() as any
    return (
      <Box
        role="button"
        sx={{
          ...item,
          w: '100%',
          color: 'gray.600',
          fontWeight: 400,
          fontSize: '14px',
          textAlign: 'start',
          bg: isFocused ? item._focus.bg : 'transparent',
          ...(isDisabled && item._disabled),
        }}
        ref={innerRef}
        {...innerProps}
        {...(isDisabled && { disabled: true })}
      >
        {children}
      </Box>
    )
  },
}

const ChakraReactSelect = ({
  children,
  styles = {},
  components = {},
  theme = () => ({}),
  size = 'md',
  colorScheme = 'gray',
  isDisabled,
  isInvalid,
  ...props
}: any) => {
  const chakraTheme = useTheme()

  // Combine the props passed into the component with the props
  // that can be set on a surrounding form control to get
  // the values of isDisabled and isInvalid
  const inputProps = useFormControl({ isDisabled, isInvalid })

  // The chakra theme styles for TagCloseButton when focused
  const closeButtonFocus = chakraTheme.components.Tag.baseStyle.closeButton._focus
  const multiValueRemoveFocusStyle = {
    background: closeButtonFocus.bg,
    boxShadow: chakraTheme.shadows[closeButtonFocus.boxShadow],
  }

  // The chakra UI global placeholder color
  // https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/styles.ts#L13
  const placeholderColor = useColorModeValue(chakraTheme.colors.gray[400], chakraTheme.colors.whiteAlpha[400])

  // Ensure that the size used is one of the options, either `sm`, `md`, or `lg`
  let realSize = size
  const sizeOptions = ['sm', 'md', 'lg']
  if (!sizeOptions.includes(size)) {
    realSize = 'md'
  }

  const select = cloneElement(children, {
    components: {
      ...chakraComponents,
      ...components,
    },
    styles: {
      ...chakraStyles,
      ...styles,
    },
    theme(baseTheme) {
      const propTheme = theme(baseTheme)

      return {
        ...baseTheme,
        ...propTheme,
        colors: {
          ...baseTheme.colors,
          neutral50: placeholderColor, // placeholder text color
          neutral40: placeholderColor, // noOptionsMessage color
          ...propTheme.colors,
        },
        spacing: {
          ...baseTheme.spacing,
          ...propTheme.spacing,
        },
      }
    },
    colorScheme,
    size: realSize,
    multiValueRemoveFocusStyle,
    // isDisabled and isInvalid can be set on the component
    // or on a surrounding form control
    isDisabled: inputProps.disabled,
    isInvalid: !!inputProps['aria-invalid'],
    ...props,
  })

  return select
}

type SelectProps = any

const Dropdown = forwardRef((props: SelectProps, ref: any) => (
  <ChakraReactSelect {...props}>
    <ReactSelect ref={ref} />
  </ChakraReactSelect>
))

const AsyncSelect = forwardRef((props: SelectProps, ref: any) => (
  <ChakraReactSelect {...props} loadOptions={props.options}>
    <AsyncReactSelect ref={ref} />
  </ChakraReactSelect>
))

const CreatableSelect = forwardRef((props: SelectProps, ref: any) => (
  <ChakraReactSelect {...props}>
    <CreatableReactSelect ref={ref} />
  </ChakraReactSelect>
))

export { Dropdown as default, AsyncSelect, CreatableSelect }
