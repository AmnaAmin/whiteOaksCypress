import { forwardRef } from 'react'
import { Select as ReactSelect } from 'chakra-react-select'
import { inputBorderLeftStyle, inputFocusStateStyle } from 'theme/common-style'
import { AnyCnameRecord } from 'dns'

// const fontSizes = {
//   sm: 'sm',
//   md: 'md',
//   lg: 'lg',
// }
// Custom styles for components which do not have a chakra equivalent
export const chakraStyles = {
  // When disabled, react-select sets the pointer-state to none
  // which prevents the `not-allowed` cursor style from chakra
  // from getting applied to the Control

  container: (provided: AnyCnameRecord) => {
    return {
      ...provided,
      pointerEvents: 'auto',
      background: '#F7FAFC',
    }
  },
  singleValue: (provider: any) => ({
    ...provider,
    color: '#718096',
    fontWeight: '300',
  }),
  menu: (provided: any) => ({
    ...provided,
    boxShadow: 'lg',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'gray.300',
    borderRadius: 'md',
    bg: 'white',
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
  control: (provider: any, options) => {
    const { isBorderLeft } = options.selectProps?.selectProps || {}

    const borderLeftStyle = isBorderLeft ? inputBorderLeftStyle : {}

    return {
      ...provider,
      ...borderLeftStyle,
      borderRadius: '6px',
      bg: '#F7FAFC',
      _focus: inputFocusStateStyle,
    }
  },
  // menuList: () => ({}),
  // option: () => ({}),
  // multiValue: () => ({}),
  // multiValueLabel: () => ({}),
  // group: () => ({}),
}

// const chakraComponents = {
//   // Control components
//   Control({ children, innerRef, innerProps, isDisabled, isFocused, selectProps }) {
//     const { size, isInvalid } = selectProps
//     const { isLeftBorder } = selectProps?.selectProps || {}
//     const inputStyles = useMultiStyleConfig('Input', { size })
//     const leftBorder = {
//       borderLeftWidth: '2px',
//       borderLeftStyle: 'solid',
//       borderLeftColor: 'blue.300',
//     }
//     const borderLeftStyle = isLeftBorder ? { ...leftBorder } : {}

//     const heights = {
//       sm: '32px',
//       md: '40px',
//       lg: '48px',
//     }

//     return (
//       <StylesProvider value={inputStyles}>
//         <Flex
//           id="control"
//           ref={innerRef}
//           sx={{
//             ...inputStyles.field,
//             ...borderLeftStyle,
//             p: 0,
//             overflow: 'hidden',
//             h: 'auto',
//             minH: heights[size],
//             rounded: 'md',
//             color: 'white',
//             position: 'relative',
//             _disabled: {
//               ...disabledInputStyle,
//               opacity: 0.9,
//               bg: 'gray.50',
//               borderColor: 'gray.200',
//             },
//             _hover: {
//               ...inputStyles.field['_hover'],
//             },
//           }}
//           {...innerProps}
//           data-focus={isFocused ? true : undefined}
//           data-invalid={isInvalid ? true : undefined}
//           data-disabled={isDisabled ? true : undefined}
//         >
//           {children}
//         </Flex>
//       </StylesProvider>
//     )
//   },

//   MultiValueContainer: ({ children, innerRef, innerProps, data, selectProps }) => (
//     <Tag
//       ref={innerRef}
//       {...innerProps}
//       m="0.125rem"
//       // react-select Fixed Options example: https://react-select.com/home#fixed-options
//       variant={data.isFixed ? 'solid' : 'subtle'}
//       colorScheme={data.colorScheme || selectProps.colorScheme}
//       size={selectProps.size}
//     >
//       {children}
//     </Tag>
//   ),
//   MultiValueLabel: ({ children, innerRef, innerProps }) => (
//     <TagLabel ref={innerRef} {...innerProps}>
//       {children}
//     </TagLabel>
//   ),
//   MultiValueRemove({ children, innerRef, innerProps, data: { isFixed } }) {
//     if (isFixed) {
//       return null
//     }

//     return (
//       <TagCloseButton ref={innerRef} {...innerProps} tabIndex={-1}>
//         {children}
//       </TagCloseButton>
//     )
//   },
//   IndicatorSeparator: ({ innerProps }) => null,
//   ClearIndicator: ({ innerProps, selectProps: { size } }) => (
//     <CloseButton {...innerProps} size={size} mx={2} tabIndex={-1} />
//   ),

//   DropdownIndicator: ({ innerProps }) => (
//     <Box px="3">
//       <FaAngleDown {...innerProps} fill="#A0AEC0" fontSize="15px" />
//     </Box>
//   ),

//   // Menu components
//   MenuPortal: ({ children }) => <Portal>{children}</Portal>,
//   Menu({ children, ...props }: any) {
//     const menuStyles = useMultiStyleConfig('Menu', {})
//     return (
//       <selectComponents.Menu {...props}>
//         <StylesProvider value={menuStyles}>{children}</StylesProvider>
//       </selectComponents.Menu>
//     )
//   },
//   MenuList({ innerRef, children, maxHeight, selectProps: { size } }) {
//     const { list } = useStyles()
//     const chakraTheme = useTheme()

//     const borderRadii = {
//       sm: chakraTheme.radii.sm,
//       md: chakraTheme.radii.md,
//       lg: chakraTheme.radii.md,
//     }

//     return (
//       <Box
//         sx={{
//           ...list,
//           maxH: `${maxHeight}px`,
//           overflowY: 'auto',
//           borderRadius: borderRadii[size],
//         }}
//         ref={innerRef}
//       >
//         {children}
//       </Box>
//     )
//   },
//   GroupHeading({ innerProps, children }) {
//     const { groupTitle } = useStyles()
//     return (
//       <Box sx={groupTitle} {...innerProps}>
//         {children}
//       </Box>
//     )
//   },
//   Option({ innerRef, innerProps, children, isFocused, isDisabled, selectProps: { size } }) {
//     const { item } = useStyles() as any
//     return (
//       <Box
//         role="button"
//         sx={{
//           ...item,
//           w: '100%',
//           textAlign: 'start',
//           bg: isFocused ? item._focus.bg : 'transparent',
//           fontSize: size,
//           ...(isDisabled && item._disabled),
//         }}
//         ref={innerRef}
//         {...innerProps}
//         {...(isDisabled && { disabled: true })}
//       >
//         {children}
//       </Box>
//     )
//   },
// }

type SelectProps = any

const Select = forwardRef((props: SelectProps, ref: any) => (
  <ReactSelect
    // defaultMenuIsOpen
    ref={ref}
    chakraStyles={chakraStyles}
    {...props}
    components={{
      IndicatorSeparator: false,
    }}
  />
))

export { Select as default }
