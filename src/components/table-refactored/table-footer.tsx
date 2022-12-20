import { Center, Divider, HStack, StackProps } from '@chakra-ui/react'

export const TableFooter: React.FC<StackProps> = ({ children, ...rest }) => {
  return (
    <HStack
      justifyContent="space-between"
      bg="white"
      borderTop="1px solid #CBD5E0"
      borderBottom="1px solid #CBD5E0"
      borderRight="1px solid #CBD5E0"
      borderBottomRadius={'4px'}
      {...rest}
    >
      {children}
    </HStack>
  )
}

export const ButtonsWrapper: React.FC<StackProps> = ({ children, ...rest }) => {
  return (
    <HStack
      spacing="0"
      borderLeft="1px solid #CBD5E0"
      borderRight="1px solid #CBD5E0"
      borderBottomRadius={'4px'}
      {...rest}
    >
      {children}
    </HStack>
  )
}

export const CustomDivider = () => {
  return (
    <Center>
      <Divider orientation="vertical" height={'15px'} border="1px solid" borderColor="gray.300" />
    </Center>
  )
}
