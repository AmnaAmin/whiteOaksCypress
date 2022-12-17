import { Center, Divider, HStack, StackProps } from '@chakra-ui/react'

export const TableFooter: React.FC<StackProps> = ({ children, ...rest }) => {
  return (
    <HStack justifyContent="space-between" bg="white" {...rest}>
      {children}
    </HStack>
  )
}

export const ButtonsWrapper: React.FC<StackProps> = ({ children, ...rest }) => {
  return (
    <HStack
      spacing="0"
      bg="#F7FAFC"
      borderWidth="0 1px 1px 1px"
      borderStyle="solid"
      borderColor="gray.300"
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
