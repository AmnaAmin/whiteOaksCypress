import { forwardRef, useEffect, useState } from 'react'
import { Select as ReactSelect } from 'chakra-react-select'
import { BiChevronDown, BiChevronRight } from 'react-icons/bi'
import { Box, Flex, Text } from '@chakra-ui/react'
import { inputBorderLeftStyle, inputFocusStateStyle } from 'theme/common-style'

const fontSizes = {
  sm: '13px',
  md: '14px',
  lg: '16px',
}

const getFontSize = (state: any) => {
  const size = state?.selectProps?.size

  return fontSizes[size] || size
}

const chakraStyles = {
  // When disabled, react-select sets the pointer-state to none
  // which prevents the `not-allowed` cursor style from chakra
  // from getting applied to the Control

  container: (provided: any) => {
    return {
      ...provided,
      pointerEvents: 'auto',
      // background: '#F7FAFC',
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
    color: 'gray.500',
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
      paddingLeft: state.data?.subItem ? '25px' : '',
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
      color: 'gray.500',
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

const CustomGroupHeading = (props: any) => {
  const [collapsedGroups, setCollapsedGroups] = useState<any>([])

  const handleHeaderClick = (group, id) => {
    if (collapsedGroups.includes(group)) {
      setCollapsedGroups(collapsedGroups.filter(g => g !== group))
    } else {
      setCollapsedGroups([...collapsedGroups, group])
    }

    const node = document?.querySelector(`#${id}`)?.nextElementSibling

    const classes = node?.classList
    if (classes?.contains('collapsed')) {
      node?.classList.remove('collapsed')
    } else {
      node?.classList.add('collapsed')
    }
  }

  useEffect(() => {
    let fpmRoleIds: number[] = []

    if (!props?.selectProps?.value?.value) return

    if (props?.data?.label === 'Field Project Manager') fpmRoleIds = props?.data?.options?.map(o => o.value)

    if (!fpmRoleIds.includes(Number(props?.selectProps?.value?.value)))
      document?.querySelector(`#${props.id}`)?.nextElementSibling?.classList?.add('collapsed')

  }, [props?.selectProps?.value])

  const { label: group } = props
  const isCollapsed = collapsedGroups.includes(group)


  return (
    <Box
      onClick={() => handleHeaderClick(group, props.id)}
      cursor="pointer"
      display="flex"
      alignItems="center"
      fontWeight="normal"
      ml={'-2px'}
      id={props.id}
      mb="3px"
      mt="3px"
    >
      {isCollapsed ? <BiChevronRight fontSize={'20px'} /> : <BiChevronDown fontSize={'20px'} />}
      <Text as="div" role="button" whiteSpace="nowrap" maxW="148px" fontSize="14px">
        {props.children}
      </Text>
    </Box>
  )
}

const Select = forwardRef((props: any, ref: any) => {
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
        GroupHeading: CustomGroupHeading,
      }}
      options={optionsMapped}
      placeholder={'Select'}
    />
  )
})

export { Select as default }
