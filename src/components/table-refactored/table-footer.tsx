import { HStack, StackProps } from '@chakra-ui/react'

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
      borderColor="gray.200"
      borderBottomRadius={'4px'}
      {...rest}
    >
      {children}
    </HStack>
  )
}
